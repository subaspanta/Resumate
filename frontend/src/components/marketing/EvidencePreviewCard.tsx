import { CheckCircle2, CircleDashed, TrendingUp } from "lucide-react";

const SKILLS = [
  { name: "React & component architecture", status: "proven" as const },
  { name: "REST API integration", status: "proven" as const },
  { name: "Automated testing", status: "gap" as const },
  { name: "System design fundamentals", status: "gap" as const },
];

/**
 * Real small-scale reproduction of the in-product evidence/gap card, not a
 * div-based fake screenshot: same status vocabulary (proven vs gap) the
 * actual career-analysis UI uses.
 */
export function EvidencePreviewCard() {
  return (
    <div className="w-full max-w-[24rem] rounded-xl border border-border-base bg-surface p-6">
      <div className="flex items-center justify-between">
        <span className="font-mono-label text-mono-label uppercase tracking-[0.08em] text-text-muted">
          Frontend Engineer
        </span>
        <span className="flex items-center gap-1 rounded-full bg-primary-container px-2.5 py-1 font-mono-label text-mono-label text-primary">
          <TrendingUp className="size-3" strokeWidth={2} />
          62% ready
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {SKILLS.map((skill) => (
          <div key={skill.name} className="flex items-center gap-3">
            {skill.status === "proven" ? (
              <CheckCircle2
                className="size-4 shrink-0 text-score-excellent"
                strokeWidth={2}
              />
            ) : (
              <CircleDashed
                className="size-4 shrink-0 text-text-muted"
                strokeWidth={2}
              />
            )}
            <span
              className={
                skill.status === "proven"
                  ? "text-body-md text-text-primary"
                  : "text-body-md text-text-muted"
              }
            >
              {skill.name}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-border-base pt-4">
        <p className="text-body-md text-text-body">
          2 gaps found. Your roadmap is ready.
        </p>
      </div>
    </div>
  );
}
