import { describe, expect, it } from "vitest";
import { mapAssessmentsToGaps } from "../../../src/modules/career-analysis/evidence-mapping.js";
import {
  GroundedSkillAssessment,
  RoleSnapshot,
} from "../../../src/modules/career-analysis/career-analysis.types.js";
import { SkillImportance } from "../../../src/generated/client/index.js";

function snapshot(
  skills: [slug: string, importance: SkillImportance][],
): RoleSnapshot {
  return {
    roleId: "role-1",
    slug: "backend-engineer",
    title: "Backend Engineer",
    description: "Builds server-side systems",
    seedVersion: "test.1",
    capturedAt: "2026-08-08T00:00:00.000Z",
    skills: skills.map(([slug, importance]) => ({
      skillId: `skill-${slug}`,
      slug,
      name: slug,
      aliases: [],
      importance,
      rationale: "because",
    })),
  };
}

function assessment(
  skillSlug: string,
  strengths: GroundedSkillAssessment["evidence"][number]["strength"][],
): GroundedSkillAssessment {
  return {
    skillSlug,
    found: strengths.length > 0,
    evidence: strengths.map((strength) => ({
      quote: `evidence for ${skillSlug}`,
      strength,
      sourceSection: "experience" as const,
      sourceIndex: 0,
      // Derived by the validator from the snapshot, never model-authored.
      sourceLabel: "Backend Intern — Acme Corp",
    })),
  };
}

describe("mapAssessmentsToGaps", () => {
  it("produces one gap per role requirement", () => {
    const result = mapAssessmentsToGaps(
      [assessment("docker", ["experience_backed"])],
      snapshot([
        ["docker", "critical"],
        ["testing", "important"],
      ]),
    );

    expect(result.gaps.map((g) => g.slug)).toEqual(["docker", "testing"]);
  });

  it("marks a skill the AI never mentioned as missing", () => {
    const result = mapAssessmentsToGaps(
      [],
      snapshot([["docker", "critical"]]),
    );

    expect(result.gaps[0].status).toBe("missing");
    expect(result.gaps[0].evidence).toEqual([]);
  });

  it("does not let an omitted skill inflate the readiness score", () => {
    // One strong skill out of two required. If the omitted skill vanished
    // instead of scoring 0, this would read 100 rather than 60.
    const result = mapAssessmentsToGaps(
      [assessment("docker", ["experience_backed"])],
      snapshot([
        ["docker", "critical"], // 1.0 * 3 = 3
        ["testing", "important"], // 0 * 2 = 0
      ]),
    );

    expect(result.readiness.possiblePoints).toBe(5);
    expect(result.readiness.earnedPoints).toBe(3);
    expect(result.readiness.score).toBe(60);
  });

  it("maps evidence strength through to gap status", () => {
    const result = mapAssessmentsToGaps(
      [
        assessment("a", ["experience_backed"]),
        assessment("b", ["project_backed"]),
        assessment("c", ["mentioned"]),
      ],
      snapshot([
        ["a", "critical"],
        ["b", "critical"],
        ["c", "critical"],
      ]),
    );

    expect(result.gaps.map((g) => g.status)).toEqual([
      "strong",
      "developing",
      "weak_evidence",
    ]);
  });

  it("treats an assessment stripped of all evidence as missing", () => {
    // What grounding leaves behind when every quote was hallucinated.
    const result = mapAssessmentsToGaps(
      [{ skillSlug: "docker", found: false, evidence: [] }],
      snapshot([["docker", "critical"]]),
    );

    expect(result.gaps[0].status).toBe("missing");
  });

  it("assigns priority from status and the role's own importance", () => {
    const result = mapAssessmentsToGaps(
      [],
      snapshot([
        ["critical-gap", "critical"],
        ["minor-gap", "nice_to_have"],
      ]),
    );

    const [critical, minor] = result.gaps;
    expect(critical.priority).toBeLessThan(minor.priority);
  });

  it("builds reasoning from the derived status and the seeded rationale", () => {
    const result = mapAssessmentsToGaps(
      [assessment("docker", ["experience_backed"])],
      snapshot([["docker", "critical"]]),
    );

    const reasoning = result.gaps[0].reasoning;
    // Assembled by the application, not quoted from the model: it must
    // reference the derived provenance and the hand-authored rationale.
    expect(reasoning).toContain("work experience");
    expect(reasoning).toContain("Backend Intern — Acme Corp");
    expect(reasoning).toContain("because");
  });

  it("explains a missing skill without inventing evidence for it", () => {
    const result = mapAssessmentsToGaps([], snapshot([["docker", "critical"]]));

    const reasoning = result.gaps[0].reasoning;
    expect(reasoning).toContain("No evidence");
    expect(reasoning).not.toContain("work experience");
  });

  it("ignores assessments for skills the role does not require", () => {
    // Grounding throws on these, but mapping must not depend on that.
    const result = mapAssessmentsToGaps(
      [
        assessment("docker", ["experience_backed"]),
        assessment("kubernetes", ["experience_backed"]),
      ],
      snapshot([["docker", "critical"]]),
    );

    expect(result.gaps).toHaveLength(1);
    expect(result.gaps[0].slug).toBe("docker");
  });
});
