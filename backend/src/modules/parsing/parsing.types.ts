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
    description?: string | null;
  }[];
  education: { degree: string; institution: string; year?: string | null }[];
  skills: string[];
  projects: { name: string; description?: string | null }[];
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
