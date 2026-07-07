"use client";

import Link from "next/link";

interface AuthFooterPromptProps {
  promptText: string;
  linkText: string;
  href: string;
}

export function AuthFooterPrompt({
  promptText,
  linkText,
  href,
}: AuthFooterPromptProps) {
  return (
    <p className="mt-lg text-center font-body-md text-body-md text-text-body">
      {promptText}{" "}
      <Link
        className="text-primary font-bold hover:underline transition-all"
        href={href}
      >
        {linkText}
      </Link>
    </p>
  );
}
