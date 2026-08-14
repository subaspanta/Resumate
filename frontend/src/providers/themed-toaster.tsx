"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

/**
 * Sonner's own `theme` prop defaults to "light" and, even set to "system",
 * only reads matchMedia -- it has no way to know about an explicit
 * light/dark choice made through this app's own toggle. Reading
 * `resolvedTheme` from next-themes keeps toasts in sync with whatever the
 * user actually picked, not just their OS preference.
 */
export function ThemedToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      position="top-right"
      richColors
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
}
