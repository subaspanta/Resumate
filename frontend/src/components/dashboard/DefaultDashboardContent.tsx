"use client";

import { UploadDropzone } from "@/src/components/dashboard/UploadDropZone";
import { RecentResumesSection } from "@/src/components/dashboard/RecentResumesSection";
import { ContinueCard } from "@/src/components/dashboard/ContinueCard";
import { useContinueState } from "@/src/components/dashboard/use-continue-state";
import type { ResumeSummary } from "@/src/features/resume/types";

interface DefaultDashboardContentProps {
  resumes: ResumeSummary[];
  onFileSelected: (file: File) => void;
  onOpenResume: (id: string) => void;
  onViewAll: () => void;
  isUploading?: boolean;
  // Delete is owned by DashboardContent so both dashboard states share one
  // mutation observer — calling useDeleteResumeFlow here too would mint a
  // second one over the same cache key.
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
  const { action } = useContinueState(resumes);

  return (
    <div className="dashboard-main-inner">
      {/* When something is in flight, it leads and upload steps back to a
          compact row. Without it, upload is still the only thing to do here,
          so it keeps the full drop zone. */}
      {action ? (
        <>
          <ContinueCard action={action} resumeName={resumes[0]?.title} />
          <UploadDropzone
            onFileSelected={onFileSelected}
            variant="compact"
            isUploading={isUploading}
          />
        </>
      ) : (
        <UploadDropzone
          onFileSelected={onFileSelected}
          variant="default"
          isUploading={isUploading}
        />
      )}

      <RecentResumesSection
        resumes={resumes}
        onOpenResume={onOpenResume}
        onViewAll={onViewAll}
        onDeleteResume={onResumeDelete}
        deletingId={deletingId}
        showViewAll
      />
    </div>
  );
}
