import { v2 as cloudinary } from "cloudinary";
import { env } from "../../config/env.js";
import { StorageError, StorageModule } from "./storage.types.js";
import { withTimeout } from "../../utils/with-timeout.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// Uploads are capped at 2MB (see middleware/upload.ts), so a healthy
// connection finishes in low single-digit seconds — this only exists to
// catch a stalled connection, not to budget for a large transfer. A timeout
// firing here stops us *waiting*, not the upload itself: the Cloudinary
// request may still complete server-side after we've given up on it,
// orphaning a file we have no handle to. Accepted gap for a side project's
// storage bill, same as the pre-existing orphan risk on a parse failure.
const STORAGE_TIMEOUT_MS = 15_000;

export class CloudinaryStorageModule implements StorageModule {
  async saveFile(buffer: Buffer): Promise<{ path: string; url: string }> {
    try {
      const result = await withTimeout(
        new Promise<{
          public_id: string;
          secure_url: string;
        }>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "raw", // PDFs/DOCX aren't images — must use "raw"
              folder: "resumes",
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

      return { path: result.public_id, url: result.secure_url };
    } catch (error) {
      throw new StorageError(
        "WRITE_FAILED",
        "Failed to upload file to storage.",
      );
    }
  }

  async deleteFile(path: string): Promise<void> {
    try {
      await withTimeout(
        cloudinary.uploader.destroy(path, { resource_type: "raw" }),
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
