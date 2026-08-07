"use client";

import { use, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMergedResume } from "@/src/features/analysis/analysis.hooks";
import { useRequireAnalysis } from "@/src/features/analysis/use-flow-guard";
import { useReviewHistory } from "@/src/components/analysis/use-review-history";
import { useGenerateSuggestions } from "@/src/components/analysis/use-generate-suggestions";
import { useDocumentViewer } from "@/src/components/workspace/use-document-viewer";
import type { ParsedJob, Suggestion } from "@/src/features/analysis/types";
import type { StructuredResume } from "@/src/features/resume/types";
import { ProgressBar } from "@/src/components/analysis/ProgressBar";
import { ExportButton } from "@/src/components/analysis/ExportButton";
import { AnalysisScoreStrip } from "@/src/components/analysis/AnalysisScoreStrip";
import { AnalysisRail } from "@/src/components/analysis/AnalysisRail";
import { ResumeReviewPreview } from "@/src/components/workspace/ResumeReviewPreview";
import { ResumeReviewToolbar } from "@/src/components/workspace/ResumeReviewToolbar";
import { FlowRedirect } from "@/src/components/FlowRedirect";
import { AppShell } from "@/src/components/layout/AppShell";
import type { FlowStepKey } from "@/src/components/layout/flow-steps";

// Fixed for this route — hoisted so AppShell doesn't see a new array every
// render (rendering-hoist-jsx / rerender-memo-with-default-value).
const CRUMBS = [{ label: "Dashboard", href: "/" }, { label: "Review" }];

