import { v2 as cloudinary } from "cloudinary";
import crypto from "node:crypto";
import { env } from "../../config/env.js";
import { StorageError, StorageModule } from "./storage.types.js";
import { withTimeout } from "../../utils/with-timeout.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// Bounds stalled Cloudinary requests; a timed-out remote upload can orphan.
const STORAGE_TIMEOUT_MS = 15_000;
const DOWNLOAD_URL_TTL_SECONDS = 5 * 60;

export class CloudinaryStorageModule implements StorageModule {
  async saveFile(
    buffer: Buffer,
    options: { extension: string; originalFileName: string },
  ): Promise<{ path: string }> {
    try {
      const result = await withTimeout(
        new Promise<{
          public_id: string;
        }>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "raw",
              // Resume PII: never allow public delivery.
              type: "authenticated",
              folder: "resumes",
              // Raw IDs need extension; original name stays metadata.
              public_id: `${crypto.randomUUID()}.${options.extension}`,
              filename_override: options.originalFileName,
            },
            (error, result) => {
              if (error || !result) {
                reject(error);
                return;
              }
              resolve(result);
            },
          );
          uploadStream.end(buffer);
        }),
        STORAGE_TIMEOUT_MS,
        "Resume storage upload",
      );

      return { path: result.public_id };
    } catch (error) {
      throw new StorageError(
        "WRITE_FAILED",
        "Failed to upload file to storage.",
      );
    }
  }

  createDownloadUrl(
    path: string,
    options: { extension: string; originalFileName: string },
  ): string {
    return cloudinary.utils.private_download_url(path, options.extension, {
      resource_type: "raw",
      type: "authenticated",
      expires_at: Math.floor(Date.now() / 1000) + DOWNLOAD_URL_TTL_SECONDS,
      attachment: true,
    });
  }

  async deleteFile(path: string): Promise<void> {
    try {
      await withTimeout(
        cloudinary.uploader.destroy(path, {
          resource_type: "raw",
          type: "authenticated",
          invalidate: true,
        }),
        STORAGE_TIMEOUT_MS,
        "Resume storage delete",
      );
    } catch (error) {
      throw new StorageError(
        "WRITE_FAILED",
        "Failed to delete file from storage.",
      );
    }
  }
}
