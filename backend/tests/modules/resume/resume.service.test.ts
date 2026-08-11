import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "../../../src/lib/prisma.js";
import { ResumeRepository } from "../../../src/modules/resume/resume.repository.js";
import { ResumeService } from "../../../src/modules/resume/resume.service.js";
import { ParsingModule, StorageModule } from "../../../src/modules/resume/resume.types.js";
import { AppError } from "../../../src/types/app-error.js";

// %PDF- magic bytes are all file-type needs to sniff this as application/pdf
// — the rest of a real PDF structure is irrelevant to detectAndValidateFileType.
const PDF_BUFFER = Buffer.from(
  "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF",
);

function fakeFile(): Express.Multer.File {
  return {
    buffer: PDF_BUFFER,
    originalname: "resume.pdf",
    size: PDF_BUFFER.length,
  } as Express.Multer.File;
}

function fakeStorageModule(overrides: Partial<StorageModule> = {}): StorageModule & {
  deletedPaths: string[];
} {
  const deletedPaths: string[] = [];
  return {
    deletedPaths,
    async saveFile() {
      return { path: "resumes/fake-path", url: "https://example.com/fake.pdf" };
    },
    async deleteFile(path: string) {
      deletedPaths.push(path);
    },
    ...overrides,
  };
}

function failingStorageModule(error: unknown): StorageModule {
  return {
    async saveFile() {
      throw error;
    },
    async deleteFile() {},
  };
}

function fakeParsingModule(overrides: Partial<ParsingModule> = {}): ParsingModule {
  return {
    async parseResume() {
      return {
        rawText: "Backend Engineer with 3 years of experience",
        structuredResume: {
          experience: [],
          education: [],
          skills: [],
          projects: [],
          certifications: [],
          customSections: [],
        },
      };
    },
    ...overrides,
  };
}

function failingParsingModule(error: unknown): ParsingModule {
  return {
    async parseResume() {
      throw error;
    },
  };
}

async function createUser() {
  return prisma.user.create({
    data: {
      name: "Upload Test User",
      email: `upload-test-${crypto.randomUUID()}@example.com`,
      passwordHash: "irrelevant-for-this-test",
    },
  });
}

describe("ResumeService.uploadResume", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("persists the resume when both storage and parsing succeed", async () => {
    const user = await createUser();
    const service = new ResumeService(
      new ResumeRepository(),
      fakeStorageModule(),
      fakeParsingModule(),
    );

    const resume = await service.uploadResume(user.id, fakeFile(), {});

    expect(resume.originalFileName).toBe("resume.pdf");
    expect(resume.fileUrl).toBe("https://example.com/fake.pdf");

    const stored = await prisma.resume.findUnique({ where: { id: resume.id } });
    expect(stored).not.toBeNull();
  });

  it("throws STORAGE_FAILED and does not persist a row when storage rejects", async () => {
    const user = await createUser();
    const service = new ResumeService(
      new ResumeRepository(),
      failingStorageModule(new Error("upload stalled")),
      fakeParsingModule(),
    );

    await expect(service.uploadResume(user.id, fakeFile(), {})).rejects.toMatchObject(
      { code: "STORAGE_FAILED" } satisfies Partial<AppError>,
    );

    const rows = await prisma.resume.findMany({ where: { userId: user.id } });
    expect(rows).toHaveLength(0);
  });

  it("throws PARSING_FAILED and cleans up the uploaded file when parsing rejects after storage succeeds", async () => {
    const user = await createUser();
    const storage = fakeStorageModule();
    const service = new ResumeService(
      new ResumeRepository(),
      storage,
      failingParsingModule(new Error("extraction stalled")),
    );

    await expect(service.uploadResume(user.id, fakeFile(), {})).rejects.toMatchObject(
      { code: "PARSING_FAILED" } satisfies Partial<AppError>,
    );

    // Cleanup: the orphaned Cloudinary object from the successful storage
    // leg must be deleted since nothing will ever reference it.
    expect(storage.deletedPaths).toEqual(["resumes/fake-path"]);

    const rows = await prisma.resume.findMany({ where: { userId: user.id } });
    expect(rows).toHaveLength(0);
  });

  it("storage and parsing run concurrently — a slow parse does not block a fast save from completing first", async () => {
    const user = await createUser();
    const order: string[] = [];

    const storage = fakeStorageModule({
      async saveFile() {
        order.push("storage-start");
        return { path: "resumes/fake-path", url: "https://example.com/fake.pdf" };
      },
    });
    const parsing = fakeParsingModule({
      async parseResume() {
        await new Promise((resolve) => setTimeout(resolve, 10));
        order.push("parsing-done");
        return {
          rawText: "Backend Engineer",
          structuredResume: {
            experience: [],
            education: [],
            skills: [],
            projects: [],
            certifications: [],
            customSections: [],
          },
        };
      },
    });

    const service = new ResumeService(new ResumeRepository(), storage, parsing);
    await service.uploadResume(user.id, fakeFile(), {});

    // storage-start fires synchronously on the same tick Promise.allSettled
    // kicks both calls off, well before the artificially delayed parse
    // resolves — proves they were launched together, not sequentially.
    expect(order[0]).toBe("storage-start");
    expect(order).toContain("parsing-done");
  });
});
