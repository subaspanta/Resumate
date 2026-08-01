import { describe, expect, it } from "vitest";
import { validateSummaryRewrite } from "./rewrite-validator.js";

const ORIGINAL =
  "Frontend developer with experience building React applications. Enjoys solving UI problems and working with modern JavaScript frameworks.";

describe("validateSummaryRewrite", () => {
  it("accepts a reworded summary of similar length", () => {
    const rewrite =
      "Frontend developer experienced in building React applications, focused on solving UI problems with modern JavaScript frameworks.";
    expect(validateSummaryRewrite(ORIGINAL, rewrite).valid).toBe(true);
  });

  it("rejects a rewrite compressed into a single short line", () => {
    const rewrite = "React developer.";
    const result = validateSummaryRewrite(ORIGINAL, rewrite);
    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/half the original length/);
  });

  it("rejects a rewrite that invents a company name", () => {
    const rewrite =
      "Frontend developer at Acme Corporation with experience building React applications and modern JavaScript frameworks.";
    const result = validateSummaryRewrite(ORIGINAL, rewrite);
    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/invented company name/);
  });

  it("rejects a rewrite that drifts too far from the original content", () => {
    const rewrite =
      "Backend engineer skilled in distributed systems, databases, and cloud infrastructure design.";
    const result = validateSummaryRewrite(ORIGINAL, rewrite);
    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/meaningful words/);
  });
});
