import { ResumeSummary } from "../features/resume/types";
import { ResumeListItem } from "./ResumeListItem";

interface RecentResumesSectionProps {
  resumes: ResumeSummary[];
  onOpenResume: (id: string) => void;
  onViewAll: () => void;
}

export function RecentResumesSection({
  resumes,
  onOpenResume,
  onViewAll,
}: RecentResumesSectionProps) {
  return (
    <section className="space-y-lg">
      <div className="flex justify-between items-center">
        <h2 className="font-headline-sm text-headline-sm text-text-primary font-bold">
          Recent Resumes
        </h2>
        <button
          className="text-primary font-label-std text-label-std hover:underline bg-transparent border-0 cursor-pointer font-semibold"
          onClick={onViewAll}
        >
          View all files
        </button>
      </div>

      <div className="bg-surface rounded-xl overflow-hidden border border-border-base no-shadow">
        {resumes.length === 0 ? (
          <p className="px-lg py-xl text-center text-text-muted font-body-md">
            No resumes yet — upload one above to get started.
          </p>
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