"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isApiError } from "@/src/api/api-error";
import { useCareerAnalysis } from "./career-analysis.hooks";

// Gates the analysis/roadmap steps. GET /career-analyses/:id 404s for both a
// missing and a foreign analysis, so a 404 here means "not yours to see" —
// bounce back to the start of the flow rather than leaving a dead-end panel.
//
// Only 404 redirects. A 500 or a dropped connection is a transient failure,
// not a skipped step — those keep the page's inline retry affordance. 401 is
// already handled by the axios refresh interceptor and AuthProvider.
export function useCareerAnalysisGuard(analysisId: string) {
  const { analysis, isLoading, isError, error } = useCareerAnalysis(analysisId);
  const router = useRouter();

  const isForbidden = isError && isApiError(error) && error.status === 404;

  useEffect(() => {
    if (!isForbidden) return;
    toast.error("That analysis isn't available. Start a new one to continue.");
    router.replace("/");
  }, [isForbidden, router]);

  return {
    analysis,
    isLoading,
    isError: isError && !isForbidden,
    isRedirecting: isForbidden,
  };
}
