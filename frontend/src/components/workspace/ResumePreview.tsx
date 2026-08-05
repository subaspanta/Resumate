"use client";

import { useMemo } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { StructuredResume } from "@/src/features/resume/types";
import { entryBullets } from "@/src/features/resume/resume.utils";
import type {
  GenerateSuggestionsInput,
  SkillsMatch,
} from "@/src/features/analysis/types";

interface ResumePreviewProps {
  structuredResume?: StructuredResume;
  isLoading?: boolean;
  skillsMatch?: SkillsMatch;
  // Only passed on the analysis page (has analysisId in scope) — the
  // workspace page omits it, so no buttons render there.
  onGenerateSuggestions?: (input: GenerateSuggestionsInput) => void;
  generatingKey?: string | null;
}

function GenerateSuggestionsButton({
  onClick,
  isGenerating,
}: {
  onClick: () => void;
  isGenerating: boolean;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="w-fit"
      disabled={isGenerating}
      onClick={onClick}
    >
      {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
      Generate Suggestions
    </Button>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="resume-preview-section-heading">{children}</h3>;
}

function EntryDates({
  startDate,
  endDate,
}: {
  startDate?: string | null;
  endDate?: string | null;
}) {
  if (!startDate && !endDate) return null;
  return (
    <span className="resume-preview-entry-dates">
      {[startDate, endDate].filter(Boolean).join(" – ")}
    </span>
  );
}

export function ResumePreview({
  structuredResume,
  isLoading,
  skillsMatch,
  onGenerateSuggestions,
  generatingKey,
}: ResumePreviewProps) {
  // Hooks must run unconditionally on every render — isLoading genuinely
  // flips false->true within one mount (it's React Query's fetch state), so
  // this can't sit below the early returns below without breaking the
  // Rules of Hooks the moment loading finishes.
  const matchedSkills = useMemo(
    () => new Set(skillsMatch?.matched ?? []),
    [skillsMatch],
  );

  if (isLoading) {
    return (
      <div className="resume-preview">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!structuredResume) return null;

  const {
    name,
    contact,
    summary,
    experience = [],
    projects = [],
    education = [],
    skills = [],
  } = structuredResume;

  const hasContact =
    contact?.email ||
    contact?.phone ||
    contact?.location ||
    contact?.linkedin ||
    contact?.github ||
    contact?.website;

  return (
    <div className="resume-preview">
      {(name || hasContact) && (
        <div className="resume-preview-header">
          {name && <h2 className="resume-preview-name">{name}</h2>}
          {hasContact && (
            <p className="resume-preview-contact">
              {[
                contact?.email,
                contact?.phone,
                contact?.location,
                contact?.linkedin,
                contact?.github,
                contact?.website,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>
      )}

      {summary && (
        <div className="resume-preview-section">
          <SectionHeading>Summary</SectionHeading>
          <p className="resume-preview-summary">{summary}</p>
          {onGenerateSuggestions && (
            <GenerateSuggestionsButton
              isGenerating={generatingKey === "summary"}
              onClick={() =>
                onGenerateSuggestions({
                  section: "summary",
                  originalText: summary,
                  key: "summary",
                })
              }
            />
          )}
        </div>
      )}

      {experience.length > 0 && (
        <div className="resume-preview-section">
          <SectionHeading>Experience</SectionHeading>
          <div className="resume-preview-entries">
            {experience.map((entry, i) => {
              const bullets = entryBullets(entry);
              return (
                <div key={i} className="resume-preview-entry">
                  <div className="resume-preview-entry-row">
                    <span className="resume-preview-entry-title">
                      {entry.title}
                      {entry.company ? ` — ${entry.company}` : ""}
                    </span>
                    <EntryDates
                      startDate={entry.startDate}
                      endDate={entry.endDate}
                    />
                  </div>
                  {bullets.length > 0 && (
                    <ul className="resume-preview-bullets">
                      {bullets.map((bullet, j) => (
                        <li
                          key={`${j}-${bullet.slice(0, 20)}`}
                          className="resume-preview-bullet-row"
                        >
                          <span className="resume-preview-bullet">
                            {bullet}
                          </span>
                          {onGenerateSuggestions && (
                            <GenerateSuggestionsButton
                              isGenerating={
                                generatingKey === `experience-${i}-${j}`
                              }
                              onClick={() =>
                                onGenerateSuggestions({
                                  section: "bullet",
                                  originalText: bullet,
                                  key: `experience-${i}-${j}`,
                                })
                              }
                            />
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="resume-preview-section">
          <SectionHeading>Projects</SectionHeading>
          <div className="resume-preview-entries">
            {projects.map((entry, i) => {
              const bullets = entryBullets(entry);
              return (
                <div key={i} className="resume-preview-entry">
                  <span className="resume-preview-entry-title">
                    {entry.name}
                  </span>
                  {bullets.length > 0 && (
                    <ul className="resume-preview-bullets">
                      {bullets.map((bullet, j) => (
                        <li
                          key={`${j}-${bullet.slice(0, 20)}`}
                          className="resume-preview-bullet-row"
                        >
                          <span className="resume-preview-bullet">
                            {bullet}
                          </span>
                          {onGenerateSuggestions && (
                            <GenerateSuggestionsButton
                              isGenerating={
                                generatingKey === `project-${i}-${j}`
                              }
                              onClick={() =>
                                onGenerateSuggestions({
                                  section: "project",
                                  originalText: bullet,
                                  key: `project-${i}-${j}`,
                                })
                              }
                            />
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div className="resume-preview-section">
          <SectionHeading>Education</SectionHeading>
          <div className="resume-preview-entries">
            {education.map((entry, i) => (
              <div key={i} className="resume-preview-entry">
                <div className="resume-preview-entry-row">
                  <span className="resume-preview-entry-title">
                    {entry.degree}
                  </span>
                  {entry.year && (
                    <span className="resume-preview-entry-dates">
                      {entry.year}
                    </span>
                  )}
                </div>
                <p className="resume-preview-entry-meta">{entry.institution}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div className="resume-preview-section">
          <SectionHeading>Skills</SectionHeading>
          {skills.map((group, g) => (
            <div key={`${g}-${group.category ?? "uncategorized"}`}>
              {group.category && (
                <p className="resume-preview-skills-category">
                  {group.category}
                </p>
              )}
              <ul className="resume-preview-skills-grid">
                {group.items.map((skill, i) => {
                  const isMatched = matchedSkills.has(skill);
                  return (
                    <li
                      key={`${i}-${skill}`}
                      className="resume-preview-skills-item"
                    >
                      <span
                        className={
                          isMatched ? "resume-preview-skills-matched" : undefined
                        }
                      >
                        {skill}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          {skillsMatch && skillsMatch.missing.length > 0 && (
            <div className="resume-preview-skills-missing">
              <p className="resume-preview-skills-missing-label">
                Missing from this job&apos;s requirements
              </p>
              <p className="resume-preview-skills-missing-list">
                {skillsMatch.missing.join(", ")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
