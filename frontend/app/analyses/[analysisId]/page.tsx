"use client";

import { use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, XCircle, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useCareerAnalysisGuard } from "@/src/features/career-analysis/use-flow-guard";
import { useCareerAnalysis } from "@/src/features/career-analysis/career-analysis.hooks";
import { useGenerateRoadmap, useRoadmap } from "@/src/features/roadmap/roadmap.hooks";
import {
  useRevisions,
  useReassessAnalysis,
} from "@/src/features/reassessment/reassessment.hooks";
import { diffGapStatuses } from "@/src/features/reassessment/reassessment.utils";
import { isApiError } from "@/src/api/api-error";
import { AnalyzingOverlay } from "@/src/components/career-analysis/AnalyzingOverlay";
import { FlowRedirect } from "@/src/components/FlowRedirect";
import { AppShell } from "@/src/components/layout/AppShell";
import { scoreBand } from "@/src/features/career-analysis/career-analysis.utils";
import type {
  EvidenceStrength,
  GapStatus,
} from "@/src/features/career-analysis/types";

const CRUMBS = [{ label: "Dashboard", href: "/" }, { label: "Analysis" }];

const GAP_STATUS_LABEL: Record<GapStatus, string> = {
  strong: "Strong",
  developing: "Developing",
  weak_evidence: "Weak evidence",
  missing: "Missing",
};

// Ordered by severity so the icon carries the same hierarchy the page is
// actually communicating, not just a strong/not-strong binary.
const GAP_STATUS_ICON: Record<GapStatus, typeof CheckCircle2> = {
  strong: CheckCircle2,
  developing: AlertCircle,
  weak_evidence: AlertCircle,
  missing: XCircle,
};

const EVIDENCE_STRENGTH_LABEL: Record<EvidenceStrength, string> = {
  experience_backed: "From work experience",
  project_backed: "From a project",
  mentioned: "Mentioned",
};

