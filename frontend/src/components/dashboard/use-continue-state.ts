"use client";

import { useMemo } from "react";
import { useCareerAnalyses } from "@/src/features/career-analysis/career-analysis.hooks";
import { resolveContinueAction } from "@/src/features/career-analysis/career-analysis.utils";
import type { ContinueAction } from "@/src/features/career-analysis/career-analysis.utils";
import type { ResumeSummary } from "@/src/features/resume/types";

// Determines what the dashboard's continue card should show.
// Reuses analyses already cached by the sidebar's roadmap shortcut — no extra cost.
export function useContinueState(resumes: ResumeSummary[]): {
  action: ContinueAction | null;
  isLoading: boolean;
} {
  const { analyses, isLoading } = useCareerAnalyses();

  const action = useMemo(
    () => resolveContinueAction(analyses, resumes[0]?.id),
    [analyses, resumes],
  );

  return { action, isLoading };
}
