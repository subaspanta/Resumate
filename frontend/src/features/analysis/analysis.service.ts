import { axiosClient } from "@/src/api/client";
import type { ApiResponse } from "@/src/features/auth/types";
import type {
  Analysis,
  AnalysisSummary,
  CreateAnalysisInput,
  CreateAnalysisResult,
  RewriteSuggestionsInput,
  Suggestion,
  UpdateSuggestionStatusInput,
} from "@/src/features/analysis/types";

export const analysisApi = {
  create: (body: CreateAnalysisInput) =>
    axiosClient.post<ApiResponse<CreateAnalysisResult>>("/analyses", body),

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

  rewriteSuggestions: (body: RewriteSuggestionsInput) =>
    axiosClient.post<ApiResponse<Suggestion[]>>(
      "/analyses/rewrite-suggestions",
      body
    ),

  updateSuggestionStatus: ({
    suggestionId,
    status,
    rejectionReason,
  }: UpdateSuggestionStatusInput) =>
    axiosClient.patch<ApiResponse<Suggestion>>(
      `/analyses/suggestions/${suggestionId}`,
      { status, rejectionReason }
    ),

  exportPDF: (resumeId: string) =>
    axiosClient.post<Blob>(
      `/exports/resumes/${resumeId}/export`,
      undefined,
      { responseType: "blob" }
    ),
};
