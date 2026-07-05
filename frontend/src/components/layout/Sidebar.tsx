"use client";

import { useAuth } from "@/src/features/auth";
import { toast } from "sonner";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  userName?: string;
}

interface NavItemProps {
  icon: string;
  label: string;
  isCollapsed: boolean;
  isActive?: boolean;
  variant?: "default" | "danger";
  onClick?: () => void;
  href?: string;
}

// Shared by every sidebar item so active/hover/danger styling and the
// collapsed-label-hiding logic live in exactly one place.
function NavItem({ icon, label, isCollapsed, isActive, variant = "default", onClick, href }: NavItemProps) {
  const baseClasses =
    "flex items-center gap-md px-md py-sm rounded-lg transition-all cursor-pointer w-full text-left border-0 bg-transparent";
  const variantClasses = isActive
    ? "bg-primary-container text-primary"
    : variant === "danger"
    ? "text-danger hover:bg-red-50"
    : "text-text-body hover:bg-canvas";

  const content = (
    <>
      <span className={`material-symbols-outlined shrink-0 ${!isActive ? "font-light" : ""}`}>{icon}</span>
      {!isCollapsed && (
        <span className={`font-body-md text-body-md whitespace-nowrap ${isActive ? "font-semibold" : ""}`}>
          {label}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a className={`${baseClasses} ${variantClasses}`} href={href} aria-label={label}>
        {content}
      </a>
    );
  }

  return (
    <button className={`${baseClasses} ${variantClasses}`} onClick={onClick} aria-label={label}>
      {content}
    </button>
  );
}

export function Sidebar({ isCollapsed, onToggle, userName }: SidebarProps) {
  const { logout } = useAuth();

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
      className={`fixed left-0 top-0 h-screen bg-surface border-r border-border-base flex flex-col py-xl px-md z-50 transition-all duration-200 ${
        isCollapsed ? "w-20" : "w-sidebar-width"
      }`}
    >
      <div className={`flex items-center gap-md mb-xxl px-md ${isCollapsed ? "justify-center" : ""}`}>
        <span
          className="material-symbols-outlined text-primary text-[28px] shrink-0"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          description
        </span>
        {!isCollapsed && (
          <span className="font-headline-lg text-headline-lg text-primary font-bold whitespace-nowrap">
            ResumeForge
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-xs" aria-label="Main navigation">
        <NavItem icon="dashboard" label="Dashboard" isCollapsed={isCollapsed} isActive href="#" />
        {/* Removed "Verify Session" debug link — see chat notes on handleTestMe */}
        <NavItem
          icon="logout"
          label="Sign Out"
          isCollapsed={isCollapsed}
          variant="danger"
          onClick={handleLogout}
        />
      </nav>

      <div className="mt-auto flex flex-col">
        <button
          onClick={onToggle}
          className="flex items-center justify-center p-sm mb-md rounded-lg hover:bg-canvas text-text-muted hover:text-primary transition-all cursor-pointer border-0 bg-transparent"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="material-symbols-outlined">{isCollapsed ? "menu" : "chevron_left"}</span>
        </button>

        <div className="pt-lg border-t border-border-base">
          <div
            className={`flex items-center gap-md p-sm rounded-lg hover:bg-canvas cursor-pointer transition-all ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-lg shrink-0 select-none">
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="font-label-std text-label-std text-text-primary font-semibold truncate">
                  {userName || "Guest User"}
                </span>
                <span className="font-mono-label text-mono-label text-text-muted truncate uppercase font-medium">
                  Pro Account
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}