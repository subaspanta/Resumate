"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileEdit } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { isApiError } from "@/src/api/api-error";
import { useRequireResume } from "@/src/features/resume/use-flow-guard";
import { useCreateAnalysis } from "@/src/features/analysis/analysis.hooks";
import { ResumeContextCard } from "@/src/components/workspace/ResumeContextCard";
import { JobInputForm } from "@/src/components/workspace/JobInputForm";
import { FlowRedirect } from "@/src/components/FlowRedirect";

export default function WorkspacePage({
  params,
}: {
  params: Promise<{ resumeId: string }>;
}) {
  const { resumeId } = use(params);
  const router = useRouter();

  const {
    resume,
    isLoading: resumeLoading,
    isRedirecting,
  } = useRequireResume(resumeId);
  const createAnalysis = useCreateAnalysis();

  const handleSubmit = async (jobDescription: string) => {
    try {
      const result = await createAnalysis.mutateAsync({
        resumeId,
        jobDescription,
      });
      router.push(`/analysis/${result.analysisId}`);
    } catch (error) {
      if (isApiError(error) && error.code === "RATE_LIMIT_EXCEEDED") {
        // Our own aiRateLimit (10 req / 5 min), not Gemini's — the server's
        // message names the actual wait, so prefer it.
        toast.error(error.message);
        return;
      }
      if (isApiError(error) && error.code === "GEMINI_RATE_LIMITED") {
        toast.error("AI is busy right now. Please try again in a moment.");
        return;
      }
      const message =
        error instanceof Error ? error.message : "Failed to start analysis";
      toast.error(message);
    }
  };

  if (isRedirecting) {
    return <FlowRedirect />;
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-md py-2xl">
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 w-fit text-muted-foreground"
          onClick={() => router.push("/")}
        >
          <ArrowLeft />
          Back
        </Button>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="workspace-steps" aria-hidden="true">
              <div className="workspace-step-dot workspace-step-dot--done" />
              <div className="workspace-step-dot workspace-step-dot--current" />
              <div className="workspace-step-dot" />
            </div>
            <span className="workspace-step-label">Step 2 of 3</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Add the Job Description
          </h1>
          <p className="text-muted-foreground">
            Paste the full job description you&apos;re targeting. Your tailored
            preview unlocks once it&apos;s analyzed.
          </p>
        </div>
      </div>

      {/* Context card only — the full resume preview belongs on the analysis
          page, which is the step this one unlocks. */}
      <ResumeContextCard resume={resume} isLoading={resumeLoading} />

      <div className="workspace-jd-panel">
        <div className="workspace-jd-panel-header">
          <div className="workspace-jd-panel-icon">
            <FileEdit className="size-5" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="workspace-jd-panel-title">Job description</p>
            <p className="workspace-jd-panel-desc">
              The more detail you paste, the more precise your suggestions.
            </p>
          </div>
        </div>

        <JobInputForm
          isSubmitting={createAnalysis.isPending}
          isDisabled={resumeLoading || !resume}
          onSubmit={handleSubmit}
        />
      </div>
    </main>
  );
}
