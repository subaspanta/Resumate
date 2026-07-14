"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { analysisApi } from "./analysis.service";
import type { Analysis, AnalysisSummary, CreateAnalysisInput } from "./types";
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

  return useMutation({
    mutationFn: async (input: CreateAnalysisInput) => {
      const response = await analysisApi.create(input);
      return response?.data?.data as Analysis;
    },
    onSuccess: (analysis) => {
      queryClient.setQueryData(
        LATEST_ANALYSIS_QUERY_KEY(analysis.resumeId),
        analysis
      );
      queryClient.invalidateQueries({
        queryKey: ANALYSIS_HISTORY_QUERY_KEY(analysis.resumeId),
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
