"use client";

import {
  ChevronLeft,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/src/features/auth/auth.hooks";
import { toast } from "sonner";
import type { DashboardViewLayout } from "@/src/components/dashboard/dashboardViewConfig";

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
  layout: SidebarLayout;
  /**
   * Which nav entry the current surface belongs to. The workspace and analysis
   * pages are both "inside" the resume workspace, so they keep that item lit
   * rather than falsely highlighting Dashboard.
   */
  activeNav?: "dashboard" | "workspace";
}

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
  isActive?: boolean;
  /** Lucide has no fill axis, so an active item reads as heavier stroke. */
  isFilled?: boolean;
  disabled?: boolean;
  hint?: string;
  onClick?: () => void;
  href?: string;
}

function NavItem({
  icon: Icon,
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
      <Icon
        className="size-6 shrink-0"
        strokeWidth={isFilled ? 2.4 : 2}
        aria-hidden="true"
      />
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
  layout,
  activeNav = "dashboard",
}: SidebarProps) {
  // Read the signed-in user here rather than taking it as a prop: this
  // component already depends on useAuth for logout, and the dashboard used to
  // drill the same name down three levels to reach it.
  const { user, logout, isLoggingOut } = useAuth();
  const userName = user?.name;
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
            <FileText
              className="size-7 text-primary"
              strokeWidth={2.4}
              aria-hidden="true"
            />
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
          icon={LayoutDashboard}
          label="Dashboard"
          isCollapsed={collapsed}
          isActive={activeNav === "dashboard"}
          isFilled={activeNav === "dashboard"}
          href="/"
        />
        <NavItem
          icon={FileText}
          label="Resume Workspace"
          isCollapsed={collapsed}
          isActive={activeNav === "workspace"}
          isFilled={activeNav === "workspace"}
          disabled={layout.sidebarNavDisabled}
          hint={layout.sidebarNavHint}
          onClick={() => handleUnavailable("Resume Workspace")}
        />
        <NavItem
          icon={Settings}
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
            <LogOut className="size-5" aria-hidden="true" />
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
          <ChevronLeft
            className="size-[18px]"
            style={{
              transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
            }}
            aria-hidden="true"
          />
        </button>
      )}
    </aside>
  );
}
