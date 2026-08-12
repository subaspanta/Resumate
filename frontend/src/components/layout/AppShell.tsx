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

// A sidebar pixel offset belongs to the layout, not to the resume feature —
// this shell is its only consumer.
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
  /** Omit on surfaces outside the linear upload->role->analysis->roadmap
   * journey (e.g. an analyses list) — the step rail only makes sense inside
   * that flow. */
  step?: FlowStepKey;
  /** Overrides the sidebar highlight derived from `step` — for surfaces
   * outside the linear flow (settings) that still need a lit nav item. */
  activeNav?: "dashboard" | "workspace" | "settings";
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

/**
 * One shell for every authenticated surface. The dashboard, the job-description
 * step, and the review step previously rendered three unrelated layouts — a
 * sidebar shell, a bare centered <main>, and another bare <main> — which is why
 * the journey read as three products. They now share this chrome, and differ
 * only in the content slot.
 */
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
    // --shell-offset is the single animated source for every element that has
    // to clear the sidebar: the main column, the footer, and the analysis
    // action bar. See the @property declaration in layout.css.
    <div
      className="dashboard-shell"
      style={{ "--shell-offset": sidebarOffset } as React.CSSProperties}
    >
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={toggle}
        layout={layout}
        activeNav={
          activeNav ?? (step === "upload" ? "dashboard" : "workspace")
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

            <div className="app-shell-titlebar">
              <div className="app-shell-titlegroup">
                <h1 className="app-shell-title">{title}</h1>
                {subtitle && <p className="app-shell-subtitle">{subtitle}</p>}
              </div>
              {actions && <div className="app-shell-actions">{actions}</div>}
            </div>

            {meta && <div className="app-shell-meta">{meta}</div>}

            {step && (
              <FlowStepRail current={step} onNavigate={onNavigateStep} />
            )}
          </header>

          {children}
        </div>

        <DashboardFooter />
      </main>
    </div>
  );
}
