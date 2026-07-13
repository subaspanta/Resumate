// resume/resume.types.ts (or a shared contracts file both modules can reference)

export interface StorageModule {
  saveFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
  ): Promise<{ path: string; url: string }>;

  deleteFile(path: string): Promise<void>;
}

export interface ParsingModule {
  parseResume(buffer: Buffer): Promise<{
    rawText: string;
    structuredResume: Record<string, unknown>;
  }>;
}
