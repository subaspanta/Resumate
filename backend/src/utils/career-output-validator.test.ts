import { describe, expect, it } from "vitest";
import {
  buildResumeHaystack,
  isQuoteGrounded,
  normalizeForGrounding,
  validateEvidenceGrounding,
  validateRoadmapGrounding,
} from "./career-output-validator.js";
import { StructuredResume } from "../modules/parsing/parsing.types.js";
import {
  EvidenceAgentOutput,
  RoleSnapshot,
} from "../modules/career-analysis/career-analysis.types.js";
import { AppError } from "../types/app-error.js";

const REAL_BULLET =
  "Containerized the payment service using Docker and deployed it to staging";
const REAL_PROJECT_BULLET =
  "Built a task tracker with React and persisted state to PostgreSQL";

function resume(): StructuredResume {
  return {
    name: "Test Candidate",
    summary: "Final-year computer science student focused on web development",
    experience: [
      {
        title: "Backend Intern",
        company: "Acme Corp",
        bullets: [REAL_BULLET],
      },
    ],
    projects: [{ name: "Task Tracker", bullets: [REAL_PROJECT_BULLET] }],
    education: [{ degree: "BSc CSIT", institution: "Example University" }],
    skills: [{ category: "Languages", items: ["TypeScript", "Kubernetes"] }],
    certifications: [],
    customSections: [],
  };
}

function roleSnapshot(slugs: string[]): RoleSnapshot {
  return {
    roleId: "role-1",
    slug: "backend-engineer",
    title: "Backend Engineer",
    description: "Builds server-side systems",
    seedVersion: "test.1",
    capturedAt: new Date().toISOString(),
    skills: slugs.map((slug) => ({
      skillId: `skill-${slug}`,
      slug,
      name: slug,
      aliases: [],
      importance: "critical" as const,
      rationale: "because",
    })),
  };
}

function output(
  assessments: EvidenceAgentOutput["assessments"],
): EvidenceAgentOutput {
  return { assessments };
}

describe("normalizeForGrounding", () => {
  it("folds en and em dashes to a plain hyphen", () => {
    expect(normalizeForGrounding("cost\u2013benefit")).toBe("cost-benefit");
    expect(normalizeForGrounding("2023\u20142024")).toBe("2023-2024");
  });

  it("folds smart quotes to straight quotes", () => {
    expect(normalizeForGrounding("the team\u2019s work")).toBe("the team's work");
  });

  // These use explicit \u escapes rather than pasted literals: the raw
  // characters are invisible in a diff and are trivially stripped in
  // transit, which would silently turn each of these into a tautology.
  it("folds non-breaking and thin spaces to ordinary spaces", () => {
    expect(normalizeForGrounding("React\u00a0and\u2009Node")).toBe("react and node");
  });

  it("folds ligatures", () => {
    expect(normalizeForGrounding("de\ufb01ned")).toBe("defined");
  });

  it("strips zero-width characters", () => {
    expect(normalizeForGrounding("Doc\u200bker")).toBe("docker");
    expect(normalizeForGrounding("\ufeffReact hooks")).toBe("react hooks");
  });

  it("strips leading bullet glyphs", () => {
    expect(normalizeForGrounding("\u2022 Built an API")).toBe("built an api");
    expect(normalizeForGrounding("- Built an API")).toBe("built an api");
  });

  it("collapses runs of whitespace", () => {
    expect(normalizeForGrounding("Built   an\n\nAPI")).toBe("built an api");
  });
});

describe("isQuoteGrounded", () => {
  const haystack = normalizeForGrounding(REAL_BULLET);

  it("accepts a quote that differs only by encoding noise", () => {
    expect(
      isQuoteGrounded(
        "Containerized the payment service using Docker",
        haystack,
      ),
    ).toBe(true);
  });

  it("rejects a quote that is not in the text", () => {
    expect(
      isQuoteGrounded("Led migration of 40 microservices to Kubernetes", haystack),
    ).toBe(false);
  });

  it("rejects a quote below the minimum length", () => {
    expect(isQuoteGrounded("Docker", haystack)).toBe(false);
  });
});

