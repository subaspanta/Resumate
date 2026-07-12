import { axiosClient } from "@/src/api/client";
import type { ApiResponse } from "@/src/features/auth/types";
import type {
  Analysis,
  AnalysisSummary,
  CreateAnalysisInput,
} from "@/src/features/analysis/types";

export const analysisApi = {
  create: (body: CreateAnalysisInput) =>
    axiosClient.post<ApiResponse<Analysis>>("/analyses", body),

  latest: (resumeId: string) =>
    axiosClient.get<ApiResponse<Analysis | null>>(
      `/resumes/${resumeId}/latest-analysis`
    ),

  get: (id: string) =>
    axiosClient.get<ApiResponse<Analysis>>(`/analyses/${id}`),

  history: (resumeId: string) =>
    axiosClient.get<ApiResponse<AnalysisSummary[]>>(
      `/resumes/${resumeId}/analyses`
    ),

  remove: (id: string) =>
    axiosClient.delete<ApiResponse<{ id: string }>>(`/analyses/${id}`),
};
