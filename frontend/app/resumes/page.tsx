"use client";

import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AppShell } from "@/src/components/layout/AppShell";
import { ResumeListItem } from "@/src/components/dashboard/ResumeListItem";
import { useResumes } from "@/src/features/resume/resume.hooks";
import { useDeleteResumeFlow } from "@/src/features/resume/use-resume-delete";
import { useReplaceResumeFlow } from "@/src/components/dashboard/use-resume-replace";

const CRUMBS = [{ label: "Dashboard", href: "/" }, { label: "Resumes" }];

export default function ResumesListPage() {
  const router = useRouter();
  const { resumes, isLoading, isError, refetch } = useResumes();
  const { handleDelete, deletingId } = useDeleteResumeFlow();
  const { triggerReplace, replacingId } = useReplaceResumeFlow();

  return (
    <AppShell
      crumbs={CRUMBS}
      title="Your Resumes"
      subtitle="Every resume you've uploaded."
    >
      {isLoading && (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      )}

      {!isLoading && isError && (
        <div className="analysis-error">
          <p className="analysis-error-message">
            We couldn&apos;t load your resumes.
          </p>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      )}

      {!isLoading && !isError && resumes.length === 0 && (
        <div className="card analyses-empty">
          <FileText className="analyses-empty-icon size-8" aria-hidden="true" />
          <p className="entry-title analyses-empty-title">No resumes yet</p>
          <p className="body-copy body-copy--muted analyses-empty-body">
            Upload a resume from the dashboard to get started.
          </p>
          <Button onClick={() => router.push("/")}>Go to dashboard</Button>
        </div>
      )}

      {!isLoading && !isError && resumes.length > 0 && (
        <div className="dashboard-recent-panel">
          <AnimatePresence initial={false}>
            {resumes.map((resume, i) => (
              <ResumeListItem
                key={resume.id}
                resume={resume}
                index={i}
                onOpen={(id) => router.push(`/resumes/${id}/review`)}
                onDelete={handleDelete}
                isDeleting={deletingId === resume.id}
                onReplace={(id) => triggerReplace(id, resume.title)}
                isReplacing={replacingId === resume.id}
                isLast={i === resumes.length - 1}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </AppShell>
  );
}
