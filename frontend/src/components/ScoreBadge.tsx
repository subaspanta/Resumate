import { getScoreTier, scoreTierClass } from "../features/utils/score";

interface ScoreBadgeProps {
  score: number;
  variant?: "stacked" | "inline";
  showLabel?: boolean;
}

export function ScoreBadge({
  score,
  variant = "stacked",
  showLabel = true,
}: ScoreBadgeProps) {
  const tier = getScoreTier(score);
  const badgeClass = `dashboard-score-badge ${scoreTierClass[tier]} ${
    variant === "inline" ? "dashboard-score-badge--inline" : ""
  }`;

  if (variant === "inline") {
    return <span className={badgeClass}>{score}</span>;
  }

  return (
    <div className="dashboard-score">
      {showLabel && <span className="dashboard-score-label">ATS Score</span>}
      <span className={badgeClass}>{score}/100</span>
    </div>
  );
}
