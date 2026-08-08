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
  skillSlug: string;
};

// Validates roadmap output against the gaps the application selected for it.
//
// Every failure throws. Unlike a bad quote — where dropping one item still
// leaves an honest, slightly poorer result — a roadmap that addresses the
// wrong gaps is not partially salvageable: the weeks are assigned by position,
// so one wrong task silently mislabels the rest.
export function validateRoadmapGrounding<T extends RoadmapTaskDraft>(
  tasks: T[],
  context: { selectedSkillSlugs: string[] },
): T[] {
  const selected = new Set(context.selectedSkillSlugs);
  const seen = new Set<string>();

  for (const task of tasks) {
    // A slug outside the selected set means the model chose its own gap to
    // work on — exactly the decision the application reserves for itself. It
    // would also fail to resolve to a SkillGap row, so the write would either
    // explode as a raw Prisma error or attach the task to nothing.
    if (!selected.has(task.skillSlug)) {
      throw new AppError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        ERROR_CODES.AI_GROUNDING_FAILED,
        "Roadmap addresses a skill that was not selected for it",
        { unexpectedSkill: task.skillSlug },
      );
    }

    // Two tasks for one gap would leave another gap with none, and weeks are
    // assigned per gap — the roadmap would quietly lose a week.
    if (seen.has(task.skillSlug)) {
      throw new AppError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        ERROR_CODES.AI_GROUNDING_FAILED,
        "Roadmap contains more than one task for the same skill",
        { duplicatedSkill: task.skillSlug },
      );
    }
    seen.add(task.skillSlug);

    // Belt-and-braces: the agent's schema has no completion field, so this
    // only fires on a schema regression. Worth keeping — completion is the
    // user's only real progress signal, and a forged completedAt is
    // unrecoverable once written.
    const claimed = task as { completed?: unknown; completedAt?: unknown };
    if (claimed.completed || claimed.completedAt) {
      throw new AppError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        ERROR_CODES.AI_GROUNDING_FAILED,
        "Roadmap tasks may not be generated as already completed",
      );
    }
  }

  // A missing task would leave its gap unaddressed while the weeks that follow
  // shift up, silently changing what the user was told to do.
  if (seen.size !== selected.size) {
    throw new AppError(
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      ERROR_CODES.AI_GROUNDING_FAILED,
      "Roadmap does not cover every selected skill",
    );
  }

  return tasks;
}
