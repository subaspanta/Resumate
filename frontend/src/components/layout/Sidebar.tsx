"use client";

import {
  BarChart3,
  ChevronLeft,
  Home,
  LogOut,
  Map,
  Settings,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useAuth } from "@/src/features/auth/auth.hooks";
import { useSidebarRoadmapLink } from "@/src/components/layout/use-sidebar-roadmap-link";
import { BrandMark } from "@/src/components/layout/BrandMark";
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
  | "sidebarNavDisabled"
  | "sidebarNavHint"
  | "sidebarAvatarSize"
>;

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  layout: SidebarLayout;
  /** Nav entry owning the current surface. */
  activeNav?: "dashboard" | "workspace" | "roadmap" | "settings";
  /** Controls the off-canvas drawer below 1024px. */
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
  isActive?: boolean;
  /** Lucide has no fill axis, so an active item reads as heavier stroke. */
  isFilled?: boolean;
  disabled?: boolean;
  /** Static explanation for disabled items. */
  hint?: string;
  href?: string;
  onClick?: () => void;
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
  onClick,
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

  // Keep nav items structurally consistent; title covers collapsed labels.
  if (href && !disabled) {
    return (
      <a
        className={className}
        href={href}
        aria-label={label}
        aria-current={isActive ? "page" : undefined}
        title={isCollapsed ? label : undefined}
        onClick={onClick}
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
  isMobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  // Read user data here because Sidebar already owns logout.
  const { user, logout, isLoggingOut } = useAuth();
  const userName = user?.name;
  const userEmail = user?.email;
  const showCollapse = layout.sidebarCollapsible;
  const collapsed = showCollapse && isCollapsed;
  const firstNavLinkRef = useRef<HTMLAnchorElement>(null);

  // Route directly to the active roadmap when one exists.
  const { href: roadmapHref, disabled: roadmapDisabled } =
    useSidebarRoadmapLink();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully.");
    } catch (error) {
      toast.error("Logout failed.");
      console.error(error);
    }
  };

  // Focus the mobile nav and support Escape-to-close.
  useEffect(() => {
    if (!isMobileOpen) return;

    firstNavLinkRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseMobile?.();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  return (
    <>
      {isMobileOpen && (
        <div
          className="dashboard-sidebar-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}
      <aside
        className={`dashboard-sidebar ${
          collapsed ? "dashboard-sidebar--collapsed" : ""
        } ${isMobileOpen ? "dashboard-sidebar--mobile-open" : ""}`}
      >
        <Link
          href="/"
          ref={firstNavLinkRef}
          aria-label="Resumate home"
          className={`dashboard-sidebar-brand ${
            collapsed ? "dashboard-sidebar-brand--collapsed" : ""
          }`}
          onClick={onCloseMobile}
        >
          <BrandMark />
          <div
            className={`dashboard-sidebar-brand-text ${
              collapsed ? "dashboard-sidebar-brand-text--collapsed" : ""
            }`}
          >
            <div className="brand-wordmark">Resumate</div>
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
            onClick={onCloseMobile}
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
            onClick={onCloseMobile}
          />
          <NavItem
            icon={Map}
            label="Roadmap"
            isCollapsed={collapsed}
            isActive={activeNav === "roadmap"}
            isFilled={activeNav === "roadmap"}
            disabled={roadmapDisabled}
            hint={roadmapDisabled ? "Generate a roadmap to unlock." : undefined}
            href={roadmapHref}
            onClick={onCloseMobile}
          />
          <NavItem
            icon={Settings}
            label="Settings"
            isCollapsed={collapsed}
            isActive={activeNav === "settings"}
            isFilled={activeNav === "settings"}
            href="/settings"
            onClick={onCloseMobile}
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
                <span className="dashboard-sidebar-user-email">
                  {userEmail}
                </span>
              )}
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="dashboard-sidebar-signout tap-target-44"
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
              className="size-4"
              style={{
                transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
              }}
              aria-hidden="true"
            />
          </button>
        )}
      </aside>
    </>
  );
}
