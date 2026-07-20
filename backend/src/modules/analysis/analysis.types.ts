import { z } from "zod";

export const marketIntelInputSchema = z.object({
  jobTitle: z
    .string()
    .trim()
    .min(2, { message: "Job title is too short" })
    .max(120, { message: "Job title is too long" })
    // Structural guard only: require at least one 2+ letter word, which rejects
    // symbol/digit-only junk like "!!! 123 ###". It intentionally does NOT catch
    // letter-gibberish ("asdfqwer") — a regex can't distinguish that from a real
    // word, and doing so would cost a Gemini call. That remains a known boundary.
    .refine((value) => /[a-zA-Z]{2,}/.test(value), {
      message: "Job title must contain a valid role name",
    }),
});

export const marketIntelOutputSchema = z.object({
  company: z.string(),
  industry: z.string(),
  techStack: z.array(z.string()),
  experienceLevel: z.string(),
  salaryRangeNPR: z.object({
    min: z.number(),
    max: z.number(),
  }),
  atsKeywords: z.array(z.string()),
  commonRequirements: z.array(z.string()),
  nepaliContext: z.string(),
});

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

// analysisResult is intentionally an open, extensible envelope rather than a flat
// { marketIntel } — later stages (scoring, etc.) attach more without a migration.
export type AnalysisResult = {
  marketIntel: MarketIntelOutput;
  parsedJob?: ParsedJob;
  scores?: unknown;
};

export type MarketIntelInput = z.infer<typeof marketIntelInputSchema>;
export type MarketIntelOutput = z.infer<typeof marketIntelOutputSchema>;
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
export interface MarketAgent {
  getMarketIntel(jobTitle: string): Promise<MarketIntelOutput>;
}

export interface JobParserAgent {
  parseJobDescription(rawText: string): Promise<ParsedJob>;
}

// TODO: implemented by agents/rewrite.agent.ts (walking-skeleton stub for now).
export interface RewriteAgent {
  rewriteBullet(input: RewriteBulletInput): Promise<RewriteOutput>;
}
