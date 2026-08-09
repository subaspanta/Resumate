import { describe, expect, it } from "vitest";
import { buildRoleSnapshot } from "../../../src/modules/role/role-snapshot.js";
import { RoleDetail } from "../../../src/modules/role/role.types.js";

function role(): RoleDetail {
  return {
    id: "role-1",
    slug: "backend-engineer",
    title: "Backend Engineer",
    description: "Builds server-side systems",
    seedVersion: "2026-08-08.1",
    requirements: [
      {
        skillId: "skill-1",
        slug: "nodejs",
        name: "Node.js",
        aliases: ["node", "express"],
        category: "runtime",
        importance: "critical",
        rationale: "The dominant JS server runtime",
      },
    ],
  };
}

describe("buildRoleSnapshot", () => {
  it("captures everything the scorer and validator need", () => {
    const snapshot = buildRoleSnapshot(role(), new Date("2026-08-08T12:00:00Z"));

    expect(snapshot).toEqual({
      roleId: "role-1",
      slug: "backend-engineer",
      title: "Backend Engineer",
      description: "Builds server-side systems",
      seedVersion: "2026-08-08.1",
      capturedAt: "2026-08-08T12:00:00.000Z",
      skills: [
        {
          skillId: "skill-1",
          slug: "nodejs",
          name: "Node.js",
          aliases: ["node", "express"],
          importance: "critical",
          rationale: "The dominant JS server runtime",
        },
      ],
    });
  });

  it("records seedVersion so an old score stays diagnosable", () => {
    const snapshot = buildRoleSnapshot(role());
    expect(snapshot.seedVersion).toBe("2026-08-08.1");
  });

  it("does not alias the source role's arrays", () => {
    // The snapshot is frozen history; mutating the live role afterwards must
    // not reach back into an analysis that already ran.
    const source = role();
    const snapshot = buildRoleSnapshot(source);
    source.requirements.push({
      skillId: "skill-2",
      slug: "docker",
      name: "Docker",
      aliases: [],
      category: null,
      importance: "important",
      rationale: "later addition",
    });

    expect(snapshot.skills).toHaveLength(1);
  });
});
