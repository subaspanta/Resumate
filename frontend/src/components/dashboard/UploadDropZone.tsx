"use client";

import { useState, useCallback, useRef } from "react";
import { FileUp, Plus, Upload } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { validateResumeFile } from "@/src/features/resume/resume.utils";

interface UploadDropzoneProps {
  onFileSelected: (file: File) => void;
  /**
   * `compact` is the returning-user form: still a full drop target, but no
   * longer the page's headline once a continue card is leading instead.
   */
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

  // preventDefault only: without it the browser refuses the drop entirely. The
  // active state is owned by the enter/leave counter, not by this — dragover
  // fires continuously, and having it re-assert `true` every few milliseconds
  // is exactly what masked the flicker as a pulse rather than a stuck state.
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  // `dragenter`/`dragleave` fire for every descendant the pointer crosses and
  // both bubble here, so dragging a file across the icon or the button used to
  // clear the active state while the file was still over the zone — `dragover`
  // re-set it a frame later, which pulsed the fill and restarted the
  // marching-ants animation mid-drag.
  //
  // Counting enters against leaves is what fixes it. The obvious alternative —
  // ignoring a leave whose `relatedTarget` is inside the zone — is not
  // reliable: browsers disagree on whether dragleave carries a relatedTarget
  // at all, and it is frequently null. The counter needs no such support.
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

  // A drop ends the drag outright, however many nested enters are outstanding.
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
      e.target.value = "";
    },
    [selectFile],
  );

  const openFilePicker = () => {
    if (isUploading) return;
    inputRef.current?.click();
  };

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

  const content = isUploading ? (
    <>
      <div className="analyzing-orbit analyzing-orbit--inline" aria-hidden="true">
        <span className="analyzing-orbit-ring" />
        <span className="analyzing-orbit-core" />
      </div>
      <h3 className="dashboard-upload-title">
        Uploading and reading your resume…
      </h3>
      <p className="dashboard-upload-desc">This usually takes a few seconds.</p>
    </>
  ) : isCompact ? (
    // One row, no hero block: the continue card above already owns the page's
    // attention, so this only has to stay findable and remain a drop target.
    <>
      <span className="dashboard-upload-compact-icon">
        <Plus className="size-[18px]" aria-hidden="true" />
      </span>
      <span className="dashboard-upload-compact-label">
        Upload another resume
      </span>
      <span className="dashboard-upload-compact-meta">PDF or DOCX, max 2MB</span>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={handleFileInput}
        disabled={isUploading}
      />
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
        // The zone itself is also click-to-open, and this button sits inside
        // it, so without stopping propagation one press ran openFilePicker
        // twice — once here and once as the click bubbled to the zone.
        onClick={(e) => {
          e.stopPropagation();
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
        // The only movement left, and it fires on drag rather than hover: at
        // that point something genuinely is in progress, which is the same
        // reason the marching ants are allowed to run. Hover is a colour step
        // only, per DESIGN.md's border-and-fill rule.
        animate={{ scale: isDragging && !reduceMotion ? 1.01 : 1 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        // The compact variant has no inner button to carry the action, so the
        // zone itself becomes the control and needs the click handler. The
        // other variants keep their own accessible button and are a plain
        // non-interactive region — giving the region itself a click handler
        // with no keyboard equivalent would be a mouse-only trap, so the
        // container-level onClick only applies to compact.
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
        {content}
      </motion.div>
    </section>
  );
}
