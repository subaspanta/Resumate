"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { careerAnalysisApi } from "./career-analysis.service";
import type {
  CareerAnalysisSummary,
  CareerAnalysisDetail,
  CreatedCareerAnalysis,
} from "./types";
import { isApiError } from "@/src/api/api-error";
import { queryKeys } from "@/src/lib/query-keys";
import { DEFAULT_STALE_TIME, defaultQueryRetry } from "@/src/lib/query-client";

export function useCareerAnalyses(resumeId?: string) {
  const {
    data: analyses = [],
    isLoading,
    isError,
    error,
  } = useQuery<CareerAnalysisSummary[]>({
    queryKey: queryKeys.careerAnalyses.list(resumeId),
    queryFn: async () => {
      // The backend cursor-paginates (default 20/page); nothing here reads
      // nextCursor yet, matching useResumes' own unused-cursor precedent —
      // this bounds the worst case rather than adding a "load more" UI.
      const response = await careerAnalysisApi.list(resumeId);
      return response?.data?.data?.items ?? [];
    },
    staleTime: DEFAULT_STALE_TIME,
    retry: defaultQueryRetry,
  });

  return {
    analyses,
    isLoading,
    isError,
    error: isApiError(error) ? error : null,
  };
}

// Analysis is created with status "analyzing" and the AI call that finishes
// it runs synchronously inside the original POST — so a GET here observing
// "analyzing" only happens when that original request died mid-flight (tab
// closed, network drop) and the backend's stale-analysis reaper hasn't
// caught it yet (career-analysis.service.ts, reapStaleAnalyses, fires on
// read after GEMINI_CALL_TIMEOUT_MS * 3). Polling is what lets this page
// observe that reap instead of showing a frozen "analyzing" state forever.
const ANALYZING_POLL_INTERVAL_MS = 3000;

export function useCareerAnalysis(id: string) {
  const {
    data: analysis,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<CareerAnalysisDetail>({
    queryKey: queryKeys.careerAnalyses.detail(id),
    queryFn: async () => {
      const response = await careerAnalysisApi.get(id);
      return response?.data?.data as CareerAnalysisDetail;
    },
    staleTime: DEFAULT_STALE_TIME,
    retry: defaultQueryRetry,
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "analyzing" || status === "pending"
        ? ANALYZING_POLL_INTERVAL_MS
        : false;
    },
  });

  return {
    analysis,
    isLoading,
    isError,
    error: isApiError(error) ? error : null,
    refetch,
  };
}

// Invalidates the list rather than writing the detail cache directly: the
// create response omits both snapshots (CreatedCareerAnalysis), a different
// shape than the CareerAnalysisDetail a GET /:id returns, so it must never be
// written into the detail cache as if it were a full read.
export function useCreateCareerAnalysis() {
  const queryClient = useQueryClient();

  return useMutation<
    CreatedCareerAnalysis,
    unknown,
    { resumeId: string; roleSlug: string }
  >({
    mutationFn: async (input) => {
      const response = await careerAnalysisApi.create(input);
      return response?.data?.data as CreatedCareerAnalysis;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.careerAnalyses.list(variables.resumeId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.careerAnalyses.list(),
      });
    },
  });
}

export function useDeleteCareerAnalysis() {
  const queryClient = useQueryClient();

  return useMutation<string, unknown, string>({
    mutationFn: async (id: string) => {
      await careerAnalysisApi.remove(id);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.careerAnalyses.all() });
      queryClient.removeQueries({ queryKey: queryKeys.careerAnalyses.detail(id) });
    },
  });
}
