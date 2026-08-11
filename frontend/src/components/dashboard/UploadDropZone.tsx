"use client";

import { useState, useCallback, useRef } from "react";
import { FileUp, Loader2, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { validateResumeFile } from "@/src/features/resume/resume.utils";

interface UploadDropzoneProps {
  onFileSelected: (file: File) => void;
  variant?: "default" | "firstTime";
  isUploading?: boolean;
}

export function UploadDropzone({
  onFileSelected,
  variant = "default",
  isUploading = false,
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFirstTime = variant === "firstTime";

  const selectFile = useCallback(
    (file: File) => {
      const error = validateResumeFile(file);
      if (error) {
        toast.error(error);
        return;
      }
      onFileSelected(file);
    },
    [onFileSelected],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!isUploading) setIsDragging(true);
    },
    [isUploading],
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (isUploading) return;
      const files = e.dataTransfer.files;
      if (files.length > 1) {
        toast.error("Only one resume can be uploaded at a time.");
        return;
      }
      const file = files[0];
      if (file) selectFile(file);
    },
    [selectFile, isUploading],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) selectFile(file);
      e.target.value = "";
    },
    [selectFile],
  );

  const openFilePicker = () => {
    if (isUploading) return;
    inputRef.current?.click();
  };

  const zoneClass = [
    "dashboard-upload-zone",
    isFirstTime
      ? "dashboard-upload-zone--first-time"
      : "dashboard-upload-zone--default",
    isDragging ? "dashboard-upload-zone--active" : "",
    isUploading ? "opacity-60 pointer-events-none" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = isUploading ? (
    <>
      <div className="dashboard-upload-icon">
        <Loader2 className="size-8 animate-spin text-primary" aria-hidden="true" />
      </div>
      <h3 className="dashboard-upload-title">
        Uploading and reading your resume…
      </h3>
      <p className="dashboard-upload-desc">This usually takes a few seconds.</p>
    </>
  ) : (
    <>
      <div className="dashboard-upload-icon">
        {isFirstTime ? (
          <Upload className="size-8 text-primary" aria-hidden="true" />
        ) : (
          <FileUp className="size-8 text-primary" aria-hidden="true" />
        )}
      </div>

      {!isFirstTime && (
        <>
          <h3 className="dashboard-upload-title">
            Upload your existing resume
          </h3>
          <p className="dashboard-upload-desc">
            We&apos;ll parse your work history and skills so you can run a
            new gap analysis against a target role.
          </p>
        </>
      )}

      <button
        type="button"
        className={`dashboard-upload-btn ${
          isFirstTime ? "dashboard-upload-btn--compact" : ""
        }`}
        onClick={openFilePicker}
        disabled={isUploading}
      >
        {!isFirstTime && <Plus className="size-[18px]" aria-hidden="true" />}
        Upload Resume
      </button>

      <p className="dashboard-upload-meta">
        {isFirstTime
          ? "Drag & Drop PDF or DOCX (Max 2MB)"
          : "Supported formats: PDF, DOCX (Max 2MB)"}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={handleFileInput}
        disabled={isUploading}
      />
    </>
  );

  return (
    <section className={isFirstTime ? undefined : "dashboard-upload"}>
      <div
        className={zoneClass}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFilePicker}
        role="region"
        aria-label="Resume upload area"
        aria-busy={isUploading}
      >
        {content}
      </div>
    </section>
  );
}
