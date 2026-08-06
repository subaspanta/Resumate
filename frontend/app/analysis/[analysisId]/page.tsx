"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
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
import type {
  Analysis,
  ParsedJob,
  Suggestion,
  SuggestionStatus,
} from "@/src/features/analysis/types";
import type { StructuredResume } from "@/src/features/resume/types";
import { queryKeys } from "@/src/lib/query-keys";
import { SuggestionsList } from "@/src/components/analysis/SuggestionsList";
import { ProgressBar } from "@/src/components/analysis/ProgressBar";
import { ExportButton } from "@/src/components/analysis/ExportButton";
import { AnalysisScoreStrip } from "@/src/components/analysis/AnalysisScoreStrip";
import { JobDescriptionPanel } from "@/src/components/analysis/JobDescriptionPanel";
import { ScoreBreakdownPanel } from "@/src/components/analysis/ScoreBreakdownPanel";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ResumeReviewPreview } from "@/src/components/workspace/ResumeReviewPreview";
import { ResumeReviewToolbar } from "@/src/components/workspace/ResumeReviewToolbar";
import { SectionVisibilitySidebar } from "@/src/components/workspace/SectionVisibilitySidebar";
import { FlowRedirect } from "@/src/components/FlowRedirect";

const ZOOM_MIN = 0.25;
const ZOOM_MAX = 2;
const ZOOM_STEP = 0.15;

