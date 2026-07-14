export interface AnalysisScore {
  overall: number;
  ats: number;
  sections: Record<string, number>;
}

export interface AnalysisResult {
  scores: AnalysisScore;
  suggestions: string[];
  jobDescription?: string;
}

export interface AnalysisSummary {
  id: string;
  resumeId: string;
  jobDescription: string;
  createdAt: string;
}

export interface Analysis extends AnalysisSummary {
  parsedJob: Record<string, unknown>;
  resumeSnapshot: Record<string, unknown>;
  analysisResult: AnalysisResult;
}

export interface CreateAnalysisInput {
  resumeId: string;
  jobTitle?: string;
  jobDescription?: string;
}
