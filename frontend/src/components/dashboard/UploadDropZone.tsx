"use client";

import { useState, useCallback, useRef } from "react";
import { FileUp, Plus, Upload } from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { toast } from "sonner";
import { validateResumeFile } from "@/src/features/resume/resume.utils";

// Degrees of tilt at the zone's edges. Small on purpose: the zone is a drop
// target, and a steep tilt would fight the dashed border's job of reading as
// a flat, well-defined boundary you are aiming a file at.
const MAX_TILT_DEG = 5;

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

  // Cursor position within the zone, normalised to -0.5..0.5 from its centre.
  // Springs sit between the raw pointer and the rendered rotation so the
  // surface settles rather than snapping frame-to-frame with the mouse.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 220, damping: 26 });
  const springY = useSpring(pointerY, { stiffness: 220, damping: 26 });
  // Y drives rotateX and X drives rotateY: pushing the cursor up should tip
  // the far edge away from you, which is rotation about the horizontal axis.
  const rotateX = useTransform(springY, [-0.5, 0.5], [MAX_TILT_DEG, -MAX_TILT_DEG]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-MAX_TILT_DEG, MAX_TILT_DEG]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // Coarse pointers have no hover to track, and a tilt triggered by a tap
      // would fire once and stick.
      if (reduceMotion || e.pointerType !== "mouse") return;
      const bounds = zoneRef.current?.getBoundingClientRect();
      if (!bounds) return;
      pointerX.set((e.clientX - bounds.left) / bounds.width - 0.5);
      pointerY.set((e.clientY - bounds.top) / bounds.height - 0.5);
    },
    [pointerX, pointerY, reduceMotion],
  );

  const resetTilt = useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
  }, [pointerX, pointerY]);

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
        style={{ rotateX, rotateY }}
        animate={{ scale: isDragging ? 1.01 : 1 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        onDragOver={handleDragOver}
        onDragLeave={() => {
          resetTilt();
          handleDragLeave();
        }}
        onDrop={(e) => {
          resetTilt();
          handleDrop(e);
        }}
        onClick={openFilePicker}
        // The compact variant has no inner button to carry the action, so the
        // zone itself becomes the control. The other variants keep their own
        // button and stay a plain region, so making them focusable too would
        // put two tab stops on one action.
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
