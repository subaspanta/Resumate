"use client";

import { UploadDropzone } from "@/src/components/UploadDropZone";
import { FeaturePreviewSection } from "@/src/components/dashboard/FeaturePreviewSection";

interface FirstTimeDashboardContentProps {
  onFileSelected: (file: File) => void;
}

export function FirstTimeDashboardContent({
  onFileSelected,
}: FirstTimeDashboardContentProps) {
  return (
    <div className="dashboard-main-inner dashboard-main-inner--first-time">
      <section className="dashboard-section-header dashboard-section-header--centered">
        <h2 className="dashboard-welcome-title">Welcome to ResumeForge.</h2>
        <p className="dashboard-welcome-subtitle dashboard-welcome-subtitle--centered">
          Upload your resume to receive ATS analysis, AI suggestions,
          section-by-section feedback, and job-specific optimization.
        </p>
      </section>

      <UploadDropzone onFileSelected={onFileSelected} variant="firstTime" />

      <FeaturePreviewSection />

      <section className="dashboard-recent-empty--bordered">
        <h3 className="dashboard-recent-title">Recent Resumes</h3>
        <div className="py-xl text-center">
          <p className="font-body-md text-body-md text-text-muted">
            No resumes yet. Your uploaded resumes will appear here.
          </p>
        </div>
      </section>
    </div>
  );
}
