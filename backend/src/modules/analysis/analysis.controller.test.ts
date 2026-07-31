import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../app.js";
import { prisma } from "../../lib/prisma.js";
import { generateAccessToken } from "../../utils/tokens.js";

async function createUserWithSuggestion() {
  const user = await prisma.user.create({
    data: {
      name: "Owner",
      email: `owner-${crypto.randomUUID()}@example.com`,
      passwordHash: "irrelevant-for-this-test",
    },
  });
  const resume = await prisma.resume.create({
    data: {
      userId: user.id,
      title: "Resume",
      originalFileName: "resume.pdf",
      mimeType: "application/pdf",
      fileSize: 1,
      fileUrl: "https://example.com/resume.pdf",
      rawText: "raw text",
      structuredResume: {},
    },
  });
  const analysis = await prisma.analysis.create({
    data: {
      resumeId: resume.id,
      userId: user.id,
      jobDescription: "a".repeat(60),
      parsedJob: {},
      resumeSnapshot: {},
      analysisResult: {},
    },
  });
  const suggestion = await prisma.suggestion.create({
    data: {
      analysisId: analysis.id,
      original: "Did stuff",
      suggested: "Did stuff, measurably better",
    },
  });
  const token = generateAccessToken({ sub: user.id, email: user.email });
  return { user, suggestion, token };
}

describe("PATCH /analyses/suggestions/:suggestionId", () => {
  let owner: Awaited<ReturnType<typeof createUserWithSuggestion>>;
  let intruderToken: string;

  beforeAll(async () => {
    owner = await createUserWithSuggestion();
    const intruder = await prisma.user.create({
      data: {
        name: "Intruder",
        email: `intruder-${crypto.randomUUID()}@example.com`,
        passwordHash: "irrelevant-for-this-test",
      },
    });
    intruderToken = generateAccessToken({
      sub: intruder.id,
      email: intruder.email,
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("rejects a request with no token", async () => {
    const res = await request(app)
      .patch(`/api/v1/analyses/suggestions/${owner.suggestion.id}`)
      .send({ status: "applied" });
    expect(res.status).toBe(401);
  });

  it("rejects a request with an invalid token", async () => {
    const res = await request(app)
      .patch(`/api/v1/analyses/suggestions/${owner.suggestion.id}`)
      .set("Cookie", ["accessToken=not-a-real-token"])
      .send({ status: "applied" });
    expect(res.status).toBe(401);
  });

  it("returns 403 when the suggestion belongs to another user", async () => {
    const res = await request(app)
      .patch(`/api/v1/analyses/suggestions/${owner.suggestion.id}`)
      .set("Cookie", [`accessToken=${intruderToken}`])
      .send({ status: "applied" });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("FORBIDDEN");
  });

  it("returns 404 when the suggestion doesn't exist", async () => {
    const res = await request(app)
      .patch(`/api/v1/analyses/suggestions/${crypto.randomUUID()}`)
      .set("Cookie", [`accessToken=${owner.token}`])
      .send({ status: "applied" });
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("RESOURCE_NOT_FOUND");
  });

  it("returns 400 for a malformed status value", async () => {
    const res = await request(app)
      .patch(`/api/v1/analyses/suggestions/${owner.suggestion.id}`)
      .set("Cookie", [`accessToken=${owner.token}`])
      .send({ status: "not-a-real-status" });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_FAILED");
  });

  it("updates the suggestion when the owner requests it", async () => {
    const res = await request(app)
      .patch(`/api/v1/analyses/suggestions/${owner.suggestion.id}`)
      .set("Cookie", [`accessToken=${owner.token}`])
      .send({ status: "applied" });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("applied");
  });
});