describe("buildResumeHaystack", () => {
  it("indexes text by the section it came from", () => {
    const haystack = buildResumeHaystack(resume());
    expect(haystack.bySection.experience).toContain("containerized");
    expect(haystack.bySection.projects).toContain("task tracker");
    expect(haystack.bySection.skills).toContain("typescript");
    expect(haystack.bySection.experience).not.toContain("task tracker");
  });

  it("does not let adjacent entries form a phantom substring", () => {
    const haystack = buildResumeHaystack({
      ...resume(),
      experience: [
        { title: "Dev", company: "A", bullets: ["Built the alpha", "Beta shipped"] },
      ],
    });
    // "alpha beta" spans two separate bullets and must not ground.
    expect(haystack.bySection.experience).not.toContain("alphabeta");
  });
});

describe("validateEvidenceGrounding", () => {
  it("throws when the AI assesses a skill outside the role's requirements", () => {
    expect(() =>
      validateEvidenceGrounding(
        output([
          {
            skillSlug: "kubernetes",
            found: true,
            evidence: [],
            observation: "",
          },
        ]),
        { roleSnapshot: roleSnapshot(["docker"]), resume: resume() },
      ),
    ).toThrow(AppError);
  });

  it("keeps evidence quoted verbatim from the resume", () => {
    const result = validateEvidenceGrounding(
      output([
        {
          skillSlug: "docker",
          found: true,
          evidence: [
            {
              quote: REAL_BULLET,
              strength: "experience_backed",
              sourceSection: "experience",
              sourceLabel: "Acme Corp — Backend Intern",
            },
          ],
          observation: "Used in an internship",
        },
      ]),
      { roleSnapshot: roleSnapshot(["docker"]), resume: resume() },
    );

    expect(result.rejections).toEqual([]);
    expect(result.assessments[0].evidence).toHaveLength(1);
    expect(result.assessments[0].found).toBe(true);
  });

  it("drops a hallucinated quote and reports why", () => {
    const result = validateEvidenceGrounding(
      output([
        {
          skillSlug: "docker",
          found: true,
          evidence: [
            {
              quote: "Led migration of 40 microservices to Kubernetes at scale",
              strength: "experience_backed",
              sourceSection: "experience",
              sourceLabel: "Acme Corp",
            },
          ],
          observation: "",
        },
      ]),
      { roleSnapshot: roleSnapshot(["docker"]), resume: resume() },
    );

    expect(result.assessments[0].evidence).toEqual([]);
    expect(result.rejections[0].reason).toBe("quote_not_verbatim");
  });

  it("collapses found to false when every quote is rejected", () => {
    const result = validateEvidenceGrounding(
      output([
        {
          skillSlug: "docker",
          found: true,
          evidence: [
            {
              quote: "Architected a fault-tolerant distributed message bus",
              strength: "experience_backed",
              sourceSection: "experience",
              sourceLabel: "Acme Corp",
            },
          ],
          observation: "",
        },
      ]),
      { roleSnapshot: roleSnapshot(["docker"]), resume: resume() },
    );

    // The AI claimed the skill but proved nothing — indistinguishable from
    // having found nothing at all.
    expect(result.assessments[0].found).toBe(false);
  });

  it("drops experience_backed strength claimed from the skills list", () => {
    const result = validateEvidenceGrounding(
      output([
        {
          skillSlug: "typescript",
          found: true,
          evidence: [
            {
              quote: "Languages TypeScript Kubernetes",
              strength: "experience_backed",
              sourceSection: "skills",
              sourceLabel: "Skills",
            },
          ],
          observation: "",
        },
      ]),
      { roleSnapshot: roleSnapshot(["typescript"]), resume: resume() },
    );

    expect(result.rejections[0].reason).toBe("strength_section_mismatch");
    expect(result.assessments[0].evidence).toEqual([]);
  });

  it("drops a real quote attributed to the wrong section", () => {
    const result = validateEvidenceGrounding(
      output([
        {
          skillSlug: "react",
          found: true,
          evidence: [
            {
              // Real text, but it lives in projects, not experience.
              quote: REAL_PROJECT_BULLET,
              strength: "experience_backed",
              sourceSection: "experience",
              sourceLabel: "Acme Corp — Backend Intern",
            },
          ],
          observation: "",
        },
      ]),
      { roleSnapshot: roleSnapshot(["react"]), resume: resume() },
    );

    expect(result.rejections[0].reason).toBe("quote_wrong_section");
  });

  it("accepts project evidence as project_backed", () => {
    const result = validateEvidenceGrounding(
      output([
        {
          skillSlug: "react",
          found: true,
          evidence: [
            {
              quote: REAL_PROJECT_BULLET,
              strength: "project_backed",
              sourceSection: "projects",
              sourceLabel: "Task Tracker",
            },
          ],
          observation: "",
        },
      ]),
      { roleSnapshot: roleSnapshot(["react"]), resume: resume() },
    );

    expect(result.rejections).toEqual([]);
    expect(result.assessments[0].evidence).toHaveLength(1);
  });

  it("rejects a quote that is too short to prove anything", () => {
    const result = validateEvidenceGrounding(
      output([
        {
          skillSlug: "docker",
          found: true,
          evidence: [
            {
              quote: "Docker",
              strength: "mentioned",
              sourceSection: "skills",
              sourceLabel: "Skills",
            },
          ],
          observation: "",
        },
      ]),
      { roleSnapshot: roleSnapshot(["docker"]), resume: resume() },
    );

    expect(result.rejections[0].reason).toBe("quote_too_short");
  });

  it("backfills a skill the AI omitted entirely as not found", () => {
    const result = validateEvidenceGrounding(
      output([
        { skillSlug: "docker", found: false, evidence: [], observation: "" },
      ]),
      {
        roleSnapshot: roleSnapshot(["docker", "testing", "ci-cd"]),
        resume: resume(),
      },
    );

    // Omitted skills must become "missing", never vanish — vanishing would
    // shrink the denominator and inflate readiness.
    expect(result.assessments).toHaveLength(3);
    expect(result.assessments.map((a) => a.skillSlug)).toEqual([
      "docker",
      "testing",
      "ci-cd",
    ]);
    expect(result.assessments.every((a) => a.found === false)).toBe(true);
  });

  it("never leaks resume content into rejection details", () => {
    const result = validateEvidenceGrounding(
      output([
        {
          skillSlug: "docker",
          found: true,
          evidence: [
            {
              quote: "Some entirely fabricated achievement about scaling",
              strength: "experience_backed",
              sourceSection: "experience",
              sourceLabel: "Acme Corp",
            },
          ],
          observation: "",
        },
      ]),
      { roleSnapshot: roleSnapshot(["docker"]), resume: resume() },
    );

    expect(result.rejections[0].detail).not.toContain("fabricated");
  });
});

