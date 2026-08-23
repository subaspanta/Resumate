"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, CircleDashed, TrendingUp } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

const SKILLS = [
  { name: "React & component architecture", status: "proven" as const },
  { name: "REST API integration", status: "proven" as const },
  { name: "Automated testing", status: "gap" as const },
  { name: "System design fundamentals", status: "gap" as const },
];

const READINESS = 62;

// The page's one authored moment, so it gets a real budget: rows resolve one
// at a time rather than arriving together, because watching evidence be
// judged is the product's whole proposition.
const ROW_STAGGER_MS = 110;
const ROW_START_MS = 260;
const COUNT_DURATION_MS = 900;

/**
 * Counts to the readiness figure once the sequence starts. A count-up is the
 * one treatment that shows a score being *arrived at* rather than asserted —
 * which is the distinction the product is selling.
 *
 * Returns the target untouched until `enabled` flips, so the resting card
 * (server render, reduced motion, failed script) shows the real number.
 */
function useCountUp(target: number, enabled: boolean) {
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / COUNT_DURATION_MS, 1);
      // Same expo-out the CSS uses, so the number decelerates on the curve
      // everything else in the system moves on.
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, enabled]);

  return value;
}

/**
 * Real small-scale reproduction of the in-product evidence/gap card, not a
 * div-based fake screenshot: same status vocabulary (proven vs gap) the
 * actual career-analysis UI uses.
 *
 * It assembles itself on load — each skill starts unresolved and settles into
 * proven or gap — because a static picture of the output can't show that the
 * product *reads* a resume rather than just listing one.
 */
export function EvidencePreviewCard() {
  const reduceMotion = useReducedMotion();
  // Gate on mount, not on render: the server has no way to know the visitor's
  // motion preference, so the markup it sends must already be the resolved
  // card. Animation is something the client opts into afterwards.
  const [animate, setAnimate] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current || reduceMotion) return;
    hasRun.current = true;
    setAnimate(true);
  }, [reduceMotion]);

  const readiness = useCountUp(READINESS, animate);

  return (
    <motion.div
      // Below lg the hero is a single column, so this fills the track full
      // width -- same as the "three steps" tiles further down the page, which
      // don't cap themselves either. From lg the hero splits into two columns
      // and this sits in the half-width one, where 24rem is the right size.
      className="w-full rounded-xl border border-border-base bg-surface p-6 lg:max-w-[24rem]"
      initial={false}
      animate={animate ? { opacity: [0, 1], y: [12, 0] } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono-label text-mono-label uppercase tracking-[0.08em] text-text-muted">
          Frontend Engineer
        </span>
        <span className="flex items-center gap-1 rounded-full bg-primary-container px-2.5 py-1 font-mono-label text-mono-label text-primary">
          <TrendingUp className="size-3" strokeWidth={2} />
          {readiness}% ready
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {SKILLS.map((skill, index) => (
          <SkillRow
            // Keyed on `animate` so flipping it remounts the row: the pending
            // state is seeded at mount, and a row already mounted as resolved
            // must not jump backwards into pending.
            key={`${skill.name}-${animate}`}
            name={skill.name}
            status={skill.status}
            animate={animate}
            delayMs={ROW_START_MS + index * ROW_STAGGER_MS}
          />
        ))}
      </div>

      <motion.div
        className="mt-5 border-t border-border-base pt-4"
        initial={false}
        animate={animate ? { opacity: [0, 1] } : { opacity: 1 }}
        transition={{
          duration: 0.3,
          delay: (ROW_START_MS + SKILLS.length * ROW_STAGGER_MS) / 1000,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <p className="text-body-md text-text-body">
          2 gaps found. Your roadmap is ready.
        </p>
      </motion.div>
    </motion.div>
  );
}

interface SkillRowProps {
  name: string;
  status: "proven" | "gap";
  animate: boolean;
  delayMs: number;
}

/**
 * Holds an unresolved dashed circle until its turn, then settles into its
 * verdict.
 *
 * `pending` only ever goes true→false, and starts false: the resting card
 * (server render, reduced motion, failed script) is the finished result
 * rather than a row of placeholders that never resolve.
 */
function SkillRow({ name, status, animate, delayMs }: SkillRowProps) {
  const [pending, setPending] = useState(animate);

  useEffect(() => {
    if (!animate) return;
    const timer = setTimeout(() => setPending(false), delayMs);
    return () => clearTimeout(timer);
  }, [animate, delayMs]);

  const resolved = !pending;
  const isProven = status === "proven" && resolved;

  return (
    <div className="flex items-center gap-3">
      {isProven ? (
        <motion.span
          initial={animate ? { scale: 0.6, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="flex shrink-0"
        >
          <CheckCircle2
            className="size-4 text-score-excellent"
            strokeWidth={2}
          />
        </motion.span>
      ) : (
        <CircleDashed
          className={`size-4 shrink-0 transition-colors duration-200 ${
            resolved ? "text-text-muted" : "text-border-input"
          }`}
          strokeWidth={2}
        />
      )}
      <span
        className={`text-body-md transition-colors duration-300 ${
          !resolved
            ? "text-text-muted"
            : status === "proven"
              ? "text-text-primary"
              : "text-text-muted"
        }`}
      >
        {name}
      </span>
    </div>
  );
}
