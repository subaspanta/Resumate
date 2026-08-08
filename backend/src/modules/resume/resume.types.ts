export interface StorageModule {
  saveFile(buffer: Buffer): Promise<{ path: string; url: string }>;
  deleteFile(path: string): Promise<void>;
}

export interface ParsingModule {
  parseResume(
    buffer: Buffer,
    mimeType: string,
  ): Promise<{
    rawText: string;
    structuredResume: Record<string, unknown>;
  }>;
}

export type ResumeSummary = {
  id: string;
  title: string;
  originalFileName: string;
  fileSize: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ResumePage = {
  items: ResumeSummary[];
  nextCursor: string | null;
};
