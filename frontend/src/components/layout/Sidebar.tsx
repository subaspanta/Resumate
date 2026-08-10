"use client";

import {
  BarChart3,
  ChevronLeft,
  Home,
  LogOut,
  Settings,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/src/features/auth/auth.hooks";
import { toast } from "sonner";
import type { DashboardViewLayout } from "@/src/components/dashboard/dashboardViewConfig";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  activeNav?: "dashboard" | "workspace" | "settings";
}

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
  isActive?: boolean;
  /** Lucide has no fill axis, so an active item reads as heavier stroke. */
  isFilled?: boolean;
  disabled?: boolean;
  /**
   * Shown as static copy under the item, never as a toast — a disabled item
   * gets exactly one explanation, not a click-triggered second one that can
   * disagree with the first.
   */
  hint?: string;
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

  // One element shape (button) for both enabled and disabled states — a
  // disabled item used to render as a <button> while every enabled item was
  // an <a>, so the "same list" had two different interaction models. The
  // collapsed rail hides the label entirely, so `title` is the one thing
  // standing in for it on hover; aria-label already covers screen readers.
  if (href && !disabled) {
    return (
      <a
        className={className}
        href={href}
        aria-label={label}
        aria-current={isActive ? "page" : undefined}
        title={isCollapsed ? label : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <>
      <button
        className={className}
        disabled={disabled}
        aria-label={label}
        aria-disabled={disabled}
        title={isCollapsed ? label : undefined}
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
  const userEmail = user?.email;
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

  return (
    <aside
      className={`dashboard-sidebar ${
        collapsed ? "dashboard-sidebar--collapsed" : ""
      }`}
    >
      <Link
        href="/"
        aria-label="ResuMate home"
        className={`dashboard-sidebar-brand ${
          collapsed ? "dashboard-sidebar-brand--collapsed" : ""
        }`}
      >
        {layout.sidebarShowBrandIcon && (
          <span className="dashboard-sidebar-brand-mark" aria-hidden="true">
            R
          </span>
        )}
        <div
          className={`dashboard-sidebar-brand-text ${
            collapsed ? "dashboard-sidebar-brand-text--collapsed" : ""
          }`}
        >
          <div className="dashboard-sidebar-brand-name">ResuMate</div>
          {layout.sidebarShowTagline && (
            <p className="dashboard-sidebar-tagline">Career Gap Analysis</p>
          )}
        </div>
      </Link>

      <nav className="dashboard-nav" aria-label="Main navigation">
        <NavItem
          icon={Home}
          label="Dashboard"
          isCollapsed={collapsed}
          isActive={activeNav === "dashboard"}
          isFilled={activeNav === "dashboard"}
          href="/"
        />
        <NavItem
          icon={BarChart3}
          label="Analyses"
          isCollapsed={collapsed}
          isActive={activeNav === "workspace"}
          isFilled={activeNav === "workspace"}
          disabled={layout.sidebarNavDisabled}
          hint={layout.sidebarNavHint}
          href={layout.sidebarNavDisabled ? undefined : "/analyses"}
        />
        <NavItem
          icon={Settings}
          label="Settings"
          isCollapsed={collapsed}
          isActive={activeNav === "settings"}
          isFilled={activeNav === "settings"}
          href="/settings"
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
            {userEmail && (
              <span className="dashboard-sidebar-user-email">{userEmail}</span>
            )}
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                className="dashboard-sidebar-signout"
                aria-label="Sign out"
                disabled={isLoggingOut}
              >
                <LogOut className="size-5" aria-hidden="true" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sign out?</AlertDialogTitle>
                <AlertDialogDescription>
                  You&apos;ll need to sign back in to continue your roadmap.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>
                  Sign out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
            className="size-3.5"
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
