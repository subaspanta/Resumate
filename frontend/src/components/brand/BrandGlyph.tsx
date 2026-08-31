interface BrandGlyphProps {
  size?: "sm" | "lg";
  className?: string;
}

/**
 * The "R" square glyph only — no link, no wordmark, no layout.
 *
 * Shared across Logo (with wordmark + link), BrandMark (with tilt stage),
 * and auth splash (with spinner). Each caller adds its own wrapper/layout.
 *
 * aria-hidden: callers already provide "Resumate" wordmark or aria-label,
 * so reading this would duplicate the brand name.
 */
export function BrandGlyph({ size = "sm", className = "" }: BrandGlyphProps) {
  return (
    <span
      className={["brand-mark", size === "lg" && "brand-mark--lg", className]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      R
    </span>
  );
}
