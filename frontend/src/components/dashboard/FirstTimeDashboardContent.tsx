"use client";

import { UploadDropzone } from "@/src/components/dashboard/UploadDropZone";

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
      <UploadDropzone
        onFileSelected={onFileSelected}
        variant="firstTime"
        isUploading={isUploading}
      />
    </div>
  );
}
