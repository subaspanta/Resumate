"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { roadmapApi } from "./roadmap.service";
import type { Roadmap } from "./types";
import { isApiError } from "@/src/api/api-error";
import { queryKeys } from "@/src/lib/query-keys";
import { DEFAULT_STALE_TIME, defaultQueryRetry } from "@/src/lib/query-client";

// `null` data is a valid success state — an analysis without a roadmap yet —
// not an error, so isError only reflects real request failures.
export function useRoadmap(analysisId: string) {
  const {
    data: roadmap,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Roadmap | null>({
    queryKey: queryKeys.roadmap.byAnalysis(analysisId),
    queryFn: async () => {
      const response = await roadmapApi.getForAnalysis(analysisId);
      return response?.data?.data ?? null;
    },
    staleTime: DEFAULT_STALE_TIME,
    retry: defaultQueryRetry,
    enabled: !!analysisId,
  });

  return {
    roadmap: roadmap ?? null,
    isLoading,
    isError,
    error: isApiError(error) ? error : null,
    refetch,
  };
}

// 422 reuses VALIDATION_FAILED (not a distinct code) for both preconditions,
// so branch on status rather than code — the message itself distinguishes
// "analysis not complete" from "no gaps worth working on".
const PRECONDITION_FALLBACK =
  "This analysis isn't ready for a roadmap yet.";

export function useGenerateRoadmap(analysisId: string) {
  const queryClient = useQueryClient();

  return useMutation<Roadmap, unknown, void>({
    mutationFn: async () => {
      const response = await roadmapApi.generate(analysisId);
      return response?.data?.data as Roadmap;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.roadmap.byAnalysis(analysisId), data);
    },
    onError: (error) => {
      if (isApiError(error) && error.status === 409) {
        // A roadmap already exists — a double-click or a replayed request,
        // not a real failure. Treat as success and refetch the real thing
        // rather than surfacing an error toast for state that's actually fine.
        queryClient.invalidateQueries({
          queryKey: queryKeys.roadmap.byAnalysis(analysisId),
        });
        return;
      }
      if (isApiError(error) && error.status === 422) {
        toast.error(error.message || PRECONDITION_FALLBACK);
        return;
      }
      const message =
        error instanceof Error ? error.message : "Failed to generate roadmap";
      toast.error(message);
    },
  });
}

interface ToggleTaskContext {
  previous?: Roadmap | null;
}

// Optimistic like useDeleteResume: cancel -> snapshot -> patch -> rollback on
// error -> invalidate on settle. Sends only { completed }; completedAt is
// server-derived and read back on refetch, never written client-side.
export function useToggleRoadmapTask(analysisId: string) {
  const queryClient = useQueryClient();
  const key = queryKeys.roadmap.byAnalysis(analysisId);

  return useMutation<
    void,
    unknown,
    { taskId: string; completed: boolean },
    ToggleTaskContext
  >({
    mutationFn: async ({ taskId, completed }) => {
      await roadmapApi.setTaskCompletion(taskId, completed);
    },
    onMutate: async ({ taskId, completed }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Roadmap | null>(key);
      if (previous) {
        queryClient.setQueryData<Roadmap>(key, {
          ...previous,
          tasks: previous.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  completed,
                  completedAt: completed ? new Date().toISOString() : null,
                }
              : task,
          ),
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(key, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });
}
