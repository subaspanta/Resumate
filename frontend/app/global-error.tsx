"use client";

import { useEffect } from "react";
import { logError } from "@/src/lib/log-error";

// Only triggers when the root layout itself throws, so it renders its own
// <html>/<body> and stays free of providers/fonts that could also fail.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logError(error, { boundary: "global" });
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center bg-white text-neutral-900">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm px-4">
          <h1 className="text-xl font-semibold tracking-tight">
            Something went wrong
          </h1>
          <p className="text-sm text-neutral-500">
            ResumeForge hit an unexpected error. Please try again.
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
