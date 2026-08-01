"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeApi } from "./resume.service";
import type { ResumeSummary, Resume } from "./types";
import { isApiError } from "@/src/api/api-error";

const RESUMES_QUERY_KEY = ["resumes"] as const;
const RESUME_QUERY_KEY = (id: string) => ["resumes", id] as const;

function enrichResumeSummary(resume: ResumeSummary): ResumeSummary {
  return {
    ...resume,
    lastEditedAt: new Date(resume.updatedAt).toLocaleDateString(),
    fileName: resume.originalFileName,
    atsScore: 0,
    suggestionsCount: 0,
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
    queryKey: RESUMES_QUERY_KEY,
    queryFn: async () => {
      const response = await resumeApi.list();
      const items = response?.data?.data?.items ?? [];
      return items.map(enrichResumeSummary);
    },
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, err) => {
      if (isApiError(err) && err.status === 401) return false;
      return failureCount < 2;
    },
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
    queryKey: RESUME_QUERY_KEY(id),
    queryFn: async () => {
      const response = await resumeApi.get(id);
      return response?.data?.data as Resume;
    },
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, err) => {
      if (isApiError(err) && err.status === 401) return false;
      return failureCount < 2;
    },
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
      queryClient.invalidateQueries({ queryKey: RESUMES_QUERY_KEY });
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await resumeApi.remove(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUMES_QUERY_KEY });
    },
  });
}
