"use client";

import { use, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  const progress = useMemo(() => {
    if (!roadmap || roadmap.tasks.length === 0) {
      return { completed: 0, total: 0, fraction: 0 };
    }
    const completed = roadmap.tasks.filter((t) => t.completed).length;
    return {
      completed,
      total: roadmap.tasks.length,
      fraction: completed / roadmap.tasks.length,
    };
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
      <div className="roadmap-progress">
        <div className="roadmap-progress-header">
          <span className="roadmap-progress-label">Overall progress</span>
          <span className="roadmap-progress-count">
            {progress.completed} of {progress.total} tasks
          </span>
        </div>
        <div className="roadmap-progress-track">
          <div
            className="roadmap-progress-fill"
            style={{ "--roadmap-fill": progress.fraction } as React.CSSProperties}
          />
        </div>
      </div>

      {weeks.map((week) => {
        const weekDone = week.tasks.filter((t) => t.completed).length;
        return (
          <div key={week.weekNumber} className="roadmap-week">
            <div className="roadmap-week-header">
              <h2 className="roadmap-week-title">Week {week.weekNumber}</h2>
              <span className="roadmap-week-count">
                {weekDone}/{week.tasks.length} done
              </span>
            </div>
            <div className="roadmap-task-list">
              {week.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`roadmap-task ${
                    task.completed ? "roadmap-task--completed" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="roadmap-task-toggle"
                    onClick={() =>
                      toggleTask.mutate({
                        taskId: task.id,
                        completed: !task.completed,
                      })
                    }
                    aria-pressed={task.completed}
                    aria-label={
                      task.completed
                        ? `Mark "${task.title}" incomplete`
                        : `Mark "${task.title}" complete`
                    }
                  >
                    {task.completed ? (
                      <CheckCircle2
                        className="roadmap-task-checkbox size-5 text-score-excellent"
                        aria-hidden="true"
                      />
                    ) : (
                      <Circle
                        className="roadmap-task-checkbox size-5 text-border-input"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                  <div className="roadmap-task-body">
                    <p
                      className={`roadmap-task-title ${
                        task.completed ? "roadmap-task-title--completed" : ""
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="roadmap-task-description">
                      {task.description}
                    </p>
                    {task.skillGap && (
                      <span className="roadmap-task-skill">
                        {task.skillGap.skill.name}
                      </span>
                    )}
                    <p className="roadmap-task-detail">
                      <span className="roadmap-task-detail-label">
                        Build:{" "}
                      </span>
                      {task.projectTask}
                    </p>
                    <p className="roadmap-task-detail">
                      <span className="roadmap-task-detail-label">
                        Proves:{" "}
                      </span>
                      {task.expectedEvidence}
                    </p>
                    {task.resources && task.resources.length > 0 && (
                      <div className="roadmap-task-resources">
                        {task.resources.map((resource, i) => (
                          <p key={i} className="roadmap-task-resource">
                            {resource}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </AppShell>
  );
}
