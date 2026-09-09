"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { roadmapApi } from "./roadmap.service";
import type { Roadmap } from "./types";
import { isApiError } from "@/src/api/api-error";
import { queryKeys } from "@/src/lib/query-keys";
import { DEFAULT_STALE_TIME, defaultQueryRetry } from "@/src/lib/query-client";

// Null is valid: an analysis may not have a roadmap yet.
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

// Both roadmap preconditions use 422/VALIDATION_FAILED; the message supplies detail.
const PRECONDITION_FALLBACK = "This analysis isn't ready for a roadmap yet.";

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
        // A duplicate request means the desired roadmap already exists.
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

// Optimistic update; completionAt stays server-derived and notes are optional.
export function useToggleRoadmapTask(analysisId: string) {
  const queryClient = useQueryClient();
  const key = queryKeys.roadmap.byAnalysis(analysisId);

  return useMutation<
    void,
    unknown,
    { taskId: string; completed: boolean; completionNote?: string },
    ToggleTaskContext
  >({
    mutationFn: async ({ taskId, completed, completionNote }) => {
      await roadmapApi.setTaskCompletion(taskId, completed, completionNote);
    },
    onMutate: async ({ taskId, completed, completionNote }) => {
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
                  ...(completionNote !== undefined ? { completionNote } : {}),
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
