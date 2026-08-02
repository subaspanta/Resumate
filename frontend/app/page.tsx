"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/features/auth";
import { toast } from "sonner";
import {
  deriveDashboardState,
  type DashboardState,
} from "@/src/features/resume/types";
import { useResumes } from "@/src/features/resume/resume.hooks";
import { useResumeUpload } from "@/src/components/dashboard/use-resume-upload";
import { DashboardContent } from "@/src/components/dashboard/DashboardContent";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const {
    resumes,
    isLoading: resumesLoading,
    isError: resumesError,
  } = useResumes();
  const { handleFileSelected, triggerUpload, isUploading } = useResumeUpload();

  const dashboardState: DashboardState = useMemo(() => {
    return deriveDashboardState({
      resumes,
      loadError: resumesError,
    });
  }, [resumes, resumesError]);

  const primaryResume =
    resumes.find((r) => r.analysisStatus === "unexported") ?? resumes[0];

  const handleOpenResume = (id: string) => {
    router.push(`/workspace/${id}`);
  };

  const handleViewAll = () => {
    toast.info("Viewing all files is not available yet.");
  };

  return (
    <DashboardContent
      dashboardState={dashboardState}
      isLoading={resumesLoading}
      isSidebarCollapsed={isSidebarCollapsed}
      onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
      userName={user?.name}
      resumes={resumes}
      primaryResume={primaryResume}
      isUploading={isUploading}
      onFileSelected={handleFileSelected}
      onUploadClick={triggerUpload}
      onOpenResume={handleOpenResume}
      onViewAll={handleViewAll}
    />
  );
}
