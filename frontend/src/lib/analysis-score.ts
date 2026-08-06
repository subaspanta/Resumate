// Presentation logic shared by the analysis score strip and the score
// breakdown panel. Lives outside both so a threshold change can't be applied
// to one component and missed in the other.

export type ScoreTier = "excellent" | "good" | "needs-work" | "poor";

/** Maps a 0–1 ratio to a badge tier. */
export function scoreTierFromRatio(ratio: number): ScoreTier {
  if (ratio >= 0.8) return "excellent";
  if (ratio >= 0.5) return "good";
  if (ratio >= 0.25) return "needs-work";
  return "poor";
}

/** Maps a 0–100 score to a badge tier. */
export function scoreTierFromPercent(value: number): ScoreTier {
  return scoreTierFromRatio(value / 100);
}

/**
 * SkillsMatch.missing is lowercased by the backend's matching pass, so
 * rendering it directly shows "typescript" where the posting said
 * "TypeScript". Match each lowercase entry back to the job's own skill list
 * to recover the original casing.
 */
export function resolveMissingSkillCasing(
  jobSkills: string[] | undefined,
  missing: string[] | undefined,
): string[] {
  const missingLower = new Set(missing ?? []);
  return (jobSkills ?? []).filter((skill) =>
    missingLower.has(skill.trim().toLowerCase()),
  );
}
