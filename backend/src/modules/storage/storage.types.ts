export interface StorageModule {
  saveFile(
    buffer: Buffer,
    options: { extension: string; originalFileName: string },
  ): Promise<{ path: string }>;
  createDownloadUrl(
    path: string,
    options: { extension: string; originalFileName: string },
  ): string;
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
