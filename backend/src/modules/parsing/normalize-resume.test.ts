import { afterEach, describe, expect, it, vi } from "vitest";
import { normalizeStructuredResume } from "./normalize-resume.js";
import { logger } from "../../config/logger.js";

describe("normalizeStructuredResume", () => {
  it("converts a legacy experience description into a single bullet", () => {
    const result = normalizeStructuredResume({
      experience: [
        {
          title: "Engineer",
          company: "Fintra",
          description: "Led migration. Cut latency 35%.",
        },
      ],
    });

    expect(result.experience[0].bullets).toEqual([
      "Led migration. Cut latency 35%.",
    ]);
    // Splitting is a guess we can't undo, so the string stays whole.
    expect(result.experience[0].bullets).toHaveLength(1);
    expect(result.experience[0].company).toBe("Fintra");
  });

  it("converts a legacy project description into a single bullet", () => {
    const result = normalizeStructuredResume({
      projects: [{ name: "Portfolio", description: "Built with Next.js" }],
    });

    expect(result.projects[0].bullets).toEqual(["Built with Next.js"]);
  });

  // The output is serialized straight into an API response typed as
  // StructuredResume, which has no `description` — emitting both would ship the
  // same text twice under a field the type doesn't declare.
  it("drops the legacy description key instead of emitting it beside bullets", () => {
    const result = normalizeStructuredResume({
      experience: [{ title: "Engineer", description: "Legacy paragraph." }],
      projects: [{ name: "Portfolio", description: "Built with Next.js" }],
    });

    expect(result.experience[0]).not.toHaveProperty("description");
    expect(result.projects[0]).not.toHaveProperty("description");
    expect(Object.keys(result.experience[0])).toEqual(["title", "bullets"]);
    // Text survives — moved, not lost.
    expect(result.experience[0].bullets).toEqual(["Legacy paragraph."]);
  });

  it("drops the legacy description even when a real bullets array wins", () => {
    const result = normalizeStructuredResume({
      experience: [
        { title: "Engineer", bullets: ["New shape"], description: "Old shape" },
      ],
    });

    expect(result.experience[0]).not.toHaveProperty("description");
    expect(result.experience[0].bullets).toEqual(["New shape"]);
  });

  it("yields an empty bullets array when description is null, absent, or blank", () => {
    const result = normalizeStructuredResume({
      experience: [
        { title: "A", description: null },
        { title: "B" },
        { title: "C", description: "   " },
      ],
    });

    expect(result.experience.map((e) => e.bullets)).toEqual([[], [], []]);
  });

  it("passes an already-correct bullets array through untouched", () => {
    const bullets = ["Shipped X", "Owned Y"];
    const result = normalizeStructuredResume({
      experience: [{ title: "Engineer", bullets }],
    });

    expect(result.experience[0].bullets).toEqual(bullets);
  });

  it("prefers bullets over description when both are present", () => {
    const result = normalizeStructuredResume({
      experience: [
        { title: "Engineer", bullets: ["New shape"], description: "Old shape" },
      ],
    });

    expect(result.experience[0].bullets).toEqual(["New shape"]);
  });

  it("drops non-string junk inside a bullets array", () => {
    const result = normalizeStructuredResume({
      experience: [{ title: "Engineer", bullets: ["ok", 42, null, { a: 1 }] }],
    });

    expect(result.experience[0].bullets).toEqual(["ok"]);
  });

  // The real fixtures in resume.controller.test.ts / analysis.controller.test.ts
  // write exactly these shapes — no experience or projects key at all.
  it.each([
    ["empty object", {}],
    ["skills-only fixture", { skills: [] }],
    ["null", null],
    ["undefined", undefined],
    ["a string", "not a resume"],
    ["an array", []],
  ])("returns an empty resume for %s without throwing", (_label, input) => {
    const result = normalizeStructuredResume(input);

    expect(result.experience).toEqual([]);
    expect(result.education).toEqual([]);
    expect(result.skills).toEqual([]);
    expect(result.projects).toEqual([]);
    expect(result.certifications).toEqual([]);
    expect(result.customSections).toEqual([]);
  });

  it("defaults non-array sections to empty arrays", () => {
    const result = normalizeStructuredResume({
      experience: "nope",
      education: 12,
      skills: "not an array either",
      projects: null,
      certifications: "nope",
      customSections: 5,
    });

    expect(result.experience).toEqual([]);
    expect(result.education).toEqual([]);
    expect(result.skills).toEqual([]);
    expect(result.projects).toEqual([]);
    expect(result.certifications).toEqual([]);
    expect(result.customSections).toEqual([]);
  });

  it("wraps a legacy flat skills array into a single uncategorized group", () => {
    const result = normalizeStructuredResume({
      skills: ["Python", "Django"],
    });

    expect(result.skills).toEqual([
      { category: null, items: ["Python", "Django"] },
    ]);
  });

  it("passes an already-grouped skills array through", () => {
    const result = normalizeStructuredResume({
      skills: [
        { category: "Backend", items: ["Python"] },
        { category: null, items: ["Excel"] },
      ],
    });

    expect(result.skills).toEqual([
      { category: "Backend", items: ["Python"] },
      { category: null, items: ["Excel"] },
    ]);
  });

  it("drops non-record entries from a malformed grouped skills array", () => {
    const result = normalizeStructuredResume({
      skills: [{ category: "Backend", items: ["Python"] }, "junk", 42],
    });

    expect(result.skills).toEqual([{ category: "Backend", items: ["Python"] }]);
  });

  it("normalizes certifications, coercing a missing name and dropping junk entries", () => {
    const result = normalizeStructuredResume({
      certifications: [
        { name: "AWS SAA", issuer: "AWS", expiryDate: null },
        { issuer: "no name" },
        "junk",
      ],
    });

    expect(result.certifications).toEqual([
      {
        name: "AWS SAA",
        issuer: "AWS",
        issueDate: null,
        expiryDate: null,
        credentialId: null,
        credentialUrl: null,
      },
      {
        name: "",
        issuer: "no name",
        issueDate: null,
        expiryDate: null,
        credentialId: null,
        credentialUrl: null,
      },
    ]);
  });

  it("drops a non-string issuer/credential field to null with a repair tag", () => {
    const result = normalizeStructuredResume({
      certifications: [
        { name: "AWS SAA", issuer: { nested: true }, credentialId: 42 },
      ],
    });

    expect(result.certifications).toEqual([
      {
        name: "AWS SAA",
        issuer: null,
        issueDate: null,
        expiryDate: null,
        credentialId: null,
        credentialUrl: null,
      },
    ]);
  });

  it("returns an empty array when certifications is absent or malformed", () => {
    expect(normalizeStructuredResume({}).certifications).toEqual([]);
    expect(
      normalizeStructuredResume({ certifications: "nope" }).certifications,
    ).toEqual([]);
  });

  it("normalizes custom sections, coercing a missing heading and dropping junk bullets", () => {
    const result = normalizeStructuredResume({
      customSections: [
        { heading: "Publications", bullets: ["Paper A", 42, null] },
        { bullets: ["No heading"] },
      ],
    });

    expect(result.customSections).toEqual([
      { heading: "Publications", bullets: ["Paper A"] },
      { heading: "", bullets: ["No heading"] },
    ]);
  });

  it("returns an empty array when customSections is absent or malformed", () => {
    expect(normalizeStructuredResume({}).customSections).toEqual([]);
    expect(
      normalizeStructuredResume({ customSections: "nope" }).customSections,
    ).toEqual([]);
  });

  it("preserves unrelated top-level fields", () => {
    const result = normalizeStructuredResume({
      name: "Jane Doe",
      summary: "Backend engineer.",
      contact: { email: "jane@example.com" },
    });

    expect(result.name).toBe("Jane Doe");
    expect(result.summary).toBe("Backend engineer.");
    expect(result.contact?.email).toBe("jane@example.com");
  });
});

