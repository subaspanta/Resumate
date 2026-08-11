export type ScoreBand = "excellent" | "good" | "needs-work";

// Display-only banding for coloring the readiness score. Not a scoring
// decision (that's computeReadiness on the backend) — just which of the
// three score-* CSS tokens a given number reads as.
export function scoreBand(score: number): ScoreBand {
  if (score >= 70) return "excellent";
  if (score >= 40) return "good";
  return "needs-work";
}
