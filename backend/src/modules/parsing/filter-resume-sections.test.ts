import { describe, expect, it } from "vitest";
import { filterVisibleSections } from "./filter-resume-sections.js";
import { StructuredResume } from "./parsing.types.js";

function baseResume(): StructuredResume {
  return {
    name: "Jane Doe",
    summary: "Experienced engineer.",
    experience: [{ title: "Engineer", bullets: ["Did things"] }],
    education: [{ degree: "BSc", institution: "State U" }],
    skills: [{ category: null, items: ["TypeScript"] }],
    projects: [{ name: "Portfolio", bullets: ["Built it"] }],
    certifications: [{ name: "AWS SAA" }],
    customSections: [
      { heading: "Volunteering", bullets: ["Helped out"] },
      { heading: "Publications", bullets: ["Wrote a paper"] },
    ],
  };
}

describe("filterVisibleSections", () => {
  it("returns the resume unchanged when enabledSections is null", () => {
    const resume = baseResume();
    expect(filterVisibleSections(resume, null)).toEqual(resume);
  });

  it("returns the resume unchanged when enabledSections is undefined or garbage", () => {
    const resume = baseResume();
    expect(filterVisibleSections(resume, undefined)).toEqual(resume);
    expect(filterVisibleSections(resume, "garbage")).toEqual(resume);
    expect(filterVisibleSections(resume, [1, 2, 3])).toEqual(resume);
  });

  it("strips a fixed section explicitly set to false", () => {
    const resume = baseResume();
    const result = filterVisibleSections(resume, { summary: false });
    expect(result.summary).toBeNull();
    expect(result.experience).toEqual(resume.experience);
  });

  it("strips array-typed fixed sections to an empty array, not undefined", () => {
    const resume = baseResume();
    const result = filterVisibleSections(resume, {
      experience: false,
      projects: false,
      education: false,
      skills: false,
      certifications: false,
    });
    expect(result.experience).toEqual([]);
    expect(result.projects).toEqual([]);
    expect(result.education).toEqual([]);
    expect(result.skills).toEqual([]);
    expect(result.certifications).toEqual([]);
  });

  it("keeps a fixed section when its key is absent or explicitly true", () => {
    const resume = baseResume();
    const result = filterVisibleSections(resume, {
      summary: true,
      experience: undefined,
    });
    expect(result.summary).toBe(resume.summary);
    expect(result.experience).toEqual(resume.experience);
  });

  it("strips only the custom section explicitly set to false, by heading", () => {
    const resume = baseResume();
    const result = filterVisibleSections(resume, {
      customSections: { Volunteering: false },
    });
    expect(result.customSections).toEqual([
      { heading: "Publications", bullets: ["Wrote a paper"] },
    ]);
  });

  it("defaults a custom section heading missing from the map to visible", () => {
    const resume = baseResume();
    const result = filterVisibleSections(resume, {
      customSections: { "Some Other Heading": false },
    });
    expect(result.customSections).toEqual(resume.customSections);
  });

  it("does not mutate the input resume", () => {
    const resume = baseResume();
    const snapshot = JSON.parse(JSON.stringify(resume));
    filterVisibleSections(resume, {
      summary: false,
      customSections: { Volunteering: false },
    });
    expect(resume).toEqual(snapshot);
  });
});
