import { Prisma } from "../../generated/client/client.js";

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

export type AnalysisStatus = "none" | "unexported" | "exported";

// Raw shape the repository selects — no analysis join. The service layer
// enriches this into ResumeSummary by merging in per-resume export status.
export type RawResumeSummary = {
  id: string;
  title: string;
  originalFileName: string;
  fileSize: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ResumeSummary = RawResumeSummary & {
  analysisStatus: AnalysisStatus;
};

export type RawResumePage = {
  items: RawResumeSummary[];
  nextCursor: string | null;
};

export type ResumePage = {
  items: ResumeSummary[];
  nextCursor: string | null;
};
