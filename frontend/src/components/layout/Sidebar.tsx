"use client";

import { useAuth } from "@/src/features/auth";
import { toast } from "sonner";
import type { DashboardView } from "@/src/features/resume/types";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  userName?: string;
  view: DashboardView;
  onUploadClick?: () => void;
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
      {!isCollapsed && <span className="dashboard-nav-label">{label}</span>}
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
      {!isCollapsed && hint && (
        <span className="dashboard-nav-hint">{hint}</span>
      )}
    </>
  );
}

export function Sidebar({
  isCollapsed,
  onToggle,
  userName,
  view,
  onUploadClick,
}: SidebarProps) {
  const { logout } = useAuth();
  const isFirstTime = view === "firstTime";
  const showCollapse = !isFirstTime;

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
        showCollapse && isCollapsed ? "dashboard-sidebar--collapsed" : ""
      }`}
    >
      <div
        className={`dashboard-sidebar-brand ${
          showCollapse && isCollapsed ? "dashboard-sidebar-brand--collapsed" : ""
        }`}
      >
        {!isFirstTime && (
          <span className="dashboard-sidebar-brand-icon">
            <span
              className="material-symbols-outlined text-primary text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              description
            </span>
          </span>
        )}
        {!isCollapsed && (
          <div>
            <div className="dashboard-sidebar-brand-name">ResumeForge</div>
            {isFirstTime && (
              <p className="dashboard-sidebar-tagline">AI Resume Workspace</p>
            )}
          </div>
        )}
      </div>

      <nav className="dashboard-nav" aria-label="Main navigation">
        <NavItem
          icon="dashboard"
          label="Dashboard"
          isCollapsed={showCollapse && isCollapsed}
          isActive
          isFilled
        />
        <NavItem
          icon="description"
          label="Resume Workspace"
          isCollapsed={showCollapse && isCollapsed}
          disabled={isFirstTime}
          hint={isFirstTime ? "Upload resume to unlock." : undefined}
          onClick={() => handleUnavailable("Resume Workspace")}
        />
        <NavItem
          icon="settings"
          label="Settings"
          isCollapsed={showCollapse && isCollapsed}
          onClick={() => handleUnavailable("Settings")}
        />
      </nav>

      <div className="dashboard-sidebar-footer">
        {showCollapse && (
          <button
            onClick={onToggle}
            className="dashboard-sidebar-toggle"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            type="button"
          >
            <span className="material-symbols-outlined">
              {isCollapsed ? "menu" : "chevron_left"}
            </span>
          </button>
        )}

        <div className="dashboard-sidebar-user">
          <div
            className={`dashboard-sidebar-user-card ${
              showCollapse && isCollapsed
                ? "dashboard-sidebar-user-card--collapsed"
                : ""
            }`}
          >
            <div
              className={`dashboard-sidebar-avatar ${
                isFirstTime ? "dashboard-sidebar-avatar--sm" : ""
              }`}
            >
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden min-w-0 flex-1">
                <span className="dashboard-sidebar-user-name">
                  {userName || "Guest User"}
                </span>
                <span className="dashboard-sidebar-user-tier">Pro Account</span>
              </div>
            )}
            {isFirstTime && !isCollapsed && (
              <button
                type="button"
                className="dashboard-icon-btn ml-auto"
                aria-label="User menu"
                onClick={() => handleUnavailable("User menu")}
              >
                <span className="material-symbols-outlined text-[20px]">
                  more_vert
                </span>
              </button>
            )}
          </div>
        </div>

        {view === "active" && !isCollapsed && (
          <div className="mt-sm">
            <NavItem
              icon="logout"
              label="Sign Out"
              isCollapsed={false}
              onClick={handleLogout}
            />
          </div>
        )}
      </div>
    </aside>
  );
}
