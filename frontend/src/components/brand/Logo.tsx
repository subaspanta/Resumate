import Link from "next/link";
import { BrandGlyph } from "@/src/components/brand/BrandGlyph";

interface LogoProps {
  href: string;
  size?: "sm" | "lg";
  showMark?: boolean;
  /** Hide the wordmark below sm for tight navigation bars. */
  hideWordmarkOnMobile?: boolean;
  className?: string;
}

export function Logo({
  href,
  size = "sm",
  showMark = true,
  hideWordmarkOnMobile = false,
  className = "",
}: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="Resumate home"
      className={`brand-lockup ${className}`}
    >
      {showMark && <BrandGlyph size={size} />}
      <span
        className={`brand-wordmark ${
          size === "sm" ? "brand-wordmark--sm" : ""
        } ${hideWordmarkOnMobile ? "hidden sm:inline" : ""}`}
      >
        Resumate
      </span>
    </Link>
  );
}
