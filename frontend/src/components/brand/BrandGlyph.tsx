interface BrandGlyphProps {
  size?: "sm" | "lg";
  className?: string;
}

/**
 * The "R" square, and nothing else — no link, no wordmark, no layout.
 *
 * Three places render this same markup for different reasons: Logo pairs it
 * with a wordmark inside a link, BrandMark wraps it in a perspective stage to
 * tilt it, and the auth splash stacks it above a spinner. Those callers can't
 * share a component (a splash has nowhere to navigate, and a nav lockup has no
 * use for tilt machinery), but they were all repeating the same three lines.
 * This owns the glyph itself; each caller keeps its own arrangement.
 *
 * Always aria-hidden: every caller pairs it with the "Resumate" wordmark or
 * its own aria-label, so announcing it too would read the brand twice.
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
