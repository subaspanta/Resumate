"use client";

import { UploadDropzone } from "@/src/components/UploadDropZone";

interface FirstTimeDashboardContentProps {
  onFileSelected: (file: File) => void;
  isUploading?: boolean;
}

export function FirstTimeDashboardContent({
  onFileSelected,
  isUploading,
}: FirstTimeDashboardContentProps) {
  return (
    <div className="dashboard-main-inner dashboard-main-inner--first-time">
      <section className="dashboard-section-header dashboard-section-header--centered">
        <h2 className="dashboard-welcome-title">Welcome to ResuMate.</h2>
        <p className="dashboard-welcome-subtitle dashboard-welcome-subtitle--centered">
          Upload your resume to receive ATS analysis, AI suggestions,
          section-by-section feedback, and job-specific optimization.
        </p>
      </section>

      <UploadDropzone
        onFileSelected={onFileSelected}
        variant="firstTime"
        isUploading={isUploading}
      />
    </div>
  );
}
