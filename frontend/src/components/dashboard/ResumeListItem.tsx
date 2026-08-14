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
  /** Position in the list, used to stagger the entrance. */
  index: number;
  onOpen: (id: string) => void;
  onDelete?: (id: string, title: string) => void;
  isDeleting?: boolean;
  // Kept separate from onOpen rather than folded into a menu: replacing a
  // resume is rare enough that a full row click target for it isn't
  // justified, but common enough (wrong file, updated resume) to deserve a
  // direct button rather than being buried behind delete-and-reupload.
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
  // The CSS-level reduce-motion guard in base.css only shortens durations;
  // motion drives these values from JS, so it has to be asked directly.
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      layout={!reduceMotion}
      initial={{ opacity: 0, y: 6 }}
      animate={{
        opacity: isDeleting ? 0.45 : 1,
        y: 0,
        // Withdraws while the delete mutation is in flight, so the removal
        // reads as the end of something the user started rather than a row
        // silently disappearing.
        scale: isDeleting ? 0.99 : 1,
      }}
      // Padding collapses with the height, or the row leaves a 48px stub
      // behind mid-exit.
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
              // Only the initial paint staggers; a row arriving later (after
              // an upload) should land immediately, not wait its turn behind
              // rows that are already on screen.
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
        {/* Colour comes from the tile so the row's hover can reach it —
            a hardcoded text-* class here would win over that. */}
        <div className="dashboard-resume-icon">
          <FileText className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="dashboard-resume-name">{resume.title}</p>
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
      {/* No separate "Analyze" button: the whole row already opens the
          resume (role=button, keyboard-navigable) — a second, redundant
          click target next to the delete button just adds noise. The arrow
          is a passive affordance, not a control, and still gets its shift
          animation from the row's own hover. */}
      <div className="dashboard-resume-row-right">
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
            {/* The whole row is a click target, so every handler inside the
                dialog has to stop propagation — otherwise confirming or
                cancelling also navigates into the workspace. */}
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
                  <strong>{resume.title}</strong> and every career analysis
                  and roadmap created from it will be permanently removed.
                  This can&apos;t be undone.
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
