"use client";

import Link from "next/link";

export function AuthTopNav() {
  return (
    <header className="fixed top-0 w-full h-top-nav-height z-50 flex items-center px-lg md:px-xl bg-surface border-b border-border-base">
      <div className="max-w-max-content w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-headline-lg text-headline-lg font-bold text-primary">
            Resumate
          </span>
        </Link>
      </div>
    </header>
  );
}
