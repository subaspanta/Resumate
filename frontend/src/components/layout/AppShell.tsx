"use client";

import { type ReactNode } from "react";
import { ChevronRight, Menu } from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/src/components/layout/Sidebar";
import { DashboardFooter } from "@/src/components/layout/DashboardFooter";
import { FlowStepRail } from "@/src/components/layout/FlowStepRail";
import type { FlowStepKey } from "@/src/components/layout/flow-steps";
import { useSidebar } from "@/src/providers/sidebar-provider";
import { DASHBOARD_VIEW_LAYOUT } from "@/src/components/dashboard/dashboardViewConfig";
import type { DashboardView } from "@/src/features/resume/types";

// Layout owns the sidebar offset shared by shell children.
function getSidebarOffset(
  isCollapsible: boolean,
  isSidebarCollapsed: boolean,
): string {
  return isCollapsible && isSidebarCollapsed
    ? "var(--spacing-sidebar-collapsed-width)"
    : "var(--spacing-sidebar-width)";
}

export interface Crumb {
  label: string;
  href?: string;
}

interface AppShellProps {
  /** Omit outside the upload-to-roadmap flow. */
  step?: FlowStepKey;
  /** Overrides the nav highlight derived from `step`. */
  activeNav?: "dashboard" | "workspace" | "roadmap" | "settings";
  view?: DashboardView;
  crumbs: Crumb[];
  title: ReactNode;
  subtitle?: ReactNode;
  /** Page-level actions (export, etc.) aligned opposite the title. */
  actions?: ReactNode;
  /** Metadata row under the title — scores on analysis, file info elsewhere. */
  meta?: ReactNode;
  onNavigateStep?: (step: FlowStepKey) => void;
  width?: "wide" | "narrow";
  /** Reserves bottom space for a page-owned fixed action bar. */
  hasActionBar?: boolean;
  children: ReactNode;
}

/** Shared chrome for authenticated surfaces; pages provide only content. */
export function AppShell({
  step,
  activeNav,
  view = "active",
  crumbs,
  title,
  subtitle,
  actions,
  meta,
  onNavigateStep,
  width = "wide",
  hasActionBar = false,
  children,
}: AppShellProps) {
  const { isCollapsed, toggle, isMobileOpen, openMobile, closeMobile } =
    useSidebar();
  const layout = DASHBOARD_VIEW_LAYOUT[view];
  const sidebarOffset = getSidebarOffset(
    layout.sidebarCollapsible,
    isCollapsed,
  );

  return (
    // One animated offset keeps the main, footer, and action bar aligned.
    <div
      className="dashboard-shell"
      style={{ "--shell-offset": sidebarOffset } as React.CSSProperties}
    >
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={toggle}
        layout={layout}
        activeNav={
          activeNav ??
          (step === "upload"
            ? "dashboard"
            : step === "roadmap"
              ? "roadmap"
              : "workspace")
        }
        isMobileOpen={isMobileOpen}
        onCloseMobile={closeMobile}
      />

      <main className="dashboard-main">
        <div
          className={[
            "app-shell-inner",
            width === "narrow" && "app-shell-inner--narrow",
            hasActionBar && "app-shell-inner--actionbar",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <header className="app-shell-header">
            <div className="app-shell-crumb-row">
              <button
                type="button"
                className="app-shell-mobile-menu-trigger"
                onClick={openMobile}
                aria-label="Open navigation menu"
                aria-expanded={isMobileOpen}
              >
                <Menu className="size-5" aria-hidden="true" />
              </button>

              <nav className="app-shell-crumbs" aria-label="Breadcrumb">
                {crumbs.map((crumb, i) => (
                  <span key={crumb.label} className="app-shell-crumb-item">
                    {crumb.href ? (
                      <Link href={crumb.href} className="app-shell-crumb-link">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="app-shell-crumb-current">
                        {crumb.label}
                      </span>
                    )}
                    {i < crumbs.length - 1 && (
                      <ChevronRight
                        className="app-shell-crumb-sep"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                ))}
              </nav>
            </div>

            {/* Separate row gives the full five-step rail enough width. */}
            {step && (
              <nav aria-label="Progress">
                <FlowStepRail current={step} onNavigate={onNavigateStep} />
              </nav>
            )}

            <div className="app-shell-titlebar">
              <div className="app-shell-titlegroup">
                <h1 className="app-shell-title">{title}</h1>
                {subtitle && <p className="app-shell-subtitle">{subtitle}</p>}
              </div>
              {actions && <div className="app-shell-actions">{actions}</div>}
            </div>

            {meta && <div className="app-shell-meta">{meta}</div>}
          </header>

          {children}
        </div>

        <DashboardFooter />
      </main>
    </div>
  );
}
