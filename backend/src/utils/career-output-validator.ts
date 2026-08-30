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
  type ResumeSourceItems,
} from "../modules/career-analysis/resume-source-items.js";
import {
  EvidenceAgentOutput,
  EvidenceItem,
  GroundedEvidenceItem,
  GroundedSkillAssessment,
  RoleSnapshot,
  SourceSection,
} from "../modules/career-analysis/career-analysis.types.js";

// Defines which resume sections can support each evidence strength.
const SECTIONS_FOR_STRENGTH: Record<
  EvidenceItem["strength"],
  readonly SourceSection[]
> = {
  experience_backed: ["experience"],
  project_backed: ["projects", "completed_work"],
  mentioned: [
    "experience",
    "projects",
    "skills",
    "summary",
    "education",
    "certifications",
    "completed_work",
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

  // Keep logs free of resume content and other PII.
  detail: string;
};

export type EvidenceGroundingResult = {
  assessments: GroundedSkillAssessment[];
  rejections: GroundingRejection[];
};

// Keeps only evidence that can be verified against the cited resume entry.
function groundEvidence(
  skillSlug: string,
  evidence: EvidenceItem[],
  sourceItems: ResumeSourceItems,
  rejections: GroundingRejection[],
): GroundedEvidenceItem[] {
  const survivors: GroundedEvidenceItem[] = [];

  for (const item of evidence) {
    const normalized = normalizeForGrounding(item.quote);

    // Reject quotes that are too short to be meaningful evidence.
    if (normalized.length < MIN_GROUNDED_QUOTE_LENGTH) {
      rejections.push({
        skillSlug,
        reason: "quote_too_short",
        detail: `quote of ${normalized.length} chars is below the ${MIN_GROUNDED_QUOTE_LENGTH}-char minimum`,
      });
      continue;
    }

    // Make sure the claimed strength matches the cited section.
    if (!SECTIONS_FOR_STRENGTH[item.strength].includes(item.sourceSection)) {
      rejections.push({
        skillSlug,
        reason: "strength_section_mismatch",
        detail: `strength "${item.strength}" is not supported by section "${item.sourceSection}"`,
      });
      continue;
    }

    const section = sourceItems[item.sourceSection];
    const source = section[item.sourceIndex];

    // Reject references to resume entries that do not exist.
    if (!source) {
      rejections.push({
        skillSlug,
        reason: "source_index_out_of_range",
        detail: `section "${item.sourceSection}" has no entry at index ${item.sourceIndex}`,
      });
      continue;
    }

    // The quote must appear in the exact entry the model cited.
    if (!source.normalizedText.includes(normalized)) {
      rejections.push({
        skillSlug,
        reason: "quote_not_verbatim",
        detail: `quote does not appear in ${item.sourceSection}[${item.sourceIndex}]`,
      });
      continue;
    }

    survivors.push({
      ...item,
      sourceLabel: source.label,
    });
  }

  return survivors;
}

// Validates AI evidence against the role requirements and resume.
export function validateEvidenceGrounding(
  output: EvidenceAgentOutput,
  context: {
    roleSnapshot: RoleSnapshot;
    resume: StructuredResume;

    // Reuse the exact source items shown to the model when provided.
    sourceItems?: ResumeSourceItems;
  },
): EvidenceGroundingResult {
  const allowed = new Map(
    context.roleSnapshot.skills.map((skill) => [skill.slug, skill]),
  );

  // AI may assess only skills that belong to the selected role.
  const foreign = output.assessments
    .map((assessment) => assessment.skillSlug)
    .filter((slug) => !allowed.has(slug));

  if (foreign.length > 0) {
    throw new AppError(
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      ERROR_CODES.AI_GROUNDING_FAILED,
      "AI assessed skills outside the role's requirements",
      { unknownSkills: foreign },
    );
  }

  const sourceItems = context.sourceItems ?? buildSourceItems(context.resume);
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

      // Only grounded evidence can make a skill count as found.
      found: survivingEvidence.length > 0,
      evidence: survivingEvidence,
    });
  }

  // Keep skipped skills in the result so readiness cannot be inflated.
  const assessments = context.roleSnapshot.skills.map(
    (skill) =>
      bySlug.get(skill.slug) ?? {
        skillSlug: skill.slug,
        found: false,
        evidence: [],
      },
  );

  return {
    assessments,
    rejections,
  };
}

// --- Roadmap grounding ------------------------------------------------------

export type RoadmapTaskDraft = {
  skillSlug: string;
};

// Validates roadmap tasks against the gaps selected by the application.
export function validateRoadmapGrounding<T extends RoadmapTaskDraft>(
  tasks: T[],
  context: { selectedSkillSlugs: string[] },
): T[] {
  const selected = new Set(context.selectedSkillSlugs);
  const seen = new Set<string>();

  for (const task of tasks) {
    // Roadmap tasks may address only the selected skill gaps.
    if (!selected.has(task.skillSlug)) {
      throw new AppError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        ERROR_CODES.AI_GROUNDING_FAILED,
        "Roadmap addresses a skill that was not selected for it",
        { unexpectedSkill: task.skillSlug },
      );
    }

    // Each selected gap should receive only one roadmap task.
    if (seen.has(task.skillSlug)) {
      throw new AppError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        ERROR_CODES.AI_GROUNDING_FAILED,
        "Roadmap contains more than one task for the same skill",
        { duplicatedSkill: task.skillSlug },
      );
    }

    seen.add(task.skillSlug);

    // AI must never mark generated tasks as completed.
    const claimed = task as {
      completed?: unknown;
      completedAt?: unknown;
    };

    if (claimed.completed || claimed.completedAt) {
      throw new AppError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        ERROR_CODES.AI_GROUNDING_FAILED,
        "Roadmap tasks may not be generated as already completed",
      );
    }
  }

  // Every selected gap must have a roadmap task.
  if (seen.size !== selected.size) {
    throw new AppError(
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      ERROR_CODES.AI_GROUNDING_FAILED,
      "Roadmap does not cover every selected skill",
    );
  }

  return tasks;
}
