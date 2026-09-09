import type { GapStatus, SkillGap } from "@/src/features/career-analysis/types";

// Matches backend STATUS_RANK: missing is worst, strong is best.
const STATUS_RANK: Record<GapStatus, number> = {
  missing: 0,
  weak_evidence: 1,
  developing: 2,
  strong: 3,
};

export interface GapMovement {
  skillSlug: string;
  skillName: string;
  before: GapStatus;
  after: GapStatus;
  direction: "improved" | "regressed";
}

// Returns changed statuses for display; backend remains authoritative.
export function diffGapStatuses(
  before: SkillGap[],
  after: SkillGap[],
): GapMovement[] {
  const beforeBySlug = new Map(before.map((gap) => [gap.skill.slug, gap]));
  const movements: GapMovement[] = [];

  for (const gap of after) {
    const prior = beforeBySlug.get(gap.skill.slug);
    if (!prior || prior.status === gap.status) continue;

    movements.push({
      skillSlug: gap.skill.slug,
      skillName: gap.skill.name,
      before: prior.status,
      after: gap.status,
      direction:
        STATUS_RANK[gap.status] > STATUS_RANK[prior.status]
          ? "improved"
          : "regressed",
    });
  }

  return movements;
}
