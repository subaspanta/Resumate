import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  resolveMissingSkillCasing,
  scoreTierFromPercent,
} from "@/src/lib/analysis-score";
import type {
  AnalysisScore,
  ParsedJob,
  SkillsMatch,
} from "@/src/features/analysis/types";

interface ScoreBreakdownPanelProps {
  scores: AnalysisScore | undefined;
  skillsMatch: SkillsMatch | undefined;
  jobSkills: ParsedJob["skills"] | undefined;
  isLoading: boolean;
}

export function ScoreBreakdownPanel({
  scores,
  skillsMatch,
  jobSkills,
  isLoading,
}: ScoreBreakdownPanelProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col gap-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (scores) {
    const rows: Array<[string, number]> = [
      ["Overall", scores.overall],
      ["ATS", scores.ats],
      ...Object.entries(scores.sections ?? {}),
    ];

    return (
      <Card>
        <CardContent className="flex flex-col">
          {rows.map(([label, value]) => (
            <div key={label} className="analysis-score-row">
              <span className="analysis-score-row-label">{label}</span>
              <span
                className={`score-badge score-badge--${scoreTierFromPercent(value)} score-badge--inline`}
              >
                {value}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const matched = skillsMatch?.matched ?? [];
  const missing = resolveMissingSkillCasing(jobSkills, skillsMatch?.missing);

  return (
    <Card>
      <CardContent className="analysis-score-empty">
        <p className="analysis-score-empty-message">
          A detailed score breakdown isn&apos;t available for this analysis
          yet.
        </p>

        {(matched.length > 0 || missing.length > 0) && (
          <>
            <div className="analysis-jd-section">
              <h3 className="analysis-jd-section-title">
                Skills matched ({matched.length})
              </h3>
              {matched.length > 0 ? (
                <div className="analysis-jd-chips">
                  {matched.map((skill, i) => (
                    <span
                      key={i}
                      className="analysis-jd-chip analysis-jd-chip--matched"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="analysis-jd-empty">No skills matched yet.</p>
              )}
            </div>

            <div className="analysis-jd-section">
              <h3 className="analysis-jd-section-title">
                Missing from this job&apos;s requirements ({missing.length})
              </h3>
              {missing.length > 0 ? (
                <div className="analysis-jd-chips">
                  {missing.map((skill, i) => (
                    <span key={i} className="analysis-jd-chip">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="analysis-jd-empty">
                  No missing skills — nice work.
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
