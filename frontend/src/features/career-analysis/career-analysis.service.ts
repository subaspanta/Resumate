import { axiosClient } from "@/src/api/client";
import type { ApiResponse } from "@/src/api/types";
import type {
  CareerAnalysisSummary,
  CareerAnalysisDetail,
  CreatedCareerAnalysis,
} from "./types";

export const careerAnalysisApi = {
  // Synchronous on the backend — evidence assessment is a Gemini call that
  // routinely runs several seconds and can take up to 60s, matching the
  // server's own GEMINI_CALL_TIMEOUT_MS-derived budget (see resumeApi.upload
  // for the same reasoning).
  create: (input: { resumeId: string; roleSlug: string }) =>
    axiosClient.post<ApiResponse<CreatedCareerAnalysis>>(
      "/career-analyses",
      input,
      { timeout: 60000 },
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
