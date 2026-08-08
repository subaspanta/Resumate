// Text folding shared by everything that compares AI-quoted text against a
// resume. Lives on its own so both the source-item builder and the grounding
// validator can use it without an import cycle.
//
// Unicode is written as \u escapes on purpose: the raw characters are
// invisible in a diff and are trivially stripped in transit, which would
// silently turn the normalization tests into tautologies.

// Below this, a "quote" is a fragment that grounds against almost any resume
// ("API", "React") and proves nothing. Rejecting them stops the model from
// satisfying the grounding check with content-free snippets.
export const MIN_GROUNDED_QUOTE_LENGTH = 12;

// Folds away the encoding noise that PDF extraction and model tokenization
// introduce, so "verbatim" means "the same words", not "the same bytes".
//
// Applied identically to both haystack and needle. Anything this does NOT
// erase — different words, different numbers, different order — still fails
// the check, which is the property that actually matters.
export function normalizeForGrounding(text: string): string {
  return (
    text
      // NFKC folds ligatures, fullwidth forms, and non-breaking / thin spaces
      // into ordinary characters.
      .normalize("NFKC")
      // PDFs emit en/em/figure dashes where the model writes a hyphen.
      .replace(/[\u2010-\u2015\u2212]/g, "-")
      .replace(/[\u2018\u2019\u201b\u2032]/g, "'")
      .replace(/[\u201c\u201d\u2033]/g, '"')
      // Zero-width characters some PDF encoders scatter through words.
      .replace(/[\u200b\u200c\u200d\ufeff]/g, "")
      .replace(/\s+/g, " ")
      // Bullet glyphs and leading dashes are layout, not content.
      .replace(/^[\u2022\u25aa\u25e6*\-\s]+/, "")
      .replace(/[\u2022\u25aa\u25e6*\-\s]+$/, "")
      .toLowerCase()
      .trim()
  );
}

// Whether a quote appears in one already-normalized source text.
export function isQuoteGrounded(quote: string, sourceText: string): boolean {
  const needle = normalizeForGrounding(quote);
  if (needle.length < MIN_GROUNDED_QUOTE_LENGTH) return false;
  return sourceText.includes(needle);
}
