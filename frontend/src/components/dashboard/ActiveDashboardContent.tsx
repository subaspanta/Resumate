"use client";

import { ArrowRight, Clock, FileText, Loader2 } from "lucide-react";
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
        <h2 className="dashboard-hero-title">Continue where you left off</h2>
        <div className="dashboard-hero-file">
          <div className="dashboard-hero-file-chip">
            <FileText className="size-5 text-text-muted" aria-hidden="true" />
            <span className="dashboard-hero-file-name">
              {resume.fileName || resume.title}
            </span>
          </div>
          <div className="dashboard-hero-timestamp">
            <Clock className="size-3.5" aria-hidden="true" />
            Last edited: {resume.lastEditedAt}
          </div>
        </div>
        {suggestionsCount > 0 ? (
          <div className="dashboard-ai-pill">
            <span className="font-label-std text-label-std">
              {suggestionsCount} Suggestions Waiting
            </span>
          </div>
        ) : null}
      </div>
      <div className="dashboard-hero-actions">
        <button
          type="button"
          className="dashboard-btn-secondary"
          onClick={onUploadNew}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : null}
          {isUploading ? "Uploading…" : "Upload New Resume"}
        </button>
        <button
          type="button"
          className="dashboard-btn-primary"
          onClick={() => onOpenWorkspace(resume.id)}
        >
          Open Workspace
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
