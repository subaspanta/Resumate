"use client";

import { use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeGuard } from "@/src/features/resume/use-flow-guard";
import { useCreateAnalysisFlow } from "@/src/components/workspace/use-create-analysis-flow";
import { ResumeContextCard } from "@/src/components/workspace/ResumeContextCard";
import { JobInputForm } from "@/src/components/workspace/JobInputForm";
import { AnalyzingOverlay } from "@/src/components/workspace/AnalyzingOverlay";
import { FlowRedirect } from "@/src/components/FlowRedirect";
import { AppShell } from "@/src/components/layout/AppShell";

const CRUMBS = [
  { label: "Dashboard", href: "/" },
  { label: "Job Description" },
];

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
    isError,
    isRedirecting,
  } = useResumeGuard(resumeId);
  const { submitJobDescription, isCreatingAnalysis } =
    useCreateAnalysisFlow(resumeId);

  const handleNavigateStep = useCallback(
    (step: string) => {
      if (step === "upload") router.push("/");
    },
    [router],
  );

  if (isRedirecting) {
    return <FlowRedirect />;
  }

  // A non-404 failure (a 500, a dropped connection) leaves nothing to tailor
  // against. Without this the JD form still renders, permanently disabled and
  // unexplained. Mirrors the analysis page's error branch: stays inside the
  // shell so the user keeps navigation.
  if (isError) {
    return (
      <AppShell
        step="job"
        width="narrow"
        crumbs={CRUMBS}
        title="Add the Job Description"
        onNavigateStep={handleNavigateStep}
      >
        <div className="analysis-error">
          <p className="analysis-error-message">
            We couldn&apos;t load this resume.
          </p>
          <Button onClick={() => window.location.reload()}>Try again</Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      step="job"
      width="narrow"
      crumbs={CRUMBS}
      title="Add the Job Description"
      subtitle="Paste the full posting you're targeting. The more detail you include, the more precise your suggestions."
      onNavigateStep={handleNavigateStep}
    >
      {/* Context card only — the full resume preview belongs on the analysis
          page, which is the step this one unlocks. */}
      <ResumeContextCard resume={resume} isLoading={resumeLoading} />

      <section className="workspace-jd-panel">
        <div className="workspace-jd-panel-header">
          <span className="workspace-jd-panel-icon" aria-hidden="true">
            <FileEdit className="size-5" />
          </span>
          <div className="workspace-jd-panel-heading">
            <h2 className="workspace-jd-panel-title">Job description</h2>
            <p className="workspace-jd-panel-desc">
              Responsibilities, requirements, and the tech stack all improve the
              match.
            </p>
          </div>
        </div>

        <JobInputForm
          isSubmitting={isCreatingAnalysis}
          isDisabled={resumeLoading || !resume}
          onSubmit={submitJobDescription}
        />
      </section>

      {isCreatingAnalysis && <AnalyzingOverlay />}
    </AppShell>
  );
}
