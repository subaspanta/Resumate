// Cross-input validation for AI rewrites. Unlike agents/validator.ts (which checks
// a single AI output against its schema in isolation), this file compares a
// rewritten bullet AGAINST its original to catch hallucinated facts, drift, and
// runaway length. Imported only by rewrite.agent.ts.

export interface RewriteValidationResult {
  valid: boolean;
  reason?: string;
}

const STOPWORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "is",
  "was",
  "were",
  "be",
  "been",
]);

// Date-like tokens: 4-digit 19xx/20xx years, English month names, and "Present".
const DATE_PATTERN =
  /\b(?:19\d{2}|20\d{2}|jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|present)\b/gi;

// Two or more consecutive capitalized words — a common company-name shape.
const CAPITALIZED_SEQUENCE_PATTERN = /\b(?:[A-Z][a-zA-Z]+)(?:\s+[A-Z][a-zA-Z]+)+\b/g;

export function validateRewrite(
  original: string,
  rewrite: string,
): RewriteValidationResult {
  const lengthResult = checkLength(original, rewrite);
  if (!lengthResult.valid) return lengthResult;

  const dateResult = checkInventedDates(original, rewrite);
  if (!dateResult.valid) return dateResult;

  const companyResult = checkInventedCompanies(original, rewrite);
  if (!companyResult.valid) return companyResult;

  const overlapResult = checkSemanticOverlap(original, rewrite);
  if (!overlapResult.valid) return overlapResult;

  return { valid: true };
}

// Summary paragraphs tolerate more rewording than a bullet — a prose rewrite
// naturally pulls in more connective/stylistic words, so it needs a looser
// (and two-sided) length bound plus a lower overlap floor. Dates/companies
// are still hallucination risks either way, so those checks are reused as-is.
export function validateSummaryRewrite(
  original: string,
  rewrite: string,
): RewriteValidationResult {
  const lengthResult = checkSummaryLength(original, rewrite);
  if (!lengthResult.valid) return lengthResult;

  const dateResult = checkInventedDates(original, rewrite);
  if (!dateResult.valid) return dateResult;

  const companyResult = checkInventedCompanies(original, rewrite);
  if (!companyResult.valid) return companyResult;

  const overlapResult = checkSemanticOverlap(original, rewrite, 20);
  if (!overlapResult.valid) return overlapResult;

  return { valid: true };
}

function checkSummaryLength(
  original: string,
  rewrite: string,
): RewriteValidationResult {
  if (rewrite.length > original.length * 1.5) {
    return { valid: false, reason: "Rewrite exceeds 1.5x original length" };
  }
  if (rewrite.length < original.length * 0.5) {
    return {
      valid: false,
      reason: "Rewrite is under half the original length — likely dropped content",
    };
  }
  return { valid: true };
}

function checkLength(
  original: string,
  rewrite: string,
): RewriteValidationResult {
  if (rewrite.length > original.length * 2) {
    return { valid: false, reason: "Rewrite exceeds 2x original length" };
  }
  return { valid: true };
}

function checkInventedDates(
  original: string,
  rewrite: string,
): RewriteValidationResult {
  const originalDates = new Set(
    (original.match(DATE_PATTERN) ?? []).map((d) => d.toLowerCase()),
  );
  const rewriteDates = rewrite.match(DATE_PATTERN) ?? [];
  for (const date of rewriteDates) {
    if (!originalDates.has(date.toLowerCase())) {
      return {
        valid: false,
        reason: "Rewrite contains a date not present in the original",
      };
    }
  }
  return { valid: true };
}

function checkInventedCompanies(
  original: string,
  rewrite: string,
): RewriteValidationResult {
  const originalSequences = new Set(
    (original.match(CAPITALIZED_SEQUENCE_PATTERN) ?? []).map((s) =>
      s.toLowerCase(),
    ),
  );
  const rewriteSequences = rewrite.match(CAPITALIZED_SEQUENCE_PATTERN) ?? [];
  for (const seq of rewriteSequences) {
    if (!originalSequences.has(seq.toLowerCase())) {
      return {
        valid: false,
        reason: `Rewrite contains a possible invented company name: "${seq}"`,
      };
    }
  }
  return { valid: true };
}

function checkSemanticOverlap(
  original: string,
  rewrite: string,
  minOverlapPercent = 30,
): RewriteValidationResult {
  const originalWords = meaningfulWords(original);
  const rewriteWords = meaningfulWords(rewrite);

  if (originalWords.size === 0) {
    return { valid: true };
  }

  let shared = 0;
  for (const word of originalWords) {
    if (rewriteWords.has(word)) shared++;
  }
  const overlapPercent = (shared / originalWords.size) * 100;

  if (overlapPercent < minOverlapPercent) {
    return {
      valid: false,
      reason: `Rewrite shares less than ${minOverlapPercent}% of original's meaningful words — may have drifted from the original content`,
    };
  }
  return { valid: true };
}

function meaningfulWords(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/\s+/)
      .map((w) => w.replace(/[^a-z0-9]/g, ""))
      .filter((w) => w.length > 0 && !STOPWORDS.has(w)),
  );
}
