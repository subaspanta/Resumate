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
import { useDeleteResumeFlow } from "../../features/resume/use-resume-delete";

const CRUMBS = [{ label: "Dashboard" }];

interface DashboardContentProps {
  dashboardState: DashboardState;
  isLoading: boolean;
  resumes: ResumeSummary[];
  onRetry: () => void;
  isUploading: boolean;
  onFileSelected: (file: File) => void;
  onOpenResume: (id: string) => void;
  onViewAll: () => void;
}

const DashboardSkeleton = () => (
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

const DashboardErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="dashboard-main-inner flex items-center justify-center">
    <div className="dashboard-side-panel items-center text-center max-w-[24rem]">
      <CircleAlert className="size-8 text-danger mb-sm" aria-hidden="true" />
      <p className="font-body-md text-body-md text-text-primary mb-lg">
        Failed to load your resumes.
      </p>
      <button type="button" onClick={onRetry} className="dashboard-btn-primary">
        Retry
      </button>
    </div>
  </div>
);

const getDashboardHeader = (state: DashboardState, userName?: string) => {
  switch (state) {
    case "firstTime":
      return {
        title: "Welcome to Resumate.",
        subtitle:
          "Upload your resume to see which skills you can prove for a target role, where the gaps are, and a roadmap to close them.",
      };
    default:
      return {
        title: `${getTimeGreeting()}, ${getGreetingName(userName)}.`,
        subtitle: "Here's where your career analysis stands.",
      };
  }
};

export function DashboardContent({
  dashboardState,
  isLoading,
  resumes,
  onRetry,
  isUploading,
  onFileSelected,
  onOpenResume,
  onViewAll,
}: DashboardContentProps) {
  const { user } = useAuth();
  const { handleDelete, deletingId } = useDeleteResumeFlow();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const header = getDashboardHeader(dashboardState, user?.name);

  return (
    <AppShell
      step="upload"
      view={stateToLayoutKey(dashboardState)}
      crumbs={CRUMBS}
      title={header.title}
      subtitle={header.subtitle}
    >
      {renderContent({
        dashboardState,
        resumes,
        onRetry,
        isUploading,
        onFileSelected,
        onOpenResume,
        onViewAll,
        onResumeDelete: handleDelete,
        deletingId,
      })}
    </AppShell>
  );
}

interface RenderContentParams {
  dashboardState: DashboardState;
  resumes: ResumeSummary[];
  onRetry: () => void;
  isUploading: boolean;
  onFileSelected: (file: File) => void;
  onOpenResume: (id: string) => void;
  onViewAll: () => void;
  onResumeDelete: (id: string, title: string) => Promise<void>;
  deletingId: string | undefined;
}

function renderContent(params: RenderContentParams) {
  const {
    dashboardState,
    resumes,
    onRetry,
    isUploading,
    onFileSelected,
    onOpenResume,
    onViewAll,
    onResumeDelete,
    deletingId,
  } = params;

  switch (dashboardState) {
    case "firstTime":
      return (
        <FirstTimeDashboardContent
          onFileSelected={onFileSelected}
          isUploading={isUploading}
        />
      );

    case "readyToStart":
      return (
        <DefaultDashboardContent
          resumes={resumes}
          onFileSelected={onFileSelected}
          onOpenResume={onOpenResume}
          onViewAll={onViewAll}
          isUploading={isUploading}
          onResumeDelete={onResumeDelete}
          deletingId={deletingId}
        />
      );

    case "error":
      return <DashboardErrorState onRetry={onRetry} />;

    default:
      return dashboardState satisfies never;
  }
}