export default function AnalysisPage({
  params,
}: {
  params: Promise<{ analysisId: string }>;
}) {
  const { analysisId } = use(params);
  const router = useRouter();

  const { analysis, isLoading, isError, isRedirecting } =
    useRequireAnalysis(analysisId);
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  const parsedJob = analysis?.parsedJob as ParsedJob | undefined;
  // The JD parser sometimes returns a literal placeholder ("Not specified",
  // "N/A") when the pasted text has no clear title — treat those the same
  // as a missing title rather than showing the model's placeholder verbatim.
  const jobTitle =
    parsedJob?.title && !/^(not specified|n\/?a)$/i.test(parsedJob.title.trim())
      ? parsedJob.title
      : undefined;
  const resumeSnapshot = analysis?.resumeSnapshot as
    | StructuredResume
    | undefined;

  // Keyed on suggestions, not the whole analysis — a score refetch or any
  // other field changing would otherwise mint a new array identity and
  // cascade into pendingSuggestions and the preview below.
  const suggestions = useMemo(
    () => analysis?.suggestions ?? [],
    [analysis?.suggestions],
  );

  // One pass for all three derived values. pendingSuggestions is passed down
  // to ResumeReviewPreview, so it needs a stable identity; the two counts ride
  // along rather than walking the list twice more.
  const { reviewedCount, appliedCount, pendingSuggestions } = useMemo(() => {
    const pending: Suggestion[] = [];
    let reviewed = 0;
    let applied = 0;
    for (const suggestion of suggestions) {
      if (suggestion.status === "pending") {
        pending.push(suggestion);
        continue;
      }
      reviewed++;
      if (suggestion.status === "applied") applied++;
    }
    return {
      reviewedCount: reviewed,
      appliedCount: applied,
      pendingSuggestions: pending,
    };
  }, [suggestions]);

  // Once a suggestion's applied, the frozen resumeSnapshot no longer reflects
  // reality — switch the preview to the merged (snapshot + applied rewrites)
  // version instead.
  const { structuredResume: mergedResume } = useMergedResume(
    analysis?.resumeId ?? "",
    appliedCount > 0,
  );
  const previewResume = mergedResume ?? resumeSnapshot;

  const viewer = useDocumentViewer();
  const review = useReviewHistory(analysisId, pendingSuggestions);
  const { applySuggestion, rejectSuggestion } = review;
  const { generate: handleGenerateSuggestions, generatingKey } =
    useGenerateSuggestions(analysisId);

  // Shared by the error and loaded branches. On the error branch `analysis` is
  // undefined, so the "job" case correctly no-ops — there's no workspace to
  // route back to when the analysis never loaded.
  const resumeId = analysis?.resumeId;
  const handleNavigateStep = useCallback(
    (step: FlowStepKey) => {
      if (step === "upload") router.push("/");
      if (step === "job" && resumeId) router.push(`/workspace/${resumeId}`);
    },
    [router, resumeId],
  );

  const handleApply = useCallback(
    (id: string) => {
      setMutatingId(id);
      applySuggestion.mutate(
        { suggestionId: id },
        { onSettled: () => setMutatingId(null) },
      );
    },
    [applySuggestion],
  );

  const handleReject = useCallback(
    (id: string) => {
      setMutatingId(id);
      rejectSuggestion.mutate(
        { suggestionId: id },
        { onSettled: () => setMutatingId(null) },
      );
    },
    [rejectSuggestion],
  );

  if (isRedirecting) {
    return <FlowRedirect />;
  }

  if (isError) {
    return (
      <AppShell
        step="review"
        crumbs={CRUMBS}
        title="Resume Review"
        onNavigateStep={handleNavigateStep}
      >
        <div className="analysis-error">
          <p className="analysis-error-message">
            We couldn&apos;t load this analysis.
          </p>
          <Button onClick={() => window.location.reload()}>Try again</Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      step="review"
      crumbs={CRUMBS}
      title={
        isLoading ? (
          <Skeleton className="h-9 w-72" />
        ) : (
          (jobTitle ?? "Resume Review")
        )
      }
      subtitle={parsedJob?.company}
      hasActionBar={suggestions.length > 0}
      onNavigateStep={handleNavigateStep}
      meta={<AnalysisScoreStrip analysis={analysis} isLoading={isLoading} />}
    >
      {/* Resume left, review rail right: the suggestion and the text it
          rewrites stay on screen together instead of being separated by a
          full page scroll. */}
      <div className="analysis-layout">
        <div className="analysis-document">
          {isLoading ? (
            <div className="resume-preview">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : (
            previewResume &&
            analysis && (
              <>
                <ResumeReviewToolbar
                  resumeId={analysis.resumeId}
                  zoom={viewer.zoom}
                  onZoomIn={viewer.zoomIn}
                  onZoomOut={viewer.zoomOut}
                  canUndo={review.canUndo}
                  canRedo={review.canRedo}
                  onUndo={review.undo}
                  onRedo={review.redo}
                  showChanges={viewer.showChanges}
                  onToggleShowChanges={viewer.toggleShowChanges}
                  onAccept={review.acceptAll}
                  onDecline={review.declineAll}
                  canReview={
                    viewer.showChanges && pendingSuggestions.length > 0
                  }
                  isMutating={review.isMutating}
                  pendingCount={pendingSuggestions.length}
                />
                <ResumeReviewPreview
                  structuredResume={previewResume}
                  pendingSuggestions={pendingSuggestions}
                  showChanges={viewer.showChanges}
                  zoom={viewer.zoom}
                  onGenerateSuggestions={handleGenerateSuggestions}
                  generatingKey={generatingKey}
                />
              </>
            )
          )}
        </div>

        <AnalysisRail
          suggestions={suggestions}
          parsedJob={parsedJob}
          skillsMatch={analysis?.skillsMatch}
          scores={analysis?.analysisResult?.scores}
          isLoading={isLoading}
          mutatingId={mutatingId}
          onApply={handleApply}
          onReject={handleReject}
        />
      </div>

      {analysis && suggestions.length > 0 && (
        <div className="analysis-actionbar">
          <div className="analysis-actionbar-inner">
            <ProgressBar
              reviewedCount={reviewedCount}
              totalCount={suggestions.length}
            />
            <ExportButton
              resumeId={analysis.resumeId}
              variant="primary"
              disabled={appliedCount === 0}
            />
          </div>
        </div>
      )}
    </AppShell>
  );
}
