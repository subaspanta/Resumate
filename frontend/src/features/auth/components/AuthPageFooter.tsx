"use client";

import Link from "next/link";

export function AuthPageFooter() {
  return (
    <footer className="w-full py-xl px-lg md:px-xl flex flex-col md:flex-row justify-between items-center gap-md bg-canvas border-t border-border-base">
      <div className="font-label-std text-label-std text-text-primary font-medium">
        Resumate
      </div>
      <div className="flex gap-lg">
        <Link
          className="font-body-md text-body-md text-text-muted hover:text-primary transition-colors"
          href="#"
        >
          Privacy Policy
        </Link>
        <Link
          className="font-body-md text-body-md text-text-muted hover:text-primary transition-colors"
          href="#"
        >
          Terms of Service
        </Link>
        <Link
          className="font-body-md text-body-md text-text-muted hover:text-primary transition-colors"
          href="#"
        >
          Help Center
        </Link>
      </div>
      <div className="font-body-md text-body-md text-text-muted">
        © 2024 Resumate. Built for professional focus.
      </div>
    </footer>
  );
}
