// Convert grounded evidence into application-owned gaps and readiness.
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
  // Derived from grounded evidence and hand-authored rationale.
  reasoning: string;
  evidence: GroundedEvidenceItem[];
};

export type MappedAnalysis = {
  gaps: MappedGap[];
  readiness: ReadinessBreakdown;
};

// Iterate role skills so omitted AI assessments remain missing, not absent.
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
