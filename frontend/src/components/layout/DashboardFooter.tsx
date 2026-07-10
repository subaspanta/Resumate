"use client";

interface DashboardFooterProps {
  isSidebarCollapsed: boolean;
  variant?: "fixed" | "inline";
}

export function DashboardFooter({
  isSidebarCollapsed,
  variant = "fixed",
}: DashboardFooterProps) {
  const sidebarOffset = isSidebarCollapsed
    ? "var(--spacing-sidebar-collapsed-width)"
    : "var(--spacing-sidebar-width)";

  if (variant === "inline") {
    return (
      <footer className="dashboard-footer--inline">
        <span className="dashboard-footer-copy">
          © 2024 ResumeForge. All rights reserved.
        </span>
        <div className="dashboard-footer-links">
          <a className="dashboard-footer-link" href="#">
            Privacy Policy
          </a>
          <a className="dashboard-footer-link" href="#">
            Terms of Service
          </a>
          <a className="dashboard-footer-link" href="#">
            Contact Support
          </a>
        </div>
      </footer>
    );
  }

  return (
    <footer
      className="dashboard-footer"
      style={{ marginLeft: sidebarOffset }}
    >
      <div className="dashboard-footer-inner">
        <span className="dashboard-footer-copy">
          © 2024 ResumeForge. All rights reserved.
        </span>
        <div className="dashboard-footer-links">
          <a className="dashboard-footer-link" href="#">
            Privacy Policy
          </a>
          <a className="dashboard-footer-link" href="#">
            Terms of Service
          </a>
          <a className="dashboard-footer-link" href="#">
            Contact Support
          </a>
        </div>
      </div>
    </footer>
  );
}
