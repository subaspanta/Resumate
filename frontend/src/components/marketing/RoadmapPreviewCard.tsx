import { Circle, CheckCircle2 } from "lucide-react";

// Same role as EvidencePreviewCard's "Frontend Engineer" so the two preview
// tiles read as one continuous story, not two unrelated mockups. Tasks
// extend the candidate's own project rather than assign a generic tutorial,
// matching the product's build-over-consume roadmap philosophy.
const TASKS = [
  {
    step: "Task 1",
    label: "Add integration tests to your existing React project",
    done: true,
  },
  {
    step: "Task 2",
    label: "Wrap one feature in an error boundary with a fallback UI",
    done: true,
  },
  {
    step: "Task 3",
    label: "Read up on system design fundamentals for frontend apps",
    done: false,
  },
  {
    step: "Task 4",
    label: "Add automated tests to your CI pipeline",
    done: false,
  },
];

/**
 * Second real preview tile, distinct content from EvidencePreviewCard, so
 * the bento cluster around it has genuine visual variation, not two clones.
 */
export function RoadmapPreviewCard() {
  return (
    <div className="w-full max-w-[24rem] rounded-xl border border-border-base bg-surface p-6">
      <span className="font-mono-label text-mono-label uppercase tracking-[0.08em] text-text-muted">
        Roadmap
      </span>

      <div className="mt-5 flex flex-col gap-4">
        {TASKS.map((task) => (
          <div key={task.step} className="flex items-start gap-3">
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
                {task.step}
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
