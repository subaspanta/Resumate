"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isApiError } from "@/src/api/api-error";
import { useCreateAnalysis } from "@/src/features/analysis/analysis.hooks";

/**
 * Mutation + error mapping + navigation for the job-description step, mirroring
 * useUploadResumeFlow on the dashboard. Both steps do the same shape of work, so
 * they're extracted the same way rather than one being inline in its route.
 */
export function useCreateAnalysisFlow(resumeId: string) {
  const router = useRouter();
  const createAnalysis = useCreateAnalysis();

  const submitJobDescription = async (jobDescription: string) => {
    try {
      const result = await createAnalysis.mutateAsync({
        resumeId,
        jobDescription,
      });
      router.push(`/analysis/${result.analysisId}`);
    } catch (error) {
      if (isApiError(error)) {
        switch (error.code) {
          case "RATE_LIMIT_EXCEEDED":
            // Our own aiRateLimit (10 req / 5 min), not Gemini's — the server's
            // message names the actual wait, so prefer it.
            toast.error(error.message);
            return;
          case "GEMINI_RATE_LIMITED":
            toast.error("AI is busy right now. Please try again in a moment.");
            return;
        }
      }
      const message =
        error instanceof Error ? error.message : "Failed to start analysis";
      toast.error(message);
    }
  };

  return {
    submitJobDescription,
    isCreatingAnalysis: createAnalysis.isPending,
  };
}
