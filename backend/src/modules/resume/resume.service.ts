import { fileTypeFromBuffer } from "file-type";
import type { Prisma } from "../../generated/client/index.js";
import { ERROR_CODES } from "../../constants/error-codes.js";
import { HTTP_STATUS } from "../../constants/http-status.js";
import { AppError } from "../../types/app-error.js";
import { ResumeRepository } from "./resume.repository.js";
import { ParsingModule, StorageModule } from "./resume.types.js";
import { normalizeStructuredResume } from "../parsing/normalize-resume.js";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
export class ResumeService {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly storageModule: StorageModule,
    private readonly parsingModule: ParsingModule,
  ) {}

  async listResumesByUserId(
    userId: string,
    options: { limit: number; cursor?: string },
  ) {
    return this.resumeRepository.findManyByUserId(userId, options);
  }

  private async detectAndValidateFileType(buffer: Buffer): Promise<string> {
    const detected = await fileTypeFromBuffer(buffer);

    if (!detected || !ALLOWED_MIME_TYPES.has(detected.mime)) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.UNSUPPORTED_FILE_TYPE,
        "Only PDF and DOCX files are supported",
      );
    }
    return detected.mime;
  }

  async uploadResume(
    userId: string,
    file: Express.Multer.File,
    inputData: { title?: string },
  ) {
    if (!file) {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.VALIDATION_FAILED,
        "No file was uploaded",
      );
    }

    const verifiedMimeType = await this.detectAndValidateFileType(
      file.buffer,
    );

    const [storageOutcome, parsingOutcome] = await Promise.allSettled([
      this.storageModule.saveFile(file.buffer),
      this.parsingModule.parseResume(file.buffer, verifiedMimeType),
    ]);

    // Storage failed — nothing was written, nothing to clean up
    if (storageOutcome.status === "rejected") {
      throw new AppError(
        503,
        ERROR_CODES.STORAGE_FAILED,
        "Unable to store file at this time. Please try again later.",
      );
    }

    // Storage succeeded, Parsing failed — file is orphaned, clean it up
    if (parsingOutcome.status === "rejected") {
      try {
        await this.storageModule.deleteFile(storageOutcome.value.path);
      } catch (cleanupError) {
        console.error(
          "Failed to clean up orphaned file after parsing failure",
          {
            path: storageOutcome.value.path,
            cleanupError,
          },
        );
      }

      throw new AppError(
        422,
        ERROR_CODES.PARSING_FAILED,
        "Unable to process this resume. Please try again.",
      );
    }

    // Both successful — persist the resume record in the database
    const { url: fileUrl, path: filePath } = storageOutcome.value;
    const { rawText, structuredResume } = parsingOutcome.value;

    return this.resumeRepository.create({
      title: inputData.title || file.originalname,
      originalFileName: file.originalname,
      mimeType: verifiedMimeType,
      fileSize: file.size,
      fileUrl,
      filePath,
      rawText,
      structuredResume: structuredResume as Prisma.InputJsonValue,
      user: { connect: { id: userId } },
    });
  }

  async getResumeById(userId: string, id: string) {
    const resume = await this.resumeRepository.findByIdAndUserId(userId, id);
    if (!resume) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Resume not found",
      );
    }
    // structuredResume is a JSONB column Prisma neither validates nor
    // migrates, so a row written by an older build can still hold a
    // pre-migration shape. Every other read path already normalizes; without
    // this one the workspace sidebar reads .customSections off whatever
    // happens to be stored and throws.
    return {
      ...resume,
      structuredResume: normalizeStructuredResume(resume.structuredResume, {
        resumeId: id,
        source: "getResumeById",
      }) as unknown as Prisma.JsonValue,
    };
  }

  // Deletes the resume row (cascades to its analyses/suggestions via the
  // schema's onDelete: Cascade) and best-effort cleans up the Cloudinary
  // file. Resumes uploaded before filePath was tracked have no way to
  // locate their Cloudinary object, so cleanup is skipped for those (logged,
  // not thrown) rather than failing the whole delete over storage cleanup —
  // matches the same best-effort pattern already used on the upload path.
  async deleteResume(userId: string, id: string): Promise<void> {
    const resume = await this.resumeRepository.findByIdAndUserId(userId, id);
    if (!resume) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Resume not found",
      );
    }

    if (resume.filePath) {
      try {
        await this.storageModule.deleteFile(resume.filePath);
      } catch (cleanupError) {
        console.error("Failed to delete resume file from storage", {
          resumeId: id,
          filePath: resume.filePath,
          cleanupError,
        });
      }
    }

    await this.resumeRepository.deleteById(id);
  }
}
