import { StructuredResume } from "./parsing.types.js";
import { logger } from "../../config/logger.js";

// `structuredResume` / `resumeSnapshot` are Json columns. Prisma neither
// validates their contents nor migrates them when the TS type changes, so
// `StructuredResume` is a promise the database does not keep — a row written
// by an older build (or a hand-inserted fixture) deserializes into a value the
// compiler believes is well-formed but isn't. Reading `entry.bullets` on such a
// row throws instead of degrading, which is why every read of stored resume
// JSON goes through here first.
//
// Deliberately total and coercive: unlike structuredResumeSchema in
// modules/ai/ai.types.ts — which is strict on purpose so bad *Gemini* output is
// rejected loudly — this handles data already persisted, where the only useful
// behavior is to salvage what's there and default the rest.

// Pre-`bullets` rows stored one string per entry instead of an array. Read-only
// legacy tolerance; nothing writes this shape anymore.
type LegacyEntry = { bullets?: unknown; description?: unknown };

// Coercions are recorded as short tags rather than logged inline, so one bad
// row produces a single warning instead of one per field. Tags name the defect
// only — never the offending value, which is a real person's contact details
// and employment history and must not reach the logs.
type Repairs = string[];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toArray(value: unknown, field: string, repairs: Repairs): unknown[] {
  if (Array.isArray(value)) return value;
  // Absent is the normal shape for an optional section; only a present-but-wrong
  // type indicates corruption worth reporting.
  if (value !== undefined && value !== null) {
    repairs.push(`${field}:not-an-array`);
  }
  return [];
}

function toStrings(value: unknown, field: string, repairs: Repairs): string[] {
  const items = toArray(value, field, repairs);
  const strings = items.filter(
    (item): item is string => typeof item === "string",
  );
  if (strings.length !== items.length) {
    repairs.push(
      `${field}:${items.length - strings.length}-non-string-dropped`,
    );
  }
  return strings;
}

// Resolution order: a real `bullets` array wins; otherwise a legacy
// `description` becomes a single bullet, kept whole rather than split on
// sentences or newlines — splitting is a guess, and a wrong guess is
// unrecoverable once written back.
function toBullets(
  entry: LegacyEntry,
  field: string,
  repairs: Repairs,
): string[] {
  if (Array.isArray(entry.bullets))
    return toStrings(entry.bullets, field, repairs);
  if (typeof entry.description === "string" && entry.description.trim()) {
    repairs.push(`${field}:legacy-description`);
    return [entry.description];
  }
  // Distinct tag from the section-level `:not-an-array` so a malformed bullets
  // field is never confused with a malformed experience/projects array.
  if (entry.bullets !== undefined && entry.bullets !== null) {
    repairs.push(`${field}:bullets-not-an-array`);
  }
  return [];
}

export function normalizeStructuredResume(
  raw: unknown,
  // Identifies the offending row in the warning. Optional so the function stays
  // callable from tests and any future non-DB path.
  context?: { resumeId?: string; source?: string },
): StructuredResume {
  const repairs: Repairs = [];
  const source = isRecord(raw) ? raw : {};
  if (!isRecord(raw) && raw !== undefined && raw !== null) {
    repairs.push(`root:${Array.isArray(raw) ? "array" : typeof raw}`);
  }

  const experience = toArray(source.experience, "experience", repairs)
    .filter(isRecord)
    .map((entry, i) => {
      // Drop `description` rather than spreading it through: its text now lives
      // in `bullets`, and emitting both would ship the same content twice in a
      // response whose type has no such field.
      const { description: _legacy, ...rest } = entry;
      return {
        ...rest,
        title: typeof entry.title === "string" ? entry.title : "",
        bullets: toBullets(entry, `experience[${i}].bullets`, repairs),
      };
    }) as StructuredResume["experience"];

  const projects = toArray(source.projects, "projects", repairs)
    .filter(isRecord)
    .map((entry, i) => {
      const { description: _legacy, ...rest } = entry;
      return {
        ...rest,
        name: typeof entry.name === "string" ? entry.name : "",
        bullets: toBullets(entry, `projects[${i}].bullets`, repairs),
      };
    }) as StructuredResume["projects"];

  const education = toArray(source.education, "education", repairs).filter(
    isRecord,
  ) as StructuredResume["education"];

  const skills = toStrings(source.skills, "skills", repairs);

  // Warn once per row, after every field has had its say.
  if (repairs.length > 0) {
    logger.warn("Repaired malformed stored resume JSON", {
      resumeId: context?.resumeId ?? "unknown",
      source: context?.source ?? "unknown",
      repairs,
    });
  }

  return {
    ...source,
    experience,
    education,
    skills,
    projects,
  };
}
