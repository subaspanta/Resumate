import { SkillGroup } from "../parsing/parsing.types.js";

// Pure set overlap, no AI call — per BR-14, skills matching is computed on
// read from resume.skills and analysis.parsedJob, not a rewrite suggestion.
// Matches only against jobSkills (a token list), not jobRequirements (free
// text sentences) — the two aren't directly comparable.
export interface SkillsMatch {
  matched: string[];
  missing: string[];
}

// Resume skills are grouped by category for display; matching only cares
// about the individual skill names, so flatten across every group.
export function flattenSkills(groups: SkillGroup[]): string[] {
  return groups.flatMap((group) => group.items);
}

export function matchSkills(
  resumeSkills: string[],
  jobSkills: string[],
): SkillsMatch {
  const normalize = (s: string) => s.trim().toLowerCase();
  const resumeSet = new Set(resumeSkills.map(normalize));
  const jobTermsSeen = new Set<string>();
  const jobTerms: string[] = [];
  for (const skill of jobSkills) {
    const key = normalize(skill);
    if (!jobTermsSeen.has(key)) {
      jobTermsSeen.add(key);
      jobTerms.push(key);
    }
  }

  const matched = resumeSkills.filter((skill) =>
    jobTermsSeen.has(normalize(skill)),
  );
  const missing = jobTerms.filter((term) => !resumeSet.has(term));

  return { matched, missing };
}
