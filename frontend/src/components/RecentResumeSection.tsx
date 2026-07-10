import { ResumeSummary } from "../features/resume/types";
import { ResumeListItem } from "./ResumeListItem";

interface RecentResumesSectionProps {
  resumes: ResumeSummary[];
  onOpenResume: (id: string) => void;
  onViewAll: () => void;
  emptyMessage?: string;
  showViewAll?: boolean;
}

export function RecentResumesSection({
  resumes,
  onOpenResume,
  onViewAll,
  emptyMessage = "No resumes yet. Your uploaded resumes will appear here.",
  showViewAll = true,
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
          <p className="dashboard-recent-empty">{emptyMessage}</p>
        ) : (
          resumes.map((resume, i) => (
            <ResumeListItem
              key={resume.id}
              resume={resume}
              onOpen={onOpenResume}
              isLast={i === resumes.length - 1}
            />
          ))
        )}
      </div>
    </section>
  );
}
