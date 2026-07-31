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
import { useResumes, useUploadResume } from "@/src/features/resume/resume.hooks";
import { useLatestAnalysis } from "@/src/features/analysis/analysis.hooks";
import { DashboardShell } from "@/src/components/dashboard/shell/DashboardShell";
import { FirstTimeDashboardContent } from "@/src/components/dashboard/FirstTimeDashboardContent";
import { DefaultDashboardContent } from "@/src/components/dashboard/DefaultDashboardContent";
import {
  ContinueWorkingHero,
  JobTargetCard,
  RecentResumesTable,
} from "@/src/components/dashboard/ActiveDashboardContent";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Data layer
  const { resumes, isLoading: resumesLoading, isError: resumesError } = useResumes();
  const primaryResumeId = resumes[0]?.id;
  const { analysis: latestAnalysis } = useLatestAnalysis(primaryResumeId || "");
  const uploadResumeMutation = useUploadResume();

  // State derivation
  const dashboardState: DashboardState = useMemo(() => {
    return deriveDashboardState({
      resumes,
      latestAnalysis: latestAnalysis || null,
      loadError: resumesError,
    });
  }, [resumes, latestAnalysis, resumesError]);

  const layoutKey = useMemo(() => stateToLayoutKey(dashboardState), [dashboardState]);
  const primaryResume = resumes[0];

  const handleFileSelected = async (file: File) => {
    const form = new FormData();
    form.append("file", file);

    try {
      await uploadResumeMutation.mutateAsync(form);
      toast.success(`"${file.name}" uploaded successfully.`);
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

  const handleSetTarget = () => {
    toast.info("Job target setup is not available yet.");
  };

  if (resumesLoading) {
    return (
      <div className="dashboard-shell flex items-center justify-center">
        <div>Loading...</div>
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
          <FirstTimeDashboardContent onFileSelected={handleFileSelected} />
        )}

        {dashboardState === "readyToStart" && (
          <DefaultDashboardContent
            userName={user?.name}
            resumes={resumes}
            onFileSelected={handleFileSelected}
            onOpenResume={handleOpenResume}
            onViewAll={handleViewAll}
          />
        )}

        {dashboardState === "workspaceReady" && primaryResume && (
          <div className="dashboard-main-inner dashboard-main-inner--active flex flex-col gap-xl">
            <ContinueWorkingHero
              resume={primaryResume}
              onOpenWorkspace={handleOpenResume}
              onUploadNew={triggerUpload}
            />
            <div className="dashboard-active-grid">
              <JobTargetCard onSetTarget={handleSetTarget} />
              <RecentResumesTable
                resumes={resumes}
                onOpenResume={handleOpenResume}
                suggestionsCount={0}
              />
            </div>
          </div>
        )}

        {dashboardState === "error" && (
          <div className="dashboard-main-inner flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">Failed to load resumes</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
