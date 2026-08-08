"use client";

import { CircleAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AppShell } from "@/src/components/layout/AppShell";
import { FirstTimeDashboardContent } from "@/src/components/dashboard/FirstTimeDashboardContent";
import { DefaultDashboardContent } from "@/src/components/dashboard/DefaultDashboardContent";
import type {
  DashboardState,
  ResumeSummary,
} from "@/src/features/resume/types";
import {
  getGreetingName,
  getTimeGreeting,
  stateToLayoutKey,
} from "@/src/features/resume/resume.utils";
import { useAuth } from "@/src/features/auth/auth.hooks";
import { useDeleteResumeFlow } from "@/src/components/dashboard/use-resume-delete";

interface DashboardContentProps {
  dashboardState: DashboardState;
  isLoading: boolean;
  resumes: ResumeSummary[];
  isUploading: boolean;
  onFileSelected: (file: File) => void;
  onOpenResume: (id: string) => void;
  onViewAll: () => void;
}

// Fixed for this route — hoisted so AppShell doesn't see a new array every
// render, matching the analysis page's CRUMBS.
const CRUMBS = [{ label: "Dashboard" }];

// Each dashboard state gets its own header copy. The shell renders it, so the
// per-state content components no longer carry their own <h1> — that split is
// what let the dashboard's chrome drift from the flow pages'.
function headerFor(
  state: DashboardState,
  userName?: string,
): { title: string; subtitle?: string } {
  switch (state) {
    case "firstTime":
      return {
        title: "Welcome to ResuMate.",
        subtitle:
          "Upload your resume to receive ATS analysis, AI suggestions, section-by-section feedback, and job-specific optimization.",
      };
    default:
      return {
        title: `${getTimeGreeting()}, ${getGreetingName(userName)}.`,
        subtitle: "Upload a resume to start tailoring it to a job description.",
      };
  }
}

export function DashboardContent({
  dashboardState,
  isLoading,
  resumes,
  isUploading,
  onFileSelected,
  onOpenResume,
  onViewAll,
}: DashboardContentProps) {
  const { user } = useAuth();
  const { handleDelete, deletingId } = useDeleteResumeFlow();

  if (isLoading) {
    return (
      <AppShell
        step="upload"
        view="default"
        crumbs={CRUMBS}
        title={<Skeleton className="h-9 w-64 bg-surface-container" />}
      >
        <div className="dashboard-main-inner flex flex-col gap-xl">
          <Skeleton className="h-5 w-96 max-w-full bg-surface-container" />
          <Skeleton className="h-48 w-full rounded-xl bg-surface-container" />
          <div className="flex flex-col gap-md">
            <Skeleton className="h-6 w-40 bg-surface-container" />
            <Skeleton className="h-16 w-full rounded-lg bg-surface-container" />
            <Skeleton className="h-16 w-full rounded-lg bg-surface-container" />
          </div>
        </div>
      </AppShell>
    );
  }

  const header = headerFor(dashboardState, user?.name);

  return (
    <AppShell
      step="upload"
      view={stateToLayoutKey(dashboardState)}
      crumbs={CRUMBS}
      title={header.title}
      subtitle={header.subtitle}
    >
      {dashboardState === "firstTime" && (
        <FirstTimeDashboardContent
          onFileSelected={onFileSelected}
          isUploading={isUploading}
        />
      )}

      {dashboardState === "readyToStart" && (
        <DefaultDashboardContent
          resumes={resumes}
          onFileSelected={onFileSelected}
          onOpenResume={onOpenResume}
          onViewAll={onViewAll}
          isUploading={isUploading}
          onResumeDelete={handleDelete}
          deletingId={deletingId}
        />
      )}

      {dashboardState === "error" && (
        <div className="dashboard-main-inner flex items-center justify-center">
          <div className="dashboard-side-panel items-center text-center max-w-sm">
            <CircleAlert
              className="size-8 text-danger mb-sm"
              aria-hidden="true"
            />
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
    </AppShell>
  );
}
