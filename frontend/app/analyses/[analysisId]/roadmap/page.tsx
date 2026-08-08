"use client";

import { use, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useCareerAnalysisGuard } from "@/src/features/career-analysis/use-flow-guard";
import {
  useRoadmap,
  useToggleRoadmapTask,
} from "@/src/features/roadmap/roadmap.hooks";
import { FlowRedirect } from "@/src/components/FlowRedirect";
import { AppShell } from "@/src/components/layout/AppShell";
import type { RoadmapTask } from "@/src/features/roadmap/types";

const CRUMBS = [{ label: "Dashboard", href: "/" }, { label: "Roadmap" }];

export default function RoadmapPage({
  params,
}: {
  params: Promise<{ analysisId: string }>;
}) {
  const { analysisId } = use(params);
  const router = useRouter();

  const { isLoading: analysisLoading, isError, isRedirecting } =
    useCareerAnalysisGuard(analysisId);
  const { roadmap, isLoading: roadmapLoading } = useRoadmap(analysisId);
  const toggleTask = useToggleRoadmapTask(analysisId);

  const handleNavigateStep = useCallback(
    (step: string) => {
      if (step === "upload") router.push("/");
      if (step === "analysis") router.push(`/analyses/${analysisId}`);
    },
    [router, analysisId],
  );

  const weeks = useMemo(() => {
    if (!roadmap) return [];
    // weekCount is the actual scheduled count, not always 4 — a candidate
    // with fewer gaps gets a shorter roadmap, so this is never hardcoded.
    const byWeek = new Map<number, RoadmapTask[]>();
    for (const task of roadmap.tasks) {
      const bucket = byWeek.get(task.weekNumber) ?? [];
      bucket.push(task);
      byWeek.set(task.weekNumber, bucket);
    }
    return Array.from({ length: roadmap.weekCount }, (_, i) => ({
      weekNumber: i + 1,
      tasks: byWeek.get(i + 1) ?? [],
    }));
  }, [roadmap]);

  if (isRedirecting) {
    return <FlowRedirect />;
  }

  if (isError) {
    return (
      <AppShell
        step="roadmap"
        crumbs={CRUMBS}
        title="Learning Roadmap"
        onNavigateStep={handleNavigateStep}
      >
        <div className="analysis-error">
          <p className="analysis-error-message">
            We couldn&apos;t load this roadmap.
          </p>
          <Button onClick={() => window.location.reload()}>Try again</Button>
        </div>
      </AppShell>
    );
  }

  if (analysisLoading || roadmapLoading) {
    return (
      <AppShell
        step="roadmap"
        crumbs={CRUMBS}
        title="Learning Roadmap"
        onNavigateStep={handleNavigateStep}
      >
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      </AppShell>
    );
  }

  if (!roadmap) {
    return (
      <AppShell
        step="roadmap"
        crumbs={CRUMBS}
        title="Learning Roadmap"
        onNavigateStep={handleNavigateStep}
      >
        <div className="analysis-error">
          <p className="analysis-error-message">
            No roadmap yet for this analysis.
          </p>
          <Button onClick={() => router.push(`/analyses/${analysisId}`)}>
            Back to analysis
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      step="roadmap"
      crumbs={CRUMBS}
      title="Your Learning Roadmap"
      subtitle={`${roadmap.weekCount}-week plan built from your skill gaps.`}
      onNavigateStep={handleNavigateStep}
    >
      {weeks.map((week) => (
        <div key={week.weekNumber} className="flex flex-col gap-4">
          <h2 className="text-sm font-medium text-muted-foreground">
            Week {week.weekNumber}
          </h2>
          {week.tasks.map((task) => (
            <Card key={task.id} className="flex flex-col gap-3 p-5">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) =>
                    toggleTask.mutate({
                      taskId: task.id,
                      completed: checked === true,
                    })
                  }
                />
                <div className="flex flex-col gap-1">
                  <p
                    className={`font-medium ${
                      task.completed
                        ? "text-muted-foreground line-through"
                        : "text-foreground"
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {task.description}
                  </p>
                </div>
              </div>
              <div className="ml-7 flex flex-col gap-1 text-sm">
                <p>
                  <span className="font-medium text-foreground">Build: </span>
                  <span className="text-muted-foreground">{task.projectTask}</span>
                </p>
                <p>
                  <span className="font-medium text-foreground">Proves: </span>
                  <span className="text-muted-foreground">
                    {task.expectedEvidence}
                  </span>
                </p>
              </div>
            </Card>
          ))}
        </div>
      ))}
    </AppShell>
  );
}
