import { describe, expect, it } from "vitest";
import { buildResumeDefinition } from "./pdf-export.service.js";
import { normalizeStructuredResume } from "../parsing/normalize-resume.js";
import type { StructuredResume } from "../parsing/parsing.types.js";

const BASE_RESUME: StructuredResume = {
  name: "Jane Doe",
  experience: [],
  education: [],
  skills: [],
  projects: [],
};

function flattenText(content: unknown[]): string[] {
  const out: string[] = [];
  for (const item of content) {
    if (item && typeof item === "object") {
      if ("text" in item && typeof (item as any).text === "string") {
        out.push((item as any).text);
      }
      if ("columns" in item && Array.isArray((item as any).columns)) {
        out.push(...flattenText((item as any).columns));
      }
    }
  }
  return out;
}

describe("buildResumeDefinition — projects section", () => {
  it("renders a PROJECTS heading and entries when projects are present", () => {
    const resume: StructuredResume = {
      ...BASE_RESUME,
      projects: [
        { name: "Portfolio site", bullets: ["Built with Next.js"] },
        { name: "CLI tool", bullets: [] },
      ],
    };
    const texts = flattenText(
      buildResumeDefinition(resume).content as unknown[],
    );
    expect(texts).toContain("PROJECTS");
    expect(texts).toContain("Portfolio site");
    expect(texts).toContain("•  Built with Next.js");
    expect(texts).toContain("CLI tool");
  });

  it("renders no PROJECTS heading when projects is empty", () => {
    const texts = flattenText(
      buildResumeDefinition(BASE_RESUME).content as unknown[],
    );
    expect(texts).not.toContain("PROJECTS");
  });

  it("renders no PROJECTS heading when projects is undefined (pre-migration data)", () => {
    const { projects, ...withoutProjects } = BASE_RESUME;
    const texts = flattenText(
      buildResumeDefinition(withoutProjects as StructuredResume)
        .content as unknown[],
    );
    expect(texts).not.toContain("PROJECTS");
  });
});

// A legacy row reaches the PDF builder only through getMergedResume, which
// normalizes first. This asserts the pair actually holds: without the
// normalizer, `for (const bullet of exp.bullets)` throws on these rows.
describe("buildResumeDefinition — legacy description-shaped resumes", () => {
  it("renders normalized legacy entries as bullets instead of throwing", () => {
    const legacy = {
      name: "Jane Doe",
      experience: [{ title: "Engineer", description: "Led the migration." }],
      education: [],
      skills: [],
      projects: [{ name: "Portfolio", description: "Built with Next.js" }],
    };

    const texts = flattenText(
      buildResumeDefinition(normalizeStructuredResume(legacy))
        .content as unknown[],
    );

    expect(texts).toContain("•  Led the migration.");
    expect(texts).toContain("•  Built with Next.js");
  });

  it("does not throw on entries with no bullets and no description", () => {
    const legacy = { experience: [{ title: "Engineer" }], projects: [{}] };

    expect(() =>
      buildResumeDefinition(normalizeStructuredResume(legacy)),
    ).not.toThrow();
  });
});
