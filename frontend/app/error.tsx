"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { logError } from "@/src/lib/log-error";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logError(error, { boundary: "route" });
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas px-4">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-surface border border-border-base">
          <span className="material-symbols-outlined text-danger text-[32px]">
            error
          </span>
        </div>
        <h1 className="text-xl font-semibold text-primary tracking-tight">
          Something went wrong
        </h1>
        <p className="text-sm text-text-muted">
          An unexpected error occurred. You can try again, or reload the
          page if the problem persists.
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
