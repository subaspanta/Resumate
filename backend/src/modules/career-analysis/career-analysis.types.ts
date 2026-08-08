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

// What the model returns per piece of evidence: a quote plus a *reference* to
// where it came from — never a display label. The backend derives the label
// from the snapshot itself, so an AI-written company or job title can never
// reach the user as provenance.
//
// sourceIndex points into the corresponding section of the resume snapshot
// (experience[2], projects[0], ...). The summary is a single string and is
// always index 0.
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

// Note what this schema cannot express: no status, priority, score,
// importance, week, or free-text commentary. The application decides all of
// those, so the model is given no field through which to smuggle a judgement.
export const evidenceAgentOutputSchema = z.object({
  assessments: z.array(skillAssessmentSchema).min(1),
});

export type EvidenceItem = z.infer<typeof evidenceItemSchema>;
export type SkillAssessment = z.infer<typeof skillAssessmentSchema>;

// An evidence item after grounding: the model's reference resolved into a
// label the backend derived from the snapshot.
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
