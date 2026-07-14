"use client";

import { useState, useCallback, useRef } from "react";

interface UploadDropzoneProps {
  onFileSelected: (file: File) => void;
  variant?: "default" | "firstTime";
}

export function UploadDropzone({
  onFileSelected,
  variant = "default",
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFirstTime = variant === "firstTime";

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileSelected(file);
      e.target.value = "";
    },
    [onFileSelected],
  );

  const openFilePicker = () => inputRef.current?.click();

  const zoneClass = [
    "dashboard-upload-zone",
    isFirstTime
      ? "dashboard-upload-zone--first-time"
      : "dashboard-upload-zone--default",
    isDragging ? "dashboard-upload-zone--active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <div className="dashboard-upload-icon">
        <span className="material-symbols-outlined text-primary text-[32px]">
          {isFirstTime ? "upload" : "upload_file"}
        </span>
      </div>

      {!isFirstTime && (
        <>
          <h3 className="dashboard-upload-title">
            Upload your existing resume
          </h3>
          <p className="dashboard-upload-desc">
            We&apos;ll parse your details and match them with industry
            standards.
          </p>
        </>
      )}

      <button
        type="button"
        className={`dashboard-upload-btn ${
          isFirstTime ? "dashboard-upload-btn--compact" : ""
        }`}
        onClick={openFilePicker}
      >
        {!isFirstTime && (
          <span className="material-symbols-outlined text-[18px]">add</span>
        )}
        Upload Resume
      </button>

      <p className="dashboard-upload-meta">
        {isFirstTime
          ? "Drag & Drop PDF or DOCX (Max 10MB)"
          : "Supported formats: PDF, DOCX (Max 10MB)"}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={handleFileInput}
      />
    </>
  );

  if (isFirstTime) {
    return (
      <section>
        <div
          className={zoneClass}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={openFilePicker}
          role="region"
          aria-label="Resume upload area"
        >
          {content}
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-upload">
      <div
        className={zoneClass}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        role="region"
        aria-label="Resume upload area"
      >
        {content}
      </div>
    </section>
  );
}
