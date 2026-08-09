import { axiosClient } from "@/src/api/client";
import type { ApiResponse } from "@/src/api/types";
import type { CareerAnalysisDetail } from "@/src/features/career-analysis/types";
import type { RevisionSummary } from "./types";

export const reassessmentApi = {
  // Re-runs the evidence agent — same 60s budget as career-analysis creation
  // and roadmap generation.
  reassess: (analysisId: string) =>
    axiosClient.post<ApiResponse<CareerAnalysisDetail>>(
      `/career-analyses/${analysisId}/reassess`,
      undefined,
      { timeout: 60000 },
    ),

  listRevisions: (analysisId: string) =>
    axiosClient.get<ApiResponse<RevisionSummary[]>>(
      `/career-analyses/${analysisId}/revisions`,
    ),
};
