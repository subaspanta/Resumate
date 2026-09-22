import { describe, expect, it, vi } from "vitest";

// CloudinaryStorageModule calls the cloudinary SDK directly (not through a
// constructor-injected fake), so module-mocking the SDK is the only way to
// simulate a stalled connection — same deliberate, scoped exception as
// parsing.service.test.ts.
vi.mock("cloudinary", () => ({
  v2: {
    config: vi.fn(),
    utils: {
      private_download_url: vi.fn(),
    },
    uploader: {
      upload_stream: vi.fn(),
      destroy: vi.fn(),
    },
  },
}));

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorageModule } from "../../../src/modules/storage/cloudinary-storage-module.js";
import { StorageError } from "../../../src/modules/storage/storage.types.js";

describe("CloudinaryStorageModule — timeout", () => {
  it("saveFile resolves normally when the upload finishes before the deadline", async () => {
    vi.mocked(cloudinary.uploader.upload_stream).mockImplementation(
      (_options, callback) => {
        // Fire the completion callback on the next tick, well inside the
        // timeout window — mirrors a healthy upload_stream response.
        queueMicrotask(() =>
          callback(undefined, {
            public_id: "resumes/abc123",
          } as never),
        );
        return { end: vi.fn() } as never;
      },
    );

    const module = new CloudinaryStorageModule();
    const result = await module.saveFile(Buffer.from("file-bytes"), {
      extension: "pdf",
      originalFileName: "resume.pdf",
    });

    expect(result).toEqual({ path: "resumes/abc123" });
    expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
      expect.objectContaining({
        resource_type: "raw",
        type: "authenticated",
        filename_override: "resume.pdf",
      }),
      expect.any(Function),
    );
  });

  it("saveFile rejects with StorageError when the upload stalls past the timeout, instead of hanging forever", async () => {
    vi.mocked(cloudinary.uploader.upload_stream).mockImplementation(
      () => ({ end: vi.fn() }) as never, // callback never invoked — simulates a hung connection
    );

    const module = new CloudinaryStorageModule();

    await expect(
      module.saveFile(Buffer.from("file-bytes"), {
        extension: "pdf",
        originalFileName: "resume.pdf",
      }),
    ).rejects.toThrow(
      StorageError,
    );
  }, 20_000);

  it("creates a short-lived URL for an authenticated raw asset", () => {
    vi.mocked(cloudinary.utils.private_download_url).mockReturnValue(
      "https://api.cloudinary.com/signed-download",
    );
    const module = new CloudinaryStorageModule();

    expect(
      module.createDownloadUrl("resumes/abc.pdf", {
        extension: "pdf",
        originalFileName: "resume.pdf",
      }),
    ).toBe("https://api.cloudinary.com/signed-download");
    expect(cloudinary.utils.private_download_url).toHaveBeenCalledWith(
      "resumes/abc.pdf",
      "pdf",
      expect.objectContaining({
        resource_type: "raw",
        type: "authenticated",
        attachment: true,
      }),
    );
  });

  it("deleteFile resolves normally when the delete finishes before the deadline", async () => {
    vi.mocked(cloudinary.uploader.destroy).mockResolvedValue({
      result: "ok",
    } as never);

    const module = new CloudinaryStorageModule();
    await expect(module.deleteFile("resumes/abc123")).resolves.toBeUndefined();
  });

  it("deleteFile rejects with StorageError when the delete stalls past the timeout, instead of hanging forever", async () => {
    vi.mocked(cloudinary.uploader.destroy).mockReturnValue(
      new Promise(() => {}), // never settles — simulates a hung connection
    );

    const module = new CloudinaryStorageModule();

    await expect(module.deleteFile("resumes/abc123")).rejects.toThrow(
      StorageError,
    );
  }, 20_000);
});
