import { PrismaClient } from "../../generated/client/index.js";
import { RoleDetail, RoleSummary } from "./role.types.js";

// Roles are global seed data; ownership checks belong to referencing modules.
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
        // Stable order keeps snapshot and prompt indices deterministic.
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
