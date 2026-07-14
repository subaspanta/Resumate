// parsing/parsing.types.ts
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

// parsing/stub-parsing.module.ts (stub, real parsing later)
export class StubParsingModule implements ParsingModule {
  async parseResume(buffer: Buffer) {
    return { rawText: "stub extracted text", structuredResume: {} };
  }
}
