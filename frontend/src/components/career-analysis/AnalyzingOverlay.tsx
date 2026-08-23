"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Both the evidence assessment and the roadmap-content Gemini calls
 * routinely take several seconds. A spinner inside the submit button is too
 * small a signal for a wait that long and leaves the rest of the page
 * looking idle-but-frozen, so the whole step takes on a working state that
 * names what is happening — title and phases are caller-supplied so the copy
 * actually matches which of the two calls is in flight.
 */
const DEFAULT_TITLE = "Analyzing your fit";

const DEFAULT_PHASES = [
  "Reading your resume",
  "Matching against the role's requirements",
  "Preparing your readiness assessment",
];

const PHASE_DURATION_MS = 2600;

// The page polls the analysis every 3s while status stays "analyzing", so
// this is a real ceiling, not decoration: a request that died mid-flight
// only recovers once the backend's stale-analysis reaper fires (currently
// 180s after the analysis started, career-analysis.service.ts). Past this
// point the user has been staring at phase text describing work that most
// likely already failed, so trade the animation for an honest fallback.
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

  // Advances one phase at a time and stops on the last — looping back to the
  // first phase would suggest the work restarted. A chained timeout rather
  // than an interval so the timer actually stops at the end instead of
  // firing forever into a clamped no-op setState.
  useEffect(() => {
    if (phase >= phases.length - 1) return;
    const timer = setTimeout(() => setPhase((p) => p + 1), PHASE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [phase, phases.length]);

  useEffect(() => {
    if (!onRetry) return;
    const timer = setTimeout(() => setStalled(true), STALL_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [onRetry]);

  // This covers the viewport like a modal but isn't one — no Radix, no
  // portal — so nothing otherwise stops the page scrolling under the scrim
  // while the user waits. Locking the body is the piece of modal behaviour
  // it genuinely needs; a focus trap is not, because until the stalled
  // branch appears there is nothing inside here to trap focus on.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  if (stalled && onRetry) {
    return (
      <div className="analyzing-overlay" role="status" aria-live="polite">
        <div className="card analyzing-overlay-card">
          <p className="analyzing-overlay-title">Taking longer than expected</p>
          <p className="analyzing-overlay-note">
            This is unusual — check again, or come back in a moment.
          </p>
          {/* The first thing in this flow the user can act on, arriving 30s
              after their last interaction. Taking focus means a keyboard
              user doesn't have to go hunting for what just appeared. */}
          <Button onClick={onRetry} autoFocus>
            Check again
          </Button>
        </div>
      </div>
    );
  }

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
                className={`analyzing-phase ${
                  isDone
                    ? "analyzing-phase--done"
                    : isActive
                      ? "analyzing-phase--active"
                      : ""
                } ${i > 0 ? "analyzing-phase--connected" : ""}`}
              >
                <span className="analyzing-phase-dot" aria-hidden="true">
                  {isDone && <Check className="analyzing-phase-check" strokeWidth={3} />}
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
