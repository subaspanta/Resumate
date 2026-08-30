import { z } from "zod";

// Minimum quote length required for meaningful grounding.
export const MIN_GROUNDED_QUOTE_LENGTH = 12;

// Normalizes text so resume quotes can be compared reliably.
export function normalizeForGrounding(text: string): string {
  return (
    text
      // Normalize Unicode variants.
      .normalize("NFKC")
      // Normalize common punctuation variants.
      .replace(/[\u2010-\u2015\u2212]/g, "-")
      .replace(/[\u2018\u2019\u201b\u2032]/g, "'")
      .replace(/[\u201c\u201d\u2033]/g, '"')
      // Remove zero-width characters from PDF extraction.
      .replace(/[\u200b\u200c\u200d\ufeff]/g, "")
      .replace(/\s+/g, " ")
      // Remove decorative bullets and dashes.
      .replace(/^[\u2022\u25aa\u25e6*\-\s]+/, "")
      .replace(/[\u2022\u25aa\u25e6*\-\s]+$/, "")
      .toLowerCase()
      .trim()
  );
}

// Checks whether a quote exists in the normalized source text.
export function isQuoteGrounded(quote: string, sourceText: string): boolean {
  const needle = normalizeForGrounding(quote);

  if (needle.length < MIN_GROUNDED_QUOTE_LENGTH) return false;

  return sourceText.includes(needle);
}
