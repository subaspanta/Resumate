"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useResume, useUpdateSectionVisibility } from "@/src/features/resume/resume.hooks";
import type { EnabledSections } from "@/src/features/resume/types";

interface SectionVisibilitySidebarProps {
  resumeId: string;
}

const FIXED_SECTIONS: {
  key: keyof Omit<EnabledSections, "customSections">;
  label: string;
}[] = [
  { key: "summary", label: "Summary" },
  { key: "experience", label: "Experience" },
  { key: "projects", label: "Projects" },
  { key: "education", label: "Education" },
  { key: "skills", label: "Skills" },
  { key: "certifications", label: "Certifications" },
];

export function SectionVisibilitySidebar({
  resumeId,
}: SectionVisibilitySidebarProps) {
  const { resume, isLoading } = useResume(resumeId);
  const updateSectionVisibility = useUpdateSectionVisibility(resumeId);
  // Tracks only the single key currently in flight, so unrelated checkboxes
  // stay interactive while one toggle's PATCH is pending.
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const enabledSections = resume?.enabledSections;

  const toggleFixed = (
    key: keyof Omit<EnabledSections, "customSections">,
    checked: boolean,
  ) => {
    setPendingKey(key);
    updateSectionVisibility.mutate(
      { [key]: checked },
      { onSettled: () => setPendingKey(null) },
    );
  };

  const toggleCustom = (heading: string, checked: boolean) => {
    setPendingKey(heading);
    updateSectionVisibility.mutate(
      { customSections: { [heading]: checked } },
      { onSettled: () => setPendingKey(null) },
    );
  };

  // Sourced from this component's own useResume fetch — never from the
  // page's previewResume/mergedResume, which has already been run through
  // the backend's filterVisibleSections. Deriving headings from filtered
  // content would make a hidden custom section's checkbox disappear the
  // moment it's hidden, with no way to find it again to re-check it.
  const customHeadings = (resume?.structuredResume?.customSections ?? []).map(
    (section) => section.heading,
  );

  return (
    <aside className="section-visibility-sidebar">
      <p className="section-visibility-sidebar-heading">Sections</p>
      <div className="section-visibility-sidebar-group">
        {FIXED_SECTIONS.map(({ key, label }) => {
          const checked = enabledSections?.[key] !== false;
          const id = `section-visibility-${key}`;
          return (
            <div key={key} className="section-visibility-sidebar-row">
              <Checkbox
                id={id}
                checked={checked}
                disabled={isLoading || pendingKey === key}
                onCheckedChange={(value) => toggleFixed(key, value === true)}
              />
              <Label htmlFor={id}>{label}</Label>
            </div>
          );
        })}
      </div>

      {customHeadings.length > 0 && (
        <>
          <div className="section-visibility-sidebar-divider" />
          <p className="section-visibility-sidebar-heading">Custom Sections</p>
          <div className="section-visibility-sidebar-group">
            {customHeadings.map((heading) => {
              const checked =
                enabledSections?.customSections?.[heading] !== false;
              const id = `section-visibility-custom-${heading}`;
              return (
                <div key={heading} className="section-visibility-sidebar-row">
                  <Checkbox
                    id={id}
                    checked={checked}
                    disabled={isLoading || pendingKey === heading}
                    onCheckedChange={(value) =>
                      toggleCustom(heading, value === true)
                    }
                  />
                  <Label htmlFor={id}>{heading}</Label>
                </div>
              );
            })}
          </div>
        </>
      )}
    </aside>
  );
}
