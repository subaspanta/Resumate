"use client";

import { use, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useResumeGuard } from "@/src/features/resume/use-flow-guard";
import { useRoles } from "@/src/features/roles/roles.hooks";
import { useCreateCareerAnalysisFlow } from "@/src/features/career-analysis/use-create-career-analysis-flow";
import { ResumeContextCard } from "@/src/components/career-analysis/ResumeContextCard";
import { AnalyzingOverlay } from "@/src/components/career-analysis/AnalyzingOverlay";
import { FlowRedirect } from "@/src/components/FlowRedirect";
import { AppShell } from "@/src/components/layout/AppShell";

const CRUMBS = [{ label: "Dashboard", href: "/" }, { label: "Target Role" }];

export default function AnalyzeRolePage({
  params,
}: {
  params: Promise<{ resumeId: string }>;
}) {
  const { resumeId } = use(params);
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const {
    resume,
    isLoading: resumeLoading,
    isError,
    isRedirecting,
  } = useResumeGuard(resumeId);
  const { roles, isLoading: rolesLoading } = useRoles();
  const { submitRole, isCreatingAnalysis } = useCreateCareerAnalysisFlow(resumeId);

  const handleNavigateStep = useCallback(
    (step: string) => {
      if (step === "upload") router.push("/");
    },
    [router],
  );

  if (isRedirecting) {
    return <FlowRedirect />;
  }

  // A non-404 failure leaves nothing to analyze against. Mirrors the
  // analysis page's error branch: stays inside the shell so the user keeps
  // navigation.
  if (isError) {
    return (
      <AppShell
        step="role"
        width="narrow"
        crumbs={CRUMBS}
        title="Choose a Target Role"
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
      step="role"
      width="narrow"
      crumbs={CRUMBS}
      title="Choose a Target Role"
      subtitle="Pick the role you're aiming for. We'll assess your resume against what it actually needs."
      onNavigateStep={handleNavigateStep}
    >
      <ResumeContextCard resume={resume} isLoading={resumeLoading} />

      <div className="flex flex-col gap-4">
        {rolesLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}

        {!rolesLoading &&
          roles.map((role) => (
            <Card
              key={role.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedSlug(role.slug)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setSelectedSlug(role.slug);
              }}
              className={`cursor-pointer p-5 transition-colors hover:border-primary/50 ${
                selectedSlug === role.slug
                  ? "border-primary ring-1 ring-primary"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">{role.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {role.description}
                  </p>
                </div>
                {selectedSlug === role.slug && <Badge>Selected</Badge>}
              </div>
            </Card>
          ))}
      </div>

      <div className="flex justify-end">
        <Button
          disabled={!selectedSlug || resumeLoading || !resume || isCreatingAnalysis}
          onClick={() => selectedSlug && submitRole(selectedSlug)}
        >
          Analyze fit
        </Button>
      </div>

      {isCreatingAnalysis && <AnalyzingOverlay />}
    </AppShell>
  );
}
