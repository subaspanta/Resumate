export interface AnalysisScore {
  overall: number;
  ats: number;
  // Optional because the backend types analysisResult.scores as `unknown` and
  // has no writer yet — the first implementation may ship overall/ats without
  // per-section detail. Guard before iterating.
  sections?: Record<string, number>;
}

// Mirrors the backend's parsedJobSchema enum — the job parser validates its
// model output against it, so these are the only values that reach the client.
export type ExperienceLevel = "entry" | "mid" | "senior";

export interface ParsedJob {
  title: string;
  company: string | null;
  requirements: string[];
  skills: string[];
  experienceLevel: ExperienceLevel;
}

// analysisResult is an open envelope on the backend.
export interface AnalysisResult {
  parsedJob?: ParsedJob;
  scores?: AnalysisScore;
}

export type SuggestionStatus = "pending" | "applied" | "rejected";

export interface Suggestion {
  id: string;
  analysisId: string;
  original: string;
  suggested: string;
  section: SuggestionSection | null;
  status: SuggestionStatus;
  rejectionReason: string | null;
  createdAt: string;
}

export interface AnalysisSummary {
  id: string;
  resumeId: string;
  jobDescription: string;
  createdAt: string;
}

export interface SkillsMatch {
  matched: string[];
  missing: string[];
}

// GET /analyses/:id returns the full row plus its suggestions and the
// computed (not stored) skills match between the resume snapshot and the
// parsed job.
export interface Analysis extends AnalysisSummary {
  userId: string;
  parsedJob: ParsedJob | Record<string, unknown>;
  resumeSnapshot: Record<string, unknown>;
  analysisResult: AnalysisResult;
  suggestions: Suggestion[];
  skillsMatch: SkillsMatch;
  // getAnalysisWithSuggestions uses Prisma `include`, so every column ships,
  // this one among them.
  exportedAt: string | null;
}

export interface CreateAnalysisInput {
  resumeId: string;
  jobDescription: string;
}

// POST /analyses returns the new analysis id plus the freshly parsed job,
// not the full persisted Analysis record.
export interface CreateAnalysisResult {
  analysisId: string;
  parsedJob: Record<string, unknown>;
}

export type SuggestionSection = "bullet" | "project" | "summary";

export interface RewriteSuggestionsInput {
  analysisId: string;
  section?: SuggestionSection;
  originalBullet: string;
}

// UI-click-event shape for "generate a suggestion for this bullet" — passed
// from ResumeReviewPreview up to whatever page owns the rewrite-suggestions
// mutation. Distinct from RewriteSuggestionsInput (the actual API request
// shape): this carries a local `key` for tracking per-bullet generating
// state, not an analysisId.
export interface GenerateSuggestionsInput {
  section: SuggestionSection;
  originalText: string;
  key: string;
}

export interface UpdateSuggestionStatusInput {
  suggestionId: string;
  status: Exclude<SuggestionStatus, "pending">;
  rejectionReason?: string;
}
