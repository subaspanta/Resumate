import { Type } from "@google/genai";

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
          description: { type: Type.STRING, nullable: true },
        },
        required: ["title"],
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
  },
  required: ["experience", "education", "skills"],
};

export const RESUME_STRUCTURING_PROMPT = `Extract structured resume data from the provided text.

For each experience entry:
- "company" is the actual employer name. If no company name is stated (e.g. the line only
  says "Remote" or a job title with no employer), set company to null — do NOT put work
  arrangement words like "Remote," "Onsite," or "Hybrid" into company.
- "workMode" captures whether the work arrangement is remote, onsite, or hybrid. If no work arrangement is stated, set workMode to null.
- "location" is the location of the job, if stated. If no location is provided, set location to null.

For each education entry:
- "year" is the year of graduation or completion, if stated. If no year is provided, set year to null.

If any field is not present in the text, set it to null or an empty array as appropriate. Do not invent data.`;
