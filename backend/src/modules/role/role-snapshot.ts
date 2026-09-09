// Freeze mutable role requirements so historical scores remain explainable.
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
    // Keep every field needed by scoring and grounding self-contained.
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
