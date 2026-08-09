import { describe, expect, it } from "vitest";
import {
  buildSourceItems,
  renderSourceItemsForPrompt,
} from "../../../src/modules/career-analysis/resume-source-items.js";
import { SOURCE_SECTIONS, SourceSection } from "../../../src/modules/career-analysis/career-analysis.types.js";
import { StructuredResume } from "../../../src/modules/parsing/parsing.types.js";
import { normalizeForGrounding } from "../../../src/utils/grounding-normalize.js";

const REAL_BULLET =
  "Containerized the payment service using Docker and deployed it to staging";
const SECOND_JOB_BULLET =
  "Wrote integration tests covering the checkout flow end to end";
const REAL_PROJECT_BULLET =
  "Built a task tracker with React and persisted state to PostgreSQL";

// Two experience entries on purpose: with only one, every index is 0 and a
// consumer that ignored the index entirely would still look correct.
function resume(): StructuredResume {
  return {
    name: "Test Candidate",
    summary: "Final-year computer science student focused on web development",
    experience: [
      { title: "Backend Intern", company: "Acme Corp", bullets: [REAL_BULLET] },
      {
        title: "Junior Developer",
        company: "Globex",
        bullets: [SECOND_JOB_BULLET],
      },
    ],
    projects: [{ name: "Task Tracker", bullets: [REAL_PROJECT_BULLET] }],
    education: [{ degree: "BSc CSIT", institution: "Example University" }],
    skills: [{ category: "Languages", items: ["TypeScript", "Kubernetes"] }],
    certifications: [{ name: "AWS Cloud Practitioner", issuer: "Amazon" }],
    customSections: [],
  };
}

describe("buildSourceItems", () => {
  it("keeps each entry separately addressable by index", () => {
    const sourceItems = buildSourceItems(resume());

    expect(sourceItems.experience).toHaveLength(2);
    expect(sourceItems.experience[0].normalizedText).toContain("containerized");
    expect(sourceItems.experience[1].normalizedText).toContain(
      "integration tests",
    );
    // Entry 0's text must not leak into entry 1 — that separation is what
    // makes a cited index verifiable.
    expect(sourceItems.experience[0].normalizedText).not.toContain(
      "integration tests",
    );
  });

  it("derives a display label for each entry from the snapshot", () => {
    const sourceItems = buildSourceItems(resume());

    expect(sourceItems.experience[0].label).toBe("Backend Intern — Acme Corp");
    expect(sourceItems.experience[1].label).toBe("Junior Developer — Globex");
    expect(sourceItems.projects[0].label).toBe("Task Tracker");
  });

  it("treats the summary as a single entry at index 0", () => {
    const sourceItems = buildSourceItems(resume());
    expect(sourceItems.summary).toHaveLength(1);
    expect(sourceItems.summary[0].label).toBe("Summary");
  });

  it("produces no entries for a section the resume omits", () => {
    const sourceItems = buildSourceItems({ ...resume(), projects: [] });
    expect(sourceItems.projects).toEqual([]);
  });

  it("returns every supported section even when the resume is empty", () => {
    const sourceItems = buildSourceItems({
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      customSections: [],
    });

    for (const section of SOURCE_SECTIONS) {
      expect(sourceItems[section]).toEqual([]);
    }
  });

  it("does not let adjacent bullets form a phantom substring", () => {
    const sourceItems = buildSourceItems({
      ...resume(),
      experience: [
        {
          title: "Dev",
          company: "A",
          bullets: ["Built the alpha", "Beta shipped"],
        },
      ],
    });
    // "alphabeta" spans two separate bullets and must not ground.
    expect(sourceItems.experience[0].normalizedText).not.toContain("alphabeta");
  });

  it("normalizes each entry's text from its own display text", () => {
    const sourceItems = buildSourceItems(resume());
    for (const section of SOURCE_SECTIONS) {
      for (const entry of sourceItems[section]) {
        expect(entry.normalizedText).toBe(
          normalizeForGrounding(entry.displayText),
        );
      }
    }
  });
});

