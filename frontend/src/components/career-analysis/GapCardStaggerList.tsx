"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface GapCardStaggerListProps {
  items: ReactNode[];
  className?: string;
}

export function GapCardStaggerList({
  items,
  className = "",
}: GapCardStaggerListProps) {
  return (
    <motion.div
      className={`gap-list ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
    >
      {items.map((item, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              },
            },
          }}
        >
          {item}
        </motion.div>
      ))}
    </motion.div>
  );
}
