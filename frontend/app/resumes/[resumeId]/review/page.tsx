"use client";

import { use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, FolderGit2, GraduationCap, Award, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useResumeGuard } from "@/src/features/resume/use-flow-guard";
import { entryBullets } from "@/src/features/resume/resume.utils";
import { FlowRedirect } from "@/src/components/FlowRedirect";
import { AppShell, type Crumb } from "@/src/components/layout/AppShell";

// The step rail already includes the dashboard destination via Resume.
const CRUMBS: Crumb[] = [];

export default function ResumeReviewPage({
  params,
}: {
  params: Promise<{ resumeId: string }>;
}) {
  const { resumeId } = use(params);
  const router = useRouter();

  const { resume, isLoading, isError, isRedirecting, refetch } =
    useResumeGuard(resumeId);

  const handleNavigateStep = useCallback(
    (step: string) => {
      if (step === "upload") router.push("/");
    },
    [router],
  );

  if (isRedirecting) {
    return <FlowRedirect />;
  }

  if (isError) {
    return (
      <AppShell
        step="review"
        width="narrow"
        crumbs={CRUMBS}
        title="Review Your Profile"
        onNavigateStep={handleNavigateStep}
      >
        <div className="analysis-error">
          <p className="analysis-error-message">
            We couldn&apos;t load this resume.
          </p>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      </AppShell>
    );
  }

  if (isLoading || !resume) {
    return (
      <AppShell
        step="review"
        width="narrow"
        crumbs={CRUMBS}
        title="Review Your Profile"
        onNavigateStep={handleNavigateStep}
      >
        <div className="flex flex-col gap-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </AppShell>
    );
  }

  const profile = resume.structuredResume;
  const contact = profile.contact;
  const hasContact =
    contact &&
    (contact.email || contact.phone || contact.location || contact.github ||
      contact.linkedin || contact.website);

  return (
    <AppShell
      step="review"
      width="narrow"
      crumbs={CRUMBS}
      title="Review Your Profile"
      subtitle="Here's what we found on your resume. This is what your analysis will be based on — nothing here is invented."
      onNavigateStep={handleNavigateStep}
      hasActionBar
    >
      <div className="card profile-review-card">
        <div className="profile-review-card-icon">
          <User className="size-5" aria-hidden="true" />
        </div>
        <div className="profile-review-card-body">
          <p className="entry-title profile-review-card-title">
            {profile.name || "Name not found"}
          </p>
          {hasContact ? (
            <p className="profile-review-card-contact">
              {[contact?.email, contact?.phone, contact?.location]
                .filter(Boolean)
                .join(" · ")}
            </p>
          ) : (
            <p className="profile-review-empty">
              No contact details found on your resume.
            </p>
          )}
        </div>
      </div>

      {profile.summary && (
        <div className="flex flex-col gap-3">
          <h2 className="section-heading">Summary</h2>
          <p className="body-copy profile-review-summary">{profile.summary}</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="section-heading">
          <Briefcase className="profile-review-heading-icon" aria-hidden="true" />
          Work Experience ({profile.experience.length})
        </h2>
        {profile.experience.length === 0 ? (
          <p className="profile-review-empty">
            No work experience found on your resume.
          </p>
        ) : (
          <div className="profile-review-list">
            {profile.experience.map((entry, i) => (
              <div key={i} className="card profile-review-entry">
                <div className="profile-review-entry-header">
                  <span className="entry-title profile-review-entry-title">
                    {entry.title}
                  </span>
                  {entry.company && (
                    <span className="profile-review-entry-subtitle">
                      {entry.company}
                    </span>
                  )}
                </div>
                {(entry.startDate || entry.endDate) && (
                  <p className="meta-label profile-review-entry-meta">
                    {[entry.startDate, entry.endDate].filter(Boolean).join(" – ")}
                  </p>
                )}
                {entryBullets(entry).length > 0 && (
                  <ul className="profile-review-bullets">
                    {entryBullets(entry).map((bullet, j) => (
                      <li key={j}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="section-heading">
          <FolderGit2 className="profile-review-heading-icon" aria-hidden="true" />
          Projects ({profile.projects.length})
        </h2>
        {profile.projects.length === 0 ? (
          <p className="profile-review-empty">
            No projects found on your resume.
          </p>
        ) : (
          <div className="profile-review-list">
            {profile.projects.map((entry, i) => (
              <div key={i} className="card profile-review-entry">
                <div className="profile-review-entry-header">
                  <span className="entry-title profile-review-entry-title">
                    {entry.name}
                  </span>
                </div>
                {entryBullets(entry).length > 0 && (
                  <ul className="profile-review-bullets">
                    {entryBullets(entry).map((bullet, j) => (
                      <li key={j}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="section-heading">Skills ({profile.skills.length})</h2>
        {profile.skills.length === 0 ? (
          <p className="profile-review-empty">
            No skills found on your resume.
          </p>
        ) : (
          <div className="profile-review-skill-groups">
            {profile.skills.map((group, i) => (
              <div key={i} className="card profile-review-skill-group">
                <span className="meta-label profile-review-skill-category">
                  {group.category ?? "Other"}
                </span>
                <div className="profile-review-skill-chips">
                  {group.items.map((item, j) => (
                    <span key={j} className="profile-review-skill-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="section-heading">
          <GraduationCap className="profile-review-heading-icon" aria-hidden="true" />
          Education ({profile.education.length})
        </h2>
        {profile.education.length === 0 ? (
          <p className="profile-review-empty">
            No education found on your resume.
          </p>
        ) : (
          <div className="profile-review-list">
            {profile.education.map((entry, i) => (
              <div key={i} className="card profile-review-entry">
                <div className="profile-review-entry-header">
                  <span className="entry-title profile-review-entry-title">
                    {entry.degree}
                  </span>
                  <span className="profile-review-entry-subtitle">
                    {entry.institution}
                  </span>
                </div>
                {entry.year && (
                  <p className="meta-label profile-review-entry-meta">{entry.year}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {profile.certifications.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="section-heading">
            <Award className="profile-review-heading-icon" aria-hidden="true" />
            Certifications ({profile.certifications.length})
          </h2>
          <div className="profile-review-list">
            {profile.certifications.map((entry, i) => (
              <div key={i} className="card profile-review-entry">
                <div className="profile-review-entry-header">
                  <span className="entry-title profile-review-entry-title">
                    {entry.name}
                  </span>
                  {entry.issuer && (
                    <span className="profile-review-entry-subtitle">
                      {entry.issuer}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="action-bar analysis-action-bar">
        <div className="action-bar-inner analysis-action-bar-inner">
          <Button onClick={() => router.push(`/analyze/${resumeId}`)}>
            Looks right — choose a role
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
