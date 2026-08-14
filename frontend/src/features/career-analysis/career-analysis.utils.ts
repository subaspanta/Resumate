import type { CareerAnalysisSummary, RoadmapProgress } from "./types";

export type ScoreBand = "excellent" | "good" | "needs-work";

// Display-only banding for coloring the readiness score. Not a scoring
// decision (that's computeReadiness on the backend) — just which of the
// three score-* CSS tokens a given number reads as.
export function scoreBand(score: number): ScoreBand {
  if (score >= 70) return "excellent";
  if (score >= 40) return "good";
  return "needs-work";
}

// The sidebar's Roadmap shortcut has to pick one destination out of
// however many analyses a user has. list rows already arrive sorted
// createdAt desc (career-analysis.repository.ts), so the first one with a
// roadmap is the most recently generated — no separate sort needed here.
export function latestAnalysisWithRoadmap(
  analyses: CareerAnalysisSummary[],
): CareerAnalysisSummary | undefined {
  return analyses.find((analysis) => analysis.hasRoadmap);
}

// What the dashboard's continue card offers next. Derived from the analysis
// the user most recently started, so the dashboard opens on the thing they
// were actually doing rather than on an upload form they've already used.
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

/**
 * Resolves the single next step for the dashboard's continue card.
 *
 * `analyses` must arrive in the backend's `createdAt desc` order — the first
 * row is the newest. Never re-sort it here (see latestAnalysisWithRoadmap).
 *
 * Returns null when there is nothing in flight to continue; the caller falls
 * back to the plain upload-led dashboard.
 */
export function resolveContinueAction(
  analyses: CareerAnalysisSummary[],
  latestResumeId: string | undefined,
): ContinueAction | null {
  const latest = analyses[0];

  // A resume exists but has never been analysed — the next step is picking a
  // target role for it.
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
  // Every task done: the roadmap has nothing left to offer, so the next
  // meaningful move is re-scoring against the work just finished.
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
