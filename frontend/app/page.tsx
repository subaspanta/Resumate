"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/features/auth";
import { toast } from "sonner";
import { isApiError } from "@/src/api/api-error";
import {
  deriveDashboardState,
  stateToLayoutKey,
  type DashboardState,
} from "@/src/features/resume/types";
import {
  useResumes,
  useUploadResume,
} from "@/src/features/resume/resume.hooks";
import { DashboardShell } from "@/src/components/dashboard/shell/DashboardShell";
import { FirstTimeDashboardContent } from "@/src/components/dashboard/FirstTimeDashboardContent";
import { DefaultDashboardContent } from "@/src/components/dashboard/DefaultDashboardContent";
import { ContinueWorkingHero } from "@/src/components/dashboard/ActiveDashboardContent";
import { RecentResumesSection } from "@/src/components/RecentResumeSection";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Data layer
  const {
    resumes,
    isLoading: resumesLoading,
    isError: resumesError,
  } = useResumes();
  const uploadResumeMutation = useUploadResume();

  // State derivation
  const dashboardState: DashboardState = useMemo(() => {
    return deriveDashboardState({
      resumes,
      loadError: resumesError,
    });
  }, [resumes, resumesError]);

  const layoutKey = useMemo(
    () => stateToLayoutKey(dashboardState),
    [dashboardState],
  );
  // The resume to show in "Continue Working" — whichever has real
  // unfinished work, not just the most recently uploaded one (resumes[0]).
  const primaryResume =
    resumes.find((r) => r.analysisStatus === "unexported") ?? resumes[0];

  const handleFileSelected = async (file: File) => {
    const form = new FormData();
    form.append("resume", file);

    try {
      const resume = await uploadResumeMutation.mutateAsync(form);
      toast.success(`"${file.name}" uploaded successfully.`);
      router.push(`/workspace/${resume.id}`);
    } catch (error) {
      if (isApiError(error) && error.code === "GEMINI_RATE_LIMITED") {
        toast.error("AI is busy right now. Please try again in a moment.");
        return;
      }
      const message =
        error instanceof Error ? error.message : "Failed to upload resume";
      toast.error(message);
    }
  };

  const triggerUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.docx";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFileSelected(file);
    };
    input.click();
  };

  const handleOpenResume = (id: string) => {
    router.push(`/workspace/${id}`);
  };

  const handleViewAll = () => {
    toast.info("Viewing all files is not available yet.");
  };

  if (resumesLoading) {
    return (
      <div className="dashboard-shell">
        <DashboardShell
          view="default"
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
          userName={user?.name}
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
        view={layoutKey}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
        userName={user?.name}
        onUploadClick={triggerUpload}
      >
        {dashboardState === "firstTime" && (
          <FirstTimeDashboardContent
            onFileSelected={handleFileSelected}
            isUploading={uploadResumeMutation.isPending}
          />
        )}

        {dashboardState === "readyToStart" && (
          <DefaultDashboardContent
            userName={user?.name}
            resumes={resumes}
            onFileSelected={handleFileSelected}
            onOpenResume={handleOpenResume}
            onViewAll={handleViewAll}
            isUploading={uploadResumeMutation.isPending}
          />
        )}

        {dashboardState === "workspaceReady" && primaryResume && (
          <div className="dashboard-main-inner flex flex-col gap-xl">
            <ContinueWorkingHero
              resume={primaryResume}
              onOpenWorkspace={handleOpenResume}
              onUploadNew={triggerUpload}
              isUploading={uploadResumeMutation.isPending}
            />
            <RecentResumesSection
              resumes={resumes}
              onOpenResume={handleOpenResume}
              onViewAll={handleViewAll}
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
