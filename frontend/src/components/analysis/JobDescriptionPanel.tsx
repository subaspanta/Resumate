import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { resolveMissingSkillCasing } from "@/src/lib/analysis-score";
import type { ParsedJob, SkillsMatch } from "@/src/features/analysis/types";

// The backend stores experienceLevel as a bare enum token; these are its
// display labels.
const EXPERIENCE_LEVEL_LABELS: Record<ParsedJob["experienceLevel"], string> = {
  entry: "Entry level",
  mid: "Mid level",
  senior: "Senior level",
};

interface JobDescriptionPanelProps {
  parsedJob: ParsedJob | undefined;
  skillsMatch: SkillsMatch | undefined;
  isLoading: boolean;
}

export function JobDescriptionPanel({
  parsedJob,
  skillsMatch,
  isLoading,
}: JobDescriptionPanelProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col gap-4">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (!parsedJob) {
    return (
      <Card>
        <CardContent>
          <p className="analysis-jd-empty">
            Job description details are not available for this analysis.
          </p>
        </CardContent>
      </Card>
    );
  }

  const requirements = parsedJob.requirements ?? [];
  const skills = parsedJob.skills ?? [];
  const matchedSet = new Set(
    (skillsMatch?.matched ?? []).map((s) => s.trim().toLowerCase()),
  );
  const missing = resolveMissingSkillCasing(skills, skillsMatch?.missing);
  // parsedJob comes off a JSON column, so an older row could carry a token
  // outside the current enum — fall back to hiding the chip rather than
  // rendering "undefined".
  const experienceLabel = EXPERIENCE_LEVEL_LABELS[parsedJob.experienceLevel];

  return (
    <Card>
      <CardContent className="flex flex-col gap-lg">
        <div className="analysis-jd-meta">
          {experienceLabel && (
            <span className="analysis-score-strip-label">
              {experienceLabel}
            </span>
          )}
        </div>

        <div className="analysis-jd-section">
          <h3 className="analysis-jd-section-title">Requirements</h3>
          {requirements.length > 0 ? (
            <ul className="analysis-jd-list">
              {requirements.map((req, i) => (
                <li key={i} className="analysis-jd-list-item">
                  {req}
                </li>
              ))}
            </ul>
          ) : (
            <p className="analysis-jd-empty">
              No specific requirements were listed in this job description.
            </p>
          )}
        </div>

        <div className="analysis-jd-section">
          <h3 className="analysis-jd-section-title">Skills</h3>
          {skills.length > 0 ? (
            <div className="analysis-jd-chips">
              {skills.map((skill, i) => {
                const isMatched = matchedSet.has(skill.trim().toLowerCase());
                return (
                  <span
                    key={i}
                    className={`analysis-jd-chip${isMatched ? " analysis-jd-chip--matched" : ""}`}
                  >
                    {skill}
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="analysis-jd-empty">
              No specific skills were listed in this job description.
            </p>
          )}
        </div>

        {missing.length > 0 && (
          <div className="analysis-jd-section">
            <h3 className="analysis-jd-section-title">
              Missing from this job&apos;s requirements
            </h3>
            <div className="analysis-jd-chips">
              {missing.map((skill, i) => (
                <span key={i} className="analysis-jd-chip">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
