import type { DashboardView } from "@/src/features/resume/types";

export interface DashboardViewLayout {
  sidebarCollapsible: boolean;
  sidebarNavDisabled: boolean;
  sidebarNavHint?: string;
  sidebarAvatarSize: "sm" | "md";
}

export const DASHBOARD_VIEW_LAYOUT: Record<DashboardView, DashboardViewLayout> = {
  firstTime: {
    sidebarCollapsible: true,
    sidebarNavDisabled: true,
    sidebarNavHint: "Upload resume to unlock.",
    sidebarAvatarSize: "sm",
  },
  default: {
    sidebarCollapsible: true,
    sidebarNavDisabled: false,
    sidebarAvatarSize: "md",
  },
  active: {
    sidebarCollapsible: true,
    sidebarNavDisabled: false,
    sidebarAvatarSize: "md",
  },
};
