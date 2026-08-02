export type StructuredResume = {
  name?: string;
  contact?: { email?: string; phone?: string; location?: string };
  summary?: string;
  experience: {
    title: string;
    company: string | null;
    workMode?: "remote" | "hybrid" | "onsite" | null;
    location?: string | null;
    startDate?: string;
    endDate?: string;
    description?: string;
  }[];
  education: { degree: string; institution: string; year?: string }[];
  skills: string[];
  projects: { name: string; description?: string }[];
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
