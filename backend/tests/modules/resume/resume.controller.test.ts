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

  it("returns 404 when deleting another user's resume, and the row survives", async () => {
    const resume = await createResume(owner.user.id);
    const res = await request(app)
      .delete(`/api/v1/resumes/${resume.id}`)
      .set("Cookie", [`accessToken=${intruder.token}`]);
    expect(res.status).toBe(404);

    // Proves the ownership predicate is on the delete write itself, not
    // just the earlier read — a bare `delete({ where: { id } })` would
    // return 404 here too (the read still gates the response) while
    // silently removing the row underneath. Confirm it did not.
    const stillExists = await prisma.resume.findUnique({
      where: { id: resume.id },
    });
    expect(stillExists).not.toBeNull();
  });

  it("returns 404 for a nonexistent resume", async () => {
    const res = await request(app)
      .delete(`/api/v1/resumes/${crypto.randomUUID()}`)
      .set("Cookie", [`accessToken=${owner.token}`]);
    expect(res.status).toBe(404);
  });

  it("deletes the resume when the owner requests it", async () => {
    const resume = await createResume(owner.user.id);

    const res = await request(app)
      .delete(`/api/v1/resumes/${resume.id}`)
      .set("Cookie", [`accessToken=${owner.token}`]);
    expect(res.status).toBe(200);

    const remaining = await prisma.resume.findUnique({
      where: { id: resume.id },
    });
    expect(remaining).toBeNull();
  });
});

describe("GET /resumes/:id", () => {
  it("returns 401 with no token", async () => {
    const owner = await createUser("GetOwner");
    const resume = await createResume(owner.user.id);
    const res = await request(app).get(`/api/v1/resumes/${resume.id}`);
    expect(res.status).toBe(401);
  });

  it("returns 404 for another user's resume", async () => {
    const owner = await createUser("GetOwner2");
    const intruder = await createUser("GetIntruder");
    const resume = await createResume(owner.user.id);
    const res = await request(app)
      .get(`/api/v1/resumes/${resume.id}`)
      .set("Cookie", [`accessToken=${intruder.token}`]);
    expect(res.status).toBe(404);
  });

  it("returns the resume to its owner", async () => {
    const owner = await createUser("GetOwner3");
    const resume = await createResume(owner.user.id);
    const res = await request(app)
      .get(`/api/v1/resumes/${resume.id}`)
      .set("Cookie", [`accessToken=${owner.token}`]);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(resume.id);
  });
});

describe("GET /resumes", () => {
  it("returns 401 with no token", async () => {
    const res = await request(app).get("/api/v1/resumes");
    expect(res.status).toBe(401);
  });

  it("lists only the requesting user's resumes", async () => {
    const owner = await createUser("ListOwner");
    const other = await createUser("ListOther");
    const mine = await createResume(owner.user.id);
    await createResume(other.user.id);

    const res = await request(app)
      .get("/api/v1/resumes")
      .set("Cookie", [`accessToken=${owner.token}`]);

    expect(res.status).toBe(200);
    expect(res.body.data.items.map((r: { id: string }) => r.id)).toEqual([
      mine.id,
    ]);
  });
});
