import { describe, expect, it, vi } from "vitest";
import {
  computeGapPriority,
  computeReadiness,
  deriveGapStatus,
  ScorableSkill,
} from "../../../src/modules/career-analysis/readiness.js";
import {
  GapStatus,
  SkillImportance,
} from "../../../src/generated/client/index.js";

function skill(
  slug: string,
  importance: SkillImportance,
  status: GapStatus,
): ScorableSkill {
  return { skillId: `id-${slug}`, slug, importance, status };
}

describe("deriveGapStatus", () => {
  it("returns missing when there is no surviving evidence", () => {
    expect(deriveGapStatus([])).toBe("missing");
  });

  it("maps work experience to strong", () => {
    expect(deriveGapStatus([{ strength: "experience_backed" }])).toBe("strong");
  });

  it("maps a project to developing", () => {
    expect(deriveGapStatus([{ strength: "project_backed" }])).toBe("developing");
  });

  it("maps a bare mention to weak evidence", () => {
    expect(deriveGapStatus([{ strength: "mentioned" }])).toBe("weak_evidence");
  });

  it("takes the strongest evidence when several exist", () => {
    expect(
      deriveGapStatus([
        { strength: "mentioned" },
        { strength: "experience_backed" },
        { strength: "project_backed" },
      ]),
    ).toBe("strong");
  });

  it("is unaffected by the order evidence arrives in", () => {
    expect(
      deriveGapStatus([
        { strength: "experience_backed" },
        { strength: "mentioned" },
      ]),
    ).toBe("strong");
  });
});

describe("computeGapPriority", () => {
  // The full 4x3 matrix, written out rather than generated: this table IS the
  // prioritization policy, so a change to it should be visible in the diff.
  const cases: [GapStatus, SkillImportance, number][] = [
    ["missing", "critical", 0],
    ["missing", "important", 1],
    ["missing", "nice_to_have", 2],
    ["weak_evidence", "critical", 10],
    ["weak_evidence", "important", 11],
    ["weak_evidence", "nice_to_have", 12],
    ["developing", "critical", 20],
    ["developing", "important", 21],
    ["developing", "nice_to_have", 22],
    ["strong", "critical", 30],
    ["strong", "important", 31],
    ["strong", "nice_to_have", 32],
  ];

  for (const [status, importance, expected] of cases) {
    it(`ranks ${status} + ${importance} at ${expected}`, () => {
      expect(computeGapPriority(status, importance)).toBe(expected);
    });
  }

  it("ranks any missing skill above any developing skill", () => {
    const worstMissing = computeGapPriority("missing", "nice_to_have");
    const bestDeveloping = computeGapPriority("developing", "critical");
    expect(worstMissing).toBeLessThan(bestDeveloping);
  });

  it("breaks ties within a status band by importance", () => {
    expect(computeGapPriority("weak_evidence", "critical")).toBeLessThan(
      computeGapPriority("weak_evidence", "important"),
    );
  });
});

describe("computeReadiness", () => {
  it("scores an all-strong candidate at exactly 100", () => {
    const result = computeReadiness([
      skill("react", "critical", "strong"),
      skill("testing", "important", "strong"),
      skill("docker", "nice_to_have", "strong"),
    ]);
    expect(result.score).toBe(100);
    expect(result.earnedPoints).toBe(result.possiblePoints);
  });

  it("scores a candidate with no evidence at 0", () => {
    const result = computeReadiness([
      skill("react", "critical", "missing"),
      skill("testing", "important", "missing"),
    ]);
    expect(result.score).toBe(0);
    expect(result.earnedPoints).toBe(0);
  });

  it("weights a missing critical skill more heavily than a missing nice-to-have", () => {
    const missingCritical = computeReadiness([
      skill("react", "critical", "missing"),
      skill("docker", "nice_to_have", "strong"),
    ]);
    const missingNiceToHave = computeReadiness([
      skill("react", "critical", "strong"),
      skill("docker", "nice_to_have", "missing"),
    ]);
    expect(missingCritical.score).toBeLessThan(missingNiceToHave.score);
  });

  it("applies the credit ladder across statuses", () => {
    // One critical skill (weight 3) at each status, so earned = credit * 3.
    const result = computeReadiness([
      skill("a", "critical", "strong"), // 1.0 * 3 = 3
      skill("b", "critical", "developing"), // 0.5 * 3 = 1.5
      skill("c", "critical", "weak_evidence"), // 0.25 * 3 = 0.75
      skill("d", "critical", "missing"), // 0 * 3 = 0
    ]);
    expect(result.earnedPoints).toBe(5.25);
    expect(result.possiblePoints).toBe(12);
    expect(result.score).toBe(44); // round(43.75)
  });

  it("returns 0 rather than dividing by zero when the role has no requirements", () => {
    const result = computeReadiness([]);
    expect(result.score).toBe(0);
    expect(result.possiblePoints).toBe(0);
    expect(result.skills).toEqual([]);
  });

  it("reports counts per status alongside the score", () => {
    const result = computeReadiness([
      skill("a", "critical", "strong"),
      skill("b", "important", "strong"),
      skill("c", "important", "developing"),
      skill("d", "nice_to_have", "missing"),
    ]);
    expect(result.countsByStatus).toEqual({
      strong: 2,
      developing: 1,
      weak_evidence: 0,
      missing: 1,
    });
  });

  it("exposes the per-skill arithmetic that produced the score", () => {
    const result = computeReadiness([skill("react", "critical", "developing")]);
    expect(result.skills).toEqual([
      {
        skillId: "id-react",
        slug: "react",
        importance: "critical",
        status: "developing",
        credit: 0.5,
        weight: 3,
        weighted: 1.5,
      },
    ]);
  });

  it("makes no network or database calls", () => {
    const spy = vi.spyOn(global, "fetch");
    computeReadiness([skill("react", "critical", "strong")]);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
