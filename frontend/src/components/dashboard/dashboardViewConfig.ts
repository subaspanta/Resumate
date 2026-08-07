import type { DashboardView } from "@/src/features/resume/types";

export interface DashboardViewLayout {
  sidebarCollapsible: boolean;
  sidebarShowBrandIcon: boolean;
  sidebarShowTagline: boolean;
  sidebarNavDisabled: boolean;
  sidebarNavHint?: string;
  sidebarAvatarSize: "sm" | "md";
}

export const DASHBOARD_VIEW_LAYOUT: Record<DashboardView, DashboardViewLayout> = {
  firstTime: {
    sidebarCollapsible: true,
    sidebarShowBrandIcon: false,
    sidebarShowTagline: true,
    sidebarNavDisabled: true,
    sidebarNavHint: "Upload resume to unlock.",
    sidebarAvatarSize: "sm",
  },
  default: {
    sidebarCollapsible: true,
    sidebarShowBrandIcon: true,
    sidebarShowTagline: false,
    sidebarNavDisabled: false,
    sidebarAvatarSize: "md",
  },
  active: {
    sidebarCollapsible: true,
    sidebarShowBrandIcon: true,
    sidebarShowTagline: false,
    sidebarNavDisabled: false,
    sidebarAvatarSize: "md",
  },
};