export default function AnalysisPage({
  params,
}: {
  params: Promise<{ analysisId: string }>;
}) {
  const { analysisId } = use(params);
  const router = useRouter();

  const { analysis, isLoading, isError, isRedirecting, refetch } =
    useCareerAnalysisGuard(analysisId);
  const generateRoadmap = useGenerateRoadmap(analysisId);
  const { roadmap } = useRoadmap(analysisId);
  const { revisions } = useRevisions(analysisId);
  const reassess = useReassessAnalysis(analysisId);

  // Only fetched once a revision exists, so a first-pass analysis (the
  // common case) never pays for a query it will not use.
  const latestRevision = revisions[revisions.length - 1];
  const { analysis: latestRevisionDetail } = useCareerAnalysis(
    latestRevision?.id ?? "",
  );

  // Loose gate: the backend owns the strict "since last revision, with a
  // note" rule and returns a specific 422 the mutation's onError surfaces —
  // this only decides whether the button is worth showing at all.
  const hasCompletedTask =
    roadmap?.tasks.some((task) => task.completed) ?? false;
  const canReassess = analysis?.status === "complete" && hasCompletedTask;

  const handleNavigateStep = useCallback(
    (step: string) => {
      if (step === "upload") router.push("/");
      if (step === "review" && analysis) {
        router.push(`/resumes/${analysis.resumeId}/review`);
      }
      if (step === "role" && analysis) {
        router.push(`/analyze/${analysis.resumeId}`);
      }
    },
    [router, analysis],
  );

  const handleGenerateRoadmap = () => {
    generateRoadmap.mutate(undefined, {
      onSuccess: () => router.push(`/analyses/${analysisId}/roadmap`),
      onError: (error: unknown) => {
        // A 409 (roadmap already exists) is handled as success by the hook —
        // the roadmap already exists, so just go see it.
        if (isApiError(error) && error.status === 409) {
          router.push(`/analyses/${analysisId}/roadmap`);
        }
      },
    });
  };

  const handleReassess = () => {
    reassess.mutate(undefined, {
      onSuccess: (data) => router.push(`/analyses/${data.id}`),
    });
  };

  if (isRedirecting) {
    return <FlowRedirect />;
  }

  if (isError) {
    return (
      <AppShell
        step="analysis"
        crumbs={CRUMBS}
        title="Career Analysis"
        onNavigateStep={handleNavigateStep}
      >
        <div className="analysis-error">
          <p className="analysis-error-message">
            We couldn&apos;t load this analysis.
          </p>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      </AppShell>
    );
  }

  if (isLoading || !analysis) {
    return (
      <AppShell
        step="analysis"
        crumbs={CRUMBS}
        title="Career Analysis"
        onNavigateStep={handleNavigateStep}
      >
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </AppShell>
    );
  }

  // `analyzing`/`pending` is a real state to render — the stale-analysis
  // reaper runs on read paths, so this is observable if a request died
  // mid-call, not just a brief flash.
  if (analysis.status === "analyzing" || analysis.status === "pending") {
    return (
      <AppShell
        step="analysis"
        crumbs={CRUMBS}
        title="Career Analysis"
        onNavigateStep={handleNavigateStep}
      >
        <AnalyzingOverlay onRetry={() => refetch()} />
      </AppShell>
    );
  }

  if (analysis.status === "failed") {
    return (
      <AppShell
        step="analysis"
        crumbs={CRUMBS}
        title="Career Analysis"
        onNavigateStep={handleNavigateStep}
      >
        <div className="analysis-error">
          <p className="analysis-error-message">
            {analysis.failureReason ?? "This analysis failed to complete."}
          </p>
          <Button onClick={() => router.push(`/analyze/${analysis.resumeId}`)}>
            Try again
          </Button>
        </div>
      </AppShell>
    );
  }

  const score = analysis.readinessScore ?? 0;
  const band = scoreBand(score);

  const beforeScore = analysis.readinessScore ?? 0;
  const afterScore = latestRevisionDetail?.readinessScore ?? null;
  const gapMovements =
    latestRevisionDetail && analysis.id !== latestRevisionDetail.id
      ? diffGapStatuses(analysis.gaps, latestRevisionDetail.gaps)
      : [];
  const showRevisionPanel =
    latestRevision &&
    latestRevision.id !== analysis.id &&
    latestRevisionDetail &&
    afterScore !== null;

  return (
    <AppShell
      step="analysis"
      crumbs={CRUMBS}
      title={`Readiness for ${analysis.role.title}`}
      subtitle="Based on evidence found in your resume."
      onNavigateStep={handleNavigateStep}
      hasActionBar
    >
      <div className="readiness-card">
        <div className="readiness-card-header">
          <span className="readiness-card-label">Readiness score</span>
          <span className={`readiness-card-score readiness-card-score--${band}`}>
            {score}%
          </span>
        </div>
        <div className="readiness-track">
          <div
            className={`readiness-track-fill readiness-track-fill--${band}`}
            style={
              {
                "--readiness-fill": Math.min(100, Math.max(0, score)) / 100,
              } as React.CSSProperties
            }
          />
        </div>
      </div>

      {showRevisionPanel && (
        <div className="reassessment-panel">
          <span className="reassessment-panel-label">
            After your latest reassessment
          </span>
          <div className="reassessment-score-change">
            <span className="reassessment-score-before">{beforeScore}%</span>
            <span className="reassessment-score-arrow" aria-hidden="true">
              →
            </span>
            <span className="reassessment-score-after">{afterScore}%</span>
          </div>
          {gapMovements.length > 0 && (
            <div className="reassessment-gap-movements">
              {gapMovements.map((movement) => (
                <div
                  key={movement.skillSlug}
                  className={`reassessment-gap-movement reassessment-gap-movement--${movement.direction}`}
                >
                  <span className="reassessment-gap-movement-skill">
                    {movement.skillName}:
                  </span>
                  <span>{GAP_STATUS_LABEL[movement.before]}</span>
                  <span aria-hidden="true">→</span>
                  <span className="reassessment-gap-movement-after">
                    {GAP_STATUS_LABEL[movement.after]}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Button variant="outline" onClick={() => router.push(`/analyses/${latestRevision.id}`)}>
            View latest assessment
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <h2 className="section-heading">
          Skill gaps ({analysis.gaps.length})
        </h2>
        <div className="gap-list">
          {analysis.gaps.map((gap) => {
            const Icon = GAP_STATUS_ICON[gap.status];
            return (
              <div key={gap.id} className="gap-card">
                <Icon
                  className={`gap-card-icon gap-card-icon--${gap.status} size-5`}
                  aria-hidden="true"
                />
                <div className="gap-card-body">
                  <div className="gap-card-header">
                    <span className="gap-card-title">{gap.skill.name}</span>
                    <span className={`gap-card-status gap-card-status--${gap.status}`}>
                      {GAP_STATUS_LABEL[gap.status]}
                    </span>
                  </div>
                  <p className="gap-card-reasoning">{gap.reasoning}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {analysis.evidence.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="section-heading">Evidence found</h2>
          <div className="evidence-list">
            {analysis.evidence.map((item) => (
              <div key={item.id} className="evidence-card">
                <Quote
                  className="evidence-card-icon size-5"
                  aria-hidden="true"
                />
                <div className="evidence-card-body">
                  <div className="evidence-card-header">
                    <span className="evidence-card-title">
                      {item.skill.name}
                    </span>
                    <span className="evidence-card-strength">
                      {EVIDENCE_STRENGTH_LABEL[item.strength]}
                    </span>
                  </div>
                  <p className="evidence-card-quote">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <p className="evidence-card-source">{item.sourceLabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {generateRoadmap.isPending && (
        <AnalyzingOverlay
          title="Building your roadmap"
          phases={[
            "Reviewing your skill gaps",
            "Prioritizing what to tackle first",
            "Writing your 4-week plan",
          ]}
        />
      )}

      {reassess.isPending && (
        <AnalyzingOverlay
          title="Reassessing your progress"
          phases={[
            "Reading what you've completed",
            "Re-checking your evidence",
            "Recomputing your readiness",
          ]}
        />
      )}

      <div className="analysis-action-bar">
        <div className="analysis-action-bar-inner">
          {canReassess && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" disabled={reassess.isPending}>
                  Reassess
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reassess your readiness?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This re-reads your resume plus the notes you added on
                    completed roadmap tasks, and creates a new assessment.
                    Your current readiness score won&apos;t change.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="alert-dialog-btn--reassess"
                    onClick={handleReassess}
                  >
                    Reassess
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button
            disabled={generateRoadmap.isPending}
            onClick={handleGenerateRoadmap}
          >
            Generate roadmap
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
