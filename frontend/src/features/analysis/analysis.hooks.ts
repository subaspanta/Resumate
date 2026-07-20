"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { analysisApi } from "./analysis.service";
import type {
  Analysis,
  AnalysisSummary,
  CreateAnalysisInput,
  CreateAnalysisResult,
  RewriteSuggestionsInput,
  Suggestion,
  SuggestionStatus,
} from "./types";
import { isApiError } from "@/src/api/api-error";

const LATEST_ANALYSIS_QUERY_KEY = (resumeId: string) =>
  ["analysis", "latest", resumeId] as const;
const ANALYSIS_QUERY_KEY = (id: string) => ["analysis", id] as const;
const ANALYSIS_HISTORY_QUERY_KEY = (resumeId: string) =>
  ["analysis", "history", resumeId] as const;

export function useLatestAnalysis(resumeId: string) {
  const {
    data: analysis,
    isLoading,
    isError,
    error,
  } = useQuery<Analysis | null>({
    queryKey: LATEST_ANALYSIS_QUERY_KEY(resumeId),
    queryFn: async () => {
      try {
        const response = await analysisApi.latest(resumeId);
        return response?.data?.data ?? null;
      } catch (err) {
        if (isApiError(err) && err.status === 404) {
          return null;
        }
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, err) => {
      if (isApiError(err) && (err.status === 401 || err.status === 404)) {
        return false;
      }
      return failureCount < 2;
    },
    enabled: !!resumeId,
  });

  return {
    analysis,
    isLoading,
    isError,
    error: isApiError(error) ? error : null,
  };
}

export function useAnalysis(id: string) {
  const {
    data: analysis,
    isLoading,
    isError,
    error,
  } = useQuery<Analysis>({
    queryKey: ANALYSIS_QUERY_KEY(id),
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

export function useAnalysisHistory(resumeId: string) {
  const {
    data: analyses = [],
    isLoading,
    isError,
    error,
  } = useQuery<AnalysisSummary[]>({
    queryKey: ANALYSIS_HISTORY_QUERY_KEY(resumeId),
    queryFn: async () => {
      const response = await analysisApi.history(resumeId);
      return response?.data?.data ?? [];
    },
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, err) => {
      if (isApiError(err) && err.status === 401) return false;
      return failureCount < 2;
    },
    enabled: !!resumeId,
  });

  return {
    analyses,
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
    onSuccess: (_result, input) => {
      queryClient.invalidateQueries({
        queryKey: LATEST_ANALYSIS_QUERY_KEY(input.resumeId),
      });
      queryClient.invalidateQueries({
        queryKey: ANALYSIS_HISTORY_QUERY_KEY(input.resumeId),
      });
    },
  });
}

export function useDeleteAnalysis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await analysisApi.remove(id);
      return id;
    },
    onSuccess: () => {
      // Invalidate all analysis queries since we don't know which resume was affected
      queryClient.invalidateQueries({ queryKey: ["analysis"] });
    },
  });
}

export function useRewriteSuggestions(analysisId: string) {
  const queryClient = useQueryClient();

  return useMutation<Suggestion[], unknown, RewriteSuggestionsInput>({
    mutationFn: async (input: RewriteSuggestionsInput) => {
      const response = await analysisApi.rewriteSuggestions(input);
      return response?.data?.data ?? [];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ANALYSIS_QUERY_KEY(analysisId),
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
  const key = ANALYSIS_QUERY_KEY(analysisId);

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