describe("normalizeStructuredResume — logging", () => {
  afterEach(() => vi.restoreAllMocks());

  it("warns with the resumeId and repair tags when data is malformed", () => {
    const warn = vi.spyOn(logger, "warn").mockImplementation(() => {});

    normalizeStructuredResume(
      {
        experience: [{ title: "Engineer", description: "Legacy paragraph." }],
        skills: ["Python", "Django"],
      },
      { resumeId: "resume-123", source: "getMergedResume" },
    );

    expect(warn).toHaveBeenCalledTimes(1);
    const [message, meta] = warn.mock.calls[0];
    expect(message).toBe("Repaired malformed stored resume JSON");
    expect(meta).toMatchObject({
      resumeId: "resume-123",
      source: "getMergedResume",
    });
    expect(meta.repairs).toContain("experience[0].bullets:legacy-description");
    expect(meta.repairs).toContain("skills:legacy-flat-array");
  });

  it("never logs resume content — only field names and defect tags", () => {
    const warn = vi.spyOn(logger, "warn").mockImplementation(() => {});

    normalizeStructuredResume({
      name: "Jane Doe",
      contact: { email: "jane@example.com", phone: "555-0100" },
      experience: [
        { title: "Engineer", description: "Led the payments migration." },
      ],
    });

    const serialized = JSON.stringify(warn.mock.calls[0]);
    expect(serialized).not.toContain("Jane Doe");
    expect(serialized).not.toContain("jane@example.com");
    expect(serialized).not.toContain("555-0100");
    expect(serialized).not.toContain("Led the payments migration.");
  });

  it("distinguishes a malformed bullets field from a malformed section", () => {
    const warn = vi.spyOn(logger, "warn").mockImplementation(() => {});

    normalizeStructuredResume({
      experience: [{ title: "Engineer", bullets: "not an array" }],
      projects: "not an array",
    });

    const { repairs } = warn.mock.calls[0][1];
    expect(repairs).toContain("experience[0].bullets:bullets-not-an-array");
    expect(repairs).toContain("projects:not-an-array");
    // The two defects must not collapse onto the same tag.
    expect(repairs).not.toContain("experience[0].bullets:not-an-array");
  });

  it("stays silent for a well-formed resume", () => {
    const warn = vi.spyOn(logger, "warn").mockImplementation(() => {});

    normalizeStructuredResume({
      name: "Jane Doe",
      experience: [{ title: "Engineer", bullets: ["Shipped X"] }],
      education: [],
      skills: [{ category: null, items: ["Python"] }],
      projects: [],
    });

    expect(warn).not.toHaveBeenCalled();
  });

  it("stays silent when optional sections are simply absent", () => {
    const warn = vi.spyOn(logger, "warn").mockImplementation(() => {});

    normalizeStructuredResume({ name: "Jane Doe" });

    expect(warn).not.toHaveBeenCalled();
  });

  it("emits one warning per row, not one per defect", () => {
    const warn = vi.spyOn(logger, "warn").mockImplementation(() => {});

    normalizeStructuredResume({
      experience: [
        { title: "A", description: "one" },
        { title: "B", description: "two" },
      ],
      projects: [{ name: "P", description: "three" }],
      skills: [1, 2, 3],
    });

    expect(warn).toHaveBeenCalledTimes(1);
  });
});

describe("normalizeStructuredResume — unrelated fields", () => {
  it("preserves unrelated top-level fields", () => {
    const result = normalizeStructuredResume({
      name: "Jane Doe",
      summary: "Backend engineer.",
      contact: { email: "jane@example.com" },
    });

    expect(result.name).toBe("Jane Doe");
    expect(result.summary).toBe("Backend engineer.");
    expect(result.contact?.email).toBe("jane@example.com");
  });
});
