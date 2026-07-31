import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../app.js";
import { prisma } from "../../lib/prisma.js";
import { generateAccessToken } from "../../utils/tokens.js";

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

async function createAnalysis(userId: string, resumeId: string) {
  return prisma.analysis.create({
    data: {
      resumeId,
      userId,
      jobDescription: "a".repeat(60),
      parsedJob: { skills: [] },
      resumeSnapshot: {},
      analysisResult: {},
    },
  });
}

describe("DELETE /resumes/:id", () => {
  let owner: Awaited<ReturnType<typeof createUser>>;
  let intruder: Awaited<ReturnType<typeof createUser>>;

  beforeAll(async () => {
    owner = await createUser("Owner");
    intruder = await createUser("Intruder");
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("rejects a request with no token", async () => {
    const resume = await createResume(owner.user.id);
    const res = await request(app).delete(`/api/v1/resumes/${resume.id}`);
    expect(res.status).toBe(401);
  });

  it("returns 404 when deleting another user's resume", async () => {
    const resume = await createResume(owner.user.id);
    const res = await request(app)
      .delete(`/api/v1/resumes/${resume.id}`)
      .set("Cookie", [`accessToken=${intruder.token}`]);
    expect(res.status).toBe(404);
  });

  it("returns 404 for a nonexistent resume", async () => {
    const res = await request(app)
      .delete(`/api/v1/resumes/${crypto.randomUUID()}`)
      .set("Cookie", [`accessToken=${owner.token}`]);
    expect(res.status).toBe(404);
  });

  it("deletes the resume and cascades its analyses when the owner requests it", async () => {
    const resume = await createResume(owner.user.id);
    const analysis = await createAnalysis(owner.user.id, resume.id);

    const res = await request(app)
      .delete(`/api/v1/resumes/${resume.id}`)
      .set("Cookie", [`accessToken=${owner.token}`]);
    expect(res.status).toBe(200);

    const remainingResume = await prisma.resume.findUnique({
      where: { id: resume.id },
    });
    const remainingAnalysis = await prisma.analysis.findUnique({
      where: { id: analysis.id },
    });
    expect(remainingResume).toBeNull();
    expect(remainingAnalysis).toBeNull();
  });
});

describe("GET /resumes/:resumeId/latest-analysis", () => {
  let owner: Awaited<ReturnType<typeof createUser>>;
  let intruder: Awaited<ReturnType<typeof createUser>>;

  beforeAll(async () => {
    owner = await createUser("LatestOwner");
    intruder = await createUser("LatestIntruder");
  });

  it("returns 401 with no token", async () => {
    const resume = await createResume(owner.user.id);
    const res = await request(app).get(
      `/api/v1/resumes/${resume.id}/latest-analysis`,
    );
    expect(res.status).toBe(401);
  });

  it("returns 404 for another user's resume", async () => {
    const resume = await createResume(owner.user.id);
    const res = await request(app)
      .get(`/api/v1/resumes/${resume.id}/latest-analysis`)
      .set("Cookie", [`accessToken=${intruder.token}`]);
    expect(res.status).toBe(404);
  });

  it("returns 200 with null data when the resume has no analyses yet", async () => {
    const resume = await createResume(owner.user.id);
    const res = await request(app)
      .get(`/api/v1/resumes/${resume.id}/latest-analysis`)
      .set("Cookie", [`accessToken=${owner.token}`]);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeNull();
  });

  it("returns the most recent analysis when one exists", async () => {
    const resume = await createResume(owner.user.id);
    const analysis = await createAnalysis(owner.user.id, resume.id);
    const res = await request(app)
      .get(`/api/v1/resumes/${resume.id}/latest-analysis`)
      .set("Cookie", [`accessToken=${owner.token}`]);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(analysis.id);
  });
});

describe("GET /resumes/:resumeId/analyses", () => {
  it("returns 401 with no token", async () => {
    const owner = await createUser("HistoryOwner");
    const resume = await createResume(owner.user.id);
    const res = await request(app).get(
      `/api/v1/resumes/${resume.id}/analyses`,
    );
    expect(res.status).toBe(401);
  });

  it("returns every analysis for the resume, newest first", async () => {
    const owner = await createUser("HistoryOwner2");
    const resume = await createResume(owner.user.id);
    const first = await createAnalysis(owner.user.id, resume.id);
    const second = await createAnalysis(owner.user.id, resume.id);

    const res = await request(app)
      .get(`/api/v1/resumes/${resume.id}/analyses`)
      .set("Cookie", [`accessToken=${owner.token}`]);
    expect(res.status).toBe(200);
    expect(res.body.data.map((a: { id: string }) => a.id)).toEqual([
      second.id,
      first.id,
    ]);
  });
});

describe("DELETE /analyses/:id", () => {
  it("returns 401 with no token", async () => {
    const owner = await createUser("AnalysisDeleteOwner");
    const resume = await createResume(owner.user.id);
    const analysis = await createAnalysis(owner.user.id, resume.id);
    const res = await request(app).delete(`/api/v1/analyses/${analysis.id}`);
    expect(res.status).toBe(401);
  });

  it("returns 404 when deleting another user's analysis", async () => {
    const owner = await createUser("AnalysisDeleteOwner2");
    const intruder = await createUser("AnalysisDeleteIntruder");
    const resume = await createResume(owner.user.id);
    const analysis = await createAnalysis(owner.user.id, resume.id);

    const res = await request(app)
      .delete(`/api/v1/analyses/${analysis.id}`)
      .set("Cookie", [`accessToken=${intruder.token}`]);
    expect(res.status).toBe(404);
  });

  it("deletes the analysis when the owner requests it", async () => {
    const owner = await createUser("AnalysisDeleteOwner3");
    const resume = await createResume(owner.user.id);
    const analysis = await createAnalysis(owner.user.id, resume.id);

    const res = await request(app)
      .delete(`/api/v1/analyses/${analysis.id}`)
      .set("Cookie", [`accessToken=${owner.token}`]);
    expect(res.status).toBe(200);

    const remaining = await prisma.analysis.findUnique({
      where: { id: analysis.id },
    });
    expect(remaining).toBeNull();
  });
});
