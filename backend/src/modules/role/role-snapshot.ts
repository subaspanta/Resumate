// Freezes a role's requirements at the moment an analysis runs.
//
// RoleSkillRequirement rows are mutable seed data. Without a snapshot, the
// next `npm run db:seed` after re-tuning importance would silently change what
// every historical readinessScore meant — the stored number and a freshly
// recomputed one would disagree, with no way to tell whether the candidate
// improved or the seed changed.
//
// Pure function: no Prisma, no IO.
import { RoleSnapshot } from "../career-analysis/career-analysis.types.js";
import { RoleDetail } from "./role.types.js";

export function buildRoleSnapshot(
  role: RoleDetail,
  capturedAt: Date = new Date(),
): RoleSnapshot {
  return {
    roleId: role.id,
    slug: role.slug,
    title: role.title,
    description: role.description,
    seedVersion: role.seedVersion,
    capturedAt: capturedAt.toISOString(),
    // Exactly the fields the scorer and the grounding validator consume, so a
    // snapshot is self-sufficient: re-validating an old analysis must never
    // resolve its vocabulary against today's requirement rows.
    skills: role.requirements.map((requirement) => ({
      skillId: requirement.skillId,
      slug: requirement.slug,
      name: requirement.name,
      aliases: requirement.aliases,
      importance: requirement.importance,
      rationale: requirement.rationale,
    })),
  };
}
