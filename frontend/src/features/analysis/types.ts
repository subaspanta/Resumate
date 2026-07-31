export interface AnalysisScore {
  overall: number;
  ats: number;
  sections: Record<string, number>;
}

export interface ParsedJob {
  title: string;
  company: string | null;
  requirements: string[];
  skills: string[];
  experienceLevel: string;
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
  jobRequirements: string[];
}

export interface UpdateSuggestionStatusInput {
  suggestionId: string;
  status: Exclude<SuggestionStatus, "pending">;
  rejectionReason?: string;
}
