import { FileQuestion } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas px-6">
      <div className="flex flex-col items-center gap-5 text-center max-w-[28rem]">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-surface-container-low">
          <FileQuestion
            className="size-7 text-text-muted"
            aria-hidden="true"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold text-text-primary tracking-tight text-balance">
            Page not found
          </h1>
          <p className="text-sm text-text-muted leading-relaxed text-balance">
            This page doesn&apos;t exist, or the resume, analysis, or
            roadmap it pointed to may have been deleted.
          </p>
        </div>
        <Button asChild className="mt-1">
          <Link href="/">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
