"use client";

import { ResumeSummary } from "@/src/features/resume/types";
import { ScoreBadge } from "@/src/components/ScoreBadge";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

function AnalysisStatusBadge({
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
  return null;
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
          <ScoreBadge
            score={resume.atsScore}
            variant="inline"
            showLabel={false}
          />
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

interface JobTargetCardProps {
  onSetTarget: () => void;
}

export function JobTargetCard({ onSetTarget }: JobTargetCardProps) {
  return (
    <section className="dashboard-job-target">
      <div>
        <h2 className="dashboard-recent-title mb-sm">Job Target</h2>
        <p className="font-body-md text-body-md text-text-body mb-lg">
          Paste a job description to tailor your resume specifically for that
          role.
        </p>
        <div className="dashboard-job-target-empty">
          <span className="material-symbols-outlined text-text-muted text-[32px]">
            work_history
          </span>
          <span className="font-label-std text-label-std text-text-muted">
            No target selected.
          </span>
        </div>
      </div>
      <button
        type="button"
        className="dashboard-btn-secondary mt-lg"
        onClick={onSetTarget}
      >
        Set Target Job
      </button>
    </section>
  );
}

interface RecentResumesTableProps {
  resumes: ResumeSummary[];
  onOpenResume: (id: string) => void;
  suggestionsCount?: number;
}

export function RecentResumesTable({
  resumes,
  onOpenResume,
  suggestionsCount = 0,
}: RecentResumesTableProps) {
  return (
    <section className="flex flex-col gap-md">
      <h2 className="dashboard-recent-title pt-md">Recent Resumes</h2>

      {suggestionsCount > 0 && (
        <div className="dashboard-ai-banner">
          <span className="material-symbols-outlined text-[18px]">
            auto_awesome
          </span>
          <span className="font-label-std text-label-std">
            {suggestionsCount} AI suggestions waiting:{" "}
            <span className="font-bold">Summary • Experience</span>
          </span>
        </div>
      )}

      <div className="dashboard-table-panel">
        <div className="overflow-x-auto">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Resume Name</th>
                <th>ATS Score</th>
                <th>Target Job</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {resumes.map((resume) => (
                <tr key={resume.id}>
                  <td>
                    <div className="flex items-center gap-sm">
                      <span className="material-symbols-outlined text-text-muted">
                        description
                      </span>
                      <span className="font-label-std text-label-std text-text-primary">
                        {resume.title}
                      </span>
                    </div>
                  </td>
                  <td>
                    <ScoreBadge
                      score={resume.atsScore}
                      variant="inline"
                      showLabel={false}
                    />
                  </td>
                  <td className="font-body-md text-body-md text-text-muted">
                    {resume.targetJob ? (
                      <span className="text-text-primary">
                        {resume.targetJob}
                      </span>
                    ) : (
                      <span className="italic">Not Set</span>
                    )}
                  </td>
                  <td>
                    <AnalysisStatusBadge status={resume.analysisStatus} />
                  </td>
                  <td className="font-mono-label text-mono-label text-text-muted">
                    {resume.lastEditedAt}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="dashboard-table-action"
                      onClick={() => onOpenResume(resume.id)}
                    >
                      Open Workspace
                      <span className="material-symbols-outlined text-[16px]">
                        arrow_forward
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function handleDashboardAction(action: string) {
  toast.info(`${action} is not available yet.`);
}
