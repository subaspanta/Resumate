import type { CareerAnalysisSummary, RoadmapProgress } from "./types";

export type ScoreBand = "excellent" | "good" | "needs-work";

// Display-only score banding; scoring remains backend-owned.
export function scoreBand(score: number): ScoreBand {
  if (score >= 70) return "excellent";
  if (score >= 40) return "good";
  return "needs-work";
}

// Rows are newest-first, so the first analysis with a roadmap is the sidebar destination.
export function latestAnalysisWithRoadmap(
  analyses: CareerAnalysisSummary[],
): CareerAnalysisSummary | undefined {
  return analyses.find((analysis) => analysis.hasRoadmap);
}

// Derives the dashboard action from the user's most recent analysis.
export type ContinueIntent =
  | "choose-role"
  | "watch-analysis"
  | "retry-analysis"
  | "generate-roadmap"
  | "resume-roadmap"
  | "reassess";

export interface ContinueAction {
  intent: ContinueIntent;
  href: string;
  actionLabel: string;
  /** Role title, or null before an analysis exists to name one. */
  roleTitle: string | null;
  readinessScore: number | null;
  progress: RoadmapProgress | null;
}

/** Resolves the next dashboard step from newest-first analyses, or null. */
export function resolveContinueAction(
  analyses: CareerAnalysisSummary[],
  latestResumeId: string | undefined,
): ContinueAction | null {
  const latest = analyses[0];

  // An unanalysed resume needs a target role.
  if (!latest) {
    if (!latestResumeId) return null;
    return {
      intent: "choose-role",
      href: `/analyze/${latestResumeId}`,
      actionLabel: "Choose a target role",
      roleTitle: null,
      readinessScore: null,
      progress: null,
    };
  }

  const roleTitle = latest.role?.title ?? null;
  const base = {
    roleTitle,
    readinessScore: latest.readinessScore,
    progress: latest.roadmapProgress,
  };

  if (latest.status === "analyzing" || latest.status === "pending") {
    return {
      ...base,
      intent: "watch-analysis",
      href: `/analyses/${latest.id}`,
      actionLabel: "View progress",
    };
  }

  if (latest.status === "failed") {
    return {
      ...base,
      intent: "retry-analysis",
      href: `/analyze/${latest.resumeId}`,
      actionLabel: "Try again",
    };
  }

  if (!latest.hasRoadmap) {
    return {
      ...base,
      intent: "generate-roadmap",
      href: `/analyses/${latest.id}`,
      actionLabel: "Generate roadmap",
    };
  }

  const progress = latest.roadmapProgress;
  // Completed roadmap: next step is reassessment.
  if (progress && progress.total > 0 && progress.completed >= progress.total) {
    return {
      ...base,
      intent: "reassess",
      href: `/analyses/${latest.id}`,
      actionLabel: "Reassess my readiness",
    };
  }

  return {
    ...base,
    intent: "resume-roadmap",
    href: `/analyses/${latest.id}/roadmap`,
    actionLabel: "Resume roadmap",
  };
}
