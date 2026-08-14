"use client";

import { useCallback, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";

// Much steeper than the upload zone's 5deg: corner travel scales with element
// size, so a 32px mark needs a large angle to move the same perceptible
// distance a 750px zone gets from a slight one. Paired with the short
// perspective on .brand-mark-stage, which is what keeps this reading as a
// solid square turning rather than a flat shape skewing.
const MAX_TILT_DEG = 22;

/**
 * The "R" square in the sidebar. Tilts toward the cursor — the one moment in
 * the app where the brand itself responds, which is why the effect lives here
 * and not on buttons or nav icons (small targets can't show perspective, and
 * spending it everywhere would spend its meaning).
 *
 * Bounds are measured once on pointer enter rather than on every move: a
 * getBoundingClientRect() per mousemove is a forced synchronous layout, and
 * this element sits in a sidebar that animates its own width.
 */
export function BrandMark() {
  const stageRef = useRef<HTMLSpanElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const reduceMotion = useReducedMotion();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 260, damping: 20 });
  const springY = useSpring(pointerY, { stiffness: 260, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [MAX_TILT_DEG, -MAX_TILT_DEG]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-MAX_TILT_DEG, MAX_TILT_DEG]);

  const handlePointerEnter = useCallback(() => {
    boundsRef.current = stageRef.current?.getBoundingClientRect() ?? null;
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLSpanElement>) => {
      if (reduceMotion || e.pointerType !== "mouse") return;
      const bounds = boundsRef.current;
      if (!bounds) return;
      pointerX.set((e.clientX - bounds.left) / bounds.width - 0.5);
      pointerY.set((e.clientY - bounds.top) / bounds.height - 0.5);
    },
    [pointerX, pointerY, reduceMotion],
  );

  const handlePointerLeave = useCallback(() => {
    boundsRef.current = null;
    pointerX.set(0);
    pointerY.set(0);
  }, [pointerX, pointerY]);

  return (
    // Tracking sits on a padded stage rather than the 32px square itself:
    // hitting a 32px target precisely is fussy, and reacting as the cursor
    // approaches is what makes the mark feel responsive rather than picky.
    <span
      ref={stageRef}
      className="brand-mark-stage"
      aria-hidden="true"
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.span className="brand-mark" style={{ rotateX, rotateY }}>
        R
      </motion.span>
    </span>
  );
}
