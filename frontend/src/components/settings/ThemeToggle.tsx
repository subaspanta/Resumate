"use client";

import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

/**
 * True only once mounted on the client. `useSyncExternalStore` -- rather
 * than `useState` + `useEffect` -- gets us this without a setState call
 * inside an effect, which is a synchronous-render footgun the lint rule
 * `react-hooks/set-state-in-effect` now flags.
 */
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

const OPTIONS: { value: "light" | "dark" | "system"; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

interface ThemeToggleProps {
  /** Icon-only rendering for tight spaces (the marketing nav) -- same three
   * options, labels move to sr-only text instead of disappearing. */
  compact?: boolean;
}

/**
 * Light/dark/system control. Used labeled in Settings and compact in the
 * marketing nav. `next-themes` only knows the resolved theme after mount (it
 * reads localStorage/matchMedia client side), so the pre-mount render stays
 * inert rather than guessing -- picking a value before hydration would risk
 * it not matching the class next-themes actually applies.
 */
export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  return (
    <div
      className={cn("theme-toggle", compact && "theme-toggle--compact")}
      role="radiogroup"
      aria-label="Color theme"
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={mounted && theme === value}
          title={compact ? label : undefined}
          className={cn(
            "theme-toggle-option",
            compact && "theme-toggle-option--compact",
            mounted && theme === value && "theme-toggle-option--active",
          )}
          onClick={() => setTheme(value)}
        >
          <Icon className="theme-toggle-option-icon" aria-hidden="true" />
          <span className={compact ? "sr-only" : undefined}>{label}</span>
        </button>
      ))}
    </div>
  );
}
