// Mirrors the backend's normalizeStructuredResume: real array wins, legacy
// `description` becomes one bullet, otherwise nothing.
export function entryBullets(entry: {
  bullets?: string[];
  description?: string;
}): string[] {
  if (Array.isArray(entry.bullets)) return entry.bullets;
  return entry.description ? [entry.description] : [];
}