describe("validateRoadmapGrounding", () => {
  const gapIds = new Set(["gap-1", "gap-2"]);

  it("accepts tasks referencing gaps in this analysis", () => {
    const tasks = [
      { skillGapId: "gap-1", weekNumber: 1, title: "T", description: "D" },
      { skillGapId: null, weekNumber: 4, title: "T", description: "D" },
    ];
    expect(
      validateRoadmapGrounding(tasks, { gapIdsInAnalysis: gapIds, weekCount: 4 }),
    ).toEqual(tasks);
  });

  it("throws on a task pinned to a gap from another analysis", () => {
    expect(() =>
      validateRoadmapGrounding(
        [
          {
            skillGapId: "gap-from-someone-else",
            weekNumber: 1,
            title: "T",
            description: "D",
          },
        ],
        { gapIdsInAnalysis: gapIds, weekCount: 4 },
      ),
    ).toThrow(AppError);
  });

  it("throws on a week outside the roadmap's range", () => {
    expect(() =>
      validateRoadmapGrounding(
        [{ skillGapId: "gap-1", weekNumber: 6, title: "T", description: "D" }],
        { gapIdsInAnalysis: gapIds, weekCount: 4 },
      ),
    ).toThrow(AppError);
  });

  it("throws when the AI marks a task as already complete", () => {
    expect(() =>
      validateRoadmapGrounding(
        [
          {
            skillGapId: "gap-1",
            weekNumber: 1,
            title: "T",
            description: "D",
            completed: true,
          },
        ],
        { gapIdsInAnalysis: gapIds, weekCount: 4 },
      ),
    ).toThrow(AppError);
  });
});
