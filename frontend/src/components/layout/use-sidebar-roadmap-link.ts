"use client";

import { useCareerAnalyses } from "@/src/features/career-analysis/career-analysis.hooks";
import { latestAnalysisWithRoadmap } from "@/src/features/career-analysis/career-analysis.utils";

/**
 * Every other sidebar nav item is prop-driven — its enabled/disabled state
 * and href come from dashboardViewConfig or the page that renders AppShell.
 * The Roadmap item is the one exception: it needs live query data (which
 * analyses exist right now) rather than a static per-view config, so that
 * data dependency is isolated here instead of living inline in Sidebar's
 * body. Sidebar stays a consumer of one small, named hook rather than the
 * place a `useCareerAnalyses()` call was written directly.
 */
export function useSidebarRoadmapLink() {
  const { analyses } = useCareerAnalyses();
  const roadmapAnalysis = latestAnalysisWithRoadmap(analyses);

  return {
    href: roadmapAnalysis
      ? `/analyses/${roadmapAnalysis.id}/roadmap`
      : undefined,
    disabled: !roadmapAnalysis,
  };
}
