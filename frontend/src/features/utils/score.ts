// Pure function: score → visual tier. Single source of truth for
// score-based styling, used anywhere an ATS score is rendered.
export type ScoreTier = "excellent" | "good" | "needsWork";

export function getScoreTier(score: number): ScoreTier {
  if (score >= 85) return "excellent";
  if (score >= 60) return "good";
  return "needsWork";
}

export const scoreTierStyles: Record<ScoreTier, string> = {
  excellent: "bg-green-50 text-score-excellent border-green-200",
  good: "bg-yellow-50 text-score-good border-yellow-200",
  needsWork: "bg-orange-50 text-score-needs-work border-orange-200",
};
