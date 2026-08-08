// Cross-input validation for career AI output. Unlike agent-output-validator.ts
// (which checks a single AI output against its schema in isolation), this file
// compares AI output AGAINST THE INPUTS IT WAS DERIVED FROM — the resume it
// claims to quote and the role vocabulary it was told to assess.
//
// This is what makes the product's "evidence-based" claim true rather than
// aspirational: a quote that isn't in the resume never reaches the database.
//
// Two policies, deliberately not mixed:
//
//   Structural violations (skill outside the vocabulary, a task pinned to a
//   foreign gap, a roadmap claiming work is already done) THROW. The model
//   ignored the contract; the output is not salvageable.
//
//   Per-quote violations (not verbatim, strength/section mismatch) DROP the
//   item and keep the rest. One bad quote out of thirty shouldn't fail a
//   60-second call. Dropping is safe here precisely because it can only lower
//   a skill's status, never raise it — the failure direction is toward
//   "missing", which understates the candidate rather than overstating them.
import { AppError } from "../types/app-error.js";
import { ERROR_CODES } from "../constants/error-codes.js";
import { HTTP_STATUS } from "../constants/http-status.js";
import { StructuredResume } from "../modules/parsing/parsing.types.js";
import {
  MIN_GROUNDED_QUOTE_LENGTH,
  normalizeForGrounding,
} from "./grounding-normalize.js";
import {
  buildSourceItems,
  ResumeSourceItems,
} from "../modules/career-analysis/resume-source-items.js";
import {
  EvidenceAgentOutput,
  EvidenceItem,
  GroundedEvidenceItem,
  GroundedSkillAssessment,
  RoleSnapshot,
  SourceSection,
} from "../modules/career-analysis/career-analysis.types.js";

// Which sections can justify each strength claim. Anything demonstrated
// through narrative lives in experience or projects; a skills list is a
// mention by definition, whatever the model asserts.
const SECTIONS_FOR_STRENGTH: Record<
  EvidenceItem["strength"],
  readonly SourceSection[]
> = {
  experience_backed: ["experience"],
  project_backed: ["projects"],
  mentioned: [
    "experience",
    "projects",
    "skills",
    "summary",
    "education",
    "certifications",
  ],
};

export type GroundingRejectionReason =
  | "quote_too_short"
  | "quote_not_verbatim"
  | "strength_section_mismatch"
  | "source_index_out_of_range";

export type GroundingRejection = {
  skillSlug: string;
  reason: GroundingRejectionReason;
  // Never carries resume content — these are logged, and logs must not
  // accumulate PII.
  detail: string;
};

export type EvidenceGroundingResult = {
  assessments: GroundedSkillAssessment[];
  rejections: GroundingRejection[];
};

// Checks one assessment's evidence, returning only the items that survive —
// each with a sourceLabel derived from the entry it actually grounded in.
function groundEvidence(
  skillSlug: string,
  evidence: EvidenceItem[],
  sourceItems: ResumeSourceItems,
  rejections: GroundingRejection[],
): GroundedEvidenceItem[] {
  const survivors: GroundedEvidenceItem[] = [];

  for (const item of evidence) {
    const normalized = normalizeForGrounding(item.quote);

    if (normalized.length < MIN_GROUNDED_QUOTE_LENGTH) {
      rejections.push({
        skillSlug,
        reason: "quote_too_short",
        detail: `quote of ${normalized.length} chars is below the ${MIN_GROUNDED_QUOTE_LENGTH}-char minimum`,
      });
      continue;
    }

    // Strength inflation is the highest-consequence failure in the scoring
    // path: a skills-list entry reported as experience_backed becomes
    // "strong", worth full credit on a critical skill.
    if (!SECTIONS_FOR_STRENGTH[item.strength].includes(item.sourceSection)) {
      rejections.push({
        skillSlug,
        reason: "strength_section_mismatch",
        detail: `strength "${item.strength}" is not supported by section "${item.sourceSection}"`,
      });
      continue;
    }

    // Indexes the same ordered representation the prompt was rendered from,
    // so the model's [n] and this lookup can never drift apart.
    const section = sourceItems[item.sourceSection];
    const source = section[item.sourceIndex];

    // A reference to an entry that doesn't exist. Rejecting rather than
    // falling back to a section-wide search is the point: an unresolvable
    // reference cannot produce trustworthy provenance.
    if (!source) {
      rejections.push({
        skillSlug,
        reason: "source_index_out_of_range",
        detail: `section "${item.sourceSection}" has no entry at index ${item.sourceIndex}`,
      });
      continue;
    }

    // Grounds against the ONE entry the model cited, not the section as a
    // whole. Catches outright invention, paraphrase (a real bullet rewritten
    // into cleaner prose the user reads as their own words), and
    // misattribution (a real quote pinned to the wrong job) in a single check.
    if (!source.normalizedText.includes(normalized)) {
      rejections.push({
        skillSlug,
        reason: "quote_not_verbatim",
        detail: `quote does not appear in ${item.sourceSection}[${item.sourceIndex}]`,
      });
      continue;
    }

    survivors.push({ ...item, sourceLabel: source.label });
  }

  return survivors;
}

