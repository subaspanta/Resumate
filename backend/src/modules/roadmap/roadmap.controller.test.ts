import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../app.js";
import { prisma } from "../../lib/prisma.js";
import { generateAccessToken } from "../../utils/tokens.js";

// HTTP boundary only — auth, validation, ownership. Every case here is
// rejected before the route would reach Gemini, so the container's real agent
// is never invoked. Generation itself is covered in roadmap.service.test.ts
// with a fake agent.

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

// Built directly rather than through the service: these tests are about the
// HTTP layer, and the real pipeline would need an AI call.
async function createRoadmapFixture(userId: string) {
  const role = await prisma.role.findUniqueOrThrow({
    where: { slug: "backend-engineer" },
  });
  const skill = await prisma.skill.findUniqueOrThrow({
    where: { slug: "docker" },
  });
  const resume = await prisma.resume.create({
    data: {
      userId,
      title: "Resume",
      originalFileName: "resume.pdf",
      mimeType: "application/pdf",
      fileSize: 1,
      fileUrl: "https://example.com/resume.pdf",
      rawText: "raw text",
      structuredResume: {},
    },
  });
  const analysis = await prisma.careerAnalysis.create({
    data: {
      userId,
      resumeId: resume.id,
      roleId: role.id,
      status: "complete",
      resumeSnapshot: {},
      roleSnapshot: { slug: "backend-engineer", title: "Backend", skills: [] },
      readinessScore: 40,
      readinessBreakdown: { score: 40 },
      gaps: {
        create: {
          skillId: skill.id,
          status: "missing",
          priority: 0,
          reasoning: "No evidence found",
        },
      },
    },
    include: { gaps: true },
  });
  const roadmap = await prisma.roadmap.create({
    data: {
      careerAnalysisId: analysis.id,
      weekCount: 4,
      tasks: {
        create: {
          skillGapId: analysis.gaps[0].id,
          weekNumber: 1,
          orderInWeek: 0,
          title: "Learn Docker",
          description: "Containerize your project",
          resources: ["docs"],
        },
      },
    },
    include: { tasks: true },
  });
  return { analysis, roadmap, task: roadmap.tasks[0] };
}

