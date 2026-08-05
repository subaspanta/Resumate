import { Type } from "@google/genai";
import { z } from "zod";

// Zod mirror of RESUME_SCHEMA below — re-validated after Gemini responds so a
// shape mismatch (missing required field, empty array, wrong type) is caught
// even though responseSchema mostly enforces this already. Matches what
// RESUME_SCHEMA actually constrains Gemini to produce, not the broader
// StructuredResume TS type in parsing.types.ts.
export const structuredResumeSchema = z.object({
  name: z.string().nullable().optional(),
  contact: z
    .object({
      email: z.string().nullable().optional(),
      phone: z.string().nullable().optional(),
      location: z.string().nullable().optional(),
      github: z.string().nullable().optional(),
      linkedin: z.string().nullable().optional(),
      website: z.string().nullable().optional(),
    })
    .optional(),
  summary: z.string().nullable().optional(),
  experience: z.array(
    z.object({
      title: z.string(),
      company: z.string().nullable().optional(),
      workMode: z.enum(["remote", "onsite", "hybrid"]).nullable().optional(),
      location: z.string().nullable().optional(),
      startDate: z.string().nullable().optional(),
      endDate: z.string().nullable().optional(),
      bullets: z.array(z.string()),
    }),
  ),
  education: z.array(
    z.object({
      degree: z.string(),
      institution: z.string(),
      year: z.string().nullable().optional(),
    }),
  ),
  skills: z.array(z.string()),
  projects: z.array(
    z.object({
      name: z.string(),
      bullets: z.array(z.string()),
    }),
  ),
});

// Gemini's structured-output schema — a runtime description of StructuredResume,

export const RESUME_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, nullable: true },
    contact: {
      type: Type.OBJECT,
      properties: {
        email: { type: Type.STRING, nullable: true },
        phone: { type: Type.STRING, nullable: true },
        location: { type: Type.STRING, nullable: true },
        github: { type: Type.STRING, nullable: true },
        linkedin: { type: Type.STRING, nullable: true },
        website: { type: Type.STRING, nullable: true },
      },
    },
    summary: { type: Type.STRING, nullable: true },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          company: { type: Type.STRING, nullable: true },
          workMode: {
            type: Type.STRING,
            enum: ["remote", "onsite", "hybrid"],
            nullable: true,
          },
          location: { type: Type.STRING, nullable: true },
          startDate: { type: Type.STRING, nullable: true },
          endDate: { type: Type.STRING, nullable: true },
          bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["title", "bullets"],
      },
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          degree: { type: Type.STRING },
          institution: { type: Type.STRING },
          year: { type: Type.STRING, nullable: true },
        },
        required: ["degree", "institution"],
      },
    },
    skills: { type: Type.ARRAY, items: { type: Type.STRING } },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["name", "bullets"],
      },
    },
  },
  required: ["experience", "education", "skills", "projects"],
};

