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
import {
  DEFAULT_STALE_TIME,
  defaultQueryRetry,
} from "@/src/lib/query-client";

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
    staleTime: DEFAULT_STALE_TIME,
    retry: defaultQueryRetry,
    enabled: !!id,
  });

  return {
    analysis,
    isLoading,
    isError,
    error: isApiError(error) ? error : null,
  };
}

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
    retry: defaultQueryRetry,
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
      // nothing reads them, so invalidating would be a no-op that reads as
      // though it does something.
      queryClient.invalidateQueries({ queryKey: queryKeys.resumes.all() });
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
