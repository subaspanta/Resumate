import { ResumeSummary } from "../features/resume/types";
import { ScoreBadge } from "./ScoreBadge";

interface ResumeListItemProps {
  resume: ResumeSummary;
  onOpen: (id: string) => void;
  isLast: boolean;
}

export function ResumeListItem({
  resume,
  onOpen,
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
          <span className="material-symbols-outlined text-text-muted">
            description
          </span>
        </div>
        <div>
          <p className="dashboard-resume-name">{resume.title}</p>
          <p className="dashboard-resume-meta">
            Last Edited: {resume.lastEditedAt}
          </p>
        </div>
      </div>
      <div className="dashboard-resume-row-right">
        <ScoreBadge score={resume.atsScore} />
        <button
          className="dashboard-open-btn"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(resume.id);
          }}
          type="button"
        >
          Open Workspace
          <span className="material-symbols-outlined text-[18px]">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