// The alignment guarantee: the [n] the model reads in the prompt and the
// sourceItems[section][n] the validator resolves must be the same entry. They
// come from one traversal, and these tests prove the two views agree rather
// than trusting that they do.
describe("prompt numbering aligns with source indexing", () => {
  function parsePromptSections(
    prompt: string,
  ): Record<string, { index: number; text: string }[]> {
    const parsed: Record<string, { index: number; text: string }[]> = {};
    let current: string | null = null;

    for (const block of prompt.split("\n\n")) {
      const heading = block.match(/^## (.+)$/m);
      if (heading) {
        current = heading[1].toLowerCase();
        parsed[current] ??= [];
        const rest = block.slice(block.indexOf("\n") + 1);
        const entry = rest.match(/^\[(\d+)\] ([\s\S]*)$/);
        if (entry) {
          parsed[current].push({ index: Number(entry[1]), text: entry[2] });
        }
        continue;
      }
      const entry = block.match(/^\[(\d+)\] ([\s\S]*)$/);
      if (entry && current) {
        parsed[current].push({ index: Number(entry[1]), text: entry[2] });
      }
    }
    return parsed;
  }

  it("numbers every entry of every populated section from zero", () => {
    const sourceItems = buildSourceItems(resume());
    const rendered = parsePromptSections(
      renderSourceItemsForPrompt(sourceItems),
    );

    for (const section of SOURCE_SECTIONS) {
      const expected = sourceItems[section];
      if (expected.length === 0) continue;

      const actual = rendered[section];
      expect(actual, `section "${section}" missing from prompt`).toBeDefined();
      expect(actual).toHaveLength(expected.length);
      expect(actual.map((e) => e.index)).toEqual(
        expected.map((_, i) => i),
      );
    }
  });

  it("puts the same text at index n in the prompt as at index n in the items", () => {
    const sourceItems = buildSourceItems(resume());
    const rendered = parsePromptSections(
      renderSourceItemsForPrompt(sourceItems),
    );

    for (const section of SOURCE_SECTIONS) {
      for (const [index, entry] of sourceItems[section].entries()) {
        const promptEntry = rendered[section][index];
        // What the model reads at [n] must normalize to what the validator
        // will search at [n]. Anything else means a cited index resolves to a
        // different entry than the one the model actually quoted.
        expect(
          normalizeForGrounding(promptEntry.text),
          `${section}[${index}] diverged`,
        ).toBe(entry.normalizedText);
      }
    }
  });

  it("stays aligned when an optional section is empty", () => {
    // An omitted section must not shift the numbering of the sections that
    // follow it — each section is indexed independently.
    const sourceItems = buildSourceItems({ ...resume(), projects: [] });
    const prompt = renderSourceItemsForPrompt(sourceItems);
    const rendered = parsePromptSections(prompt);

    expect(prompt).not.toContain("## Projects");
    expect(rendered.experience.map((e) => e.index)).toEqual([0, 1]);
    expect(
      normalizeForGrounding(rendered.experience[1].text),
    ).toBe(sourceItems.experience[1].normalizedText);
  });

  it("stays aligned when only one section has any content", () => {
    const sourceItems = buildSourceItems({
      experience: [],
      education: [],
      skills: [{ category: "Languages", items: ["TypeScript"] }],
      projects: [],
      certifications: [],
      customSections: [],
    });
    const rendered = parsePromptSections(
      renderSourceItemsForPrompt(sourceItems),
    );

    expect(Object.keys(rendered)).toEqual(["skills"]);
    expect(rendered.skills[0].index).toBe(0);
    expect(normalizeForGrounding(rendered.skills[0].text)).toBe(
      sourceItems.skills[0].normalizedText,
    );
  });

  it("renders nothing for a resume with no quotable content", () => {
    const prompt = renderSourceItemsForPrompt(
      buildSourceItems({
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        customSections: [],
      }),
    );
    expect(prompt).toBe("");
  });

  it("covers every section the evidence schema allows a model to cite", () => {
    // If a new SourceSection is added to the enum but not to buildSourceItems,
    // the model could cite a section that never resolves. This catches that.
    const sourceItems = buildSourceItems(resume());
    const built = Object.keys(sourceItems).sort();
    expect(built).toEqual([...SOURCE_SECTIONS].sort() as SourceSection[]);
  });
});
