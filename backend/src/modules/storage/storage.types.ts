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
