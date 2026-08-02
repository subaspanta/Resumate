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
import type { StructuredResume } from "@/src/features/resume/types";

// AI-backed calls (job parsing, rewrite generation) run a Gemini round-trip
// server-side and can exceed the client's default 10s timeout under normal
// latency, not just when something's actually wrong.
const AI_CALL_TIMEOUT_MS = 60000;

export const analysisApi = {
  create: (body: CreateAnalysisInput) =>
    axiosClient.post<ApiResponse<CreateAnalysisResult>>("/analyses", body, {
      timeout: AI_CALL_TIMEOUT_MS,
    }),

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

  merged: (resumeId: string) =>
    axiosClient.get<ApiResponse<{ structuredResume: StructuredResume }>>(
      `/analyses/resumes/${resumeId}/merged`
    ),

  remove: (id: string) =>
    axiosClient.delete<ApiResponse<{ id: string }>>(`/analyses/${id}`),

  rewriteSuggestions: (body: RewriteSuggestionsInput) =>
    axiosClient.post<ApiResponse<Suggestion[]>>(
      "/analyses/rewrite-suggestions",
      body,
      { timeout: AI_CALL_TIMEOUT_MS }
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
