import { describe, expect, it } from "vitest";
import {
  validateEvidenceGrounding,
  validateRoadmapGrounding,
} from "../../src/utils/career-output-validator.js";
import {
  isQuoteGrounded,
  normalizeForGrounding,
} from "../../src/utils/grounding-normalize.js";
import {
  buildReassessmentSourceItems,
  buildSourceItems,
} from "../../src/modules/career-analysis/resume-source-items.js";
import { StructuredResume } from "../../src/modules/parsing/parsing.types.js";
import {
  EvidenceAgentOutput,
  RoleSnapshot,
} from "../../src/modules/career-analysis/career-analysis.types.js";
import { AppError } from "../../src/types/app-error.js";

const REAL_BULLET =
  "Containerized the payment service using Docker and deployed it to staging";
const SECOND_JOB_BULLET =
  "Wrote integration tests covering the checkout flow end to end";
const REAL_PROJECT_BULLET =
  "Built a task tracker with React and persisted state to PostgreSQL";

// Two experience entries on purpose: with only one, every sourceIndex is 0 and
// a validator that ignored the index entirely would still pass.
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
      {
        title: "Junior Developer",
        company: "Globex",
        bullets: [SECOND_JOB_BULLET],
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

describe("validateEvidenceGrounding", () => {
  it("throws when the AI assesses a skill outside the role's requirements", () => {
    expect(() =>
      validateEvidenceGrounding(
        output([
          {
            skillSlug: "kubernetes",
            found: true,
            evidence: [],
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
              sourceIndex: 0,
            },
          ],
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
              sourceIndex: 0,
            },
          ],
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
              sourceIndex: 0,
            },
          ],
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
              sourceIndex: 0,
            },
          ],
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
              sourceIndex: 0,
            },
          ],
        },
      ]),
      { roleSnapshot: roleSnapshot(["react"]), resume: resume() },
    );

    expect(result.rejections[0].reason).toBe("quote_not_verbatim");
  });

  it("drops a real quote attributed to the wrong entry in the right section", () => {
    // The subtle case index-addressing exists to catch: genuine resume text,
    // correct section, but credited to a different job. A section-wide search
    // would accept this and show the user fabricated provenance.
    const result = validateEvidenceGrounding(
      output([
        {
          skillSlug: "docker",
          found: true,
          evidence: [
            {
              quote: REAL_BULLET, // belongs to experience[0]
              strength: "experience_backed",
              sourceSection: "experience",
              sourceIndex: 1, // credited to Globex
            },
          ],
        },
      ]),
      { roleSnapshot: roleSnapshot(["docker"]), resume: resume() },
    );

    expect(result.rejections[0].reason).toBe("quote_not_verbatim");
    expect(result.assessments[0].evidence).toEqual([]);
  });

  it("rejects a source index that does not exist", () => {
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
              sourceIndex: 99,
            },
          ],
        },
      ]),
      { roleSnapshot: roleSnapshot(["docker"]), resume: resume() },
    );

    expect(result.rejections[0].reason).toBe("source_index_out_of_range");
  });

  it("derives the source label from the cited entry rather than trusting the model", () => {
    const result = validateEvidenceGrounding(
      output([
        {
          skillSlug: "testing",
          found: true,
          evidence: [
            {
              quote: SECOND_JOB_BULLET,
              strength: "experience_backed",
              sourceSection: "experience",
              sourceIndex: 1,
            },
          ],
        },
      ]),
      { roleSnapshot: roleSnapshot(["testing"]), resume: resume() },
    );

    // The model supplied only an index; the label came from the snapshot.
    expect(result.assessments[0].evidence[0].sourceLabel).toBe(
      "Junior Developer — Globex",
    );
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
              sourceIndex: 0,
            },
          ],
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
              sourceIndex: 0,
            },
          ],
        },
      ]),
      { roleSnapshot: roleSnapshot(["docker"]), resume: resume() },
    );

    expect(result.rejections[0].reason).toBe("quote_too_short");
  });

  it("backfills a skill the AI omitted entirely as not found", () => {
    const result = validateEvidenceGrounding(
      output([
        { skillSlug: "docker", found: false, evidence: [] },
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
              sourceIndex: 0,
            },
          ],
        },
      ]),
      { roleSnapshot: roleSnapshot(["docker"]), resume: resume() },
    );

    expect(result.rejections[0].detail).not.toContain("fabricated");
  });
});

