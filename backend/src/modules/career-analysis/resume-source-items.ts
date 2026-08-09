// The one place a resume snapshot is flattened into addressable entries.
//
// Both sides of the evidence seam read from this and nothing else:
//
//   resumeSnapshot
//        ↓
//   buildSourceItems()
//        ↓
//   ├── the numbered prompt the model cites by index
//   └── the grounding validator that resolves those indices
//
// They must agree on ordering, or provenance points at the wrong job while
// still looking verified. Two independent traversals cannot be kept in step by
// discipline alone — one function, consumed twice, makes divergence impossible
// rather than merely unlikely.
//
// Pure module: no Prisma, no Express, no AI.
import { StructuredResume } from "../parsing/parsing.types.js";
import { normalizeForGrounding } from "../../utils/grounding-normalize.js";
import { SOURCE_SECTIONS, SourceSection } from "./career-analysis.types.js";

export type SourceItem = {
  // Original text, shown to the model in the prompt.
  displayText: string;
  // Same text folded for comparison — what a quote must appear in.
  normalizedText: string;
  // Provenance shown to the user. Derived here; never model-authored.
  label: string;
};

export type ResumeSourceItems = Record<SourceSection, SourceItem[]>;

function joinParts(parts: (string | null | undefined)[]): string {
  // Joined with "\n" (which normalizes to a space) rather than "" so the end
  // of one bullet and the start of the next can't form a phantom substring
  // that grounds a quote spanning two unrelated bullets.
  return parts.filter((p): p is string => Boolean(p)).join("\n");
}

function item(displayText: string, label: string): SourceItem {
  return {
    displayText,
    normalizedText: normalizeForGrounding(displayText),
    label,
  };
}

export function buildSourceItems(resume: StructuredResume): ResumeSourceItems {
  return {
    // A single string, so it is always index 0 — the one section where the
    // index carries no choice.
    summary: resume.summary ? [item(resume.summary, "Summary")] : [],

    experience: (resume.experience ?? []).map((entry) => {
      const header = [entry.title, entry.company].filter(Boolean).join(" — ");
      const dates = [entry.startDate, entry.endDate].filter(Boolean).join(" to ");
      return item(
        joinParts([
          header + (dates ? ` (${dates})` : ""),
          entry.location,
          ...(entry.bullets ?? []),
        ]),
        header || "Experience",
      );
    }),

    projects: (resume.projects ?? []).map((project) =>
      item(
        joinParts([project.name, ...(project.bullets ?? [])]),
        project.name || "Project",
      ),
    ),

    skills: (resume.skills ?? []).map((group) =>
      item(
        `${group.category ?? "Other"}: ${group.items.join(", ")}`,
        group.category ?? "Skills",
      ),
    ),

    education: (resume.education ?? []).map((entry) =>
      item(
        joinParts([entry.degree, entry.institution, entry.year]),
        [entry.degree, entry.institution].filter(Boolean).join(", ") ||
          "Education",
      ),
    ),

    certifications: (resume.certifications ?? []).map((cert) =>
      item(joinParts([cert.name, cert.issuer]), cert.name || "Certification"),
    ),

    // Always empty on a first-pass analysis. Populated only by
    // buildReassessmentSourceItems below.
    completed_work: [],
  };
}

export type CompletedWorkItem = {
  // Provenance label, from the roadmap task's skill gap.
  skillName: string;
  // User-written; the only groundable text a reassessment introduces.
  completionNote: string;
};

// Reassessment's source items: the frozen resume PLUS what the user wrote
// about the work they completed.
//
// Why this composes buildSourceItems() instead of running its own traversal:
// the resume sections must keep byte-identical indices between the original
// analysis and every reassessment, or a quote grounded at experience[2] could
// resolve to a different job. Layering one extra section on top of the exact
// same call is the only way to guarantee that.
//
// Why the AI-authored projectTask/expectedEvidence never appear here: a quote
// grounded against them would be the model quoting the model. The roadmap
// agent writes "Deploy a containerized service"; the evidence agent would
// then be able to quote that same sentence back as proof; readiness would
// rise on text no human ever wrote. Task text is fed to the evidence agent as
// PROMPT CONTEXT (see evidence.agent.ts) so it knows what a note is
// describing — but only the note itself is a quotable source.
export function buildReassessmentSourceItems(
  resume: StructuredResume,
  completedWork: CompletedWorkItem[],
): ResumeSourceItems {
  return {
    ...buildSourceItems(resume),
    completed_work: completedWork.map((work) =>
      item(work.completionNote, work.skillName),
    ),
  };
}

// Renders the sections as the model sees them: each entry prefixed with the
// index it must cite. Empty sections are omitted entirely rather than shown as
// headings with no entries, so the model is never invited to cite one.
export function renderSourceItemsForPrompt(
  sourceItems: ResumeSourceItems,
): string {
  const headings: Record<SourceSection, string> = {
    summary: "Summary",
    experience: "Experience",
    projects: "Projects",
    skills: "Skills",
    education: "Education",
    certifications: "Certifications",
    completed_work: "Completed roadmap work",
  };

  return SOURCE_SECTIONS.filter((section) => sourceItems[section].length > 0)
    .map((section) => {
      const entries = sourceItems[section]
        .map((entry, index) => `[${index}] ${entry.displayText}`)
        .join("\n\n");
      return `## ${headings[section]}\n${entries}`;
    })
    .join("\n\n");
}
