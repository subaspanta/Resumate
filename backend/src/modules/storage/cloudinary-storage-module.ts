import { v2 as cloudinary } from "cloudinary";
import { env } from "../../config/env.js";
import { StorageError, StorageModule } from "./storage.types.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export class CloudinaryStorageModule implements StorageModule {
  async saveFile(buffer: Buffer): Promise<{ path: string; url: string }> {
    try {
      const result = await new Promise<{
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
      });

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
      await cloudinary.uploader.destroy(path, { resource_type: "raw" });
    } catch (error) {
      throw new StorageError(
        "WRITE_FAILED",
        "Failed to delete file from storage.",
      );
    }
  }
}
