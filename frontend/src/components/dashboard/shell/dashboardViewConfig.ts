import type { DashboardView } from "@/src/features/resume/types";

export interface DashboardViewLayout {
  sidebarCollapsible: boolean;
  sidebarShowBrandIcon: boolean;
  sidebarShowTagline: boolean;
  sidebarNavDisabled: boolean;
  sidebarNavHint?: string;
  sidebarAvatarSize: "sm" | "md";
  sidebarShowUserMenu: boolean;
  sidebarShowSignOut: boolean;
  topNavMode: "placeholder" | "search";
  footerVariant: "inline" | "fixed";
}

export const DASHBOARD_VIEW_LAYOUT: Record<DashboardView, DashboardViewLayout> = {
  firstTime: {
    sidebarCollapsible: false,
    sidebarShowBrandIcon: false,
    sidebarShowTagline: true,
    sidebarNavDisabled: true,
    sidebarNavHint: "Upload resume to unlock.",
    sidebarAvatarSize: "sm",
    sidebarShowUserMenu: true,
    sidebarShowSignOut: false,
    topNavMode: "placeholder",
    footerVariant: "inline",
  },
  default: {
    sidebarCollapsible: true,
    sidebarShowBrandIcon: true,
    sidebarShowTagline: false,
    sidebarNavDisabled: false,
    sidebarAvatarSize: "md",
    sidebarShowUserMenu: false,
    sidebarShowSignOut: false,
    topNavMode: "search",
    footerVariant: "fixed",
  },
  active: {
    sidebarCollapsible: true,
    sidebarShowBrandIcon: true,
    sidebarShowTagline: false,
    sidebarNavDisabled: false,
    sidebarAvatarSize: "md",
    sidebarShowUserMenu: false,
    sidebarShowSignOut: true,
    topNavMode: "search",
    footerVariant: "fixed",
  },
};
