"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeApi } from "./resume.service";
import type { ResumeSummary, Resume } from "./types";
import { isApiError } from "@/src/api/api-error";
import { queryKeys } from "@/src/lib/query-keys";
import {
  DEFAULT_STALE_TIME,
  defaultQueryRetry,
} from "@/src/lib/query-client";

function enrichResumeSummary(resume: ResumeSummary): ResumeSummary {
  return {
    ...resume,
    lastEditedAt: new Date(resume.updatedAt).toLocaleDateString(),
    fileName: resume.originalFileName,
  };
}

export function useResumes() {
  const {
    data: resumes = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ResumeSummary[]>({
    queryKey: queryKeys.resumes.all(),
    queryFn: async () => {
      const response = await resumeApi.list();
      const items = response?.data?.data?.items ?? [];
      return items.map(enrichResumeSummary);
    },
    staleTime: DEFAULT_STALE_TIME,
    retry: defaultQueryRetry,
  });

  return {
    resumes,
    isLoading,
    isError,
    error: isApiError(error) ? error : null,
    refetch,
  };
}

export function useResume(id: string) {
  const {
    data: resume,
    isLoading,
    isError,
    error,
  } = useQuery<Resume>({
    queryKey: queryKeys.resumes.detail(id),
    queryFn: async () => {
      const response = await resumeApi.get(id);
      return response?.data?.data as Resume;
    },
    staleTime: DEFAULT_STALE_TIME,
    retry: defaultQueryRetry,
    enabled: !!id,
  });

  return {
    resume,
    isLoading,
    isError,
    error: isApiError(error) ? error : null,
  };
}

export function useUploadResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (form: FormData) => {
      const response = await resumeApi.upload(form);
      return response?.data?.data as Resume;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resumes.all() });
    },
  });
}

interface DeleteResumeContext {
  previous?: ResumeSummary[];
}

// Optimistic: drop the row immediately so the list doesn't sit there with a
// spinner on a destructive action the user has already confirmed. Rolls the
// row back if the request fails.
export function useDeleteResume() {
  const queryClient = useQueryClient();
  const key = queryKeys.resumes.all();

  return useMutation<string, unknown, string, DeleteResumeContext>({
    mutationFn: async (id: string) => {
      await resumeApi.remove(id);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<ResumeSummary[]>(key);
      if (previous) {
        queryClient.setQueryData<ResumeSummary[]>(
          key,
          previous.filter((r) => r.id !== id),
        );
      }
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(key, context.previous);
      }
    },
    onSettled: (_data, _err, id) => {
      queryClient.invalidateQueries({ queryKey: key });
      // The deleted resume's own detail entry is now dead cache — a stale
      // read would render a resume the server no longer has.
      queryClient.removeQueries({ queryKey: queryKeys.resumes.detail(id) });
    },
  });
}
