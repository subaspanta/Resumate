import { getScoreTier, scoreTierStyles } from "../features/utils/score";

interface ScoreBadgeProps {
  score: number;
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const tier = getScoreTier(score);
  return (
    <div className="flex flex-col items-end">
      <span className="font-mono-label text-mono-label text-text-muted uppercase tracking-wider mb-xs font-semibold">
        ATS Score
      </span>
      <span
        className={`px-sm py-xs font-mono-label text-mono-label rounded border font-bold ${scoreTierStyles[tier]}`}
      >
        {score}/100
      </span>
    </div>
  );
}