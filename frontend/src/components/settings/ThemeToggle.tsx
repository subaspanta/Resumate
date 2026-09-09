"use client";

import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

/** Client-mounted state without an effect state update or hydration mismatch. */
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

const OPTIONS: {
  value: "light" | "dark" | "system";
  label: string;
  icon: LucideIcon;
}[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

interface ThemeToggleProps {
  /** Use icon-only controls while retaining screen-reader labels. */
  compact?: boolean;
}

/** Theme control that stays inert until next-themes resolves on the client. */
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
