import { z } from "zod";

export const parsedJobSchema = z.object({
  title: z.string(),
  company: z.string().nullable(),
  requirements: z.array(z.string()),
  skills: z.array(z.string()),
  experienceLevel: z.enum(["entry", "mid", "senior"]),
});

// Job context an analysis already has parsed (title/company/skills/etc) —
// sourced server-side from the persisted Analysis row, never from client
// input, since the client's copy could be stale or spoofed.
export const jobContextSchema = z.object({
  title: z.string(),
  company: z.string().nullable(),
  requirements: z.array(z.string()),
  skills: z.array(z.string()),
  experienceLevel: z.enum(["entry", "mid", "senior"]),
});

// Reserved for future resume-owner context (years of experience, target
// industry, tone preference, etc). Untyped placeholder until a real source
// of user context exists — adding fields here later is a type change in
// one place, not a signature change through every rewrite prompt.
export type UserContext = Record<string, unknown>;

export const rewriteBulletInputSchema = z.object({
  originalBullet: z
    .string()
    .trim()
    .min(10, { message: "Bullet is too short to rewrite" }),
  jobContext: jobContextSchema,
  userContext: z.custom<UserContext>().optional(),
});

export const rewriteOutputSchema = z.object({
  suggestions: z.array(z.string()).length(1),
});

export const createAnalysisInputSchema = z.object({
  resumeId: z.string().uuid(),
  jobDescription: z
    .string()
    .trim()
    .min(150, {
      message: "Job description is too short — paste the full posting",
    })
    .max(10000, {
      message: "Job description is too long — max 10,000 characters",
    }),
});

export const suggestionSectionSchema = z.enum(["bullet", "project", "summary"]);

// Client-facing request shape — deliberately excludes job/user context.
// Those come from the analysis row itself (parsedJob), fetched server-side
// in the service, so a client can't send stale or spoofed context.
export const getRewriteSuggestionsInputSchema = z.object({
  analysisId: z.string().uuid(),
  section: suggestionSectionSchema.default("bullet"),
  originalBullet: z
    .string()
    .trim()
    .min(10, { message: "Text is too short to rewrite" }),
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

export type SuggestionSection = z.infer<typeof suggestionSectionSchema>;
export type ParsedJob = z.infer<typeof parsedJobSchema>;
export type JobContext = z.infer<typeof jobContextSchema>;
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

export interface RewriteAgent {
  rewriteBullet(input: RewriteBulletInput): Promise<RewriteOutput>;
  rewriteProject(input: RewriteBulletInput): Promise<RewriteOutput>;
  rewriteSummary(input: RewriteBulletInput): Promise<RewriteOutput>;
}
