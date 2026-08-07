import { Skeleton } from "@/components/ui/skeleton";
import {
  scoreTierFromPercent,
  scoreTierFromRatio,
} from "@/src/lib/analysis-score";
import type { Analysis, ParsedJob } from "@/src/features/analysis/types";

interface AnalysisScoreStripProps {
  analysis: Analysis | undefined;
  isLoading: boolean;
}

export function AnalysisScoreStrip({
  analysis,
  isLoading,
}: AnalysisScoreStripProps) {
  if (isLoading) {
    return (
      <div className="analysis-score-strip">
        <Skeleton className="h-6 w-28 rounded-DEFAULT" />
        <Skeleton className="h-6 w-24 rounded-DEFAULT" />
      </div>
    );
  }

  if (!analysis) return null;

  const parsedJob = analysis.parsedJob as ParsedJob | undefined;
  const jobSkillCount = parsedJob?.skills?.length ?? 0;
  const matchedCount = analysis.skillsMatch?.matched.length ?? 0;
  const scores = analysis.analysisResult?.scores;

  if (jobSkillCount === 0 && !scores) return null;

  const ratio = jobSkillCount > 0 ? matchedCount / jobSkillCount : 0;
  const tier = scoreTierFromRatio(ratio);

  return (
    <div className="analysis-score-strip">
      {jobSkillCount > 0 && (
        <div className="analysis-score-strip-item">
          <span className="analysis-score-strip-label">Skills Matched</span>
          <span
            className={`score-badge score-badge--${tier} score-badge--inline`}
          >
            {matchedCount}/{jobSkillCount}
          </span>
        </div>
      )}
      {scores && (
        <>
          <div className="analysis-score-strip-item">
            <span className="analysis-score-strip-label">Overall</span>
            <span
              className={`score-badge score-badge--${scoreTierFromPercent(scores.overall)} score-badge--inline`}
            >
              {scores.overall}
            </span>
          </div>
          <div className="analysis-score-strip-item">
            <span className="analysis-score-strip-label">ATS</span>
            <span
              className={`score-badge score-badge--${scoreTierFromPercent(scores.ats)} score-badge--inline`}
            >
              {scores.ats}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
