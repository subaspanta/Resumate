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

describe("ResumeService.replaceResume", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  async function uploadFixtureResume(overrides: {
    storage?: StorageModule;
    parsing?: ParsingModule;
  } = {}) {
    const user = await createUser();
    const service = new ResumeService(
      new ResumeRepository(),
      overrides.storage ?? fakeStorageModule(),
      overrides.parsing ?? fakeParsingModule(),
    );
    const resume = await service.uploadResume(user.id, fakeFile(), {});
    return { user, service, resume };
  }

  it("updates the row in place, keeping the same id", async () => {
    const { user, resume } = await uploadFixtureResume();
    const service = new ResumeService(
      new ResumeRepository(),
      fakeStorageModule(),
      fakeParsingModule({
        async parseResume() {
          return {
            rawText: "Full Stack Engineer with 5 years of experience",
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
      }),
    );

    const newFile = { ...fakeFile(), originalname: "new-resume.pdf" };
    const replaced = await service.replaceResume(user.id, resume.id, newFile, {});

    expect(replaced.id).toBe(resume.id);
    expect(replaced.originalFileName).toBe("new-resume.pdf");

    const rows = await prisma.resume.findMany({ where: { userId: user.id } });
    expect(rows).toHaveLength(1);
  });

  it("does not retroactively change a career analysis already frozen on the old content", async () => {
    const { user, resume } = await uploadFixtureResume();

    // Freeze a snapshot the same way createAnalysis does, without pulling in
    // the whole career-analysis module: a minimal CareerAnalysis row whose
    // resumeSnapshot captures the resume's rawText-derived content at this
    // point in time.
    const role = await prisma.role.findFirst();
    if (!role) throw new Error("Expected seed data — run npm run db:seed against the test database");

    const analysis = await prisma.careerAnalysis.create({
      data: {
        userId: user.id,
        resumeId: resume.id,
        roleId: role.id,
        status: "complete",
        resumeSnapshot: { experience: [], education: [], skills: [], projects: [], certifications: [], customSections: [], _marker: "pre-replace" },
        roleSnapshot: { skills: [] },
      },
    });

    const service = new ResumeService(
      new ResumeRepository(),
      fakeStorageModule(),
      fakeParsingModule({
        async parseResume() {
          return {
            rawText: "Completely different content",
            structuredResume: {
              experience: [], education: [], skills: [], projects: [], certifications: [], customSections: [], _marker: "post-replace",
            } as never,
          };
        },
      }),
    );

    await service.replaceResume(user.id, resume.id, fakeFile(), {});

    const frozenAnalysis = await prisma.careerAnalysis.findUniqueOrThrow({
      where: { id: analysis.id },
    });
    expect(
      (frozenAnalysis.resumeSnapshot as Record<string, unknown>)._marker,
    ).toBe("pre-replace");

    // And the live resume row genuinely did change — proves this isn't
    // passing merely because the replace itself was a no-op.
    const liveResume = await prisma.resume.findUniqueOrThrow({
      where: { id: resume.id },
    });
    expect(
      (liveResume.structuredResume as Record<string, unknown>)._marker,
    ).toBe("post-replace");
  });

  it("throws RESOURCE_NOT_FOUND for a resume owned by someone else", async () => {
    const { resume } = await uploadFixtureResume();
    const otherUser = await createUser();
    const service = new ResumeService(
      new ResumeRepository(),
      fakeStorageModule(),
      fakeParsingModule(),
    );

    await expect(
      service.replaceResume(otherUser.id, resume.id, fakeFile(), {}),
    ).rejects.toMatchObject({ code: "RESOURCE_NOT_FOUND" } satisfies Partial<AppError>);
  });

  it("throws PARSING_FAILED and cleans up the new file when parsing rejects, leaving the old row untouched", async () => {
    const { user, resume } = await uploadFixtureResume();
    const storage = fakeStorageModule();
    const service = new ResumeService(
      new ResumeRepository(),
      storage,
      failingParsingModule(new Error("extraction stalled")),
    );

    await expect(
      service.replaceResume(user.id, resume.id, fakeFile(), {}),
    ).rejects.toMatchObject({ code: "PARSING_FAILED" } satisfies Partial<AppError>);

    expect(storage.deletedPaths).toEqual(["resumes/fake-path"]);

    const stillThere = await prisma.resume.findUniqueOrThrow({
      where: { id: resume.id },
    });
    expect(stillThere.originalFileName).toBe("resume.pdf");
  });

  it("deletes the previous file from storage only after the new row write succeeds", async () => {
    const { user, resume } = await uploadFixtureResume();
    const storage = fakeStorageModule({
      async saveFile() {
        return { path: "resumes/second-path", url: "https://example.com/second.pdf" };
      },
    });
    const service = new ResumeService(new ResumeRepository(), storage, fakeParsingModule());

    await service.replaceResume(user.id, resume.id, fakeFile(), {});

    expect(storage.deletedPaths).toEqual(["resumes/fake-path"]);
  });
});
