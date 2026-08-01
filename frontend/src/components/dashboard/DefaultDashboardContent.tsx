"use client";

import { UploadDropzone } from "@/src/components/UploadDropZone";
import { RecentResumesSection } from "@/src/components/RecentResumeSection";
import {
  getGreetingName,
  getTimeGreeting,
  type ResumeSummary,
} from "@/src/features/resume/types";

interface DefaultDashboardContentProps {
  userName?: string;
  resumes: ResumeSummary[];
  onFileSelected: (file: File) => void;
  onOpenResume: (id: string) => void;
  onViewAll: () => void;
  isUploading?: boolean;
}

export function DefaultDashboardContent({
  userName,
  resumes,
  onFileSelected,
  onOpenResume,
  onViewAll,
  isUploading,
}: DefaultDashboardContentProps) {
  const greeting = getTimeGreeting();
  const firstName = getGreetingName(userName);

  return (
    <div className="dashboard-main-inner">
      <section className="dashboard-section-header">
        <h1 className="dashboard-welcome-title">
          {greeting}, {firstName}.
        </h1>
        <p className="dashboard-welcome-subtitle">
          Continue improving your resume or start a new workspace from scratch.
        </p>
      </section>

      <UploadDropzone
        onFileSelected={onFileSelected}
        variant="default"
        isUploading={isUploading}
      />

      <RecentResumesSection
        resumes={resumes}
        onOpenResume={onOpenResume}
        onViewAll={onViewAll}
      />
    </div>
  );
}
