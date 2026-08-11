import { prisma } from "../../lib/prisma.js";
import { RoleDetail, RoleSummary } from "./role.types.js";

// Roles are global seed data with no owner, so nothing here is user-scoped —
// unlike every other repository in the codebase. Ownership checks live in the
// modules that reference a role, not in this one.
export class RoleRepository {
  async findAll(): Promise<RoleSummary[]> {
    return prisma.role.findMany({
      select: { id: true, slug: true, title: true, description: true },
      orderBy: { title: "asc" },
    });
  }

  async findBySlug(slug: string): Promise<RoleDetail | null> {
    const role = await prisma.role.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        seedVersion: true,
        requirements: {
          select: {
            importance: true,
            rationale: true,
            skill: {
              select: {
                id: true,
                slug: true,
                name: true,
                aliases: true,
                category: true,
              },
            },
          },
        },
      },
    });

    if (!role) return null;

    return {
      id: role.id,
      slug: role.slug,
      title: role.title,
      description: role.description,
      seedVersion: role.seedVersion,
      requirements: role.requirements.map((requirement) => ({
        skillId: requirement.skill.id,
        slug: requirement.skill.slug,
        name: requirement.skill.name,
        aliases: requirement.skill.aliases,
        category: requirement.skill.category,
        importance: requirement.importance,
        rationale: requirement.rationale,
      })),
    };
  }
}
