import { describe, expect, it } from "vitest";
import { buildGapReasoning } from "./gap-reasoning.js";
import { GroundedEvidenceItem } from "./career-analysis.types.js";

function evidence(
  strength: GroundedEvidenceItem["strength"],
  sourceLabel: string,
): GroundedEvidenceItem {
  return {
    quote: "some grounded quote from the resume",
    strength,
    sourceSection: strength === "project_backed" ? "projects" : "experience",
    sourceIndex: 0,
    sourceLabel,
  };
}

const BASE = {
  skillName: "Docker",
  roleTitle: "Backend Engineer",
  rationale: "Reproducible environments are the normal deployment artifact.",
};

describe("buildGapReasoning", () => {
  it("explains a strong skill with its work-experience provenance", () => {
    const text = buildGapReasoning({
      ...BASE,
      status: "strong",
      importance: "critical",
      evidence: [evidence("experience_backed", "Backend Intern — Acme Corp")],
    });

    expect(text).toContain("demonstrated Docker");
    expect(text).toContain("work experience");
    expect(text).toContain("Backend Intern — Acme Corp");
    expect(text).toContain("core requirement for Backend Engineer");
  });

  it("distinguishes project evidence from professional experience", () => {
    const text = buildGapReasoning({
      ...BASE,
      status: "developing",
      importance: "important",
      evidence: [evidence("project_backed", "Task Tracker")],
    });

    expect(text).toContain("not yet in a professional setting");
    expect(text).toContain("in a project (Task Tracker)");
  });

  it("says a listed-only skill lacks supporting detail", () => {
    const text = buildGapReasoning({
      ...BASE,
      status: "weak_evidence",
      importance: "important",
      evidence: [evidence("mentioned", "Tools")],
    });

    expect(text).toContain("without describing what you did with it");
  });

  it("describes a missing skill without referencing evidence", () => {
    const text = buildGapReasoning({
      ...BASE,
      status: "missing",
      importance: "critical",
      evidence: [],
    });

    expect(text).toContain("No evidence of Docker");
    expect(text).not.toContain("Your resume shows");
    expect(text).toContain("would close this gap");
  });

  it("includes the hand-authored rationale verbatim in substance", () => {
    const text = buildGapReasoning({
      ...BASE,
      status: "missing",
      importance: "critical",
      evidence: [],
    });

    expect(text).toContain("eproducible environments are the normal deployment artifact");
  });

  it("phrases importance differently per tier", () => {
    const critical = buildGapReasoning({
      ...BASE,
      status: "missing",
      importance: "critical",
      evidence: [],
    });
    const nice = buildGapReasoning({
      ...BASE,
      status: "missing",
      importance: "nice_to_have",
      evidence: [],
    });

    expect(critical).toContain("core requirement");
    expect(nice).toContain("strengthens an application");
  });

  it("offers no next step for a skill already demonstrated", () => {
    const text = buildGapReasoning({
      ...BASE,
      status: "strong",
      importance: "critical",
      evidence: [evidence("experience_backed", "Acme Corp")],
    });

    expect(text).not.toContain("would close this gap");
    expect(text).not.toContain("would strengthen this");
  });

  it("cites the strongest evidence when several survive", () => {
    const text = buildGapReasoning({
      ...BASE,
      status: "strong",
      importance: "critical",
      evidence: [
        evidence("mentioned", "Tools"),
        evidence("experience_backed", "Backend Intern — Acme Corp"),
      ],
    });

    expect(text).toContain("Backend Intern — Acme Corp");
    expect(text).not.toContain("Tools");
  });

  it("preserves a rationale that opens with an acronym", () => {
    const text = buildGapReasoning({
      ...BASE,
      status: "missing",
      importance: "critical",
      rationale: "REST endpoints are the daily work of the role.",
      evidence: [],
    });

    expect(text).toContain("REST endpoints");
  });

  it("preserves a two-letter acronym opener", () => {
    const text = buildGapReasoning({
      ...BASE,
      status: "missing",
      importance: "critical",
      rationale: "CI pipelines are expected on every team.",
      evidence: [],
    });

    expect(text).toContain("CI pipelines");
    expect(text).not.toContain("cI pipelines");
  });

  it("lowercases an ordinary sentence whose second character is a space", () => {
    const text = buildGapReasoning({
      ...BASE,
      status: "missing",
      importance: "critical",
      rationale: "A working knowledge of the tool is expected.",
      evidence: [],
    });

    expect(text).toContain(": a working knowledge");
    expect(text).not.toContain(": A working knowledge");
  });

  it("lowercases a normal capitalised sentence", () => {
    const text = buildGapReasoning({
      ...BASE,
      status: "missing",
      importance: "critical",
      rationale: "Reproducible builds matter here.",
      evidence: [],
    });

    expect(text).toContain(": reproducible builds");
  });
});
