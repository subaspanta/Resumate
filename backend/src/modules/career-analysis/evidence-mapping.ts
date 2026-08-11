// Turns grounded AI evidence into the gap rows the application owns.
//
// This is the application side of the seam: everything upstream is untrusted
// model output, everything from here down is our own judgement. The AI never
// sees a GapStatus, a priority, or a score — those are all computed here from
// evidence that survived grounding, plus the role's own seeded importance.
//
// Pure module: no Prisma, no Express, no AI.
import {
  computeGapPriority,
  computeReadiness,
  deriveGapStatus,
  ReadinessBreakdown,
} from "./readiness.js";
import { GapStatus } from "../../generated/client/index.js";
import {
  GroundedEvidenceItem,
  GroundedSkillAssessment,
  RoleSnapshot,
  RoleSnapshotSkill,
} from "./career-analysis.types.js";
import { buildGapReasoning } from "./gap-reasoning.js";

export type MappedGap = {
  skillId: string;
  slug: string;
  name: string;
  status: GapStatus;
  priority: number;
  // Assembled by the application from the derived status, the grounded
  // evidence, and the hand-authored requirement rationale — never model prose.
  reasoning: string;
  evidence: GroundedEvidenceItem[];
};

export type MappedAnalysis = {
  gaps: MappedGap[];
  readiness: ReadinessBreakdown;
};

// Maps every skill the ROLE requires — not every skill the AI returned.
//
// Driving the loop from the role snapshot is what guarantees a skill the model
// silently dropped still gets a row (as `missing`) instead of disappearing.
// A vanished skill would shrink the readiness denominator and quietly inflate
// the score, which is the exact opposite of the failure direction we want.
export function mapAssessmentsToGaps(
  assessments: GroundedSkillAssessment[],
  roleSnapshot: RoleSnapshot,
): MappedAnalysis {
  const bySlug = new Map(assessments.map((a) => [a.skillSlug, a]));

  const gaps: MappedGap[] = roleSnapshot.skills.map(
    (skill: RoleSnapshotSkill) => {
      const assessment = bySlug.get(skill.slug);
      const evidence = assessment?.evidence ?? [];
      const status = deriveGapStatus(evidence);

      return {
        skillId: skill.skillId,
        slug: skill.slug,
        name: skill.name,
        status,
        priority: computeGapPriority(status, skill.importance),
        reasoning: buildGapReasoning({
          skillName: skill.name,
          status,
          importance: skill.importance,
          roleTitle: roleSnapshot.title,
          rationale: skill.rationale,
          evidence,
        }),
        evidence,
      };
    },
  );

  // gaps is built from roleSnapshot.skills in order, so the two arrays are
  // index-aligned — no lookup needed to pair a skill with its status.
  const readiness = computeReadiness(
    roleSnapshot.skills.map((skill, i) => ({
      skillId: skill.skillId,
      slug: skill.slug,
      importance: skill.importance,
      status: gaps[i].status,
    })),
  );

  return { gaps, readiness };
}
