import { z } from "zod";
import { SkillImportance } from "../../generated/client/index.js";
import { StructuredResume } from "../parsing/parsing.types.js";

// --- Role snapshot ----------------------------------------------------------
// Frozen copy of the role's requirements as they stood when an analysis ran.
// RoleSkillRequirement rows are mutable seed data; without this snapshot a
// re-seed would silently rewrite the meaning of every historical score.
//
// The grounding validator resolves its closed vocabulary against the snapshot,
// never a fresh DB read — otherwise re-validating an old analysis would check
// it against today's requirements.

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

// --- Evidence agent (AI call #2) --------------------------------------------

// Sections a quote may be attributed to. Mirrors the parts of StructuredResume
// that hold user-authored prose.
export const SOURCE_SECTIONS = [
  "experience",
  "projects",
  "skills",
  "summary",
  "education",
  "certifications",
] as const;

export const sourceSectionSchema = z.enum(SOURCE_SECTIONS);
export type SourceSection = z.infer<typeof sourceSectionSchema>;

export const evidenceItemSchema = z.object({
  quote: z.string().min(1),
  strength: z.enum(["experience_backed", "project_backed", "mentioned"]),
  sourceSection: sourceSectionSchema,
  sourceLabel: z.string().max(200),
});

export const skillAssessmentSchema = z.object({
  skillSlug: z.string().min(1),
  found: z.boolean(),
  evidence: z.array(evidenceItemSchema).max(3),
  observation: z.string().max(400),
});

// Note what this schema cannot express: no status, priority, score,
// importance, or week. The application decides all of those, so the model is
// given no field through which to smuggle a judgement.
export const evidenceAgentOutputSchema = z.object({
  assessments: z.array(skillAssessmentSchema).min(1),
});

export type EvidenceItem = z.infer<typeof evidenceItemSchema>;
export type SkillAssessment = z.infer<typeof skillAssessmentSchema>;
export type EvidenceAgentOutput = z.infer<typeof evidenceAgentOutputSchema>;

export type EvidenceAgentInput = {
  resume: StructuredResume;
  role: { title: string; description: string };
  // Vocabulary only — importance and rationale are deliberately withheld so
  // the model can't inflate evidence for skills it knows the role weights
  // heavily.
  requiredSkills: { slug: string; name: string; aliases: string[] }[];
};

export interface EvidenceAgent {
  assessEvidence(input: EvidenceAgentInput): Promise<EvidenceAgentOutput>;
}

// --- Request schemas --------------------------------------------------------

export const createCareerAnalysisSchema = z.object({
  resumeId: z.string().uuid(),
  roleSlug: z.string().min(1).max(100),
});

export type CreateCareerAnalysisInput = z.infer<
  typeof createCareerAnalysisSchema
>;
