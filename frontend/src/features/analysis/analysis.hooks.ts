"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { analysisApi } from "./analysis.service";
import type {
  Analysis,
  CreateAnalysisInput,
  CreateAnalysisResult,
  RewriteSuggestionsInput,
  Suggestion,
  SuggestionStatus,
} from "./types";
import type { StructuredResume } from "@/src/features/resume/types";
import { isApiError } from "@/src/api/api-error";
import { queryKeys } from "@/src/lib/query-keys";

// Unused — no current caller. Backend route (GET /resumes/:resumeId/latest-analysis)
// still exists, so this can come back if a "continue last analysis" flow is added.
// export function useLatestAnalysis(resumeId: string) {
//   const {
//     data: analysis,
//     isLoading,
//     isError,
//     error,
//   } = useQuery<Analysis | null>({
//     queryKey: queryKeys.analysis.latest(resumeId),
//     queryFn: async () => {
//       try {
//         const response = await analysisApi.latest(resumeId);
//         return response?.data?.data ?? null;
//       } catch (err) {
//         if (isApiError(err) && err.status === 404) {
//           return null;
//         }
//         throw err;
//       }
//     },
//     staleTime: 1000 * 60 * 5,
//     retry: (failureCount, err) => {
//       if (isApiError(err) && (err.status === 401 || err.status === 404)) {
//         return false;
//       }
//       return failureCount < 2;
//     },
//     enabled: !!resumeId,
//   });
//
//   return {
//     analysis,
//     isLoading,
//     isError,
//     error: isApiError(error) ? error : null,
//   };
// }

export function useAnalysis(id: string) {
  const {
    data: analysis,
    isLoading,
    isError,
    error,
  } = useQuery<Analysis>({
    queryKey: queryKeys.analysis.detail(id),
    queryFn: async () => {
      const response = await analysisApi.get(id);
      return response?.data?.data as Analysis;
    },
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, err) => {
      if (isApiError(err) && err.status === 401) return false;
      return failureCount < 2;
    },
    enabled: !!id,
  });

  return {
    analysis,
    isLoading,
    isError,
    error: isApiError(error) ? error : null,
  };
}

// Unused — no current caller. Backend route (GET /resumes/:resumeId/analyses)
// still exists, so this can come back if a per-resume analysis history view is added.
// export function useAnalysisHistory(resumeId: string) {
//   const {
//     data: analyses = [],
//     isLoading,
//     isError,
//     error,
//   } = useQuery<AnalysisSummary[]>({
//     queryKey: queryKeys.analysis.history(resumeId),
//     queryFn: async () => {
//       const response = await analysisApi.history(resumeId);
//       return response?.data?.data ?? [];
//     },
//     staleTime: 1000 * 60 * 5,
//     retry: (failureCount, err) => {
//       if (isApiError(err) && err.status === 401) return false;
//       return failureCount < 2;
//     },
//     enabled: !!resumeId,
//   });
//
//   return {
//     analyses,
//     isLoading,
//     isError,
//     error: isApiError(error) ? error : null,
//   };
// }

// Only meaningful once at least one suggestion has been applied — callers
// gate `enabled` on that so the preview falls back to the analysis's frozen
// resumeSnapshot until there's actually a merge to show.
export function useMergedResume(resumeId: string, enabled: boolean) {
  const {
    data: structuredResume,
    isLoading,
    isError,
    error,
  } = useQuery<StructuredResume | undefined>({
    queryKey: queryKeys.analysis.merged(resumeId),
    queryFn: async () => {
      const response = await analysisApi.merged(resumeId);
      return response?.data?.data?.structuredResume;
    },
    retry: (failureCount, err) => {
      if (isApiError(err) && err.status === 401) return false;
      return failureCount < 2;
    },
    enabled: enabled && !!resumeId,
  });

  return {
    structuredResume,
    isLoading,
    isError,
    error: isApiError(error) ? error : null,
  };
}

export function useCreateAnalysis() {
  const queryClient = useQueryClient();

  return useMutation<CreateAnalysisResult, unknown, CreateAnalysisInput>({
    mutationFn: async (input: CreateAnalysisInput) => {
      const response = await analysisApi.create(input);
      return response?.data?.data as CreateAnalysisResult;
    },
    onSuccess: () => {
      // The dashboard derives its whole layout from each resume's
      // analysisStatus, so without this it keeps showing the pre-analysis
      // state for the full 5-minute staleTime after an analysis is created.
      //
      // The analysis latest/history keys are deliberately not invalidated:
      // the hooks that read them are commented out, so those calls would be
      // no-ops that read as though they do something.
      queryClient.invalidateQueries({ queryKey: queryKeys.resumes.all() });
    },
  });
}

// Unused — no current caller. Backend route (DELETE /analyses/:id) still
// exists, so this can come back if a delete-analysis action is added to the UI.
// export function useDeleteAnalysis() {
//   const queryClient = useQueryClient();
//
//   return useMutation({
//     mutationFn: async (id: string) => {
//       await analysisApi.remove(id);
//       return id;
//     },
//     onSuccess: () => {
//       // Invalidate all analysis queries since we don't know which resume was affected
//       queryClient.invalidateQueries({ queryKey: queryKeys.analysis.all() });
//     },
//   });
// }

export function useRewriteSuggestions(analysisId: string) {
  const queryClient = useQueryClient();

  return useMutation<Suggestion[], unknown, RewriteSuggestionsInput>({
    mutationFn: async (input: RewriteSuggestionsInput) => {
      const response = await analysisApi.rewriteSuggestions(input);
      return response?.data?.data ?? [];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.analysis.detail(analysisId),
      });
    },
  });
}

interface UpdateSuggestionVars {
  suggestionId: string;
  rejectionReason?: string;
}

interface SuggestionMutationContext {
  previous?: Analysis;
}

// Shared optimistic-PATCH factory: flips one suggestion to `status` in the
// cached analysis immediately, rolls back on error, and refetches on settle.
function useUpdateSuggestionStatus(
  analysisId: string,
  status: Exclude<SuggestionStatus, "pending">
) {
  const queryClient = useQueryClient();
  const key = queryKeys.analysis.detail(analysisId);

  return useMutation<
    Suggestion,
    unknown,
    UpdateSuggestionVars,
    SuggestionMutationContext
  >({
    mutationFn: async ({ suggestionId, rejectionReason }) => {
      const response = await analysisApi.updateSuggestionStatus({
        suggestionId,
        status,
        rejectionReason,
      });
      return response?.data?.data as Suggestion;
    },
    onMutate: async ({ suggestionId }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Analysis>(key);
      if (previous) {
        queryClient.setQueryData<Analysis>(key, {
          ...previous,
          suggestions: previous.suggestions.map((s) =>
            s.id === suggestionId ? { ...s, status } : s
          ),
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(key, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
      const resumeId = queryClient.getQueryData<Analysis>(key)?.resumeId;
      if (resumeId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.analysis.merged(resumeId),
        });
      }
    },
  });
}

export function useApplySuggestion(analysisId: string) {
  return useUpdateSuggestionStatus(analysisId, "applied");
}

export function useRejectSuggestion(analysisId: string) {
  return useUpdateSuggestionStatus(analysisId, "rejected");
}

export function useExportPDF(resumeId: string) {
  return useMutation<Blob, unknown, void>({
    mutationFn: async () => {
      const response = await analysisApi.exportPDF(resumeId);
      return response.data;
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
}
