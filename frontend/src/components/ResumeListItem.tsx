import { ResumeSummary } from "../features/resume/types";
import { ScoreBadge } from "./Scorebadge";

interface ResumeListItemProps {
  resume: ResumeSummary;
  onOpen: (id: string) => void;
  isLast: boolean;
}

export function ResumeListItem({ resume, onOpen, isLast }: ResumeListItemProps) {
  return (
    <div
      className={`flex items-center justify-between px-lg py-md hover:bg-canvas transition-colors group cursor-pointer ${
        isLast ? "" : "border-b border-border-base"
      }`}
      onClick={() => onOpen(resume.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen(resume.id);
      }}
    >
      <div className="flex items-center gap-lg">
        <div className="w-10 h-10 bg-canvas flex items-center justify-center rounded border border-border-base">
          <span className="material-symbols-outlined text-text-muted">description</span>
        </div>
        <div>
          <p className="font-body-lg text-body-lg text-text-primary font-medium">
            {resume.title}
          </p>
          <p className="font-body-md text-body-md text-text-muted">
            Last Edited: {resume.lastEditedAt}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-xxl">
        <ScoreBadge score={resume.atsScore} />
        <button
          className="flex items-center gap-xs font-label-std text-label-std text-text-body hover:text-primary transition-colors bg-transparent border-0 cursor-pointer font-medium"
          onClick={(e) => {
            e.stopPropagation(); // avoid double-firing with the row's own onClick
            onOpen(resume.id);
          }}
        >
          Open Workspace
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}