interface ReviewHistoryEntry {
  suggestionIds: string[];
  prevStatus: SuggestionStatus;
  newStatus: Exclude<SuggestionStatus, "pending">;
}

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

  const pendingSuggestions = useMemo(
    () => suggestions.filter((s) => s.status === "pending"),
    [suggestions],
  );

  const queryClient = useQueryClient();
  const [zoom, setZoom] = useState(1);
  const [showChanges, setShowChanges] = useState(false);
  const [reviewHistory, setReviewHistory] = useState<ReviewHistoryEntry[]>([]);
  const [redoStack, setRedoStack] = useState<ReviewHistoryEntry[]>([]);
  const [isReviewMutating, setIsReviewMutating] = useState(false);

  const runStatusMutation = (
    id: string,
    status: Exclude<SuggestionStatus, "pending">,
  ) =>
    status === "applied"
      ? applySuggestion.mutateAsync({ suggestionId: id })
      : rejectSuggestion.mutateAsync({ suggestionId: id });

  const handleReviewAccept = async () => {
    const ids = pendingSuggestions.map((s) => s.id);
    if (ids.length === 0) return;
    setIsReviewMutating(true);
    try {
      await Promise.all(ids.map((id) => runStatusMutation(id, "applied")));
      setReviewHistory((h) => [
        ...h,
        { suggestionIds: ids, prevStatus: "pending", newStatus: "applied" },
      ]);
      setRedoStack([]);
    } finally {
      setIsReviewMutating(false);
    }
  };

  const handleReviewDecline = async () => {
    const ids = pendingSuggestions.map((s) => s.id);
    if (ids.length === 0) return;
    setIsReviewMutating(true);
    try {
      await Promise.all(ids.map((id) => runStatusMutation(id, "rejected")));
      setReviewHistory((h) => [
        ...h,
        { suggestionIds: ids, prevStatus: "pending", newStatus: "rejected" },
      ]);
      setRedoStack([]);
    } finally {
      setIsReviewMutating(false);
    }
  };

  // Reverts a batch of suggestions to a target status. When the target is
  // "pending" there is no real endpoint to call — updateSuggestionStatus's
  // Zod schema only accepts "applied"/"rejected" — so this writes straight
  // into the analysis-detail cache instead (same setQueryData shape
  // useUpdateSuggestionStatus's onMutate already uses). That means an undo
  // back to pending is client-only and won't survive a page refresh; the
  // DB row stays at whatever it was last PATCHed to. Not a bug — history is
  // deliberately session-only. Revisit if this proves confusing in practice.
  const revertSuggestions = async (
    ids: string[],
    targetStatus: SuggestionStatus,
  ) => {
    if (targetStatus === "pending") {
      const key = queryKeys.analysis.detail(analysisId);
      const current = queryClient.getQueryData<Analysis>(key);
      if (current) {
        queryClient.setQueryData<Analysis>(key, {
          ...current,
          suggestions: current.suggestions.map((s: Suggestion) =>
            ids.includes(s.id) ? { ...s, status: "pending" } : s,
          ),
        });
      }
      return;
    }
    await Promise.all(ids.map((id) => runStatusMutation(id, targetStatus)));
  };

  const handleReviewUndo = async () => {
    const entry = reviewHistory[reviewHistory.length - 1];
    if (!entry) return;
    setIsReviewMutating(true);
    try {
      await revertSuggestions(entry.suggestionIds, entry.prevStatus);
      setReviewHistory((h) => h.slice(0, -1));
      setRedoStack((r) => [...r, entry]);
    } finally {
      setIsReviewMutating(false);
    }
  };

  const handleReviewRedo = async () => {
    const entry = redoStack[redoStack.length - 1];
    if (!entry) return;
    setIsReviewMutating(true);
    try {
      await Promise.all(
        entry.suggestionIds.map((id) => runStatusMutation(id, entry.newStatus)),
      );
      setRedoStack((r) => r.slice(0, -1));
      setReviewHistory((h) => [...h, entry]);
    } finally {
      setIsReviewMutating(false);
    }
  };

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
          if (isApiError(error) && error.code === "RATE_LIMIT_EXCEEDED") {
            // Our own aiRateLimit (10 req / 5 min), not Gemini's. The generic
            // fallback below says "try again", which is wrong here — the
            // server's message names the actual wait.
            toast.error(error.message);
            return;
          }
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
    <main className="mx-auto w-full max-w-6xl px-md py-2xl pb-32">
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

        <AnalysisScoreStrip analysis={analysis} isLoading={isLoading} />
      </header>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {analysis && previewResume && (
          <SectionVisibilitySidebar resumeId={analysis.resumeId} />
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-8">
          {isLoading ? (
            <div className="resume-preview">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : (
            previewResume && (
              <>
                <ResumeReviewToolbar
                  zoom={zoom}
                  onZoomIn={() =>
                    setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))
                  }
                  onZoomOut={() =>
                    setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))
                  }
                  canUndo={reviewHistory.length > 0}
                  canRedo={redoStack.length > 0}
                  onUndo={handleReviewUndo}
                  onRedo={handleReviewRedo}
                  showChanges={showChanges}
                  onToggleShowChanges={() => setShowChanges((s) => !s)}
                  onAccept={handleReviewAccept}
                  onDecline={handleReviewDecline}
                  canReview={showChanges && pendingSuggestions.length > 0}
                  isMutating={isReviewMutating}
                />
                <ResumeReviewPreview
                  structuredResume={previewResume}
                  pendingSuggestions={pendingSuggestions}
                  showChanges={showChanges}
                  zoom={zoom}
                  onGenerateSuggestions={handleGenerateSuggestions}
                  generatingKey={generatingKey}
                />
              </>
            )
          )}

          <Tabs defaultValue="suggestions" className="flex flex-col gap-4">
            <TabsList>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              <TabsTrigger value="job-description">
                Job Description
              </TabsTrigger>
              <TabsTrigger value="score">Score</TabsTrigger>
            </TabsList>

            <TabsContent
              value="suggestions"
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  AI Suggestions
                </h2>
                <p className="text-sm text-muted-foreground">
                  Review suggestions and apply the ones that strengthen your
                  resume.
                </p>
              </div>

              <SuggestionsList
                suggestions={suggestions}
                isLoading={isLoading}
                mutatingId={mutatingId}
                onApply={handleApply}
                onReject={handleReject}
              />
            </TabsContent>

            <TabsContent value="job-description">
              <JobDescriptionPanel
                parsedJob={parsedJob}
                skillsMatch={analysis?.skillsMatch}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="score">
              <ScoreBreakdownPanel
                scores={analysis?.analysisResult?.scores}
                skillsMatch={analysis?.skillsMatch}
                jobSkills={parsedJob?.skills}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {analysis && suggestions.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-md py-4 sm:flex-row sm:items-center sm:justify-between">
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
