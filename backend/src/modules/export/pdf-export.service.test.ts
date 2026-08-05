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
  certifications: [],
  customSections: [],
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
describe("buildResumeDefinition — skills section", () => {
  it("renders a labelled block per categorized skill group", () => {
    const resume: StructuredResume = {
      ...BASE_RESUME,
      skills: [
        { category: "Backend", items: ["Python", "Django"] },
        { category: "Cloud", items: ["AWS"] },
      ],
    };
    const texts = flattenText(
      buildResumeDefinition(resume).content as unknown[],
    );
    expect(texts).toContain("SKILLS");
  });

  it("renders no SKILLS heading when every group is empty", () => {
    const resume: StructuredResume = {
      ...BASE_RESUME,
      skills: [{ category: "Backend", items: [] }],
    };
    const texts = flattenText(
      buildResumeDefinition(resume).content as unknown[],
    );
    expect(texts).not.toContain("SKILLS");
  });

  it("renders no SKILLS heading when skills is empty", () => {
    const texts = flattenText(
      buildResumeDefinition(BASE_RESUME).content as unknown[],
    );
    expect(texts).not.toContain("SKILLS");
  });
});

describe("buildResumeDefinition — certifications section", () => {
  it("renders name, date range, issuer, and credential info when present", () => {
    const resume: StructuredResume = {
      ...BASE_RESUME,
      certifications: [
        {
          name: "AWS Certified Solutions Architect – Associate",
          issuer: "Amazon Web Services",
          issueDate: "2022-03",
          expiryDate: "2025-03",
          credentialId: "ABC123",
          credentialUrl: "https://aws.amazon.com/verify/ABC123",
        },
      ],
    };
    const texts = flattenText(
      buildResumeDefinition(resume).content as unknown[],
    );
    expect(texts).toContain("CERTIFICATIONS");
    expect(texts).toContain("AWS Certified Solutions Architect – Associate");
    expect(texts).toContain("2022-03 – 2025-03");
    expect(
      texts.some((t) =>
        t.includes("Amazon Web Services") &&
        t.includes("ID: ABC123") &&
        t.includes("https://aws.amazon.com/verify/ABC123"),
      ),
    ).toBe(true);
  });

  it("tolerates a missing issueDate or expiryDate", () => {
    const resume: StructuredResume = {
      ...BASE_RESUME,
      certifications: [
        { name: "Cert A", issueDate: "2022-03", expiryDate: null },
        { name: "Cert B", issueDate: null, expiryDate: "2025-03" },
      ],
    };
    const texts = flattenText(
      buildResumeDefinition(resume).content as unknown[],
    );
    expect(texts).toContain("2022-03");
    expect(texts).toContain("2025-03");
  });

  it("omits the meta line when issuer and credential fields are absent", () => {
    const resume: StructuredResume = {
      ...BASE_RESUME,
      certifications: [{ name: "Cert A" }],
    };
    const texts = flattenText(
      buildResumeDefinition(resume).content as unknown[],
    );
    expect(texts).toContain("Cert A");
    expect(texts).not.toContain(" | ");
  });

  it("renders no CERTIFICATIONS heading when certifications is empty or absent", () => {
    const texts = flattenText(
      buildResumeDefinition(BASE_RESUME).content as unknown[],
    );
    expect(texts).not.toContain("CERTIFICATIONS");

    const { certifications, ...withoutCerts } = BASE_RESUME;
    const texts2 = flattenText(
      buildResumeDefinition(withoutCerts as StructuredResume)
        .content as unknown[],
    );
    expect(texts2).not.toContain("CERTIFICATIONS");
  });
});

describe("buildResumeDefinition — custom sections", () => {
  it("renders heading and bullets for each custom section", () => {
    const resume: StructuredResume = {
      ...BASE_RESUME,
      customSections: [
        {
          heading: "Publications",
          bullets: ['Co-authored "Scaling Payment Systems at Fintra."'],
        },
      ],
    };
    const texts = flattenText(
      buildResumeDefinition(resume).content as unknown[],
    );
    expect(texts).toContain("PUBLICATIONS");
    expect(texts).toContain(
      '•  Co-authored "Scaling Payment Systems at Fintra."',
    );
  });

  it("renders multiple custom sections in order", () => {
    const resume: StructuredResume = {
      ...BASE_RESUME,
      customSections: [
        { heading: "Publications", bullets: ["Paper A"] },
        { heading: "Volunteering", bullets: ["Org B"] },
      ],
    };
    const texts = flattenText(
      buildResumeDefinition(resume).content as unknown[],
    );
    expect(texts.indexOf("PUBLICATIONS")).toBeLessThan(
      texts.indexOf("VOLUNTEERING"),
    );
  });

  it("renders no custom section heading when customSections is empty or absent", () => {
    const texts = flattenText(
      buildResumeDefinition(BASE_RESUME).content as unknown[],
    );
    expect(texts).not.toContain("PUBLICATIONS");

    const { customSections, ...withoutCustom } = BASE_RESUME;
    const texts2 = flattenText(
      buildResumeDefinition(withoutCustom as StructuredResume)
        .content as unknown[],
    );
    expect(texts2).not.toContain("PUBLICATIONS");
  });
});

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
