"use client";

import { Check } from "lucide-react";
import { FLOW_STEPS, FLOW_STEP_INDEX, type FlowStepKey } from "./flow-steps";

interface FlowStepRailProps {
  current: FlowStepKey;
  /**
   * Steps the user can jump back to. Forward steps are never navigable — a
   * later step doesn't exist until the earlier one produced its artifact
   * (no resume, no workspace; no analysis, no review).
   */
  onNavigate?: (step: FlowStepKey) => void;
}

/**
 * The whole five-step journey, upcoming steps included.
 *
 * This used to render as extra breadcrumb items showing only the steps
 * already behind the user, which answered "where am I" but never "how much
 * is left" — the question that actually matters to someone deciding whether
 * to start. Showing the full track costs one row and answers both.
 *
 * The filled portion is one element scaled on the X axis rather than a
 * width transition, so advancing a step doesn't relayout the row.
 */
export function FlowStepRail({ current, onNavigate }: FlowStepRailProps) {
  const currentIndex = FLOW_STEP_INDEX[current];
  const lastIndex = FLOW_STEPS.length - 1;
  // Fill reaches the current marker's centre, not past it: the track measures
  // ground covered, and the step you're standing on isn't behind you yet.
  const progress = currentIndex / lastIndex;

  return (
    <div className="flow-rail">
      <ol className="flow-rail-track">
        <div className="flow-rail-line" aria-hidden="true">
          <div
            className="flow-rail-line-fill"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>

        {FLOW_STEPS.map((step, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          // Only a done step is navigable, and only when the page gave us a
          // handler — the current step is already here, and an upcoming one
          // has no artifact to show.
          const canNavigate = isDone && !!onNavigate;

          const state = isDone ? "done" : isCurrent ? "current" : "upcoming";

          const marker = (
            <>
              <span className={`flow-rail-marker flow-rail-marker--${state}`}>
                {isDone ? (
                  <Check className="flow-rail-check" aria-hidden="true" />
                ) : (
                  <span aria-hidden="true">{index + 1}</span>
                )}
              </span>
              <span className="flow-rail-label">{step.label}</span>
            </>
          );

          return (
            <li
              key={step.key}
              className={`flow-rail-step flow-rail-step--${state}`}
              aria-current={isCurrent ? "step" : undefined}
            >
              {canNavigate ? (
                <button
                  type="button"
                  className="flow-rail-step-button"
                  onClick={() => onNavigate(step.key)}
                >
                  {marker}
                  <span className="sr-only">— completed, go back</span>
                </button>
              ) : (
                <span className="flow-rail-step-static">{marker}</span>
              )}
            </li>
          );
        })}
      </ol>

      <p className="flow-rail-counter">
        Step {currentIndex + 1} of {FLOW_STEPS.length}
      </p>
    </div>
  );
}
