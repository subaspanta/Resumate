// Single source for prompt numbering and grounding lookup order.
import { StructuredResume } from "../parsing/parsing.types.js";
import { normalizeForGrounding } from "../../utils/grounding-normalize.js";
import { SOURCE_SECTIONS, SourceSection } from "./career-analysis.types.js";

export type SourceItem = {
  // Text shown to the model.
  displayText: string;
  // Normalized text used for quote matching.
  normalizedText: string;
  // Backend-derived provenance label.
  label: string;
};

export type ResumeSourceItems = Record<SourceSection, SourceItem[]>;

function joinParts(parts: (string | null | undefined)[]): string {
  // Keep bullet boundaries from forming cross-bullet quote matches.
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
    // Summary is a single index-0 item.
    summary: resume.summary ? [item(resume.summary, "Summary")] : [],

    experience: (resume.experience ?? []).map((entry) => {
      const header = [entry.title, entry.company].filter(Boolean).join(" — ");
      const dates = [entry.startDate, entry.endDate]
        .filter(Boolean)
        .join(" to ");
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

    // Populated only for reassessment.
    completed_work: [],
  };
}

export type CompletedWorkItem = {
  // Provenance label, from the roadmap task's skill gap.
  skillName: string;
  // User-written; the only groundable text a reassessment introduces.
  completionNote: string;
};

// Reassessment preserves original indices and adds only user-written notes.
// AI-authored task text remains prompt context, never quoteable evidence.
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
