import { describe, expect, it, vi } from "vitest";
import { matchSkills } from "./skills-match.js";

describe("matchSkills", () => {
  it("matches case-insensitively and reports missing job skills", () => {
    const result = matchSkills(
      ["React", "PostgreSQL", "Docker"],
      ["react", "AWS", "Docker"],
    );
    expect(result.matched).toEqual(["React", "Docker"]);
    expect(result.missing).toEqual(["aws"]);
  });

  it("returns everything as missing when the resume has no skills", () => {
    const result = matchSkills([], ["React", "AWS"]);
    expect(result.matched).toEqual([]);
    expect(result.missing).toEqual(["react", "aws"]);
  });

  it("returns nothing missing when the job lists no skills", () => {
    const result = matchSkills(["React"], []);
    expect(result.matched).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  it("makes no network or database calls", () => {
    const spy = vi.spyOn(global, "fetch");
    matchSkills(["React"], ["React"]);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
