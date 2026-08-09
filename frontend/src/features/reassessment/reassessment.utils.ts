import type { GapStatus, SkillGap } from "@/src/features/career-analysis/types";

// Same rank order as backend/src/modules/career-analysis/readiness.ts
// (STATUS_RANK) — missing is worst, strong is best.
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

// Diffs two gap lists by skill slug, returning only skills whose status
// actually changed. Display-only — the backend's readiness.ts already
// decided both statuses; this just compares them.
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
