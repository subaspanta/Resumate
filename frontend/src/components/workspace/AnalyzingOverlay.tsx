"use client";

import { useEffect, useState } from "react";

/**
 * Creating an analysis is two sequential Gemini calls (parse the JD, then
 * score against the resume) and routinely runs several seconds. A spinner
 * inside the submit button is too small a signal for a wait that long and
 * leaves the rest of the page looking idle-but-frozen, so the whole step
 * takes on a working state that names what is happening.
 */
const PHASES = [
  "Reading the job description",
  "Matching against your resume",
  "Preparing your tailored review",
];

const PHASE_DURATION_MS = 2600;

export function AnalyzingOverlay() {
  const [phase, setPhase] = useState(0);

  // Advances one phase at a time and stops on the last — looping back to
  // "Reading the job description" would suggest the work restarted. A chained
  // timeout rather than an interval so the timer actually stops at the end
  // instead of firing forever into a clamped no-op setState.
  useEffect(() => {
    if (phase >= PHASES.length - 1) return;
    const timer = setTimeout(() => setPhase((p) => p + 1), PHASE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <div className="analyzing-overlay" role="status" aria-live="polite">
      <div className="analyzing-overlay-card">
        <div className="analyzing-orbit" aria-hidden="true">
          <span className="analyzing-orbit-ring" />
          <span className="analyzing-orbit-core" />
        </div>
        <p className="analyzing-overlay-title">Analyzing your resume</p>
        <ol className="analyzing-phases">
          {PHASES.map((label, i) => (
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
