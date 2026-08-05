export type SkillGroup = {
  // null = uncategorized. Backward compat for resumes with no explicit
  // headings, and the shape a legacy flat array coerces into.
  category: string | null;
  items: string[];
};

export type Certification = {
  name: string;
  issuer?: string | null;
  issueDate?: string | null;
  expiryDate?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
};

export type CustomSection = {
  heading: string;
  bullets: string[];
};

export type EnabledSections = {
  summary?: boolean;
  experience?: boolean;
  projects?: boolean;
  education?: boolean;
  skills?: boolean;
  certifications?: boolean;
  // Keyed by CustomSection.heading.
  customSections?: Record<string, boolean>;
};

export type StructuredResume = {
  name?: string | null;
  contact?: {
    email?: string | null;
    phone?: string | null;
    location?: string | null;
    github?: string | null;
    linkedin?: string | null;
    website?: string | null;
  };
  summary?: string | null;
  experience: {
    title: string;
    company?: string | null;
    workMode?: "remote" | "hybrid" | "onsite" | null;
    location?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    bullets: string[];
  }[];
  education: { degree: string; institution: string; year?: string | null }[];
  skills: SkillGroup[];
  projects: { name: string; bullets: string[] }[];
  certifications: Certification[];
  customSections: CustomSection[];
};

export interface AIStructuringModule {
  structureResume(rawText: string): Promise<StructuredResume>;
}

export interface ParsingModule {
  parseResume(
    buffer: Buffer,
    mimeType: string,
  ): Promise<{ rawText: string; structuredResume: StructuredResume }>;
}
