"use client";

import { use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, XCircle, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCareerAnalysisGuard } from "@/src/features/career-analysis/use-flow-guard";
import { useGenerateRoadmap } from "@/src/features/roadmap/roadmap.hooks";
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

      <div className="analysis-action-bar">
        <div className="analysis-action-bar-inner">
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
