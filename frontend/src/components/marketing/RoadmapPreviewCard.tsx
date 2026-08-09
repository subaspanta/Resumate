import { Circle, CheckCircle2 } from "lucide-react";

const TASKS = [
  { week: "Week 1", label: "Write unit tests for one existing component", done: true },
  { week: "Week 2", label: "Build a small feature with integration tests", done: true },
  { week: "Week 3", label: "Read up on load balancing & caching basics", done: false },
  { week: "Week 4", label: "Design a system for a mock scaling scenario", done: false },
];

/**
 * Second real preview tile, distinct content from EvidencePreviewCard, so
 * the bento cluster around it has genuine visual variation, not two clones.
 */
export function RoadmapPreviewCard() {
  return (
    <div className="w-full max-w-[24rem] rounded-xl border border-border-base bg-surface p-6">
      <span className="font-mono-label text-mono-label uppercase tracking-[0.08em] text-text-muted">
        4-week roadmap
      </span>

      <div className="mt-5 flex flex-col gap-4">
        {TASKS.map((task) => (
          <div key={task.week} className="flex items-start gap-3">
            {task.done ? (
              <CheckCircle2
                className="mt-0.5 size-4 shrink-0 text-score-excellent"
                strokeWidth={2}
              />
            ) : (
              <Circle
                className="mt-0.5 size-4 shrink-0 text-border-input"
                strokeWidth={2}
              />
            )}
            <div>
              <p className="font-mono-label text-mono-label text-text-muted">
                {task.week}
              </p>
              <p
                className={
                  task.done
                    ? "text-body-md text-text-muted line-through"
                    : "text-body-md text-text-primary"
                }
              >
                {task.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
