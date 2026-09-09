import { SkillGroup, StructuredResume } from "./parsing.types.js";
import { Logger } from "../../config/logger.js";

// Coerce persisted JSON defensively; database JSON is not schema-validated.

// Legacy entries may store description instead of bullets.
type LegacyEntry = { bullets?: unknown; description?: unknown };

// Record repair tags, never resume values, in logs.
type Repairs = string[];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toArray(value: unknown, field: string, repairs: Repairs): unknown[] {
  if (Array.isArray(value)) return value;
  // Missing optional sections are valid; present wrong types are repairs.
  if (value !== undefined && value !== null) {
    repairs.push(`${field}:not-an-array`);
  }
  return [];
}

function toNullableString(
  value: unknown,
  field: string,
  repairs: Repairs,
): string | null {
  if (typeof value === "string") return value;
  // Missing optional fields are valid; present wrong types are repairs.
  if (value !== undefined && value !== null) {
    repairs.push(`${field}:not-a-string`);
  }
  return null;
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

// Prefer bullets; otherwise preserve legacy description as one bullet.
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
  // Keep malformed bullets distinct from malformed sections in repair tags.
  if (entry.bullets !== undefined && entry.bullets !== null) {
    repairs.push(`${field}:bullets-not-an-array`);
  }
  return [];
}

// Wrap legacy flat skills as one uncategorized group without rewriting data.
function normalizeSkills(value: unknown, repairs: Repairs): SkillGroup[] {
  if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
    if (value.length === 0) return [];
    repairs.push("skills:legacy-flat-array");
    return [{ category: null, items: value }];
  }

  const items = toArray(value, "skills", repairs);
  const groups: SkillGroup[] = [];
  let dropped = 0;
  for (const entry of items) {
    if (!isRecord(entry)) {
      dropped++;
      continue;
    }
    const category = typeof entry.category === "string" ? entry.category : null;
    groups.push({
      category,
      items: toStrings(entry.items, "skills[].items", repairs),
    });
  }
  if (dropped > 0) {
    repairs.push(`skills:${dropped}-non-group-dropped`);
  }
  return groups;
}

export function normalizeStructuredResume(
  raw: unknown,
  // Identifies the offending row in the warning. Optional so the function stays
  // callable from tests and any future non-DB path.
  context?: { resumeId?: string; source?: string },
  logger?: Logger,
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

  const skills = normalizeSkills(source.skills, repairs);

  const certifications = toArray(
    source.certifications,
    "certifications",
    repairs,
  )
    .filter(isRecord)
    .map((entry, i) => ({
      name: typeof entry.name === "string" ? entry.name : "",
      issuer: toNullableString(
        entry.issuer,
        `certifications[${i}].issuer`,
        repairs,
      ),
      issueDate: toNullableString(
        entry.issueDate,
        `certifications[${i}].issueDate`,
        repairs,
      ),
      expiryDate: toNullableString(
        entry.expiryDate,
        `certifications[${i}].expiryDate`,
        repairs,
      ),
      credentialId: toNullableString(
        entry.credentialId,
        `certifications[${i}].credentialId`,
        repairs,
      ),
      credentialUrl: toNullableString(
        entry.credentialUrl,
        `certifications[${i}].credentialUrl`,
        repairs,
      ),
    })) as StructuredResume["certifications"];

  const customSections = toArray(
    source.customSections,
    "customSections",
    repairs,
  )
    .filter(isRecord)
    .map((entry, i) => ({
      heading: typeof entry.heading === "string" ? entry.heading : "",
      bullets: toStrings(
        entry.bullets,
        `customSections[${i}].bullets`,
        repairs,
      ),
    })) as StructuredResume["customSections"];

  // Warn once per row, after every field has had its say.
  if (repairs.length > 0 && logger) {
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
    certifications,
    customSections,
  };
}
