"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/src/components/layout/Sidebar";
import { DashboardFooter } from "@/src/components/layout/DashboardFooter";
import { getSidebarOffset, type DashboardView } from "@/src/features/resume/types";
import { DASHBOARD_VIEW_LAYOUT } from "@/src/components/dashboard/shell/dashboardViewConfig";

interface DashboardShellProps {
  view: DashboardView;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  userName?: string;
  children: ReactNode;
}

export function DashboardShell({
  view,
  isSidebarCollapsed,
  onToggleSidebar,
  userName,
  children,
}: DashboardShellProps) {
  const layout = DASHBOARD_VIEW_LAYOUT[view];
  const sidebarOffset = getSidebarOffset(layout.sidebarCollapsible, isSidebarCollapsed);

  return (
    <>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={onToggleSidebar}
        userName={userName}
        layout={layout}
      />

      <main className="dashboard-main" style={{ marginLeft: sidebarOffset }}>
        {children}

        <DashboardFooter
          variant={layout.footerVariant}
          isSidebarCollapsible={layout.sidebarCollapsible}
          isSidebarCollapsed={isSidebarCollapsed}
        />
      </main>
    </>
  );
}
