"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isApiError } from "@/src/api/api-error";
import { useCreateCareerAnalysis } from "./career-analysis.hooks";

// Mutation + error mapping + navigation for the role-selection step, mirroring
// useUploadResumeFlow on the dashboard. On failure the create call throws
// (POST /career-analyses re-throws on AI failure after marking the row
// failed server-side) and returns no analysis id to navigate to, so the user
// stays on this page and sees a toast rather than being routed to a result
// that doesn't exist.
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
            // Our own aiRateLimit (10 req / 5 min), not Gemini's — the
            // server's message names the actual wait, so prefer it.
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
