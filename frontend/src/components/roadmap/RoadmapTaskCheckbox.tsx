"use client";

import { motion } from "motion/react";

interface RoadmapTaskCheckboxProps {
  completed: boolean;
  onChange: (completed: boolean) => void;
  disabled?: boolean;
}

export function RoadmapTaskCheckbox({
  completed,
  onChange,
  disabled = false,
}: RoadmapTaskCheckboxProps) {
  return (
    <motion.button
      type="button"
      className="roadmap-task-toggle"
      onClick={() => onChange(!completed)}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.1 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      aria-label={completed ? "Mark incomplete" : "Mark complete"}
    >
      <motion.svg
        className="roadmap-task-checkbox"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        initial={false}
        animate={completed ? "checked" : "unchecked"}
        variants={{
          unchecked: { pathLength: 1 },
          checked: { pathLength: 1 },
        }}
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <motion.path
          d="M9 12l2 2 4-4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={completed ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </motion.svg>
    </motion.button>
  );
}
