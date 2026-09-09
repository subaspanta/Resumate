interface BrandGlyphProps {
  size?: "sm" | "lg";
  className?: string;
}

/** Shared decorative glyph; callers provide layout and accessible brand text. */
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
