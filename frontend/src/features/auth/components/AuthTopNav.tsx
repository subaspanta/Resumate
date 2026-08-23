"use client";

import { Logo } from "@/src/components/brand/Logo";

export function AuthTopNav() {
  return (
    <header className="fixed top-0 w-full h-top-nav-height z-[var(--z-chrome)] flex items-center px-lg md:px-xl bg-surface border-b border-border-base">
      <div className="max-w-max-content w-full mx-auto flex items-center justify-between">
        <Logo href="/" size="sm" />
      </div>
    </header>
  );
}
