"use client";

import { use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useCareerAnalysisGuard } from "@/src/features/career-analysis/use-flow-guard";
import { useGenerateRoadmap } from "@/src/features/roadmap/roadmap.hooks";
import { isApiError } from "@/src/api/api-error";
import { AnalyzingOverlay } from "@/src/components/career-analysis/AnalyzingOverlay";
import { FlowRedirect } from "@/src/components/FlowRedirect";
import { AppShell } from "@/src/components/layout/AppShell";
import type { GapStatus } from "@/src/features/career-analysis/types";

const CRUMBS = [{ label: "Dashboard", href: "/" }, { label: "Analysis" }];

const GAP_STATUS_LABEL: Record<GapStatus, string> = {
  strong: "Strong",
  developing: "Developing",
  weak_evidence: "Weak evidence",
  missing: "Missing",
};

// Ordered by severity so the badge color carries the same hierarchy the
// page is actually communicating, not just a strong/not-strong binary.
const GAP_STATUS_BADGE_VARIANT: Record<
  GapStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  strong: "default",
  developing: "secondary",
  weak_evidence: "outline",
  missing: "destructive",
};

export default function AnalysisPage({
  params,
}: {
  params: Promise<{ analysisId: string }>;
}) {
  const { analysisId } = use(params);
  const router = useRouter();

  const { analysis, isLoading, isError, isRedirecting } =
    useCareerAnalysisGuard(analysisId);
  const generateRoadmap = useGenerateRoadmap(analysisId);

  const handleNavigateStep = useCallback(
    (step: string) => {
      if (step === "upload") router.push("/");
    },
    [router],
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
          <Button onClick={() => window.location.reload()}>Try again</Button>
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
        <AnalyzingOverlay />
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

  return (
    <AppShell
      step="analysis"
      crumbs={CRUMBS}
      title={`Readiness for ${analysis.role.title}`}
      subtitle="Based on evidence found in your resume."
      onNavigateStep={handleNavigateStep}
    >
      <Card className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <p className="font-medium text-foreground">Readiness score</p>
          <p className="text-2xl font-semibold text-foreground">
            {analysis.readinessScore ?? 0}%
          </p>
        </div>
        <Progress value={analysis.readinessScore ?? 0} />
      </Card>

      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-medium text-muted-foreground">
          Skill gaps ({analysis.gaps.length})
        </h2>
        {analysis.gaps.map((gap) => (
          <Card key={gap.id} className="flex flex-col gap-2 p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-foreground">{gap.skill.name}</p>
              <Badge variant={GAP_STATUS_BADGE_VARIANT[gap.status]}>
                {GAP_STATUS_LABEL[gap.status]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{gap.reasoning}</p>
          </Card>
        ))}
      </div>

      {analysis.evidence.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-medium text-muted-foreground">
            Evidence found
          </h2>
          {analysis.evidence.map((item) => (
            <Card key={item.id} className="flex flex-col gap-2 p-5">
              <p className="font-medium text-foreground">{item.skill.name}</p>
              <p className="text-sm italic text-muted-foreground">
                &ldquo;{item.quote}&rdquo;
              </p>
              <p className="text-xs text-muted-foreground">{item.sourceLabel}</p>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          disabled={generateRoadmap.isPending}
          onClick={handleGenerateRoadmap}
        >
          Generate roadmap
        </Button>
      </div>

      {generateRoadmap.isPending && <AnalyzingOverlay />}
    </AppShell>
  );
}
