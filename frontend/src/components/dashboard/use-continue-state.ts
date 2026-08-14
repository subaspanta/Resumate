"use client";

import { useMemo } from "react";
import { useCareerAnalyses } from "@/src/features/career-analysis/career-analysis.hooks";
import { resolveContinueAction } from "@/src/features/career-analysis/career-analysis.utils";
import type { ContinueAction } from "@/src/features/career-analysis/career-analysis.utils";
import type { ResumeSummary } from "@/src/features/resume/types";

/**
 * Resolves what the dashboard's continue card should offer.
 *
 * Deliberately one query: role title and roadmap progress ride along on the
 * analyses list row, so this costs nothing extra — the sidebar's roadmap
 * shortcut has already put that list in the cache by the time this runs.
 */
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
