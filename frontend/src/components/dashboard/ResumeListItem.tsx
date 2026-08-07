"use client";

import { ArrowRight, FileText, Trash2 } from "lucide-react";
import { ResumeSummary } from "@/src/features/resume/types";
import { AnalysisStatusBadge } from "@/src/components/dashboard/ActiveDashboardContent";
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
}

export function ResumeListItem({
  resume,
  onOpen,
  onDelete,
  isDeleting = false,
  isLast,
}: ResumeListItemProps) {
  return (
    <div
      className={`dashboard-resume-row ${
        isLast ? "" : "dashboard-resume-row--bordered"
      }`}
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
        <AnalysisStatusBadge status={resume.analysisStatus} />
        <button
          className="dashboard-open-btn"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(resume.id);
          }}
          type="button"
        >
          Open Workspace
          <ArrowRight className="size-[18px]" aria-hidden="true" />
        </button>

        {onDelete && (
          <AlertDialog>
            {/* The whole row is a click target, so every handler inside the
                dialog has to stop propagation — otherwise confirming or
                cancelling also navigates into the workspace. */}
            <AlertDialogTrigger asChild>
              <button
                className="dashboard-resume-delete-btn"
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
                  <strong>{resume.title}</strong> and every analysis,
                  suggestion, and tailored version created from it will be
                  permanently removed. This can&apos;t be undone.
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
    </div>
  );
}
