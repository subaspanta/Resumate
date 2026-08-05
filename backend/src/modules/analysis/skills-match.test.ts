import { describe, expect, it, vi } from "vitest";
import { flattenSkills, matchSkills } from "./skills-match.js";

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

describe("flattenSkills", () => {
  it("flattens items across multiple categorized groups", () => {
    const result = flattenSkills([
      { category: "Backend", items: ["Python", "Django"] },
      { category: "Cloud", items: ["AWS"] },
    ]);
    expect(result).toEqual(["Python", "Django", "AWS"]);
  });

  it("flattens an uncategorized group the same as a categorized one", () => {
    const result = flattenSkills([{ category: null, items: ["React"] }]);
    expect(result).toEqual(["React"]);
  });

  it("returns an empty array for no groups", () => {
    expect(flattenSkills([])).toEqual([]);
  });
});
