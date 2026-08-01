"use client";

import { ResumeSummary } from "@/src/features/resume/types";
import { Badge } from "@/components/ui/badge";

export function AnalysisStatusBadge({
  status,
}: {
  status: ResumeSummary["analysisStatus"];
}) {
  if (status === "exported") {
    return <Badge variant="secondary">Exported</Badge>;
  }
  if (status === "unexported") {
    return <Badge variant="default">Continue</Badge>;
  }
  return <Badge variant="outline">Not started</Badge>;
}

interface ContinueWorkingHeroProps {
  resume: ResumeSummary;
  onOpenWorkspace: (id: string) => void;
  onUploadNew: () => void;
  isUploading?: boolean;
}

export function ContinueWorkingHero({
  resume,
  onOpenWorkspace,
  onUploadNew,
  isUploading,
}: ContinueWorkingHeroProps) {
  const suggestionsCount = resume.suggestionsCount ?? 0;

  return (
    <section className="dashboard-hero-card">
      <div className="dashboard-hero-content">
        <h1 className="dashboard-welcome-title">Continue Working</h1>
        <div className="dashboard-hero-file">
          <div className="dashboard-hero-file-chip">
            <span className="material-symbols-outlined text-text-muted">
              description
            </span>
            <span className="dashboard-hero-file-name">
              {resume.fileName || resume.title}
            </span>
          </div>
          <div className="dashboard-hero-timestamp">
            <span className="material-symbols-outlined text-[14px]">
              schedule
            </span>
            Last edited: {resume.lastEditedAt}
          </div>
        </div>
        {suggestionsCount > 0 && (
          <div className="dashboard-ai-pill">
            <span className="font-label-std text-label-std">
              {suggestionsCount} Suggestions Waiting
            </span>
          </div>
        )}
      </div>
      <div className="dashboard-hero-actions">
        <button
          type="button"
          className="dashboard-btn-secondary"
          onClick={onUploadNew}
          disabled={isUploading}
        >
          {isUploading ? (
            <span className="material-symbols-outlined animate-spin text-[16px]">
              progress_activity
            </span>
          ) : null}
          {isUploading ? "Uploading…" : "Upload New Resume"}
        </button>
        <button
          type="button"
          className="dashboard-btn-primary"
          onClick={() => onOpenWorkspace(resume.id)}
        >
          Open Workspace
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </section>
  );
}
