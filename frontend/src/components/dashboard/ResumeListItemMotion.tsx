"use client";

import { ArrowRight, FileText, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { ResumeSummary } from "@/src/features/resume/types";
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
  onOpen: (id: string) => void;
  onDelete?: (id: string, title: string) => void;
  isDeleting?: boolean;
  isLast: boolean;
  index?: number;
}

export function ResumeListItemMotion({
  resume,
  onOpen,
  onDelete,
  isDeleting = false,
  isLast,
  index = 0,
}: ResumeListItemProps) {
  return (
    <motion.div
      className={`dashboard-resume-row ${
        isLast ? "" : "dashboard-resume-row--bordered"
      }`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ x: 4 }}
      onClick={() => onOpen(resume.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen(resume.id);
      }}
    >
      <div className="dashboard-resume-row-left">
        <div className="dashboard-resume-icon">
          <FileText className="size-5 text-text-muted" aria-hidden="true" />
        </div>
        <div>
          <p className="dashboard-resume-name">{resume.title}</p>
          <p className="dashboard-resume-meta">
            Last Edited: {resume.lastEditedAt}
          </p>
        </div>
      </div>
      <div className="dashboard-resume-row-right">
        <button
          className="dashboard-open-btn"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(resume.id);
          }}
          disabled={isDeleting}
          aria-label={`Open ${resume.title}`}
        >
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>
        {onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="dashboard-delete-btn"
                disabled={isDeleting}
                aria-label={`Delete ${resume.title}`}
              >
                <Trash2 className="size-5" aria-hidden="true" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Resume?</AlertDialogTitle>
                <AlertDialogDescription>
                  Deleting <strong>{resume.title}</strong> cannot be undone. All
                  analyses linked to this resume will remain.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(resume.id, resume.title)}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </motion.div>
  );
}
