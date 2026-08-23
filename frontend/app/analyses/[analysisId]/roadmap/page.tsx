"use client";

import { use, useCallback, useMemo, useState } from "react";
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
import { AppShell, type Crumb } from "@/src/components/layout/AppShell";
import type { RoadmapTask } from "@/src/features/roadmap/types";

// The flow step rail supplies the whole trail (Resume -> ... -> Roadmap);
// a separate "Dashboard" crumb would just duplicate the Resume step, since
// that step's own destination is the dashboard.
const CRUMBS: Crumb[] = [];

// Single field, no cross-field validation — plain useState per the CLAUDE.md
// resolver rule, same reasoning as JobInputForm. Own component so typing a
// draft note in one task never re-renders the whole task list.
//
// Rendered unconditionally (not gated on task.completed): a user should be
// able to write what they built as one action, not "check the box, then
// notice a second box appeared, then fill that in too." Saving a note always
// marks the task complete alongside it, so this is the one action that does
// both.
function TaskCompletionNote({
  task,
  onSave,
  saving,
}: {
  task: RoadmapTask;
  onSave: (note: string) => void;
  saving: boolean;
}) {
  const [note, setNote] = useState(task.completionNote ?? "");

  // Disabled once nothing would change: same note, already complete. Not
  // disabled just because the task isn't complete yet — that's exactly the
  // case Save is meant to handle in one click.
  const unchanged = task.completed && note.trim() === (task.completionNote ?? "");

  return (
    <div className="roadmap-task-note">
      <label className="roadmap-task-note-label" htmlFor={`note-${task.id}`}>
        What did you build?
      </label>
      <textarea
        id={`note-${task.id}`}
        className="roadmap-task-note-input"
        value={note}
        maxLength={1000}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Describe what you actually did, in your own words"
      />
      <Button
        variant="outline"
        size="sm"
        disabled={saving || unchanged}
        onClick={() => onSave(note)}
      >
        {task.completed ? "Save note" : "Save note & mark complete"}
      </Button>
    </div>
  );
}

export default function RoadmapPage({
  params,
}: {
  params: Promise<{ analysisId: string }>;
}) {
  const { analysisId } = use(params);
  const router = useRouter();

  const {
    analysis,
    isLoading: analysisLoading,
    isError,
    isRedirecting,
    refetch: refetchAnalysis,
  } = useCareerAnalysisGuard(analysisId);
  const {
    roadmap,
    isLoading: roadmapLoading,
    refetch: refetchRoadmap,
  } = useRoadmap(analysisId);
  const toggleTask = useToggleRoadmapTask(analysisId);

  const handleNavigateStep = useCallback(
    (step: string) => {
      if (step === "upload") router.push("/");
      if (step === "review" && analysis) {
        router.push(`/resumes/${analysis.resumeId}/review`);
      }
      if (step === "role" && analysis) {
        router.push(`/analyze/${analysis.resumeId}`);
      }
      if (step === "analysis") router.push(`/analyses/${analysisId}`);
    },
    [router, analysisId, analysis],
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
          <Button
            onClick={() => {
              refetchAnalysis();
              refetchRoadmap();
            }}
          >
            Try again
          </Button>
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
      hasActionBar
    >
      <div className="card roadmap-progress">
        <div className="roadmap-progress-header">
          <span className="entry-title roadmap-progress-label">Overall progress</span>
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
              <h2 className="entry-title roadmap-week-title">Week {week.weekNumber}</h2>
              <span className="roadmap-week-count">
                {weekDone}/{week.tasks.length} done
              </span>
            </div>
            <div className="roadmap-task-list">
              {week.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`card roadmap-task ${
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
                      className={`entry-title roadmap-task-title ${
                        task.completed ? "roadmap-task-title--completed" : ""
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="body-copy roadmap-task-description">
                      {task.description}
                    </p>
                    {task.skillGap && (
                      <span className="roadmap-task-skill">
                        {task.skillGap.skill.name}
                      </span>
                    )}
                    <p className="body-copy roadmap-task-detail">
                      <span className="roadmap-task-detail-label">
                        Build:{" "}
                      </span>
                      {task.projectTask}
                    </p>
                    <p className="body-copy roadmap-task-detail">
                      <span className="roadmap-task-detail-label">
                        Proves:{" "}
                      </span>
                      {task.expectedEvidence}
                    </p>
                    {task.resources && task.resources.length > 0 && (
                      <div className="roadmap-task-resources">
                        <p className="roadmap-task-resources-heading">
                          Free Resources
                        </p>
                        {task.resources.map((resource, i) => (
                          <p key={i} className="body-copy roadmap-task-resource">
                            {resource}
                          </p>
                        ))}
                      </div>
                    )}
                    <TaskCompletionNote
                      task={task}
                      saving={toggleTask.isPending}
                      onSave={(note) =>
                        toggleTask.mutate({
                          taskId: task.id,
                          completed: true,
                          completionNote: note,
                        })
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="action-bar roadmap-action-bar">
        <div className="action-bar-inner roadmap-action-bar-inner">
          <span className="body-copy body-copy--muted roadmap-action-bar-hint">
            Done for now? Head back to your analysis to reassess once
            you&apos;ve completed a task.
          </span>
          <Button
            variant="outline"
            onClick={() => router.push(`/analyses/${analysisId}`)}
          >
            Back to analysis
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
