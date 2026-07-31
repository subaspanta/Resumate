import { z } from "zod";

export const jobDescriptionInputSchema = z.object({
  jobDescription: z
    .string()
    .trim()
    .min(50, { message: "Job description is too short to be a real posting" }),
});

export const parsedJobSchema = z.object({
  title: z.string(),
  company: z.string().nullable(),
  requirements: z.array(z.string()),
  skills: z.array(z.string()),
  experienceLevel: z.enum(["entry", "mid", "senior"]),
});

export const rewriteBulletInputSchema = z.object({
  originalBullet: z
    .string()
    .trim()
    .min(10, { message: "Bullet is too short to rewrite" }),
  jobRequirements: z.array(z.string()),
});

export const rewriteOutputSchema = z.object({
  suggestions: z.array(z.string()).length(3),
});

export const createAnalysisInputSchema = z.object({
  resumeId: z.string().uuid(),
  jobDescription: z
    .string()
    .trim()
    .min(50, { message: "Job description is too short to be a real posting" }),
});

export const getRewriteSuggestionsInputSchema = z.object({
  analysisId: z.string().uuid(),
  originalBullet: z
    .string()
    .trim()
    .min(10, { message: "Bullet is too short to rewrite" }),
  jobRequirements: z.array(z.string()),
});

export const updateSuggestionStatusInputSchema = z.object({
  status: z.enum(["applied", "rejected"]),
  rejectionReason: z.string().optional(),
});

// analysisResult is intentionally an open, extensible envelope so later
// stages (scoring, etc.) can attach more without a migration.
export type AnalysisResult = {
  parsedJob?: ParsedJob;
  scores?: unknown;
};

export type JobDescriptionInput = z.infer<typeof jobDescriptionInputSchema>;
export type ParsedJob = z.infer<typeof parsedJobSchema>;
export type RewriteBulletInput = z.infer<typeof rewriteBulletInputSchema>;
export type RewriteOutput = z.infer<typeof rewriteOutputSchema>;
export type CreateAnalysisInput = z.infer<typeof createAnalysisInputSchema>;
export type GetRewriteSuggestionsInput = z.infer<
  typeof getRewriteSuggestionsInputSchema
>;
export type UpdateSuggestionStatusInput = z.infer<
  typeof updateSuggestionStatusInputSchema
>;

// Agents depend on these interfaces, not concrete classes, so the service
// layer can be dependency-injected the same way ResumeService receives its
// ParsingModule / StorageModule collaborators.
export interface JobParserAgent {
  parseJobDescription(rawText: string): Promise<ParsedJob>;
}

// TODO: implemented by agents/rewrite.agent.ts (walking-skeleton stub for now).
export interface RewriteAgent {
  rewriteBullet(input: RewriteBulletInput): Promise<RewriteOutput>;
}
