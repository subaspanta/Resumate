"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isApiError } from "@/src/api/api-error";
import { useResume } from "./resume.hooks";

// Gates the job-description step: without a resume there's nothing to tailor.
// Same 404-means-missing-or-foreign contract as useAnalysisGuard, and the
// same rule that only a 404 redirects.
export function useResumeGuard(resumeId: string) {
  const { resume, isLoading, isError, error } = useResume(resumeId);
  const router = useRouter();

  const isForbidden = isError && isApiError(error) && error.status === 404;

  useEffect(() => {
    if (!isForbidden) return;
    toast.error("That resume isn't available. Upload one to get started.");
    router.replace("/");
  }, [isForbidden, router]);

  return {
    resume,
    isLoading,
    isError: isError && !isForbidden,
    isRedirecting: isForbidden,
  };
}
