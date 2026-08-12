"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface SidebarContextValue {
  isCollapsed: boolean;
  toggle: () => void;
  /** Off-canvas drawer state below the 768px breakpoint — independent of
   * `isCollapsed`, which is the desktop icon-rail preference. Conflating the
   * two would mean opening the mobile drawer could leave the sidebar stuck
   * collapsed on desktop, or vice versa. */
  isMobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

/**
 * Sidebar collapse is a user preference, not per-page state, so it can't live
 * inside AppShell — every route mounts its own AppShell, and the dashboard
 * owns a second copy in app/page.tsx. Collapsing then navigating reset it,
 * and the two owners never agreed with each other. Hoisting it to the root
 * layout gives the whole authenticated app one source of truth.
 *
 * Deliberately in-memory: persisting to localStorage would survive a reload
 * too, but the server can't read localStorage, so the first paint would show
 * the sidebar expanded and then snap it closed. Fixing that needs a blocking
 * inline script in <head>. Not worth it until someone actually complains.
 */
export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggle = useCallback(() => setIsCollapsed((prev) => !prev), []);
  const openMobile = useCallback(() => setIsMobileOpen(true), []);
  const closeMobile = useCallback(() => setIsMobileOpen(false), []);

  const value = useMemo(
    () => ({ isCollapsed, toggle, isMobileOpen, openMobile, closeMobile }),
    [isCollapsed, toggle, isMobileOpen, openMobile, closeMobile],
  );

  return <SidebarContext value={value}>{children}</SidebarContext>;
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
