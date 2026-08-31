"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

// Default copy for the analyzing state
const DEFAULT_TITLE = "Analyzing your fit";
const DEFAULT_PHASES = [
  "Reading your resume",
  "Matching against the role's requirements",
  "Preparing your readiness assessment",
];
const PHASE_DURATION_MS = 2600;

// Stale guard: backend reaper runs at 180s, but we show retry earlier
// to avoid leaving users staring at dead work.
const STALL_TIMEOUT_MS = 30_000;

interface AnalyzingOverlayProps {
  title?: string;
  phases?: string[];
  onRetry?: () => void;
}

export function AnalyzingOverlay({
  title = DEFAULT_TITLE,
  phases = DEFAULT_PHASES,
  onRetry,
}: AnalyzingOverlayProps = {}) {
  const [phase, setPhase] = useState(0);
  const [stalled, setStalled] = useState(false);

  // Advance through phases sequentially, stop at last (no loop)
  useEffect(() => {
    if (phase >= phases.length - 1) return;
    const timer = setTimeout(() => setPhase((p) => p + 1), PHASE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [phase, phases.length]);

  // Show retry button after stall timeout
  useEffect(() => {
    if (!onRetry) return;
    const timer = setTimeout(() => setStalled(true), STALL_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [onRetry]);

  // Prevent background scroll while overlay is active
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Stalled state: show retry button
  if (stalled && onRetry) {
    return (
      <div className="analyzing-overlay" role="status" aria-live="polite">
        <div className="card analyzing-overlay-card">
          <p className="analyzing-overlay-title">Taking longer than expected</p>
          <p className="analyzing-overlay-note">
            This is unusual — check again, or come back in a moment.
          </p>
          <Button onClick={onRetry} autoFocus>
            Check again
          </Button>
        </div>
      </div>
    );
  }

  // Normal analyzing state with phase progression
  return (
    <div className="analyzing-overlay" role="status" aria-live="polite">
      <div className="card analyzing-overlay-card">
        <div className="analyzing-orbit" aria-hidden="true">
          <span className="analyzing-orbit-ring" />
          <span className="analyzing-orbit-core" />
        </div>
        <p className="analyzing-overlay-title">{title}</p>
        <ol className="analyzing-phases">
          {phases.map((label, i) => {
            const isDone = i < phase;
            const isActive = i === phase;
            return (
              <li
                key={label}
                className={`
                  analyzing-phase
                  ${isDone ? "analyzing-phase--done" : ""}
                  ${isActive ? "analyzing-phase--active" : ""}
                  ${i > 0 ? "analyzing-phase--connected" : ""}
                `}
              >
                <span className="analyzing-phase-dot" aria-hidden="true">
                  {isDone && (
                    <Check className="analyzing-phase-check" strokeWidth={3} />
                  )}
                </span>
                {label}
              </li>
            );
          })}
        </ol>
        <p className="analyzing-overlay-note">
          This usually takes a few seconds.
        </p>
      </div>
    </div>
  );
}
