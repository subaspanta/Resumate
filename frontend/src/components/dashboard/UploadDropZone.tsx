"use client";

import { useState, useCallback, useRef } from "react";
import { FileUp, Plus, Upload } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { validateResumeFile } from "@/src/features/resume/resume.utils";

interface UploadDropzoneProps {
  onFileSelected: (file: File) => void;
  // Compact = returning-user form (no hero, just a drop target)
  variant?: "default" | "firstTime" | "compact";
  isUploading?: boolean;
}

export function UploadDropzone({
  onFileSelected,
  variant = "default",
  isUploading = false,
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const isFirstTime = variant === "firstTime";
  const isCompact = variant === "compact";
  const reduceMotion = useReducedMotion();

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

  // Prevent default to allow drop; no state updates here (dragover fires constantly)
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  // Drag counter prevents flicker: enter/leave fires for every child element,
  // so we track depth instead of relying on relatedTarget (unreliable across browsers)
  const dragDepth = useRef(0);

  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (isUploading) return;
      dragDepth.current += 1;
      setIsDragging(true);
    },
    [isUploading],
  );

  const handleDragLeave = useCallback(() => {
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current > 0) return;
    setIsDragging(false);
  }, []);

  const resetDrag = useCallback(() => {
    dragDepth.current = 0;
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      resetDrag();
      if (isUploading) return;

      const files = e.dataTransfer.files;
      if (files.length > 1) {
        toast.error("Only one resume can be uploaded at a time.");
        return;
      }

      const file = files[0];
      if (file) selectFile(file);
    },
    [selectFile, isUploading, resetDrag],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) selectFile(file);
      e.target.value = ""; // Reset to allow re-selecting same file
    },
    [selectFile],
  );

  const openFilePicker = () => {
    if (isUploading) return;
    inputRef.current?.click();
  };

  // Variant classes
  const variantClass = isFirstTime
    ? "dashboard-upload-zone--first-time"
    : isCompact
      ? "dashboard-upload-zone--compact"
      : "dashboard-upload-zone--default";

  const zoneClass = [
    "dashboard-upload-zone",
    variantClass,
    isDragging ? "dashboard-upload-zone--active" : "",
    isUploading ? "opacity-60 pointer-events-none" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Render content based on state
  const renderContent = () => {
    if (isUploading) {
      return (
        <>
          <div
            className="analyzing-orbit analyzing-orbit--inline"
            aria-hidden="true"
          >
            <span className="analyzing-orbit-ring" />
            <span className="analyzing-orbit-core" />
          </div>
          <h3 className="dashboard-upload-title">
            Uploading and reading your resume…
          </h3>
          <p className="dashboard-upload-desc">
            This usually takes a few seconds.
          </p>
        </>
      );
    }

    if (isCompact) {
      return (
        <>
          <span className="dashboard-upload-compact-icon">
            <Plus className="size-[18px]" aria-hidden="true" />
          </span>
          <span className="dashboard-upload-compact-label">
            Upload another resume
          </span>
          <span className="dashboard-upload-compact-meta">
            PDF or DOCX, max 2MB
          </span>
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
    }

    return (
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
              We&apos;ll parse your work history and skills so you can run a new
              gap analysis against a target role.
            </p>
          </>
        )}

        <button
          type="button"
          className={`dashboard-upload-btn ${
            isFirstTime ? "dashboard-upload-btn--compact" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent double-trigger from zone click
            openFilePicker();
          }}
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
  };

  return (
    <section
      className={[
        isFirstTime || isCompact ? "" : "dashboard-upload",
        "dashboard-upload-stage",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <motion.div
        ref={zoneRef}
        className={zoneClass}
        animate={{ scale: isDragging && !reduceMotion ? 1.01 : 1 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        // Compact variant needs click handler; others use inner button for accessibility
        onClick={isCompact ? openFilePicker : undefined}
        {...(isCompact
          ? {
              role: "button" as const,
              tabIndex: isUploading ? -1 : 0,
              onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openFilePicker();
                }
              },
              "aria-label": "Upload another resume",
            }
          : { role: "region" as const, "aria-label": "Resume upload area" })}
        aria-busy={isUploading}
      >
        <svg
          className="dashboard-upload-zone-border"
          aria-hidden="true"
          preserveAspectRatio="none"
        >
          <rect
            x="1"
            y="1"
            width="calc(100% - 2px)"
            height="calc(100% - 2px)"
            rx={isFirstTime ? 8 : 12}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {renderContent()}
      </motion.div>
    </section>
  );
}
