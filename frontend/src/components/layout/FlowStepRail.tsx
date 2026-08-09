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

export function FlowStepRail({ current, onNavigate }: FlowStepRailProps) {
  const currentIndex = FLOW_STEP_INDEX[current];

  return (
    <nav className="flow-rail" aria-label="Analysis progress">
      <ol className="flow-rail-list">
        {FLOW_STEPS.map((step, index) => {
          const state =
            index < currentIndex
              ? "done"
              : index === currentIndex
                ? "current"
                : "upcoming";
          const canNavigate = state === "done" && !!onNavigate;

          return (
            <li key={step.key} className="flow-rail-item">
              <button
                type="button"
                className={`flow-rail-step flow-rail-step--${state}`}
                aria-current={state === "current" ? "step" : undefined}
                disabled={!canNavigate}
                onClick={canNavigate ? () => onNavigate(step.key) : undefined}
              >
                <span className="flow-rail-marker" aria-hidden="true">
                  {state === "done" ? (
                    <Check className="size-3" strokeWidth={3} />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="flow-rail-label">{step.label}</span>
              </button>
              {index < FLOW_STEPS.length - 1 && (
                <span
                  className={`flow-rail-connector ${
                    index < currentIndex ? "flow-rail-connector--done" : ""
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
      <span className="flow-rail-count">
        Step {currentIndex + 1} of {FLOW_STEPS.length}
      </span>
    </nav>
  );
}
