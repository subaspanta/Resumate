"use client";

import Link from "next/link";
import { ArrowRight, CircleAlert, Loader2 } from "lucide-react";
import type { ContinueAction } from "@/src/features/career-analysis/career-analysis.utils";
import { scoreBand } from "@/src/features/career-analysis/career-analysis.utils";

interface ContinueCardProps {
  action: ContinueAction;
  resumeName?: string; // Filename when known, used as fallback subject
}

// Landing spot for returning users: shows current work and primary action.
// Score is supporting context, not the headline — avoids feeling like a report card.
export function ContinueCard({ action, resumeName }: ContinueCardProps) {
  const { intent, href, actionLabel, roleTitle, readinessScore, progress } =
    action;

  const isAnalyzing = intent === "watch-analysis";
  const isFailed = intent === "retry-analysis";
  const showScore = readinessScore !== null && !isAnalyzing && !isFailed;
  const showProgress = progress !== null && progress.total > 0;

  return (
    <section className="continue-card">
      <div className="continue-card-body">
        <p className="continue-card-subject">
          {roleTitle ?? resumeName ?? "Your resume"}
        </p>

        <h2 className="continue-card-headline">{headlineFor(action)}</h2>

        {(showScore || showProgress || isAnalyzing || isFailed) && (
          <div className="continue-card-meta">
            {isAnalyzing && (
              <span className="continue-card-status">
                <Loader2
                  className="continue-card-status-icon continue-card-status-icon--spin size-4"
                  aria-hidden="true"
                />
                Analysis in progress
              </span>
            )}

            {isFailed && (
              <span className="continue-card-status continue-card-status--failed">
                <CircleAlert
                  className="continue-card-status-icon size-4"
                  aria-hidden="true"
                />
                Analysis didn&apos;t finish
              </span>
            )}

            {showScore && (
              <span
                className={`continue-card-score continue-card-score--${scoreBand(
                  readinessScore,
                )}`}
              >
                {readinessScore}% ready
              </span>
            )}

            {showProgress && (
              <span className="continue-card-tasks">
                {progress.completed} of {progress.total} tasks done
              </span>
            )}
          </div>
        )}

        {showProgress && (
          <div
            className="continue-card-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={progress.total}
            aria-valuenow={progress.completed}
            aria-label="Roadmap tasks completed"
          >
            <div
              className="continue-card-track-fill"
              style={{
                transform: `scaleX(${progress.completed / progress.total})`,
              }}
            />
          </div>
        )}
      </div>

      <Link href={href} className="continue-card-action">
        {actionLabel}
        <ArrowRight
          className="continue-card-action-arrow size-4"
          aria-hidden="true"
        />
      </Link>
    </section>
  );
}

// User-friendly headlines for each state. Each must stand alone as the
// largest text on the dashboard, so none repeat the role title above.
function headlineFor(action: ContinueAction): string {
  switch (action.intent) {
    case "choose-role":
      return "Pick the role you're aiming for.";
    case "watch-analysis":
      return "We're reading your resume now.";
    case "retry-analysis":
      return "That analysis stopped early.";
    case "generate-roadmap":
      return "Your gaps are ready to turn into a plan.";
    case "reassess":
      return "You finished every task on your roadmap.";
    case "resume-roadmap":
      return "Pick up where you left off.";
  }
}
