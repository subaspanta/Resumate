import { afterAll, describe, expect, it } from "vitest";
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

async function createResumeWithAnalysis(userId: string) {
  const resume = await prisma.resume.create({
    data: {
      userId,
      title: "Resume",
      originalFileName: "resume.pdf",
      mimeType: "application/pdf",
      fileSize: 1,
      fileUrl: "https://example.com/resume.pdf",
      rawText: "raw text",
      structuredResume: { skills: [] },
    },
  });

  const role = await prisma.role.findFirstOrThrow();

  const analysis = await prisma.careerAnalysis.create({
    data: {
      userId,
      resumeId: resume.id,
      roleId: role.id,
      status: "complete",
      resumeSnapshot: {},
      roleSnapshot: {},
      readinessScore: 50,
    },
  });

  return { resume, analysis };
}

describe("DELETE /auth/me", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("rejects a request with no token", async () => {
    const res = await request(app).delete("/api/v1/auth/me");
    expect(res.status).toBe(401);
  });

  it("deletes the account and cascades every owned row", async () => {
    const { user, token } = await createUser("DeleteMe");
    const { resume, analysis } = await createResumeWithAnalysis(user.id);

    const res = await request(app)
      .delete("/api/v1/auth/me")
      .set("Cookie", [`accessToken=${token}`]);

    expect(res.status).toBe(200);

    // Full-cascade proof: the audit's own P0 concern was that account
    // deletion needed to be verified, not assumed from the schema's
    // onDelete: Cascade annotations.
    const [survivingUser, survivingResume, survivingAnalysis] =
      await Promise.all([
        prisma.user.findUnique({ where: { id: user.id } }),
        prisma.resume.findUnique({ where: { id: resume.id } }),
        prisma.careerAnalysis.findUnique({ where: { id: analysis.id } }),
      ]);

    expect(survivingUser).toBeNull();
    expect(survivingResume).toBeNull();
    expect(survivingAnalysis).toBeNull();
  });

  it("clears the auth cookies on success", async () => {
    const { token } = await createUser("CookieClear");

    const res = await request(app)
      .delete("/api/v1/auth/me")
      .set("Cookie", [`accessToken=${token}`]);

    expect(res.status).toBe(200);
    const setCookie = res.headers["set-cookie"];
    expect(setCookie).toBeDefined();
    const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
    expect(cookies.some((c: string) => c.startsWith("accessToken=;"))).toBe(
      true,
    );
    expect(cookies.some((c: string) => c.startsWith("refreshToken=;"))).toBe(
      true,
    );
  });

  it("returns 404 when deleting an already-deleted account", async () => {
    const { user, token } = await createUser("DoubleDelete");
    await prisma.user.delete({ where: { id: user.id } });

    const res = await request(app)
      .delete("/api/v1/auth/me")
      .set("Cookie", [`accessToken=${token}`]);

    expect(res.status).toBe(404);
  });
});
