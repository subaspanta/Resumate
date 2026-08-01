"use client";

import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  reviewedCount: number;
  totalCount: number;
}

export function ProgressBar({ reviewedCount, totalCount }: ProgressBarProps) {
  const pct = totalCount === 0 ? 0 : (reviewedCount / totalCount) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">
          {reviewedCount} of {totalCount} suggestions reviewed
        </span>
        <span className="text-muted-foreground">{Math.round(pct)}%</span>
      </div>
      <Progress value={pct} />
    </div>
  );
}
