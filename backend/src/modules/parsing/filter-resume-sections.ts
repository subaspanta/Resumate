import { EnabledSections, StructuredResume } from "./parsing.types.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// `enabledSections` is untyped JSON from the DB — same trust level as
// structuredResume. Garbage or an unexpected shape is treated as "no prefs
// set" (show everything) rather than thrown, matching normalizeStructuredResume's
// coercive philosophy.
function parseEnabledSections(raw: unknown): EnabledSections {
  if (!isRecord(raw)) return {};
  const customSections = isRecord(raw.customSections)
    ? (raw.customSections as Record<string, boolean>)
    : {};
  return { ...raw, customSections } as EnabledSections;
}

// Applies stored section-visibility prefs to an already-merged/normalized
// resume. A missing key (including a customSections heading never seen in a
// previous PATCH) defaults to visible, same as a null enabledSections column.
// Never mutates the input.
export function filterVisibleSections(
  resume: StructuredResume,
  enabledSections: unknown,
): StructuredResume {
  const prefs = parseEnabledSections(enabledSections);

  return {
    ...resume,
    summary: prefs.summary === false ? null : resume.summary,
    experience: prefs.experience === false ? [] : resume.experience,
    projects: prefs.projects === false ? [] : resume.projects,
    education: prefs.education === false ? [] : resume.education,
    skills: prefs.skills === false ? [] : resume.skills,
    certifications: prefs.certifications === false ? [] : resume.certifications,
    customSections: resume.customSections.filter(
      (section) => prefs.customSections?.[section.heading] !== false,
    ),
  };
}
