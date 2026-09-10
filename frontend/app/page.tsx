"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import type { DashboardState } from "@/src/features/resume/types";
import { deriveDashboardState } from "@/src/features/resume/resume.utils";
import { useResumes } from "@/src/features/resume/resume.hooks";
import { useUploadResumeFlow } from "@/src/components/dashboard/use-resume-upload";
import { DashboardContent } from "@/src/components/dashboard/DashboardContent";

export default function HomePage() {
  const router = useRouter();

  const {
    resumes,
    isLoading: resumesLoading,
    isError: resumesError,
    refetch: refetchResumes,
  } = useResumes();

  const { handleFileSelected, isUploading } = useUploadResumeFlow();

  const dashboardState: DashboardState = useMemo(() => {
    return deriveDashboardState({
      resumes,
      loadError: resumesError,
    });
  }, [resumes, resumesError]);

  const handleOpenResume = (id: string) => {
    router.push(`/analyze/${id}`);
  };

  const handleViewAll = () => {
    router.push("/resumes");
  };

  return (
    <DashboardContent
      dashboardState={dashboardState}
      isLoading={resumesLoading}
      resumes={resumes}
      onRetry={refetchResumes}
      isUploading={isUploading}
      onFileSelected={handleFileSelected}
      onOpenResume={handleOpenResume}
      onViewAll={handleViewAll}
    />
  );
}
