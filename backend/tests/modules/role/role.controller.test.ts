import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../../src/app.js";
import { prisma } from "../../../src/lib/prisma.js";
import { generateAccessToken } from "../../../src/utils/tokens.js";

async function createUser(name: string) {
  const user = await prisma.user.create({
    data: {
      name,
      email: `${name.toLowerCase()}-${crypto.randomUUID()}@example.com`,
      passwordHash: "irrelevant-for-this-test",
    },
  });
  const token = generateAccessToken({ sub: user.id, email: user.email });
  return { user, token };
}

describe("GET /roles", () => {
  let user: Awaited<ReturnType<typeof createUser>>;

  beforeAll(async () => {
    user = await createUser("RoleReader");
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("rejects a request with no token", async () => {
    const res = await request(app).get("/api/v1/roles");
    expect(res.status).toBe(401);
  });

  it("rejects an invalid token", async () => {
    const res = await request(app)
      .get("/api/v1/roles")
      .set("Cookie", ["accessToken=not-a-real-token"]);
    expect(res.status).toBe(401);
  });

  it("returns the seeded roles", async () => {
    const res = await request(app)
      .get("/api/v1/roles")
      .set("Cookie", [`accessToken=${user.token}`]);

    expect(res.status).toBe(200);
    const slugs = res.body.data.map((r: { slug: string }) => r.slug);
    expect(slugs).toContain("frontend-engineer");
    expect(slugs).toContain("backend-engineer");
    expect(slugs).toContain("full-stack-engineer");
  });
});

describe("GET /roles/:slug", () => {
  let user: Awaited<ReturnType<typeof createUser>>;

  beforeAll(async () => {
    user = await createUser("RoleDetailReader");
  });

  it("rejects a request with no token", async () => {
    const res = await request(app).get("/api/v1/roles/frontend-engineer");
    expect(res.status).toBe(401);
  });

  it("returns 404 for an unknown slug", async () => {
    const res = await request(app)
      .get("/api/v1/roles/underwater-basket-weaver")
      .set("Cookie", [`accessToken=${user.token}`]);

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("RESOURCE_NOT_FOUND");
  });

  it("returns the role with its skill requirements", async () => {
    const res = await request(app)
      .get("/api/v1/roles/backend-engineer")
      .set("Cookie", [`accessToken=${user.token}`]);

    expect(res.status).toBe(200);
    expect(res.body.data.slug).toBe("backend-engineer");
    expect(res.body.data.requirements.length).toBeGreaterThan(0);

    const requirement = res.body.data.requirements[0];
    expect(requirement).toHaveProperty("slug");
    expect(requirement).toHaveProperty("importance");
    // Rationale is hand-authored and shown to the user as the reason a skill
    // matters — an empty one means the seed data lost its justification.
    expect(requirement.rationale.length).toBeGreaterThan(0);
  });

  it("carries the alias list the evidence agent needs", async () => {
    const res = await request(app)
      .get("/api/v1/roles/frontend-engineer")
      .set("Cookie", [`accessToken=${user.token}`]);

    const react = res.body.data.requirements.find(
      (r: { slug: string }) => r.slug === "react",
    );
    expect(react.aliases).toContain("nextjs");
  });
});
