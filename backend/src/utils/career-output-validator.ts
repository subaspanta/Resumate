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
  EvidenceAgentOutput,
  EvidenceItem,
  RoleSnapshot,
  SkillAssessment,
  SourceSection,
} from "../modules/career-analysis/career-analysis.types.js";

// Below this, a "quote" is a fragment that grounds against almost any resume
// ("API", "React") and proves nothing. Rejecting them stops the model from
// satisfying the grounding check with content-free snippets.
export const MIN_GROUNDED_QUOTE_LENGTH = 12;

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
  | "quote_wrong_section";

export type GroundingRejection = {
  skillSlug: string;
  reason: GroundingRejectionReason;
  // Never carries resume content — these are logged, and logs must not
  // accumulate PII.
  detail: string;
};

export type EvidenceGroundingResult = {
  assessments: SkillAssessment[];
  rejections: GroundingRejection[];
};

export type ResumeHaystack = {
  all: string;
  bySection: Record<SourceSection, string>;
};

// Folds away the encoding noise that PDF extraction and model tokenization
// introduce, so "verbatim" means "the same words", not "the same bytes".
//
// Applied identically to both haystack and needle. Anything this does NOT
// erase — different words, different numbers, different order — still fails
// the check, which is the property that actually matters.
export function normalizeForGrounding(text: string): string {
  return (
    text
      // NFKC folds ligatures (ﬁ -> fi), fullwidth forms, and non-breaking /
      // thin spaces into ordinary characters.
      .normalize("NFKC")
      // PDFs emit en/em/figure dashes where the model writes a hyphen.
      .replace(/[\u2010-\u2015\u2212]/g, "-")
      .replace(/[\u2018\u2019\u201b\u2032]/g, "'")
      .replace(/[\u201c\u201d\u2033]/g, '"')
      // Zero-width characters some PDF encoders scatter through words.
      .replace(/[\u200b\u200c\u200d\ufeff]/g, "")
      .replace(/\s+/g, " ")
      // Bullet glyphs and leading dashes are layout, not content.
      .replace(/^[\u2022\u25aa\u25e6*\-\s]+/, "")
      .replace(/[\u2022\u25aa\u25e6*\-\s]+$/, "")
      .toLowerCase()
      .trim()
  );
}

function joinSection(parts: (string | null | undefined)[]): string {
  // Joined with "\n" (which normalizes to a space) rather than "" so the end
  // of one bullet and the start of the next can't form a phantom substring
  // that grounds a quote spanning two unrelated entries.
  return parts.filter((p): p is string => Boolean(p)).join("\n");
}

// Flattens the snapshot once per analysis. Rebuilding this per skill would be
// O(skills x resume size) for no benefit.
export function buildResumeHaystack(resume: StructuredResume): ResumeHaystack {
  const experience = joinSection(
    (resume.experience ?? []).flatMap((entry) => [
      entry.title,
      entry.company,
      entry.location,
      ...(entry.bullets ?? []),
    ]),
  );

  const projects = joinSection(
    (resume.projects ?? []).flatMap((project) => [
      project.name,
      ...(project.bullets ?? []),
    ]),
  );

  const skills = joinSection(
    (resume.skills ?? []).flatMap((group) => [group.category, ...group.items]),
  );

  const education = joinSection(
    (resume.education ?? []).flatMap((entry) => [
      entry.degree,
      entry.institution,
      entry.year,
    ]),
  );

  const certifications = joinSection(
    (resume.certifications ?? []).flatMap((cert) => [cert.name, cert.issuer]),
  );

  const customSections = joinSection(
    (resume.customSections ?? []).flatMap((section) => [
      section.heading,
      ...(section.bullets ?? []),
    ]),
  );

  const summary = resume.summary ?? "";

  const bySection: Record<SourceSection, string> = {
    experience: normalizeForGrounding(experience),
    projects: normalizeForGrounding(projects),
    skills: normalizeForGrounding(skills),
    summary: normalizeForGrounding(summary),
    education: normalizeForGrounding(education),
    certifications: normalizeForGrounding(certifications),
  };

  const all = normalizeForGrounding(
    joinSection([
      summary,
      experience,
      projects,
      skills,
      education,
      certifications,
      customSections,
    ]),
  );

  return { all, bySection };
}

export function isQuoteGrounded(quote: string, haystack: string): boolean {
  const needle = normalizeForGrounding(quote);
  if (needle.length < MIN_GROUNDED_QUOTE_LENGTH) return false;
  return haystack.includes(needle);
}

// Checks one assessment's evidence, returning only the items that survive.
function groundEvidence(
  skillSlug: string,
  evidence: EvidenceItem[],
  haystack: ResumeHaystack,
  rejections: GroundingRejection[],
): EvidenceItem[] {
  const survivors: EvidenceItem[] = [];

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

    // Catches outright invention and the subtler failure: a real bullet
    // paraphrased into cleaner prose, which the user reads as their own words.
    if (!haystack.all.includes(normalized)) {
      rejections.push({
        skillSlug,
        reason: "quote_not_verbatim",
        detail: "quote does not appear in the resume snapshot",
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

    // Right quote, wrong attribution — sourceLabel is rendered to the user as
    // provenance, so a mislabelled section shows them a fabricated source.
    if (!haystack.bySection[item.sourceSection].includes(normalized)) {
      rejections.push({
        skillSlug,
        reason: "quote_wrong_section",
        detail: `quote is not present in section "${item.sourceSection}"`,
      });
      continue;
    }

    survivors.push(item);
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

  const haystack = buildResumeHaystack(context.resume);
  const rejections: GroundingRejection[] = [];
  const bySlug = new Map<string, SkillAssessment>();

  for (const assessment of output.assessments) {
    const survivingEvidence = groundEvidence(
      assessment.skillSlug,
      assessment.evidence,
      haystack,
      rejections,
    );

    bySlug.set(assessment.skillSlug, {
      ...assessment,
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
        observation: "",
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
