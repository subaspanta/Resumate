"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Trash2, FileSearch, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import { AppShell } from "@/src/components/layout/AppShell";
import {
  useCareerAnalyses,
  useDeleteCareerAnalysis,
} from "@/src/features/career-analysis/career-analysis.hooks";
import { useRoles } from "@/src/features/roles/roles.hooks";
import { scoreBand } from "@/src/features/career-analysis/career-analysis.utils";
import type { CareerAnalysisStatus } from "@/src/features/career-analysis/types";

const CRUMBS = [{ label: "Dashboard", href: "/" }, { label: "Analyses" }];

const STATUS_LABEL: Record<CareerAnalysisStatus, string> = {
  pending: "Pending",
  analyzing: "Analyzing",
  complete: "Complete",
  failed: "Failed",
};

export default function AnalysesListPage() {
  const router = useRouter();
  const { analyses, isLoading, isError } = useCareerAnalyses();
  const { roles } = useRoles();
  const deleteAnalysis = useDeleteCareerAnalysis();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const roleTitleById = useMemo(() => {
    const map = new Map<string, string>();
    for (const role of roles) map.set(role.id, role.title);
    return map;
  }, [roles]);

  const handleOpen = (id: string, status: CareerAnalysisStatus) => {
    if (status === "failed") return;
    router.push(`/analyses/${id}`);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteAnalysis.mutateAsync(id);
      toast.success("Analysis deleted.");
    } catch {
      toast.error("Failed to delete analysis.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AppShell crumbs={CRUMBS} title="Your Analyses" subtitle="Every career gap analysis you've run.">
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
            We couldn&apos;t load your analyses.
          </p>
          <Button onClick={() => window.location.reload()}>Try again</Button>
        </div>
      )}

      {!isLoading && !isError && analyses.length === 0 && (
        <div className="analyses-empty">
          <FileSearch className="analyses-empty-icon size-8" aria-hidden="true" />
          <p className="analyses-empty-title">No analyses yet</p>
          <p className="analyses-empty-body">
            Upload a resume and pick a target role to run your first gap
            analysis.
          </p>
          <Button onClick={() => router.push("/")}>Go to dashboard</Button>
        </div>
      )}

      {!isLoading && !isError && analyses.length > 0 && (
        <div className="analyses-list">
          {analyses.map((analysis) => {
            const roleTitle = roleTitleById.get(analysis.roleId) ?? "Unknown role";
            const isBusy = analysis.status === "pending" || analysis.status === "analyzing";
            const band =
              analysis.status === "complete" && analysis.readinessScore !== null
                ? scoreBand(analysis.readinessScore)
                : null;

            return (
              <div key={analysis.id} className="analyses-row">
                <button
                  type="button"
                  className="analyses-row-main"
                  onClick={() => handleOpen(analysis.id, analysis.status)}
                  disabled={analysis.status === "failed"}
                >
                  <div className="analyses-row-info">
                    <p className="analyses-row-title">{roleTitle}</p>
                    <p className="analyses-row-date">
                      {new Date(analysis.createdAt).toLocaleDateString(
                        undefined,
                        { year: "numeric", month: "short", day: "numeric" },
                      )}
                    </p>
                  </div>

                  <div className="analyses-row-right">
                    {isBusy && (
                      <span className="analyses-row-status analyses-row-status--busy">
                        <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                        {STATUS_LABEL[analysis.status]}
                      </span>
                    )}
                    {analysis.status === "failed" && (
                      <span className="analyses-row-status analyses-row-status--failed">
                        <XCircle className="size-3.5" aria-hidden="true" />
                        {STATUS_LABEL[analysis.status]}
                      </span>
                    )}
                    {band && (
                      <span className={`analyses-row-score analyses-row-score--${band}`}>
                        {analysis.readinessScore}%
                      </span>
                    )}
                    {analysis.status !== "failed" && (
                      <ArrowRight className="size-[18px] text-text-muted" aria-hidden="true" />
                    )}
                  </div>
                </button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className="analyses-row-delete"
                      disabled={deletingId === analysis.id}
                      type="button"
                      aria-label={`Delete analysis for ${roleTitle}`}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this analysis?</AlertDialogTitle>
                      <AlertDialogDescription>
                        The analysis for <strong>{roleTitle}</strong> and its
                        roadmap will be permanently removed. This can&apos;t
                        be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="dashboard-resume-delete-confirm"
                        onClick={() => handleDelete(analysis.id)}
                      >
                        Delete analysis
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
