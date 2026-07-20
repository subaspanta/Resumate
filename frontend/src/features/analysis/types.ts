export interface AnalysisScore {
  overall: number;
  ats: number;
  sections: Record<string, number>;
}

export interface MarketIntel {
  company: string;
  industry: string;
  techStack: string[];
  experienceLevel: string;
  salaryRangeNPR: { min: number; max: number };
  atsKeywords: string[];
  commonRequirements: string[];
  nepaliContext: string;
}

export interface ParsedJob {
  title: string;
  company: string | null;
  requirements: string[];
  skills: string[];
  experienceLevel: string;
}

// analysisResult is an open envelope on the backend; marketIntel is the only
// field guaranteed present today.
export interface AnalysisResult {
  marketIntel?: MarketIntel;
  parsedJob?: ParsedJob;
  scores?: AnalysisScore;
}

export type SuggestionStatus = "pending" | "applied" | "rejected";

export interface Suggestion {
  id: string;
  analysisId: string;
  original: string;
  suggested: string;
  section: string | null;
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

// GET /analyses/:id returns the full row plus its suggestions.
export interface Analysis extends AnalysisSummary {
  userId: string;
  parsedJob: ParsedJob | Record<string, unknown>;
  resumeSnapshot: Record<string, unknown>;
  analysisResult: AnalysisResult;
  suggestions: Suggestion[];
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
  marketIntel: Record<string, unknown>;
}

export interface RewriteSuggestionsInput {
  analysisId: string;
  originalBullet: string;
  jobRequirements: string[];
}

export interface UpdateSuggestionStatusInput {
  suggestionId: string;
  status: Exclude<SuggestionStatus, "pending">;
  rejectionReason?: string;
}
