"use client";

import { getSidebarOffset } from "@/src/features/resume/types";

interface DashboardFooterProps {
  isSidebarCollapsible: boolean;
  isSidebarCollapsed: boolean;
  variant?: "fixed" | "inline";
}

export function DashboardFooter({
  isSidebarCollapsible,
  isSidebarCollapsed,
  variant = "fixed",
}: DashboardFooterProps) {
  const sidebarOffset = getSidebarOffset(isSidebarCollapsible, isSidebarCollapsed);

  return (
    <footer
      className="dashboard-footer"
      style={variant === "fixed" ? { marginLeft: sidebarOffset } : undefined}
    >
      <div className="dashboard-footer-inner">
        <span className="dashboard-footer-copy">© 2024 ResuMate</span>
      </div>
    </footer>
  );
}
