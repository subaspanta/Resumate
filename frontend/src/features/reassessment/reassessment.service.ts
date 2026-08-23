import { axiosClient } from "@/src/api/client";
import { AI_CALL_TIMEOUT_MS } from "@/src/api/config";
import type { ApiResponse } from "@/src/api/types";
import type { CreatedCareerAnalysis } from "@/src/features/career-analysis/types";
import type { RevisionSummary } from "./types";

export const reassessmentApi = {
  // Re-runs the evidence agent — same budget as career-analysis creation and
  // roadmap generation. Response omits both frozen snapshots, same as
  // POST /career-analyses — see CreatedCareerAnalysis.
  reassess: (analysisId: string) =>
    axiosClient.post<ApiResponse<CreatedCareerAnalysis>>(
      `/career-analyses/${analysisId}/reassess`,
      undefined,
      { timeout: AI_CALL_TIMEOUT_MS },
    ),

  listRevisions: (analysisId: string) =>
    axiosClient.get<ApiResponse<RevisionSummary[]>>(
      `/career-analyses/${analysisId}/revisions`,
    ),
};
