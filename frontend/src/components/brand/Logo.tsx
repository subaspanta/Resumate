import Link from "next/link";

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
      {showMark && (
        <span
          className={`brand-mark ${size === "lg" ? "brand-mark--lg" : ""}`}
          aria-hidden="true"
        >
          R
        </span>
      )}
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