export const RESUME_STRUCTURING_PROMPT = `Extract structured resume data from the provided text.

"name" is the candidate's full name, usually the most prominent line at the top of the
resume. If the header is a document title instead of a person's name (e.g. "Curriculum
Vitae", "Resume"), look further down for the actual name. If no name can be identified
anywhere in the text, set it to null — do not guess.

"summary" is a short introductory paragraph about the candidate (sometimes labeled
"Summary," "Profile," "Objective," or with no label at all, appearing right after the
name/contact block). If no such paragraph is present, set it to null. Do not construct
one from scattered details elsewhere in the resume.

For contact links:
- "github" is the candidate's GitHub profile URL or handle (e.g. "github.com/jsmith").
- "linkedin" is the candidate's LinkedIn profile URL or handle.
- "website" is a personal website or portfolio URL that is neither GitHub nor LinkedIn.
Only extract a link if it is explicitly present in the text — never guess a URL from a
name or infer one that isn't written out. If a link type isn't present, set it to null.

Dates ("startDate", "endDate" for experience) must be normalized to "YYYY-MM" when a
month and year are both stated (e.g. "Jan 2020" or "01/2020" both become "2020-01"). If
only a year is stated, use "YYYY". If the entry is ongoing, set "endDate" to "Present".
If a date is genuinely not stated, set it to null — do not infer or estimate a date.

For each experience entry:
- "company" is the actual employer name. If no company name is stated (e.g. the line only
  says "Remote" or a job title with no employer), set company to null — do NOT put work
  arrangement words like "Remote," "Onsite," or "Hybrid" into company.
- "workMode" captures whether the work arrangement is remote, onsite, or hybrid. If no work arrangement is stated, set workMode to null.
- "location" is the location of the job, if stated. If no location is provided, set location to null.
- "bullets" is an array with ONE entry per distinct achievement or responsibility line in
  the source resume — never merge multiple bullet points into a single string. A resume
  bullet is usually its own line, often starting with a past-tense verb ("Led," "Built,"
  "Implemented"). If the role has no bullet content at all, use an empty array.

For each education entry:
- "year" is the year of graduation or completion, if stated. If no year is provided, set year to null.

For each project entry:
- "name" is the project's title or name.
- "bullets" is an array with ONE entry per distinct line describing what the project does
  or the work performed — same rule as experience bullets, never merge them. If no
  bullet content is present, use an empty array.
If no projects section is present in the resume, return an empty array.

"skills" is a flat array of every individual skill listed in the text — if the resume
groups skills under headings (e.g. "Frontend:", "Backend:"), ignore the headings and
collect every skill from every group into one flat list. Do not preserve or invent
category labels.

If any field is not present in the text, set it to null or an empty array as appropriate.
Do not invent, infer, or estimate any data that is not explicitly stated in the text —
this includes dates, employer names, bullets, and skills. If the resume text appears
garbled, truncated, or corrupted (e.g. from a scanned document with poor text extraction),
extract whatever is clearly legible and leave the rest null rather than guessing at
unclear parts.

EXAMPLE

Resume text:
"Jordan Lee
jordan.lee@email.com | (555) 123-4567 | Austin, TX
github.com/jlee-dev | linkedin.com/in/jordanlee

Backend-focused software engineer with 4 years of experience building payment systems.

EXPERIENCE
Senior Backend Engineer — Fintra (Remote)
Jan 2021 - Present
Led migration of the payments service from a monolith to microservices.
Reduced average API latency by 35% through query optimization and caching.
Mentored two junior engineers on system design and code review practices.

EDUCATION
B.S. Computer Science, University of Texas, 2019

SKILLS
Backend: Python, Django, PostgreSQL
Cloud & DevOps: AWS, Docker, Terraform"

Correct extraction:
{
  "name": "Jordan Lee",
  "contact": {
    "email": "jordan.lee@email.com",
    "phone": "(555) 123-4567",
    "location": "Austin, TX",
    "github": "github.com/jlee-dev",
    "linkedin": "linkedin.com/in/jordanlee",
    "website": null
  },
  "summary": "Backend-focused software engineer with 4 years of experience building payment systems.",
  "experience": [
    {
      "title": "Senior Backend Engineer",
      "company": "Fintra",
      "workMode": "remote",
      "location": null,
      "startDate": "2021-01",
      "endDate": "Present",
      "bullets": [
        "Led migration of the payments service from a monolith to microservices.",
        "Reduced average API latency by 35% through query optimization and caching.",
        "Mentored two junior engineers on system design and code review practices."
      ]
    }
  ],
  "education": [
    { "degree": "B.S. Computer Science", "institution": "University of Texas", "year": "2019" }
  ],
  "skills": ["Python", "Django", "PostgreSQL", "AWS", "Docker", "Terraform"],
  "projects": []
}

Note how "Fintra" (the employer) is separated from "(Remote)" (the work mode, mapped to
"workMode": "remote", never appended to "company"), "Jan 2021" is normalized to "2021-01",
each of the three achievement lines becomes its own "bullets" entry rather than being
merged into one paragraph, and the "Backend:"/"Cloud & DevOps:" headings are dropped —
every skill from both groups is collected into one flat "skills" array.`;
