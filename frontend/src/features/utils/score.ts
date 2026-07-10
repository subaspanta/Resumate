export type ScoreTier = "excellent" | "good" | "needsWork" | "poor";

export function getScoreTier(score: number): ScoreTier {
  if (score >= 90) return "excellent";
  if (score >= 70) return "good";
  if (score >= 40) return "needsWork";
  return "poor";
}

export const scoreTierClass: Record<ScoreTier, string> = {
  excellent: "dashboard-score-badge--excellent",
  good: "dashboard-score-badge--good",
  needsWork: "dashboard-score-badge--needs-work",
  poor: "dashboard-score-badge--poor",
};