// Validates evidence output against the resume it quotes and the role
// vocabulary it was given.
export function validateEvidenceGrounding(
  output: EvidenceAgentOutput,
  context: { roleSnapshot: RoleSnapshot; resume: StructuredResume },
): EvidenceGroundingResult {
  const allowed = new Map(
    context.roleSnapshot.skills.map((skill) => [skill.slug, skill]),
  );

  // A skill outside the role's requirements means the model invented a
  // requirement and would present it to the user as authoritative — exactly
  // the "AI decides what the job needs" failure the seeded role model exists
  // to prevent. Not salvageable, so throw.
  const foreign = output.assessments
    .map((a) => a.skillSlug)
    .filter((slug) => !allowed.has(slug));

  if (foreign.length > 0) {
    throw new AppError(
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      ERROR_CODES.AI_GROUNDING_FAILED,
      "AI assessed skills outside the role's requirements",
      { unknownSkills: foreign },
    );
  }

  const sourceItems = buildSourceItems(context.resume);
  const rejections: GroundingRejection[] = [];
  const bySlug = new Map<string, GroundedSkillAssessment>();

  for (const assessment of output.assessments) {
    const survivingEvidence = groundEvidence(
      assessment.skillSlug,
      assessment.evidence,
      sourceItems,
      rejections,
    );

    bySlug.set(assessment.skillSlug, {
      skillSlug: assessment.skillSlug,
      // `found` must reflect surviving evidence, not the model's claim — an
      // assessment whose every quote was rejected is indistinguishable from
      // one that found nothing.
      found: survivingEvidence.length > 0,
      evidence: survivingEvidence,
    });
  }

  // Backfill anything the model skipped. A dropped skill must become
  // "missing", not vanish: vanishing would shrink possiblePoints and inflate
  // the readiness score.
  const assessments = context.roleSnapshot.skills.map(
    (skill) =>
      bySlug.get(skill.slug) ?? {
        skillSlug: skill.slug,
        found: false,
        evidence: [],
      },
  );

  return { assessments, rejections };
}

// --- Roadmap grounding ------------------------------------------------------

export type RoadmapTaskDraft = {
  skillGapId: string | null;
  weekNumber: number;
  title: string;
  description: string;
  resources?: unknown;
};

// Validates roadmap output against the analysis it belongs to. Every failure
// here throws: unlike a bad quote, a task pointing at the wrong gap cannot be
// partially salvaged.
export function validateRoadmapGrounding<T extends RoadmapTaskDraft>(
  tasks: T[],
  context: { gapIdsInAnalysis: Set<string>; weekCount: number },
): T[] {
  for (const task of tasks) {
    // The security-relevant check. If the model echoes a real uuid belonging
    // to another user's analysis, writing this task would attach it to their
    // gap — a cross-tenant write, not merely a validation error.
    if (task.skillGapId !== null && !context.gapIdsInAnalysis.has(task.skillGapId)) {
      throw new AppError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        ERROR_CODES.AI_GROUNDING_FAILED,
        "Roadmap references a skill gap that does not belong to this analysis",
      );
    }

    if (
      !Number.isInteger(task.weekNumber) ||
      task.weekNumber < 1 ||
      task.weekNumber > context.weekCount
    ) {
      throw new AppError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        ERROR_CODES.AI_GROUNDING_FAILED,
        `Roadmap task falls outside weeks 1-${context.weekCount}`,
      );
    }

    // Belt-and-braces: the agent's schema has no `completed` field, so this
    // only fires on a schema regression. Worth keeping — completion is the
    // user's only real progress signal, and a forged completedAt is
    // unrecoverable once written.
    if ((task as { completed?: unknown }).completed) {
      throw new AppError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        ERROR_CODES.AI_GROUNDING_FAILED,
        "Roadmap tasks may not be generated as already completed",
      );
    }
  }

  return tasks;
}
