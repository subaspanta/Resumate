"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isApiError } from "@/src/api/api-error";
import { useAnalysis } from "./analysis.hooks";

// Gates the preview step. The backend returns 404 for a missing *and* a
// foreign analysis (getAnalysisById in analysis.service.ts), so a 404 here
// means "not yours to see" — bounce back to the start of the flow rather
// than leaving a dead-end error panel.
//
// Redirect target is "/" and not /workspace/:resumeId because a failed fetch
// never yields an analysis, so there's no trustworthy resumeId to build that
// URL from.
//
// Only 404 redirects. A 500 or a network drop is a transient failure, not a
// skipped step — those keep the page's inline retry affordance. 401 is already
// handled by the axios refresh interceptor and AuthProvider.
export function useRequireAnalysis(analysisId: string) {
  const { analysis, isLoading, isError, error } = useAnalysis(analysisId);
  const router = useRouter();

  const isForbidden = isError && isApiError(error) && error.status === 404;

  useEffect(() => {
    if (!isForbidden) return;
    toast.error("Enter a job description for your resume to see a preview.");
    router.replace("/");
  }, [isForbidden, router]);

  return {
    analysis,
    isLoading,
    // The page still shows its retry panel for real failures, but not while a
    // redirect is in flight — otherwise the dead-end copy flashes on the way out.
    isError: isError && !isForbidden,
    isRedirecting: isForbidden,
  };
}
