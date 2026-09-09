// Single source of deterministic readiness and gap-prioritization policy.
import {
  EvidenceStrength,
  GapStatus,
  SkillImportance,
} from "../../generated/client/index.js";

// Credit earned by each gap status.
export const STATUS_CREDIT: Record<GapStatus, number> = {
  strong: 1.0,
  developing: 0.5,
  weak_evidence: 0.25,
  missing: 0,
};

// Importance weights reflect role requirements.
export const IMPORTANCE_WEIGHT: Record<SkillImportance, number> = {
  critical: 3,
  important: 2,
  nice_to_have: 1,
};

// Maps observed evidence strength to application-owned gap status.
export const STATUS_BY_EVIDENCE: Record<EvidenceStrength, GapStatus> = {
  experience_backed: "strong",
  project_backed: "developing",
  mentioned: "weak_evidence",
};

// Ranks for priority ordering. Lower = more urgent.
const STATUS_RANK: Record<GapStatus, number> = {
  missing: 0,
  weak_evidence: 1,
  developing: 2,
  strong: 3,
};

const IMPORTANCE_RANK: Record<SkillImportance, number> = {
  critical: 0,
  important: 1,
  nice_to_have: 2,
};

// Shared ordering keeps scoring and gap explanations on the same evidence.
export const EVIDENCE_RANK: Record<EvidenceStrength, number> = {
  experience_backed: 3,
  project_backed: 2,
  mentioned: 1,
};

// Return the strongest evidence item, or undefined when none exists.
export function strongestEvidence<T extends { strength: EvidenceStrength }>(
  evidence: T[],
): T | undefined {
  if (evidence.length === 0) return undefined;
  return evidence.reduce((best, current) =>
    EVIDENCE_RANK[current.strength] > EVIDENCE_RANK[best.strength]
      ? current
      : best,
  );
}

export type ScoredSkill = {
  skillId: string;
  slug: string;
  importance: SkillImportance;
  status: GapStatus;
  credit: number;
  weight: number;
  weighted: number;
};

export type ReadinessBreakdown = {
  score: number;
  earnedPoints: number;
  possiblePoints: number;
  countsByStatus: Record<GapStatus, number>;
  skills: ScoredSkill[];
};

export type ScorableSkill = {
  skillId: string;
  slug: string;
  importance: SkillImportance;
  status: GapStatus;
};

// Grounded evidence alone can promote a skill; no evidence means missing.
export function deriveGapStatus(
  groundedEvidence: { strength: EvidenceStrength }[],
): GapStatus {
  const best = strongestEvidence(groundedEvidence);
  if (!best) return "missing";
  return STATUS_BY_EVIDENCE[best.strength];
}

// Status determines urgency; importance breaks ties.
export function computeGapPriority(
  status: GapStatus,
  importance: SkillImportance,
): number {
  return STATUS_RANK[status] * 10 + IMPORTANCE_RANK[importance];
}

// Compute weighted readiness and retain its full breakdown.
export function computeReadiness(skills: ScorableSkill[]): ReadinessBreakdown {
  const scored: ScoredSkill[] = skills.map((skill) => {
    const credit = STATUS_CREDIT[skill.status];
    const weight = IMPORTANCE_WEIGHT[skill.importance];
    return { ...skill, credit, weight, weighted: credit * weight };
  });

  const earnedPoints = scored.reduce((sum, s) => sum + s.weighted, 0);
  const possiblePoints = scored.reduce((sum, s) => sum + s.weight, 0);

  const countsByStatus: Record<GapStatus, number> = {
    strong: 0,
    developing: 0,
    weak_evidence: 0,
    missing: 0,
  };
  for (const skill of scored) countsByStatus[skill.status]++;

  // A role with no requirements is a seed bug, not a perfect candidate —
  // score 0 rather than dividing by zero or implying readiness.
  const score =
    possiblePoints === 0
      ? 0
      : Math.round((earnedPoints / possiblePoints) * 100);

  return {
    score,
    earnedPoints,
    possiblePoints,
    countsByStatus,
    skills: scored,
  };
}
