"use client";

import { useEffect, useState } from "react";

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

interface AnalyzingOverlayProps {
  title?: string;
  phases?: string[];
}

export function AnalyzingOverlay({
  title = DEFAULT_TITLE,
  phases = DEFAULT_PHASES,
}: AnalyzingOverlayProps = {}) {
  const [phase, setPhase] = useState(0);

  // Advances one phase at a time and stops on the last — looping back to the
  // first phase would suggest the work restarted. A chained timeout rather
  // than an interval so the timer actually stops at the end instead of
  // firing forever into a clamped no-op setState.
  useEffect(() => {
    if (phase >= phases.length - 1) return;
    const timer = setTimeout(() => setPhase((p) => p + 1), PHASE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [phase, phases.length]);

  return (
    <div className="analyzing-overlay" role="status" aria-live="polite">
      <div className="analyzing-overlay-card">
        <div className="analyzing-orbit" aria-hidden="true">
          <span className="analyzing-orbit-ring" />
          <span className="analyzing-orbit-core" />
        </div>
        <p className="analyzing-overlay-title">{title}</p>
        <ol className="analyzing-phases">
          {phases.map((label, i) => (
            <li
              key={label}
              className={`analyzing-phase ${
                i < phase
                  ? "analyzing-phase--done"
                  : i === phase
                    ? "analyzing-phase--active"
                    : ""
              }`}
            >
              <span className="analyzing-phase-dot" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ol>
        <p className="analyzing-overlay-note">
          This usually takes a few seconds.
        </p>
      </div>
    </div>
  );
}
