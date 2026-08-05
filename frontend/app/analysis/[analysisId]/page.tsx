"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { isApiError } from "@/src/api/api-error";
import {
  useApplySuggestion,
  useMergedResume,
  useRejectSuggestion,
  useRewriteSuggestions,
} from "@/src/features/analysis/analysis.hooks";
import { useRequireAnalysis } from "@/src/features/analysis/use-flow-guard";
import type { ParsedJob } from "@/src/features/analysis/types";
import type { StructuredResume } from "@/src/features/resume/types";
import { SuggestionsList } from "@/src/components/analysis/SuggestionsList";
import { ProgressBar } from "@/src/components/analysis/ProgressBar";
import { ExportButton } from "@/src/components/analysis/ExportButton";
import { ResumePreview } from "@/src/components/workspace/ResumePreview";
import { FlowRedirect } from "@/src/components/FlowRedirect";

export default function AnalysisPage({
  params,
}: {
  params: Promise<{ analysisId: string }>;
}) {
  const { analysisId } = use(params);

  const { analysis, isLoading, isError, isRedirecting } =
    useRequireAnalysis(analysisId);
  const applySuggestion = useApplySuggestion(analysisId);
  const rejectSuggestion = useRejectSuggestion(analysisId);
  const rewriteSuggestions = useRewriteSuggestions(analysisId);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [generatingKey, setGeneratingKey] = useState<string | null>(null);

  const parsedJob = analysis?.parsedJob as ParsedJob | undefined;
  const jobTitle = parsedJob?.title;
  const resumeSnapshot = analysis?.resumeSnapshot as
    | StructuredResume
    | undefined;

  const suggestions = useMemo(() => analysis?.suggestions ?? [], [analysis]);
  const reviewedCount = suggestions.filter(
    (s) => s.status !== "pending",
  ).length;
  const appliedCount = suggestions.filter((s) => s.status === "applied").length;

  // Once a suggestion's applied, the frozen resumeSnapshot no longer reflects
  // reality — switch the preview to the merged (snapshot + applied rewrites)
  // version instead.
  const { structuredResume: mergedResume } = useMergedResume(
    analysis?.resumeId ?? "",
    appliedCount > 0,
  );
  const previewResume = mergedResume ?? resumeSnapshot;

  const handleApply = (id: string) => {
    setMutatingId(id);
    applySuggestion.mutate(
      { suggestionId: id },
      { onSettled: () => setMutatingId(null) },
    );
  };

  const handleReject = (id: string) => {
    setMutatingId(id);
    rejectSuggestion.mutate(
      { suggestionId: id },
      { onSettled: () => setMutatingId(null) },
    );
  };

  const handleGenerateSuggestions = (input: {
    section: "bullet" | "project" | "summary";
    originalText: string;
    key: string;
  }) => {
    setGeneratingKey(input.key);
    rewriteSuggestions.mutate(
      {
        analysisId,
        section: input.section,
        originalBullet: input.originalText,
      },
      {
        onError: (error) => {
          if (isApiError(error) && error.code === "GEMINI_RATE_LIMITED") {
            toast.error("AI is busy right now. Please try again in a moment.");
            return;
          }
          toast.error("Failed to generate suggestions. Please try again.");
        },
        onSettled: () => setGeneratingKey(null),
      },
    );
  };

  if (isRedirecting) {
    return <FlowRedirect />;
  }

  if (isError) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-md">
        <p className="text-muted-foreground">Failed to load analysis.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-md py-2xl pb-32">
      <header className="mb-8 flex flex-col gap-4">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Dashboard
          </Link>
          <ChevronRight className="size-4" />
          <span className="text-foreground">Analysis</span>
        </nav>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {isLoading ? (
                <Skeleton className="h-8 w-64" />
              ) : (
                (jobTitle ?? "Resume Analysis")
              )}
            </h1>
            {parsedJob?.company && (
              <p className="text-sm text-muted-foreground">
                {parsedJob.company}
              </p>
            )}
          </div>

          {analysis && (
            <ExportButton
              resumeId={analysis.resumeId}
              variant="secondary"
              disabled={appliedCount === 0}
            />
          )}
        </div>
      </header>

      <div className="flex flex-col gap-8">
        <ResumePreview
          structuredResume={previewResume}
          isLoading={isLoading}
          skillsMatch={analysis?.skillsMatch}
          onGenerateSuggestions={handleGenerateSuggestions}
          generatingKey={generatingKey}
        />

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              AI Suggestions
            </h2>
            <p className="text-sm text-muted-foreground">
              Review suggestions and apply the ones that strengthen your resume.
            </p>
          </div>

          <SuggestionsList
            suggestions={suggestions}
            isLoading={isLoading}
            mutatingId={mutatingId}
            onApply={handleApply}
            onReject={handleReject}
          />
        </section>
      </div>

      {analysis && suggestions.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-md py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <ProgressBar
                reviewedCount={reviewedCount}
                totalCount={suggestions.length}
              />
            </div>
            <ExportButton
              resumeId={analysis.resumeId}
              variant="primary"
              disabled={appliedCount === 0}
            />
          </div>
        </div>
      )}
    </main>
  );
}