describe("validateEvidenceGrounding — reassessment (completed_work)", () => {
  const NOTE = "Wrote a multi-stage Dockerfile and a docker-compose file for local dev";
  const TASK_TEXT = "Containerize a small service using Docker and docker-compose";

  function reassessmentSourceItems() {
    return buildReassessmentSourceItems(resume(), [
      { skillName: "docker", completionNote: NOTE },
    ]);
  }

  it("grounds a quote from a completion note as project_backed", () => {
    const sourceItems = reassessmentSourceItems();
    const result = validateEvidenceGrounding(
      output([
        {
          skillSlug: "docker",
          found: true,
          evidence: [
            {
              quote: NOTE,
              strength: "project_backed",
              sourceSection: "completed_work",
              sourceIndex: 0,
            },
          ],
        },
      ]),
      { roleSnapshot: roleSnapshot(["docker"]), resume: resume(), sourceItems },
    );

    expect(result.rejections).toEqual([]);
    expect(result.assessments[0].found).toBe(true);
  });

  // The ceiling: completed_work is self-directed practice, not paid
  // employment. A note must never be able to earn "strong" — full credit on
  // a critical skill would be exactly the strength inflation the grounding
  // table exists to stop.
  it("drops a completion-note quote claimed as experience_backed", () => {
    const sourceItems = reassessmentSourceItems();
    const result = validateEvidenceGrounding(
      output([
        {
          skillSlug: "docker",
          found: true,
          evidence: [
            {
              quote: NOTE,
              strength: "experience_backed",
              sourceSection: "completed_work",
              sourceIndex: 0,
            },
          ],
        },
      ]),
      { roleSnapshot: roleSnapshot(["docker"]), resume: resume(), sourceItems },
    );

    expect(result.rejections[0].reason).toBe("strength_section_mismatch");
    expect(result.assessments[0].found).toBe(false);
  });

  // The anti-self-certification test: the AI-authored task description is
  // never in sourceItems, so a quote lifted verbatim from it can never ground
  // — even though the text itself looks plausible. If this test starts
  // failing, someone has wired task text into the groundable sources, which
  // would let the roadmap agent's own words count as the user's evidence.
  it("drops a quote lifted verbatim from the AI-authored task text", () => {
    const sourceItems = reassessmentSourceItems();
    const result = validateEvidenceGrounding(
      output([
        {
          skillSlug: "docker",
          found: true,
          evidence: [
            {
              quote: TASK_TEXT,
              strength: "project_backed",
              sourceSection: "completed_work",
              sourceIndex: 0,
            },
          ],
        },
      ]),
      { roleSnapshot: roleSnapshot(["docker"]), resume: resume(), sourceItems },
    );

    expect(result.rejections[0].reason).toBe("quote_not_verbatim");
    expect(result.assessments[0].found).toBe(false);
  });

  it("still grounds resume quotes normally alongside a completed_work section", () => {
    const sourceItems = reassessmentSourceItems();
    const result = validateEvidenceGrounding(
      output([
        {
          skillSlug: "testing",
          found: true,
          evidence: [
            {
              quote: SECOND_JOB_BULLET,
              strength: "experience_backed",
              sourceSection: "experience",
              sourceIndex: 1,
            },
          ],
        },
      ]),
      {
        roleSnapshot: roleSnapshot(["testing"]),
        resume: resume(),
        sourceItems,
      },
    );

    expect(result.rejections).toEqual([]);
    expect(result.assessments[0].found).toBe(true);
  });
});

describe("validateRoadmapGrounding", () => {
  const selectedSkillSlugs = ["testing", "docker"];

  it("accepts exactly one task per selected skill", () => {
    const tasks = [{ skillSlug: "testing" }, { skillSlug: "docker" }];
    expect(validateRoadmapGrounding(tasks, { selectedSkillSlugs })).toEqual(
      tasks,
    );
  });

  it("throws when the model writes a task for a skill it was not given", () => {
    // Choosing what to work on is the application's decision, not the model's.
    expect(() =>
      validateRoadmapGrounding(
        [
          { skillSlug: "testing" },
          { skillSlug: "docker" },
          { skillSlug: "kubernetes" },
        ],
        { selectedSkillSlugs },
      ),
    ).toThrow(AppError);
  });

  it("throws on two tasks for the same skill", () => {
    // Weeks are assigned per gap, so a duplicate would leave another gap with
    // no task and quietly lose a week.
    expect(() =>
      validateRoadmapGrounding(
        [{ skillSlug: "testing" }, { skillSlug: "testing" }],
        { selectedSkillSlugs },
      ),
    ).toThrow(AppError);
  });

  it("throws when a selected skill has no task", () => {
    expect(() =>
      validateRoadmapGrounding([{ skillSlug: "testing" }], {
        selectedSkillSlugs,
      }),
    ).toThrow(AppError);
  });

  it("throws when the AI marks a task as already complete", () => {
    expect(() =>
      validateRoadmapGrounding(
        [
          { skillSlug: "testing", completed: true },
          { skillSlug: "docker" },
        ],
        { selectedSkillSlugs },
      ),
    ).toThrow(AppError);
  });

  it("throws when the AI supplies a completion timestamp", () => {
    expect(() =>
      validateRoadmapGrounding(
        [
          { skillSlug: "testing", completedAt: "2026-01-01" },
          { skillSlug: "docker" },
        ],
        { selectedSkillSlugs },
      ),
    ).toThrow(AppError);
  });
});
