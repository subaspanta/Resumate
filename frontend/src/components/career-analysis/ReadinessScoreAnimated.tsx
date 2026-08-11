"use client";

import { motion } from "motion/react";

interface ReadinessScoreAnimatedProps {
  score: number;
  breakdownLabel: string;
  statusClass: "excellent" | "good" | "needs-work";
  children?: React.ReactNode;
}

export function ReadinessScoreAnimated({
  score,
  breakdownLabel,
  statusClass,
  children,
}: ReadinessScoreAnimatedProps) {
  const displayScore = Math.round(score * 100);

  return (
    <div className="readiness-card">
      <div className="readiness-card-header">
        <span className="readiness-card-label">{breakdownLabel}</span>
        <motion.div
          className={`readiness-card-score readiness-card-score--${statusClass}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
          >
            {displayScore}%
          </motion.span>
        </motion.div>
      </div>

      <div className="readiness-track">
        <motion.div
          className={`readiness-track-fill readiness-track-fill--${statusClass}`}
          style={{ "--readiness-fill": score } as React.CSSProperties}
          initial={{ "--readiness-fill": 0 } as React.CSSProperties}
          animate={{ "--readiness-fill": score } as React.CSSProperties}
          transition={{
            duration: 0.9,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>

      {children}
    </div>
  );
}
