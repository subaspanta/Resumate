"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface AuthFooterPromptProps {
  promptText: string;
  linkText: string;
  href: string;
  variant?: "login" | "register";
  className?: string;
}

export function AuthFooterPrompt({
  promptText,
  linkText,
  href,
  variant = "login",
  className,
}: AuthFooterPromptProps) {
  return (
    <p
      className={cn(
        "auth-footer-prompt",
        `auth-footer-prompt--${variant}`,
        className,
      )}
    >
      {promptText}{" "}
      <Link className="auth-footer-prompt-link" href={href}>
        {linkText}
      </Link>
    </p>
  );
}
