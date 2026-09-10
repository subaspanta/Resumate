"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isApiError } from "@/src/api/api-error";
import { useCareerAnalysis } from "./career-analysis.hooks";

export function useCareerAnalysisGuard(analysisId: string) {
  const { analysis, isLoading, isError, error, refetch } =
    useCareerAnalysis(analysisId);
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
    refetch,
  };
}
