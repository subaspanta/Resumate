"use client";

import { useMemo } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StructuredResume } from "@/src/features/resume/types";
import { entryBullets } from "@/src/features/resume/resume.utils";
import type {
  GenerateSuggestionsInput,
  Suggestion,
} from "@/src/features/analysis/types";

interface ResumeReviewPreviewProps {
  structuredResume: StructuredResume;
  pendingSuggestions: Suggestion[];
  showChanges: boolean;
  zoom: number;
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

// Renders one piece of resume text (summary line or bullet) plus its
// Generate-Suggestions trigger. A pending suggestion already covers this
// text once shown highlighted, so the trigger hides then — generating again
// would just queue a second, conflicting rewrite for the same original.
function ReviewTextRow({
  text,
  suggestionByOriginal,
  showChanges,
  section,
  entryKey,
  onGenerateSuggestions,
  generatingKey,
  textClassName,
}: {
  text: string;
  suggestionByOriginal: Map<string, Suggestion>;
  showChanges: boolean;
  section: GenerateSuggestionsInput["section"];
  entryKey: string;
  onGenerateSuggestions?: (input: GenerateSuggestionsInput) => void;
  generatingKey?: string | null;
  textClassName: string;
}) {
  const suggestion = suggestionByOriginal.get(text);
  const isHighlighted = showChanges && !!suggestion;

  return (
    <>
      <span className={textClassName}>
        {isHighlighted ? (
          <span className="resume-review-highlight">{suggestion.suggested}</span>
        ) : (
          text
        )}
      </span>
      {/* min 10 mirrors the backend's originalBullet bound — without it the
          button renders on stub text and the request 400s with no way for the
          user to make the retry succeed. */}
      {onGenerateSuggestions && !isHighlighted && text.trim().length >= 10 && (
        <GenerateSuggestionsButton
          isGenerating={generatingKey === entryKey}
          onClick={() =>
            onGenerateSuggestions({ section, originalText: text, key: entryKey })
          }
        />
      )}
    </>
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

export function ResumeReviewPreview({
  structuredResume,
  pendingSuggestions,
  showChanges,
  zoom,
  onGenerateSuggestions,
  generatingKey,
}: ResumeReviewPreviewProps) {
  // Suggestions carry no bullet-index/location field — they're matched to
  // resume text purely by exact string equality against `original`, same
  // convention the backend's merge-on-read (applySuggestions) relies on.
  const suggestionByOriginal = useMemo(
    () => new Map(pendingSuggestions.map((s) => [s.original, s])),
    [pendingSuggestions],
  );

  const {
    name,
    contact,
    summary,
    experience = [],
    projects = [],
    education = [],
    skills = [],
    certifications = [],
    customSections = [],
  } = structuredResume;

  const hasContact =
    contact?.email ||
    contact?.phone ||
    contact?.location ||
    contact?.linkedin ||
    contact?.github ||
    contact?.website;

  return (
    <div className="resume-review-viewport">
      <div
        className="resume-review-card resume-preview"
        style={{ transform: `scale(${zoom})` }}
      >
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
            <SectionHeading>Professional Summary</SectionHeading>
            <ReviewTextRow
              text={summary}
              suggestionByOriginal={suggestionByOriginal}
              showChanges={showChanges}
              section="summary"
              entryKey="summary"
              onGenerateSuggestions={onGenerateSuggestions}
              generatingKey={generatingKey}
              textClassName="resume-preview-summary"
            />
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
                            <ReviewTextRow
                              text={bullet}
                              suggestionByOriginal={suggestionByOriginal}
                              showChanges={showChanges}
                              section="bullet"
                              entryKey={`experience-${i}-${j}`}
                              onGenerateSuggestions={onGenerateSuggestions}
                              generatingKey={generatingKey}
                              textClassName="resume-preview-bullet"
                            />
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
                            <ReviewTextRow
                              text={bullet}
                              suggestionByOriginal={suggestionByOriginal}
                              showChanges={showChanges}
                              section="project"
                              entryKey={`project-${i}-${j}`}
                              onGenerateSuggestions={onGenerateSuggestions}
                              generatingKey={generatingKey}
                              textClassName="resume-preview-bullet"
                            />
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
                  <p className="resume-preview-entry-meta">
                    {entry.institution}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {certifications.length > 0 && (
          <div className="resume-preview-section">
            <SectionHeading>Certifications</SectionHeading>
            <div className="resume-preview-entries">
              {certifications.map((cert, i) => (
                <div key={i} className="resume-preview-entry">
                  <div className="resume-preview-entry-row">
                    <span className="resume-preview-entry-title">
                      {cert.name}
                      {cert.issuer ? ` — ${cert.issuer}` : ""}
                    </span>
                    {cert.issueDate && (
                      <span className="resume-preview-entry-dates">
                        {cert.issueDate}
                      </span>
                    )}
                  </div>
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
                  {group.items.map((skill, i) => (
                    <li
                      key={`${i}-${skill}`}
                      className="resume-preview-skills-item"
                    >
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {customSections.map((section) => (
          <div key={section.heading} className="resume-preview-section">
            <SectionHeading>{section.heading}</SectionHeading>
            {section.bullets.length > 0 && (
              <ul className="resume-preview-bullets">
                {section.bullets.map((bullet, j) => (
                  <li
                    key={`${j}-${bullet.slice(0, 20)}`}
                    className="resume-preview-bullet-row"
                  >
                    <span className="resume-preview-bullet">{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
