"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { reassessmentApi } from "./reassessment.service";
import type { RevisionSummary } from "./types";
import type { CreatedCareerAnalysis } from "@/src/features/career-analysis/types";
import { isApiError } from "@/src/api/api-error";
import { queryKeys } from "@/src/lib/query-keys";
import { DEFAULT_STALE_TIME, defaultQueryRetry } from "@/src/lib/query-client";

export function useRevisions(analysisId: string) {
  const {
    data: revisions = [],
    isLoading,
    isError,
    error,
  } = useQuery<RevisionSummary[]>({
    queryKey: queryKeys.careerAnalyses.revisions(analysisId),
    queryFn: async () => {
      const response = await reassessmentApi.listRevisions(analysisId);
      return response?.data?.data ?? [];
    },
    staleTime: DEFAULT_STALE_TIME,
    retry: defaultQueryRetry,
    enabled: !!analysisId,
  });

  return {
    revisions,
    isLoading,
    isError,
    error: isApiError(error) ? error : null,
  };
}

// 422 reuses VALIDATION_FAILED for every eligibility precondition (no
// completed task, no note, analysis not complete) — the backend messages are
// written to be shown to the user directly, so branch on status, not code.
export function useReassessAnalysis(analysisId: string) {
  const queryClient = useQueryClient();

  return useMutation<CreatedCareerAnalysis, unknown, void>({
    mutationFn: async () => {
      const response = await reassessmentApi.reassess(analysisId);
      return response?.data?.data as CreatedCareerAnalysis;
    },
    onSuccess: (data) => {
      // Invalidate rather than write: the response omits both frozen
      // snapshots (CreatedCareerAnalysis), a different shape than the
      // CareerAnalysisDetail a GET /:id returns, so it must never be written
      // into the detail cache as if it were a full read — same reasoning as
      // useCreateCareerAnalysis.
      queryClient.invalidateQueries({
        queryKey: queryKeys.careerAnalyses.detail(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.careerAnalyses.revisions(analysisId),
      });
    },
    onError: (error) => {
      if (isApiError(error) && (error.status === 422 || error.status === 400)) {
        toast.error(error.message || "This analysis isn't ready to reassess yet.");
        return;
      }
      if (
        isApiError(error) &&
        (error.code === "RATE_LIMIT_EXCEEDED" || error.code === "GEMINI_RATE_LIMITED")
      ) {
        toast.error("Too many AI requests. Please wait a few minutes and try again.");
        return;
      }
      const message =
        error instanceof Error ? error.message : "Failed to reassess your analysis";
      toast.error(message);
    },
  });
}
