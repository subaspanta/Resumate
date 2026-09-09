import { z } from "zod";
import { SkillImportance } from "../../generated/client/index.js";
import { StructuredResume } from "../parsing/parsing.types.js";

// Frozen role requirements used for historical scoring and grounding.

export type RoleSnapshotSkill = {
  skillId: string;
  slug: string;
  name: string;
  aliases: string[];
  importance: SkillImportance;
  rationale: string;
};

export type RoleSnapshot = {
  roleId: string;
  slug: string;
  title: string;
  description: string;
  seedVersion: string;
  capturedAt: string;
  skills: RoleSnapshotSkill[];
};

// Resume sections that may supply evidence quotes.
export const SOURCE_SECTIONS = [
  "experience",
  "projects",
  "skills",
  "summary",
  "education",
  "certifications",
  // Used only during reassessment.
  "completed_work",
] as const;

export const sourceSectionSchema = z.enum(SOURCE_SECTIONS);
export type SourceSection = z.infer<typeof sourceSectionSchema>;

// Evidence uses a quote plus a snapshot reference; labels are backend-derived.
export const evidenceItemSchema = z.object({
  quote: z.string().min(1),
  strength: z.enum(["experience_backed", "project_backed", "mentioned"]),
  sourceSection: sourceSectionSchema,
  sourceIndex: z.number().int().min(0),
});

export const skillAssessmentSchema = z.object({
  skillSlug: z.string().min(1),
  found: z.boolean(),
  evidence: z.array(evidenceItemSchema).max(3),
});

// Output has no status, priority, score, week, or free-text judgment fields.
export const evidenceAgentOutputSchema = z.object({
  assessments: z.array(skillAssessmentSchema).min(1),
});

export type EvidenceItem = z.infer<typeof evidenceItemSchema>;
export type SkillAssessment = z.infer<typeof skillAssessmentSchema>;

// Evidence after resolving its snapshot reference.
export type GroundedEvidenceItem = EvidenceItem & {
  sourceLabel: string;
};

export type GroundedSkillAssessment = {
  skillSlug: string;
  found: boolean;
  evidence: GroundedEvidenceItem[];
};
export type EvidenceAgentOutput = z.infer<typeof evidenceAgentOutputSchema>;

export type EvidenceAgentInput = {
  resume: StructuredResume;
  role: { title: string; description: string };
  // Vocabulary only; importance and rationale stay application-owned.
  requiredSkills: { slug: string; name: string; aliases: string[] }[];
  // Pre-built reassessment sources keep prompt and validator indices aligned.
  sourceItems?: ResumeSourceItemsShape;
  // Context only; completion notes are not candidate evidence.
  completedWorkContext?: {
    skillName: string;
    projectTask: string;
    expectedEvidence: string;
  }[];
};

// Local structural type mirroring ResumeSourceItems (defined in
// resume-source-items.ts) to avoid a circular import — that module already
// imports SOURCE_SECTIONS/SourceSection from here.
type ResumeSourceItemsShape = Record<
  SourceSection,
  { displayText: string; normalizedText: string; label: string }[]
>;

export interface EvidenceAgent {
  assessEvidence(input: EvidenceAgentInput): Promise<EvidenceAgentOutput>;
}

// --- Request schemas --------------------------------------------------------

export const createCareerAnalysisSchema = z.object({
  resumeId: z.string().uuid(),
  roleSlug: z.string().min(1).max(100),
});

export const listCareerAnalysesQuerySchema = z.object({
  resumeId: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().uuid().optional(),
});

// Route params. Without these a malformed id reaches Prisma's uuid cast and
// surfaces as a generic 500 instead of a 400.
export const analysisIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type ListCareerAnalysesQuery = z.infer<
  typeof listCareerAnalysesQuerySchema
>;
