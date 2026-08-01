"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { isApiError } from "@/src/api/api-error";
import { useResume } from "@/src/features/resume/resume.hooks";
import { useCreateAnalysis } from "@/src/features/analysis/analysis.hooks";
import { ResumeContextCard } from "@/src/components/workspace/ResumeContextCard";
import { ResumePreview } from "@/src/components/workspace/ResumePreview";
import { JobInputForm } from "@/src/components/workspace/JobInputForm";

export default function WorkspacePage({
  params,
}: {
  params: Promise<{ resumeId: string }>;
}) {
  const { resumeId } = use(params);
  const router = useRouter();

  const { resume, isLoading: resumeLoading } = useResume(resumeId);
  const createAnalysis = useCreateAnalysis();

  const handleSubmit = async (jobDescription: string) => {
    try {
      const result = await createAnalysis.mutateAsync({
        resumeId,
        jobDescription,
      });
      router.push(`/analysis/${result.analysisId}`);
    } catch (error) {
      if (isApiError(error) && error.code === "GEMINI_RATE_LIMITED") {
        toast.error("AI is busy right now. Please try again in a moment.");
        return;
      }
      const message =
        error instanceof Error ? error.message : "Failed to start analysis";
      toast.error(message);
    }
  };

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
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Analyze Your Resume
          </h1>
          <p className="text-muted-foreground">
            Enter a job title or paste a job description to get started.
          </p>
        </div>
      </div>

      <ResumeContextCard resume={resume} isLoading={resumeLoading} />

      <ResumePreview
        structuredResume={resume?.structuredResume}
        isLoading={resumeLoading}
      />

      <JobInputForm
        isSubmitting={createAnalysis.isPending}
        onSubmit={handleSubmit}
      />
    </main>
  );
}
