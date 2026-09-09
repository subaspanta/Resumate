"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

/** Sync Sonner with the app's explicit theme choice, not only OS preference. */
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
