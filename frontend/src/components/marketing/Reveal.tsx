"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Fades + lifts content in once it enters the viewport. Uses
 * IntersectionObserver rather than a scroll listener (no per-frame React
 * state churn).
 *
 * Content starts *visible* and is hidden only after mount, once we know the
 * visitor accepts motion. Hiding in the initial render instead would send
 * `opacity: 0` markup from the server — where the motion preference is
 * unknowable — and leave reduced-motion visitors staring at an invisible
 * page until hydration caught up, or forever if the script failed.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || revealed) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Already on screen at mount (the hero, typically): there is nothing to
    // scroll into, so animating it would mean hiding content the visitor can
    // already see.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    setHidden(true);

    const show = () => {
      setHidden(false);
      setRevealed(true);
    };

    // Any part of the element entering the viewport is enough. A fractional
    // threshold would strand anything taller than the viewport — it can never
    // reach 20% visible, so it would stay hidden permanently.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);

    // Backstop: if the observer somehow never fires, content must not stay
    // invisible. Hiding content is only ever acceptable while an animation is
    // actually coming.
    const failsafe = setTimeout(show, 2500);

    return () => {
      observer.disconnect();
      clearTimeout(failsafe);
    };
  }, [revealed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transitionProperty: "opacity, transform",
        transitionDuration: "400ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${delay}ms`,
        opacity: hidden ? 0 : 1,
        transform: hidden ? "translateY(16px)" : "translateY(0)",
      }}
    >
      {children}
    </div>
  );
}
