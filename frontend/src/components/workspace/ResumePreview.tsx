"use client";

import { Sparkles, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { StructuredResume } from "@/src/features/resume/types";

interface SkillsMatch {
  matched: string[];
  missing: string[];
}

interface GenerateSuggestionsInput {
  section: "bullet" | "project" | "summary";
  originalText: string;
  key: string;
}

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
      {isGenerating ? (
        <Loader2 className="animate-spin" />
      ) : (
        <Sparkles />
      )}
      Generate Suggestions
    </Button>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </h3>
  );
}

export function ResumePreview({
  structuredResume,
  isLoading,
  skillsMatch,
  onGenerateSuggestions,
  generatingKey,
}: ResumePreviewProps) {
  if (isLoading) {
    return (
      <Card className="flex flex-col gap-4 p-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
      </Card>
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

  const hasContact = contact?.email || contact?.phone || contact?.location;

  return (
    <Card className="flex flex-col gap-6 p-6">
      {(name || hasContact) && (
        <div className="flex flex-col gap-1">
          {name && (
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {name}
            </h2>
          )}
          {hasContact && (
            <p className="text-sm text-muted-foreground">
              {[contact?.email, contact?.phone, contact?.location]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>
      )}

      {summary && (
        <div className="flex flex-col gap-2">
          <SectionHeading>Summary</SectionHeading>
          <p className="text-sm text-foreground">{summary}</p>
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
        <div className="flex flex-col gap-3">
          <SectionHeading>Experience</SectionHeading>
          <div className="flex flex-col gap-4">
            {experience.map((entry, i) => (
              <div key={i} className="flex flex-col gap-1">
                <p className="text-sm font-medium text-foreground">
                  {entry.title}
                  {entry.company ? ` · ${entry.company}` : ""}
                </p>
                {(entry.startDate || entry.endDate) && (
                  <p className="text-xs text-muted-foreground">
                    {[entry.startDate, entry.endDate].filter(Boolean).join(" – ")}
                  </p>
                )}
                {entry.description && (
                  <p className="text-sm text-muted-foreground">
                    {entry.description}
                  </p>
                )}
                {onGenerateSuggestions && entry.description && (
                  <GenerateSuggestionsButton
                    isGenerating={generatingKey === `experience-${i}`}
                    onClick={() =>
                      onGenerateSuggestions({
                        section: "bullet",
                        originalText: entry.description!,
                        key: `experience-${i}`,
                      })
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="flex flex-col gap-3">
          <SectionHeading>Projects</SectionHeading>
          <div className="flex flex-col gap-4">
            {projects.map((entry, i) => (
              <div key={i} className="flex flex-col gap-1">
                <p className="text-sm font-medium text-foreground">
                  {entry.name}
                </p>
                {entry.description && (
                  <p className="text-sm text-muted-foreground">
                    {entry.description}
                  </p>
                )}
                {onGenerateSuggestions && entry.description && (
                  <GenerateSuggestionsButton
                    isGenerating={generatingKey === `project-${i}`}
                    onClick={() =>
                      onGenerateSuggestions({
                        section: "project",
                        originalText: entry.description!,
                        key: `project-${i}`,
                      })
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div className="flex flex-col gap-3">
          <SectionHeading>Education</SectionHeading>
          <div className="flex flex-col gap-2">
            {education.map((entry, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <p className="text-sm font-medium text-foreground">
                  {entry.degree}
                </p>
                <p className="text-xs text-muted-foreground">
                  {entry.institution}
                  {entry.year ? ` · ${entry.year}` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div className="flex flex-col gap-3">
          <SectionHeading>Skills</SectionHeading>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => {
              const isMatched = skillsMatch?.matched.includes(skill);
              return (
                <Badge
                  key={skill}
                  variant={isMatched ? "default" : "secondary"}
                >
                  {skill}
                </Badge>
              );
            })}
          </div>
          {skillsMatch && skillsMatch.missing.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">
                Missing from this job&apos;s requirements:
              </p>
              <div className="flex flex-wrap gap-2">
                {skillsMatch.missing.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
