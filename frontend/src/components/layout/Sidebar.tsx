"use client";

import { useAuth } from "@/src/features/auth";
import { toast } from "sonner";
import type { DashboardViewLayout } from "@/src/components/dashboard/shell/dashboardViewConfig";

type SidebarLayout = Pick<
  DashboardViewLayout,
  | "sidebarCollapsible"
  | "sidebarShowBrandIcon"
  | "sidebarShowTagline"
  | "sidebarNavDisabled"
  | "sidebarNavHint"
  | "sidebarAvatarSize"
>;

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  userName?: string;
  layout: SidebarLayout;
}

interface NavItemProps {
  icon: string;
  label: string;
  isCollapsed: boolean;
  isActive?: boolean;
  isFilled?: boolean;
  disabled?: boolean;
  hint?: string;
  onClick?: () => void;
  href?: string;
}

function NavItem({
  icon,
  label,
  isCollapsed,
  isActive,
  isFilled,
  disabled,
  hint,
  onClick,
  href,
}: NavItemProps) {
  const className = [
    "dashboard-nav-item",
    isActive && "dashboard-nav-item--active",
    disabled && "dashboard-nav-item--disabled",
    isCollapsed && "dashboard-nav-item--collapsed",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <span
        className="material-symbols-outlined shrink-0"
        style={isFilled ? { fontVariationSettings: "'FILL' 1" } : undefined}
      >
        {icon}
      </span>
      <span
        className={`dashboard-nav-label ${
          isCollapsed ? "dashboard-nav-label--collapsed" : ""
        }`}
      >
        {label}
      </span>
    </>
  );

  if (href && !disabled) {
    return (
      <a className={className} href={href} aria-label={label}>
        {content}
      </a>
    );
  }

  return (
    <>
      <button
        className={className}
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        type="button"
      >
        {content}
      </button>
      {hint && (
        <span
          className={`dashboard-nav-hint ${
            isCollapsed ? "dashboard-nav-hint--collapsed" : ""
          }`}
        >
          {hint}
        </span>
      )}
    </>
  );
}

export function Sidebar({
  isCollapsed,
  onToggle,
  userName,
  layout,
}: SidebarProps) {
  const { logout, isLoggingOut } = useAuth();
  const showCollapse = layout.sidebarCollapsible;
  const collapsed = showCollapse && isCollapsed;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully.");
    } catch (error) {
      toast.error("Logout failed.");
      console.error(error);
    }
  };

  const handleUnavailable = (feature: string) =>
    toast.info(`${feature} is not available yet.`);

  return (
    <aside
      className={`dashboard-sidebar ${
        collapsed ? "dashboard-sidebar--collapsed" : ""
      }`}
    >
      <div
        className={`dashboard-sidebar-brand ${
          collapsed ? "dashboard-sidebar-brand--collapsed" : ""
        }`}
      >
        {layout.sidebarShowBrandIcon && (
          <span className="dashboard-sidebar-brand-icon">
            <span
              className="material-symbols-outlined text-primary text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              description
            </span>
          </span>
        )}
        <div
          className={`dashboard-sidebar-brand-text ${
            collapsed ? "dashboard-sidebar-brand-text--collapsed" : ""
          }`}
        >
          <div className="dashboard-sidebar-brand-name">ResuMate</div>
          {layout.sidebarShowTagline && (
            <p className="dashboard-sidebar-tagline">AI Resume Workspace</p>
          )}
        </div>
      </div>

      <nav className="dashboard-nav" aria-label="Main navigation">
        <NavItem
          icon="dashboard"
          label="Dashboard"
          isCollapsed={collapsed}
          isActive
          isFilled
        />
        <NavItem
          icon="description"
          label="Resume Workspace"
          isCollapsed={collapsed}
          disabled={layout.sidebarNavDisabled}
          hint={layout.sidebarNavHint}
          onClick={() => handleUnavailable("Resume Workspace")}
        />
        <NavItem
          icon="settings"
          label="Settings"
          isCollapsed={collapsed}
          onClick={() => handleUnavailable("Settings")}
        />
      </nav>

      <div className="dashboard-sidebar-footer">
        <div
          className={`dashboard-sidebar-user-card ${
            collapsed ? "dashboard-sidebar-user-card--collapsed" : ""
          }`}
        >
          <div
            className={`dashboard-sidebar-avatar ${
              layout.sidebarAvatarSize === "sm"
                ? "dashboard-sidebar-avatar--sm"
                : ""
            }`}
          >
            {userName ? userName.charAt(0).toUpperCase() : "U"}
          </div>
          <div
            className={`dashboard-sidebar-user-text ${
              collapsed ? "dashboard-sidebar-user-text--collapsed" : ""
            }`}
          >
            <span className="dashboard-sidebar-user-name">
              {userName || "Guest User"}
            </span>
            <span className="dashboard-sidebar-user-tier">Pro Account</span>
          </div>
          <button
            type="button"
            className="dashboard-sidebar-signout"
            aria-label="Sign out"
            disabled={isLoggingOut}
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined text-[20px]">
              logout
            </span>
          </button>
        </div>
      </div>

      {showCollapse && (
        <button
          onClick={onToggle}
          className="dashboard-sidebar-toggle"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          type="button"
        >
          <span
            className="material-symbols-outlined text-[18px]"
            style={{
              transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            chevron_left
          </span>
        </button>
      )}
    </aside>
  );
}
