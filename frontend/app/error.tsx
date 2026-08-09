"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logError } from "@/src/lib/log-error";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    logError(error, { boundary: "route" });
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas px-6">
      <div className="flex flex-col items-center gap-5 text-center max-w-[28rem]">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-danger/10">
          <CircleAlert className="size-7 text-danger" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold text-text-primary tracking-tight text-balance">
            Something went wrong
          </h1>
          <p className="text-sm text-text-muted leading-relaxed text-balance">
            An unexpected error occurred. Try again, or go back to where
            you were.
          </p>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <Button variant="outline" onClick={() => router.push("/")}>
            Go back
          </Button>
          <Button onClick={reset}>Try again</Button>
        </div>
      </div>
    </div>
  );
}
