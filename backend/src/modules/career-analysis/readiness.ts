// The single home for readiness and gap-prioritization policy.
//
// Every number that decides how good a candidate looks lives in this file and
// nowhere else. That is deliberate: these are product judgements, and if they
// are spread across services they drift, and a change to "how we score" turns
// into an archaeology exercise. Changing the formula should mean editing the
// constants below and their tests — nothing else.
//
// Pure module: no Prisma, no Express, no AI. Everything here is a total
// function of its arguments, which is what makes the deterministic half of
// the pipeline testable without a database.
import {
  EvidenceStrength,
  GapStatus,
  SkillImportance,
} from "../../generated/client/index.js";

// How much credit each gap status earns toward readiness.
export const STATUS_CREDIT: Record<GapStatus, number> = {
  strong: 1.0,
  developing: 0.5,
  weak_evidence: 0.25,
  missing: 0,
};

// How much a skill counts, by how much the role needs it. A missing
// nice-to-have should barely move the score; a missing critical skill should
// dominate it.
export const IMPORTANCE_WEIGHT: Record<SkillImportance, number> = {
  critical: 3,
  important: 2,
  nice_to_have: 1,
};

// Evidence strength (what the AI observed in the resume) -> gap status (what
// we judge about the candidate). A pure lookup, and the only bridge between
// the two enums.
//
// project_backed maps to `developing` rather than `strong` deliberately: the
// target user is a final-year student whose evidence is mostly coursework and
// side projects. Scoring that as zero would make the product useless to them;
// scoring it equal to shipped production work would overstate them to
// employers. `developing` is the honest middle.
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

// Strongest evidence wins when a skill has several supporting quotes — one
// production deployment outweighs three passing mentions.
const EVIDENCE_RANK: Record<EvidenceStrength, number> = {
  experience_backed: 3,
  project_backed: 2,
  mentioned: 1,
};

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

// Maps the surviving evidence for one skill to a gap status.
//
// Takes only evidence that survived grounding validation, which is what makes
// the whole pipeline fail safe: if the AI claimed a skill but every quote it
// offered was fabricated, the quotes are dropped upstream and this returns
// `missing`. "The AI said so" is never sufficient on its own.
export function deriveGapStatus(
  groundedEvidence: { strength: EvidenceStrength }[],
): GapStatus {
  if (groundedEvidence.length === 0) return "missing";

  const best = groundedEvidence.reduce((strongest, current) =>
    EVIDENCE_RANK[current.strength] > EVIDENCE_RANK[strongest.strength]
      ? current
      : strongest,
  );

  return STATUS_BY_EVIDENCE[best.strength];
}

// Deterministic urgency rank; lower sorts first.
//
// Status dominates and importance breaks ties within a status band, so any
// missing skill outranks any developing one. The x10 spacing keeps the two
// dimensions from ever colliding: statuses land on 0/10/20/30 and importance
// only ever shifts a result by 0-2 within its band.
export function computeGapPriority(
  status: GapStatus,
  importance: SkillImportance,
): number {
  return STATUS_RANK[status] * 10 + IMPORTANCE_RANK[importance];
}

// Weighted readiness over every skill the role requires.
//
// Returns the breakdown alongside the number by construction — there is no
// score-only variant, because a bare percentage the user can't interrogate is
// exactly what the PRD says not to ship.
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

  return { score, earnedPoints, possiblePoints, countsByStatus, skills: scored };
}
