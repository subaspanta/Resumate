"use client";

import { useState } from "react";
import { toast } from "sonner";
import { isApiError } from "@/src/api/api-error";
import { useRewriteSuggestions } from "@/src/features/analysis/analysis.hooks";
import type { GenerateSuggestionsInput } from "@/src/features/analysis/types";

/**
 * On-demand AI rewrite for a single bullet, project, or summary. Mutation plus
 * error mapping, matching how useCreateAnalysisFlow and useResumeUpload handle
 * the same rate-limit codes on the other two steps.
 */
export function useGenerateSuggestions(analysisId: string) {
  const rewriteSuggestions = useRewriteSuggestions(analysisId);
  const [generatingKey, setGeneratingKey] = useState<string | null>(null);

  const generate = (input: GenerateSuggestionsInput) => {
    setGeneratingKey(input.key);
    rewriteSuggestions.mutate(
      {
        analysisId,
        section: input.section,
        originalBullet: input.originalText,
      },
      {
        onError: (error) => {
          if (isApiError(error) && error.code === "RATE_LIMIT_EXCEEDED") {
            // Our own aiRateLimit (10 req / 5 min), not Gemini's. The generic
            // fallback below says "try again", which is wrong here — the
            // server's message names the actual wait.
            toast.error(error.message);
            return;
          }
          if (isApiError(error) && error.code === "GEMINI_RATE_LIMITED") {
            toast.error("AI is busy right now. Please try again in a moment.");
            return;
          }
          toast.error("Failed to generate suggestions. Please try again.");
        },
        onSettled: () => setGeneratingKey(null),
      },
    );
  };

  return { generate, generatingKey };
}
