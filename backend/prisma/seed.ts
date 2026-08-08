// Seeds the role skill model from the hand-authored data in seed-data.ts.
//
// Idempotency is a hard requirement, not a nicety: the test suite shares one
// real Postgres database and never truncates it, so this runs repeatedly
// against data that analyses already reference. That rules out
// delete-then-insert — the Restrict foreign keys on Skill and Role would
// reject it, and if they didn't, cascading deletes would destroy user history.
// So everything upserts on its unique key.
import "dotenv/config";
import { pathToFileURL } from "node:url";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/client/index.js";
import { ROLES, SKILLS } from "./seed-data.js";

// Reads DATABASE_URL directly rather than through src/config/env.ts, which
// validates the whole application environment — seeding a database shouldn't
// require a Cloudinary key or a JWT secret to be present.
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL must be set to seed the database");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

export async function seedRoleModel(client: PrismaClient = prisma) {
  // One transaction: a partial seed would leave a role holding half its
  // requirements, which produces plausible-looking but wrong readiness scores
  // rather than an obvious failure.
  await client.$transaction(async (tx) => {
    const skillIdBySlug = new Map<string, string>();

    for (const skill of SKILLS) {
      const row = await tx.skill.upsert({
        where: { slug: skill.slug },
        create: {
          slug: skill.slug,
          name: skill.name,
          aliases: skill.aliases,
          category: skill.category,
        },
        update: {
          name: skill.name,
          aliases: skill.aliases,
          category: skill.category,
        },
        select: { id: true },
      });
      skillIdBySlug.set(skill.slug, row.id);
    }

    for (const role of ROLES) {
      const row = await tx.role.upsert({
        where: { slug: role.slug },
        create: {
          slug: role.slug,
          title: role.title,
          description: role.description,
          seedVersion: role.seedVersion,
        },
        update: {
          title: role.title,
          description: role.description,
          seedVersion: role.seedVersion,
        },
        select: { id: true },
      });

      const keptSkillIds: string[] = [];

      for (const requirement of role.requirements) {
        const skillId = skillIdBySlug.get(requirement.skillSlug);
        // Fail loudly. A typo'd slug would otherwise seed the role with fewer
        // requirements than intended, surfacing much later as a readiness
        // score that is wrong for reasons nobody can trace.
        if (!skillId) {
          throw new Error(
            `Unknown skill slug "${requirement.skillSlug}" in role "${role.slug}"`,
          );
        }
        keptSkillIds.push(skillId);

        await tx.roleSkillRequirement.upsert({
          where: {
            roleId_skillId: { roleId: row.id, skillId },
          },
          create: {
            roleId: row.id,
            skillId,
            importance: requirement.importance,
            rationale: requirement.rationale,
          },
          update: {
            importance: requirement.importance,
            rationale: requirement.rationale,
          },
        });
      }

      // Upserting alone can only add and update. Without this, a skill removed
      // from a role's list in seed-data.ts would survive in the database
      // forever and keep appearing in every new roleSnapshot.
      await tx.roleSkillRequirement.deleteMany({
        where: { roleId: row.id, skillId: { notIn: keptSkillIds } },
      });
    }
  });
}

async function main() {
  await seedRoleModel();

  const [skills, roles, requirements] = await Promise.all([
    prisma.skill.count(),
    prisma.role.count(),
    prisma.roleSkillRequirement.count(),
  ]);

  console.log(
    `Seeded ${roles} roles, ${skills} skills, ${requirements} role requirements.`,
  );
}

// Only run when executed directly — importing this module (e.g. from the test
// setup) must not kick off a seed as a side effect.
const isDirectRun =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  main()
    .catch((error) => {
      console.error("Seed failed:", error);
      process.exitCode = 1;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
