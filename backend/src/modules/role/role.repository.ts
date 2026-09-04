import { PrismaClient } from "../../generated/client/index.js";
import { RoleDetail, RoleSummary } from "./role.types.js";

// Roles are global seed data with no owner, so nothing here is user-scoped —
// unlike every other repository in the codebase. Ownership checks live in the
// modules that reference a role, not in this one.
export class RoleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<RoleSummary[]> {
    return this.prisma.role.findMany({
      select: { id: true, slug: true, title: true, description: true },
      orderBy: { title: "asc" },
    });
  }

  async findBySlug(slug: string): Promise<RoleDetail | null> {
    const role = await this.prisma.role.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        seedVersion: true,
        // Ordered by skill slug: this list becomes roleSnapshot.skills, whose
        // order is what the evidence agent's prompt numbers requirements by.
        // Without an explicit order, Postgres may return a different order
        // across two analyses of the same role, changing the snapshot's [n]
        // numbering for no reason.
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
          orderBy: { skill: { slug: "asc" } },
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
