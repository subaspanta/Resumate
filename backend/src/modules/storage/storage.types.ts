// storage/storage.types.ts
export interface StorageModule {
  saveFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
  ): Promise<{ path: string; url: string }>;
  deleteFile(path: string): Promise<void>;
}

export class StorageError extends Error {
  constructor(
    public readonly code:
      | "DISK_FULL"
      | "WRITE_FAILED"
      | "INVALID_FILE"
      | "STORAGE_UNAVAILABLE",
    message: string,
  ) {
    super(message);
    this.name = "StorageError";
  }
}

// storage/local-storage.module.ts (stub, real disk write later)
import crypto from "crypto";

export class LocalStorageModule implements StorageModule {
  async saveFile(buffer: Buffer, originalName: string, mimeType: string) {
    const fakePath = `/tmp/resumes/${crypto.randomUUID()}.pdf`;
    return { path: fakePath, url: fakePath };
  }
  async deleteFile(path: string) {
    // no-op stub
  }
}
