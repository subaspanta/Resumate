"use client";

import { use, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useResumeGuard } from "@/src/features/resume/use-flow-guard";
import { useRoles } from "@/src/features/roles/roles.hooks";
import { useCreateCareerAnalysisFlow } from "@/src/features/career-analysis/use-create-career-analysis-flow";
import { ResumeContextCard } from "@/src/components/career-analysis/ResumeContextCard";
import { RoleOptionCard } from "@/src/components/career-analysis/RoleOptionCard";
import { AnalyzingOverlay } from "@/src/components/career-analysis/AnalyzingOverlay";
import { FlowRedirect } from "@/src/components/FlowRedirect";
import { AppShell } from "@/src/components/layout/AppShell";

// Search only earns its keep once scrolling a plain list gets tedious; below
// this count it would just be one more thing to look at before three cards.
const SEARCH_THRESHOLD = 2;

const CRUMBS = [{ label: "Dashboard", href: "/" }, { label: "Target Role" }];

export default function AnalyzeRolePage({
  params,
}: {
  params: Promise<{ resumeId: string }>;
}) {
  const { resumeId } = use(params);
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const {
    resume,
    isLoading: resumeLoading,
    isError,
    isRedirecting,
  } = useResumeGuard(resumeId);
  const { roles, isLoading: rolesLoading } = useRoles();
  const { submitRole, isCreatingAnalysis } =
    useCreateCareerAnalysisFlow(resumeId);

  const filteredRoles = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter(
      (role) =>
        role.title.toLowerCase().includes(q) ||
        role.description.toLowerCase().includes(q),
    );
  }, [roles, query]);

  const handleNavigateStep = useCallback(
    (step: string) => {
      if (step === "upload") router.push("/");
      if (step === "review") router.push(`/resumes/${resumeId}/review`);
    },
    [router, resumeId],
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

      {!rolesLoading && roles.length > SEARCH_THRESHOLD && (
        <div className="role-search">
          <Search className="role-search-icon size-4" aria-hidden="true" />
          <input
            type="text"
            className="role-search-input"
            placeholder="Search roles"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search target roles"
          />
        </div>
      )}

      {rolesLoading && (
        <div className="role-list">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!rolesLoading && filteredRoles.length === 0 && (
        <p className="role-empty">No roles match &ldquo;{query}&rdquo;.</p>
      )}

      {!rolesLoading && filteredRoles.length > 0 && (
        <RadioGroupPrimitive.Root
          className="role-list"
          value={selectedSlug ?? undefined}
          onValueChange={setSelectedSlug}
          aria-label="Target role"
        >
          {filteredRoles.map((role) => (
            <RoleOptionCard key={role.id} role={role} />
          ))}
        </RadioGroupPrimitive.Root>
      )}

      <div className="flex justify-end">
        <Button
          disabled={
            !selectedSlug || resumeLoading || !resume || isCreatingAnalysis
          }
          onClick={() => selectedSlug && submitRole(selectedSlug)}
        >
          Analyze fit
        </Button>
      </div>

      {isCreatingAnalysis && <AnalyzingOverlay />}
    </AppShell>
  );
}
