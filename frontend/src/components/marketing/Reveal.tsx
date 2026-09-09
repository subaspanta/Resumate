"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/** Reveal below-fold content without hiding server-rendered or reduced-motion content. */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || revealed) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Do not hide content already visible at mount.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    setHidden(true);

    const show = () => {
      setHidden(false);
      setRevealed(true);
    };

    // Use intersection instead of a fractional visibility threshold for tall elements.
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

    // Never leave content hidden if the observer fails.
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
