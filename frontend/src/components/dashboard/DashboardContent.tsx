"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { DashboardShell } from "@/src/components/dashboard/shell/DashboardShell";
import { FirstTimeDashboardContent } from "@/src/components/dashboard/FirstTimeDashboardContent";
import { DefaultDashboardContent } from "@/src/components/dashboard/DefaultDashboardContent";
import { ContinueWorkingHero } from "@/src/components/dashboard/ActiveDashboardContent";
import { RecentResumesSection } from "@/src/components/RecentResumeSection";
import {
  stateToLayoutKey,
  type DashboardState,
  type ResumeSummary,
} from "@/src/features/resume/types";

interface DashboardContentProps {
  dashboardState: DashboardState;
  isLoading: boolean;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  userName?: string;
  resumes: ResumeSummary[];
  primaryResume?: ResumeSummary;
  isUploading: boolean;
  onFileSelected: (file: File) => void;
  onUploadClick: () => void;
  onOpenResume: (id: string) => void;
  onViewAll: () => void;
}

export function DashboardContent({
  dashboardState,
  isLoading,
  isSidebarCollapsed,
  onToggleSidebar,
  userName,
  resumes,
  primaryResume,
  isUploading,
  onFileSelected,
  onUploadClick,
  onOpenResume,
  onViewAll,
}: DashboardContentProps) {
  if (isLoading) {
    return (
      <div className="dashboard-shell">
        <DashboardShell
          view="default"
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={onToggleSidebar}
          userName={userName}
        >
          <div className="dashboard-main-inner flex flex-col gap-xl">
            <div className="flex flex-col gap-sm">
              <Skeleton className="h-9 w-64 bg-surface-container" />
              <Skeleton className="h-5 w-96 max-w-full bg-surface-container" />
            </div>
            <Skeleton className="h-48 w-full rounded-xl bg-surface-container" />
            <div className="flex flex-col gap-md">
              <Skeleton className="h-6 w-40 bg-surface-container" />
              <Skeleton className="h-16 w-full rounded-lg bg-surface-container" />
              <Skeleton className="h-16 w-full rounded-lg bg-surface-container" />
            </div>
          </div>
        </DashboardShell>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <DashboardShell
        view={stateToLayoutKey(dashboardState)}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={onToggleSidebar}
        userName={userName}
      >
        {dashboardState === "firstTime" && (
          <FirstTimeDashboardContent
            onFileSelected={onFileSelected}
            isUploading={isUploading}
          />
        )}

        {dashboardState === "readyToStart" && (
          <DefaultDashboardContent
            userName={userName}
            resumes={resumes}
            onFileSelected={onFileSelected}
            onOpenResume={onOpenResume}
            onViewAll={onViewAll}
            isUploading={isUploading}
          />
        )}

        {dashboardState === "workspaceReady" && primaryResume && (
          <div className="dashboard-main-inner flex flex-col gap-xl">
            <ContinueWorkingHero
              resume={primaryResume}
              onOpenWorkspace={onOpenResume}
              onUploadNew={onUploadClick}
              isUploading={isUploading}
            />
            <RecentResumesSection
              resumes={resumes}
              onOpenResume={onOpenResume}
              onViewAll={onViewAll}
            />
          </div>
        )}

        {dashboardState === "error" && (
          <div className="dashboard-main-inner flex items-center justify-center">
            <div className="dashboard-side-panel items-center text-center max-w-sm">
              <span className="material-symbols-outlined text-danger text-[32px] mb-sm">
                error
              </span>
              <p className="font-body-md text-body-md text-text-primary mb-lg">
                Failed to load your resumes.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="dashboard-btn-primary"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </DashboardShell>
    </div>
  );
}
