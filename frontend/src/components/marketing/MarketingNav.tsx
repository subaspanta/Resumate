"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/src/components/brand/Logo";
import { ThemeToggle } from "@/src/components/settings/ThemeToggle";

/** Condenses after scrolling via an observer, without per-frame scroll work. */
export function MarketingNav() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setCondensed(!entry.isIntersecting),
      { threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="h-px" />
      <header
        className={`marketing-nav${condensed ? " marketing-nav--condensed" : ""}`}
      >
        <div className="mx-auto flex w-full max-w-max-content items-center justify-between px-lg md:px-xl">
          <Logo href="/welcome" size="sm" hideWordmarkOnMobile />

          <nav className="flex items-center gap-3">
            <ThemeToggle compact />
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
            >
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">Get started</Link>
            </Button>
          </nav>
        </div>
      </header>
    </>
  );
}
