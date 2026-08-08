import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../app.js";
import { prisma } from "../../lib/prisma.js";
import { generateAccessToken } from "../../utils/tokens.js";

// These exercise the HTTP boundary only — auth, validation, and ownership.
// Every case here is rejected before the route would reach Gemini, so the
// container's real agent is never invoked. The pipeline itself is covered in
// career-analysis.service.test.ts with a fake agent.

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

async function createResume(userId: string) {
  return prisma.resume.create({
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
}

// Persisted directly rather than via the service: these tests are about the
// HTTP layer, and going through createAnalysis would require an AI call.
async function createAnalysisRow(userId: string, resumeId: string) {
  const role = await prisma.role.findUniqueOrThrow({
    where: { slug: "backend-engineer" },
  });
  return prisma.careerAnalysis.create({
    data: {
      userId,
      resumeId,
      roleId: role.id,
      status: "complete",
      resumeSnapshot: {},
      roleSnapshot: { slug: "backend-engineer", skills: [] },
      readinessScore: 42,
      readinessBreakdown: { score: 42 },
    },
  });
}

describe("POST /career-analyses", () => {
  let owner: Awaited<ReturnType<typeof createUser>>;
  let resumeId: string;

  beforeAll(async () => {
    owner = await createUser("AnalysisPoster");
    resumeId = (await createResume(owner.user.id)).id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("rejects an unauthenticated request", async () => {
    const res = await request(app)
      .post("/api/v1/career-analyses")
      .send({ resumeId, roleSlug: "backend-engineer" });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("rejects an invalid token", async () => {
    const res = await request(app)
      .post("/api/v1/career-analyses")
      .set("Cookie", ["accessToken=not-a-real-token"])
      .send({ resumeId, roleSlug: "backend-engineer" });

    expect(res.status).toBe(401);
  });

  it("rejects a body with no roleSlug", async () => {
    const res = await request(app)
      .post("/api/v1/career-analyses")
      .set("Cookie", [`accessToken=${owner.token}`])
      .send({ resumeId });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_FAILED");
  });

  it("rejects a resumeId that is not a uuid", async () => {
    const res = await request(app)
      .post("/api/v1/career-analyses")
      .set("Cookie", [`accessToken=${owner.token}`])
      .send({ resumeId: "not-a-uuid", roleSlug: "backend-engineer" });

    expect(res.status).toBe(400);
  });

  it("returns 404 for a resume the caller does not own", async () => {
    const intruder = await createUser("AnalysisIntruder");
    const res = await request(app)
      .post("/api/v1/career-analyses")
      .set("Cookie", [`accessToken=${intruder.token}`])
      .send({ resumeId, roleSlug: "backend-engineer" });

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("RESOURCE_NOT_FOUND");
  });

  it("returns 404 for an unknown role", async () => {
    const res = await request(app)
      .post("/api/v1/career-analyses")
      .set("Cookie", [`accessToken=${owner.token}`])
      .send({ resumeId, roleSlug: "underwater-basket-weaver" });

    expect(res.status).toBe(404);
  });
});

describe("GET /career-analyses/:id", () => {
  let owner: Awaited<ReturnType<typeof createUser>>;
  let intruder: Awaited<ReturnType<typeof createUser>>;
  let analysisId: string;

  beforeAll(async () => {
    owner = await createUser("AnalysisReader");
    intruder = await createUser("AnalysisSnooper");
    const resume = await createResume(owner.user.id);
    analysisId = (await createAnalysisRow(owner.user.id, resume.id)).id;
  });

  it("rejects an unauthenticated request", async () => {
    const res = await request(app).get(
      `/api/v1/career-analyses/${analysisId}`,
    );
    expect(res.status).toBe(401);
  });

  it("returns 403 for another user's analysis", async () => {
    const res = await request(app)
      .get(`/api/v1/career-analyses/${analysisId}`)
      .set("Cookie", [`accessToken=${intruder.token}`]);

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("FORBIDDEN");
  });

  it("returns 404 for an analysis that does not exist", async () => {
    const res = await request(app)
      .get(`/api/v1/career-analyses/${crypto.randomUUID()}`)
      .set("Cookie", [`accessToken=${owner.token}`]);

    expect(res.status).toBe(404);
  });

  it("returns the analysis with its score and breakdown to the owner", async () => {
    const res = await request(app)
      .get(`/api/v1/career-analyses/${analysisId}`)
      .set("Cookie", [`accessToken=${owner.token}`]);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(analysisId);
    expect(res.body.data.readinessScore).toBe(42);
    expect(res.body.data.readinessBreakdown).toBeTruthy();
    expect(res.body.data.role.slug).toBe("backend-engineer");
  });
});

describe("GET /career-analyses", () => {
  it("rejects an unauthenticated request", async () => {
    const res = await request(app).get("/api/v1/career-analyses");
    expect(res.status).toBe(401);
  });

  it("lists only the caller's analyses", async () => {
    const owner = await createUser("AnalysisLister");
    const other = await createUser("AnalysisOther");
    const resume = await createResume(owner.user.id);
    const mine = await createAnalysisRow(owner.user.id, resume.id);

    const res = await request(app)
      .get("/api/v1/career-analyses")
      .set("Cookie", [`accessToken=${owner.token}`]);

    expect(res.status).toBe(200);
    expect(res.body.data.map((a: { id: string }) => a.id)).toEqual([mine.id]);

    const theirs = await request(app)
      .get("/api/v1/career-analyses")
      .set("Cookie", [`accessToken=${other.token}`]);
    expect(theirs.body.data).toEqual([]);
  });

  it("rejects a non-uuid resumeId filter", async () => {
    const owner = await createUser("AnalysisFilterer");
    const res = await request(app)
      .get("/api/v1/career-analyses?resumeId=nope")
      .set("Cookie", [`accessToken=${owner.token}`]);

    expect(res.status).toBe(400);
  });
});

describe("DELETE /career-analyses/:id", () => {
  it("rejects an unauthenticated request", async () => {
    const res = await request(app).delete(
      `/api/v1/career-analyses/${crypto.randomUUID()}`,
    );
    expect(res.status).toBe(401);
  });

  it("returns 403 for another user's analysis", async () => {
    const owner = await createUser("DeleteOwner");
    const intruder = await createUser("DeleteIntruder");
    const resume = await createResume(owner.user.id);
    const analysis = await createAnalysisRow(owner.user.id, resume.id);

    const res = await request(app)
      .delete(`/api/v1/career-analyses/${analysis.id}`)
      .set("Cookie", [`accessToken=${intruder.token}`]);

    expect(res.status).toBe(403);
    // The row must survive a rejected delete.
    expect(
      await prisma.careerAnalysis.findUnique({ where: { id: analysis.id } }),
    ).not.toBeNull();
  });

  it("deletes the analysis for its owner", async () => {
    const owner = await createUser("DeleteSelf");
    const resume = await createResume(owner.user.id);
    const analysis = await createAnalysisRow(owner.user.id, resume.id);

    const res = await request(app)
      .delete(`/api/v1/career-analyses/${analysis.id}`)
      .set("Cookie", [`accessToken=${owner.token}`]);

    expect(res.status).toBe(200);
    expect(
      await prisma.careerAnalysis.findUnique({ where: { id: analysis.id } }),
    ).toBeNull();
  });
});
