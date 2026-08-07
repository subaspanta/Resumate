"use client";

import { useEffect, useRef, useState } from "react";
import { LayoutList, ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  useResume,
  useUpdateSectionVisibility,
} from "@/src/features/resume/resume.hooks";
import type { EnabledSections } from "@/src/features/resume/types";

interface SectionVisibilityMenuProps {
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

/**
 * Which resume sections get exported. This used to be a permanent 240px left
 * rail on the analysis page, which spent the primary axis on six checkboxes
 * most users touch once. It now lives in the preview toolbar, next to the
 * other controls that act on the same document.
 */
export function SectionVisibilityMenu({
  resumeId,
}: SectionVisibilityMenuProps) {
  const { resume, isLoading } = useResume(resumeId);
  const updateSectionVisibility = useUpdateSectionVisibility(resumeId);
  // Tracks only the single key currently in flight, so unrelated checkboxes
  // stay interactive while one toggle's PATCH is pending.
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

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

  const hiddenCount =
    FIXED_SECTIONS.filter(({ key }) => enabledSections?.[key] === false).length +
    customHeadings.filter(
      (heading) => enabledSections?.customSections?.[heading] === false,
    ).length;

  return (
    <div className="sections-menu" ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`sections-menu-trigger ${
          isOpen ? "sections-menu-trigger--open" : ""
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => setIsOpen((open) => !open)}
      >
        <LayoutList className="size-4" aria-hidden="true" />
        Sections
        {hiddenCount > 0 ? (
          <span className="sections-menu-count">{hiddenCount} hidden</span>
        ) : null}
        <ChevronDown
          className={`size-3.5 sections-menu-chevron ${
            isOpen ? "sections-menu-chevron--open" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="sections-menu-panel" role="group" aria-label="Sections">
          <p className="sections-menu-heading">Include in export</p>
          <div className="sections-menu-group">
            {FIXED_SECTIONS.map(({ key, label }) => {
              const checked = enabledSections?.[key] !== false;
              const id = `section-visibility-${key}`;
              return (
                <div key={key} className="sections-menu-row">
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
              <div className="sections-menu-divider" />
              <p className="sections-menu-heading">Custom sections</p>
              <div className="sections-menu-group">
                {customHeadings.map((heading) => {
                  const checked =
                    enabledSections?.customSections?.[heading] !== false;
                  const id = `section-visibility-custom-${heading}`;
                  return (
                    <div key={heading} className="sections-menu-row">
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
        </div>
      )}
    </div>
  );
}
