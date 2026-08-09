"use client";

import { motion } from "motion/react";

interface RoadmapProgressAnimatedProps {
  completed: number;
  total: number;
}

export function RoadmapProgressAnimated({
  completed,
  total,
}: RoadmapProgressAnimatedProps) {
  const fillRatio = total > 0 ? completed / total : 0;

  return (
    <div className="roadmap-progress">
      <div className="roadmap-progress-header">
        <span className="roadmap-progress-label">Overall Progress</span>
        <motion.span
          className="roadmap-progress-count"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {completed} of {total}
        </motion.span>
      </div>

      <div className="roadmap-progress-track">
        <motion.div
          className="roadmap-progress-fill"
          style={{ "--roadmap-fill": fillRatio } as React.CSSProperties}
          initial={{ "--roadmap-fill": 0 } as React.CSSProperties}
          animate={{ "--roadmap-fill": fillRatio } as React.CSSProperties}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>
    </div>
  );
}
