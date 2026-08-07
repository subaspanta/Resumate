"use client";

import { UploadDropzone } from "@/src/components/dashboard/UploadDropZone";
import { RecentResumesSection } from "@/src/components/dashboard/RecentResumesSection";
import type { ResumeSummary } from "@/src/features/resume/types";

interface DefaultDashboardContentProps {
  resumes: ResumeSummary[];
  onFileSelected: (file: File) => void;
  onOpenResume: (id: string) => void;
  onViewAll: () => void;
  isUploading?: boolean;
  // Delete is owned by DashboardContent so both dashboard states share one
  // mutation observer — calling useResumeDelete here too would mint a second
  // one over the same cache key.
  onResumeDelete?: (id: string, title: string) => void;
  deletingId?: string;
}

export function DefaultDashboardContent({
  resumes,
  onFileSelected,
  onOpenResume,
  onViewAll,
  isUploading,
  onResumeDelete,
  deletingId,
}: DefaultDashboardContentProps) {
  return (
    <div className="dashboard-main-inner">
      <UploadDropzone
        onFileSelected={onFileSelected}
        variant="default"
        isUploading={isUploading}
      />

      <RecentResumesSection
        resumes={resumes}
        onOpenResume={onOpenResume}
        onViewAll={onViewAll}
        onDeleteResume={onResumeDelete}
        deletingId={deletingId}
      />
    </div>
  );
}
