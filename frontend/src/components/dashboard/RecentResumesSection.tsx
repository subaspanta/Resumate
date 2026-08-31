"use client";

import { AnimatePresence } from "motion/react";
import { ResumeSummary } from "@/src/features/resume/types";
import { ResumeListItem } from "./ResumeListItem";

interface RecentResumesSectionProps {
  resumes: ResumeSummary[];
  onOpenResume: (id: string) => void;
  onViewAll: () => void;
  onDeleteResume?: (id: string, title: string) => void;
  deletingId?: string;
  emptyMessage?: string;
  showViewAll?: boolean;
}

export function RecentResumesSection({
  resumes,
  onOpenResume,
  onViewAll,
  onDeleteResume,
  deletingId,
  emptyMessage = "No resumes yet. Your uploaded resumes will appear here.",
  showViewAll = false,
}: RecentResumesSectionProps) {
  return (
    <section className="dashboard-recent-section">
      <div className="dashboard-recent-header">
        <h2 className="dashboard-recent-title">Recent Resumes</h2>
        {showViewAll && resumes.length > 0 && (
          <button
            className="dashboard-recent-link"
            onClick={onViewAll}
            type="button"
          >
            View all files
          </button>
        )}
      </div>

      <div className="dashboard-recent-panel">
        {resumes.length === 0 ? (
          <p className="body-copy body-copy--muted dashboard-recent-empty">
            {emptyMessage}
          </p>
        ) : (
          <AnimatePresence initial={false}>
            {resumes.map((resume, i) => (
              <ResumeListItem
                key={resume.id}
                resume={resume}
                index={i}
                onOpen={onOpenResume}
                onDelete={onDeleteResume}
                isDeleting={deletingId === resume.id}
                isLast={i === resumes.length - 1}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
