export interface ParsingModule {
  parseResume(
    buffer: Buffer,
  ): Promise<{ rawText: string; structuredResume: Record<string, unknown> }>;
}

export class ParsingError extends Error {
  constructor(
    public readonly code:
      | "UNREADABLE_PDF"
      | "EMPTY_TEXT"
      | "PASSWORD_PROTECTED"
      | "PARSING_FAILED",
    message: string,
  ) {
    super(message);
    this.name = "ParsingError";
  }
}
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
