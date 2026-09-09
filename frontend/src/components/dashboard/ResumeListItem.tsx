"use client";

import { ArrowRight, FileText, RefreshCw, Trash2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { ResumeSummary } from "@/src/features/resume/types";
import { resumeFileKind } from "@/src/features/resume/resume.utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ResumeListItemProps {
  resume: ResumeSummary;
  index: number;
  onOpen: (id: string) => void;
  onDelete?: (id: string, title: string) => void;
  isDeleting?: boolean;
  // Separate from onOpen — replace is rare but common enough to deserve a
  // direct button without hiding behind delete-and-reupload.
  onReplace?: (id: string) => void;
  isReplacing?: boolean;
  isLast: boolean;
}

export function ResumeListItem({
  resume,
  index,
  onOpen,
  onDelete,
  isDeleting = false,
  onReplace,
  isReplacing = false,
  isLast,
}: ResumeListItemProps) {
  const kind = resumeFileKind(resume.fileName ?? resume.originalFileName);
  const reduceMotion = useReducedMotion(); // CSS media query doesn't affect motion.js

  return (
    <motion.div
      layout={!reduceMotion}
      initial={{ opacity: 0, y: 6 }}
      animate={{
        opacity: isDeleting ? 0.45 : 1,
        y: 0,
        scale: isDeleting ? 0.99 : 1,
      }}
      exit={{
        opacity: 0,
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
      }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1],
              delay: Math.min(index * 0.04, 0.2),
            }
      }
      className={[
        "dashboard-resume-row",
        isLast ? "" : "dashboard-resume-row--bordered",
        isDeleting ? "dashboard-resume-row--deleting" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => onOpen(resume.id)}
      role="button"
      tabIndex={0}
      aria-busy={isDeleting}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen(resume.id);
      }}
    >
      <div className="dashboard-resume-row-left">
        <div className="dashboard-resume-icon">
          <FileText className="size-5" aria-hidden="true" />
        </div>
        <div className="dashboard-resume-row-text">
          <p className="dashboard-resume-name" title={resume.title}>
            {resume.title}
          </p>
          <p className="dashboard-resume-meta">
            {kind !== "file" && (
              <span className="dashboard-resume-kind">
                {kind.toUpperCase()}
              </span>
            )}
            Last edited {resume.lastEditedAt}
          </p>
        </div>
      </div>

      <div className="dashboard-resume-row-right">
        {/* Passive affordance, not a separate control — whole row is clickable */}
        <ArrowRight
          className="dashboard-resume-row-arrow size-[18px]"
          aria-hidden="true"
        />

        {onReplace && (
          <button
            className="dashboard-resume-replace-btn tap-target-44"
            onClick={(e) => {
              e.stopPropagation();
              onReplace(resume.id);
            }}
            disabled={isReplacing}
            type="button"
            aria-label={`Replace ${resume.title}`}
          >
            <RefreshCw
              className={`size-4 ${isReplacing ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
          </button>
        )}

        {onDelete && (
          <AlertDialog>
            {/* Stop propagation so clicking dialog controls doesn't open resume */}
            <AlertDialogTrigger asChild>
              <button
                className="dashboard-resume-delete-btn tap-target-44"
                onClick={(e) => e.stopPropagation()}
                disabled={isDeleting}
                type="button"
                aria-label={`Delete ${resume.title}`}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this resume?</AlertDialogTitle>
                <AlertDialogDescription>
                  <strong>{resume.title}</strong> and every career analysis and
                  roadmap created from it will be permanently removed. This
                  can&apos;t be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="dashboard-resume-delete-confirm"
                  onClick={() => onDelete(resume.id, resume.title)}
                >
                  Delete resume
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </motion.div>
  );
}