describe("POST /career-analyses/:id/roadmap", () => {
  let owner: Awaited<ReturnType<typeof createUser>>;
  let intruder: Awaited<ReturnType<typeof createUser>>;
  let fixture: Awaited<ReturnType<typeof createRoadmapFixture>>;

  beforeAll(async () => {
    owner = await createUser("RoadmapPoster");
    intruder = await createUser("RoadmapPostIntruder");
    fixture = await createRoadmapFixture(owner.user.id);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("rejects an unauthenticated request", async () => {
    const res = await request(app).post(
      `/api/v1/career-analyses/${fixture.analysis.id}/roadmap`,
    );
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("returns 403 for another user's analysis", async () => {
    const res = await request(app)
      .post(`/api/v1/career-analyses/${fixture.analysis.id}/roadmap`)
      .set("Cookie", [`accessToken=${intruder.token}`]);

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("FORBIDDEN");
  });

  it("returns 404 for an analysis that does not exist", async () => {
    const res = await request(app)
      .post(`/api/v1/career-analyses/${crypto.randomUUID()}/roadmap`)
      .set("Cookie", [`accessToken=${owner.token}`]);

    expect(res.status).toBe(404);
  });

  it("returns 409 when the analysis already has a roadmap", async () => {
    const res = await request(app)
      .post(`/api/v1/career-analyses/${fixture.analysis.id}/roadmap`)
      .set("Cookie", [`accessToken=${owner.token}`]);

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("ROADMAP_ALREADY_EXISTS");
  });
});

describe("GET /career-analyses/:id/roadmap", () => {
  let owner: Awaited<ReturnType<typeof createUser>>;
  let intruder: Awaited<ReturnType<typeof createUser>>;
  let fixture: Awaited<ReturnType<typeof createRoadmapFixture>>;

  beforeAll(async () => {
    owner = await createUser("RoadmapGetter");
    intruder = await createUser("RoadmapGetIntruder");
    fixture = await createRoadmapFixture(owner.user.id);
  });

  it("rejects an unauthenticated request", async () => {
    const res = await request(app).get(
      `/api/v1/career-analyses/${fixture.analysis.id}/roadmap`,
    );
    expect(res.status).toBe(401);
  });

  it("returns 403 for another user's analysis", async () => {
    const res = await request(app)
      .get(`/api/v1/career-analyses/${fixture.analysis.id}/roadmap`)
      .set("Cookie", [`accessToken=${intruder.token}`]);
    expect(res.status).toBe(403);
  });

  it("returns the roadmap with its tasks to the owner", async () => {
    const res = await request(app)
      .get(`/api/v1/career-analyses/${fixture.analysis.id}/roadmap`)
      .set("Cookie", [`accessToken=${owner.token}`]);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(fixture.roadmap.id);
    expect(res.body.data.tasks).toHaveLength(1);
    expect(res.body.data.tasks[0].skillGap.skill.slug).toBe("docker");
  });

  it("returns null data when the analysis has no roadmap yet", async () => {
    const other = await createUser("NoRoadmapYet");
    const role = await prisma.role.findUniqueOrThrow({
      where: { slug: "backend-engineer" },
    });
    const resume = await prisma.resume.create({
      data: {
        userId: other.user.id,
        title: "R",
        originalFileName: "r.pdf",
        mimeType: "application/pdf",
        fileSize: 1,
        fileUrl: "https://example.com/r.pdf",
        rawText: "t",
        structuredResume: {},
      },
    });
    const analysis = await prisma.careerAnalysis.create({
      data: {
        userId: other.user.id,
        resumeId: resume.id,
        roleId: role.id,
        status: "complete",
        resumeSnapshot: {},
        roleSnapshot: {},
      },
    });

    const res = await request(app)
      .get(`/api/v1/career-analyses/${analysis.id}/roadmap`)
      .set("Cookie", [`accessToken=${other.token}`]);

    // Not an error — an analysis without a roadmap is a normal state.
    expect(res.status).toBe(200);
    expect(res.body.data).toBeNull();
  });
});

describe("GET /roadmaps/:roadmapId", () => {
  it("returns 403 for another user's roadmap", async () => {
    const owner = await createUser("DirectRoadmapOwner");
    const intruder = await createUser("DirectRoadmapIntruder");
    const fixture = await createRoadmapFixture(owner.user.id);

    const res = await request(app)
      .get(`/api/v1/roadmaps/${fixture.roadmap.id}`)
      .set("Cookie", [`accessToken=${intruder.token}`]);

    expect(res.status).toBe(403);
  });

  it("returns 404 for a roadmap that does not exist", async () => {
    const owner = await createUser("DirectRoadmapMissing");
    const res = await request(app)
      .get(`/api/v1/roadmaps/${crypto.randomUUID()}`)
      .set("Cookie", [`accessToken=${owner.token}`]);

    expect(res.status).toBe(404);
  });
});

describe("PATCH /roadmap-tasks/:taskId", () => {
  let owner: Awaited<ReturnType<typeof createUser>>;
  let intruder: Awaited<ReturnType<typeof createUser>>;
  let fixture: Awaited<ReturnType<typeof createRoadmapFixture>>;

  beforeAll(async () => {
    owner = await createUser("TaskPatcher");
    intruder = await createUser("TaskPatchIntruder");
    fixture = await createRoadmapFixture(owner.user.id);
  });

  it("rejects an unauthenticated request", async () => {
    const res = await request(app)
      .patch(`/api/v1/roadmap-tasks/${fixture.task.id}`)
      .send({ completed: true });
    expect(res.status).toBe(401);
  });

  it("rejects a non-boolean completed value", async () => {
    const res = await request(app)
      .patch(`/api/v1/roadmap-tasks/${fixture.task.id}`)
      .set("Cookie", [`accessToken=${owner.token}`])
      .send({ completed: "yes please" });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_FAILED");
  });

  it("returns 403 for another user's task", async () => {
    const res = await request(app)
      .patch(`/api/v1/roadmap-tasks/${fixture.task.id}`)
      .set("Cookie", [`accessToken=${intruder.token}`])
      .send({ completed: true });

    expect(res.status).toBe(403);
    // The task must be unchanged after a rejected write.
    const task = await prisma.roadmapTask.findUnique({
      where: { id: fixture.task.id },
    });
    expect(task!.completed).toBe(false);
  });

  it("returns 404 for a task that does not exist", async () => {
    const res = await request(app)
      .patch(`/api/v1/roadmap-tasks/${crypto.randomUUID()}`)
      .set("Cookie", [`accessToken=${owner.token}`])
      .send({ completed: true });

    expect(res.status).toBe(404);
  });

  it("marks the task complete for its owner", async () => {
    const res = await request(app)
      .patch(`/api/v1/roadmap-tasks/${fixture.task.id}`)
      .set("Cookie", [`accessToken=${owner.token}`])
      .send({ completed: true });

    expect(res.status).toBe(200);
    expect(res.body.data.completed).toBe(true);
    expect(res.body.data.completedAt).not.toBeNull();
  });

  it("ignores a client-supplied completedAt", async () => {
    const forged = "1999-01-01T00:00:00.000Z";
    const res = await request(app)
      .patch(`/api/v1/roadmap-tasks/${fixture.task.id}`)
      .set("Cookie", [`accessToken=${owner.token}`])
      .send({ completed: true, completedAt: forged });

    expect(res.status).toBe(200);
    // Progress history is server-authored; a user must not be able to date
    // their own completions.
    expect(res.body.data.completedAt).not.toBe(forged);
  });
});
