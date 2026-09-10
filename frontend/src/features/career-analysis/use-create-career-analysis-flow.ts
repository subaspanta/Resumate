"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isApiError } from "@/src/api/api-error";
import { useCreateCareerAnalysis } from "./career-analysis.hooks";

export function useCreateCareerAnalysisFlow(resumeId: string) {
  const router = useRouter();
  const createAnalysis = useCreateCareerAnalysis();

  const submitRole = async (roleSlug: string) => {
    try {
      const result = await createAnalysis.mutateAsync({ resumeId, roleSlug });
      router.push(`/analyses/${result.id}`);
    } catch (error) {
      if (isApiError(error)) {
        switch (error.code) {
          case "RATE_LIMIT_EXCEEDED":
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
    submitRole,
    isCreatingAnalysis: createAnalysis.isPending,
  };
}
