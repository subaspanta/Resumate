import { axiosClient } from "@/src/api/client";
import { AI_CALL_TIMEOUT_MS } from "@/src/api/config";
import type { ApiResponse } from "@/src/api/types";
import type {
  CareerAnalysisSummary,
  CareerAnalysisDetail,
  CreatedCareerAnalysis,
} from "./types";

export const careerAnalysisApi = {
  // Synchronous on the backend — evidence assessment is a Gemini call that
  // routinely runs several seconds, plus the completion transaction after it.
  create: (input: { resumeId: string; roleSlug: string }) =>
    axiosClient.post<ApiResponse<CreatedCareerAnalysis>>(
      "/career-analyses",
      input,
      { timeout: AI_CALL_TIMEOUT_MS },
    ),

  list: (resumeId?: string) =>
    axiosClient.get<ApiResponse<CareerAnalysisSummary[]>>("/career-analyses", {
      params: resumeId ? { resumeId } : undefined,
    }),

  get: (id: string) =>
    axiosClient.get<ApiResponse<CareerAnalysisDetail>>(`/career-analyses/${id}`),

  remove: (id: string) =>
    axiosClient.delete<ApiResponse<{ id: string }>>(`/career-analyses/${id}`),
};
