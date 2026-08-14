import Link from "next/link";
import { BrandGlyph } from "@/src/components/brand/BrandGlyph";

interface LogoProps {
  href: string;
  size?: "sm" | "lg";
  showMark?: boolean;
  className?: string;
}

export function Logo({
  href,
  size = "sm",
  showMark = true,
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
        }`}
      >
        Resumate
      </span>
    </Link>
  );
}
