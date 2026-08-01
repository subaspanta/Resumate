import { describe, expect, it } from "vitest";
import { buildResumeDefinition } from "./pdf-export.service.js";
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
        { name: "Portfolio site", description: "Built with Next.js" },
        { name: "CLI tool" },
      ],
    };
    const texts = flattenText(
      buildResumeDefinition(resume).content as unknown[],
    );
    expect(texts).toContain("PROJECTS");
    expect(texts).toContain("Portfolio site");
    expect(texts).toContain("Built with Next.js");
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
