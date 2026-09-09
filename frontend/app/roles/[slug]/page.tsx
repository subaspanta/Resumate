"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AppShell } from "@/src/components/layout/AppShell";
import { useRole } from "@/src/features/roles/roles.hooks";
import type { SkillImportance } from "@/src/features/roles/types";

const CRUMBS_BASE = [{ label: "Dashboard", href: "/" }];

const IMPORTANCE_LABEL: Record<SkillImportance, string> = {
  critical: "Critical",
  important: "Important",
  nice_to_have: "Nice to have",
};

// Keep requirements in candidate-priority order.
const IMPORTANCE_ORDER: SkillImportance[] = [
  "critical",
  "important",
  "nice_to_have",
];

export default function RoleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { role, isLoading, isError } = useRole(slug);

  const crumbs = [
    ...CRUMBS_BASE,
    { label: role?.title ?? "Role" },
  ];

  if (isLoading) {
    return (
      <AppShell crumbs={crumbs} title="Role" width="narrow">
        <Skeleton className="h-6 w-48" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </AppShell>
    );
  }

  if (isError || !role) {
    return (
      <AppShell crumbs={crumbs} title="Role" width="narrow">
        <div className="analysis-error">
          <p className="analysis-error-message">
            We couldn&apos;t find that role.
          </p>
          <Button onClick={() => router.push("/")}>Back to dashboard</Button>
        </div>
      </AppShell>
    );
  }

  const requirementsByImportance = IMPORTANCE_ORDER.map((importance) => ({
    importance,
    requirements: role.requirements.filter(
      (r) => r.importance === importance,
    ),
  })).filter((group) => group.requirements.length > 0);

  return (
    <AppShell
      crumbs={crumbs}
      title={role.title}
      subtitle={role.description}
      width="narrow"
    >
      {requirementsByImportance.map((group) => (
        <div key={group.importance} className="flex flex-col gap-4">
          <h2 className="section-heading">
            {IMPORTANCE_LABEL[group.importance]} (
            {group.requirements.length})
          </h2>
          <div className="gap-list">
            {group.requirements.map((req) => (
              <div key={req.skillId} className="card">
                <div className="gap-card-header">
                  <span className="entry-title gap-card-title">{req.name}</span>
                </div>
                <p className="body-copy gap-card-reasoning">{req.rationale}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </AppShell>
  );
}
