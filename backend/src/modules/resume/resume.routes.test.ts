import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../app.js";

describe("PATCH /api/v1/resumes/:id/sections", () => {
  it("rejects an unauthenticated request with 401 before parsing the body", async () => {
    const res = await request(app)
      .patch("/api/v1/resumes/11111111-1111-1111-1111-111111111111/sections")
      // Deliberately invalid body: if validateRequest ran first this would
      // be a 400, proving auth is not the outermost gate.
      .send({ summary: "not-a-boolean" });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });
});
