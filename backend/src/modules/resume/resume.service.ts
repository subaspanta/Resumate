import { fileTypeFromBuffer } from "file-type";
import type { Prisma } from "../../generated/client/index.js";
import { ERROR_CODES } from "../../constants/error-codes.js";
import { HTTP_STATUS } from "../../constants/http-status.js";
import { AppError } from "../../types/app-error.js";
import { ResumeRepository } from "./resume.repository.js";
import { ParsingModule, StorageModule } from "./resume.types.js";
import { normalizeStructuredResume } from "../parsing/normalize-resume.js";
import { logger } from "../../config/logger.js";

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

  // Shared by uploadResume and replaceResume: verify the type, store and
  // parse concurrently, and on a parse failure clean up the now-orphaned
  // storage write before throwing. Both callers persist the result
  // differently (create vs. update), which is why that step stays outside
  // this method rather than folding it in too.
  private async saveAndParseFile(file: Express.Multer.File): Promise<{
    verifiedMimeType: string;
    fileUrl: string;
    filePath: string;
    rawText: string;
    structuredResume: Record<string, unknown>;
  }> {
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
        HTTP_STATUS.SERVICE_UNAVAILABLE,
        ERROR_CODES.STORAGE_FAILED,
        "Unable to store file at this time. Please try again later.",
      );
    }

    // Storage succeeded, Parsing failed — file is orphaned, clean it up
    if (parsingOutcome.status === "rejected") {
      try {
        await this.storageModule.deleteFile(storageOutcome.value.path);
      } catch (cleanupError) {
        logger.error(
          "Failed to clean up orphaned file after parsing failure",
          {
            path: storageOutcome.value.path,
            cleanupError,
          },
        );
      }

      throw new AppError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        ERROR_CODES.PARSING_FAILED,
        "Unable to process this resume. Please try again.",
      );
    }

    const { url: fileUrl, path: filePath } = storageOutcome.value;
    const { rawText, structuredResume } = parsingOutcome.value;

    return { verifiedMimeType, fileUrl, filePath, rawText, structuredResume };
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

    const { verifiedMimeType, fileUrl, filePath, rawText, structuredResume } =
      await this.saveAndParseFile(file);

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

  // Updates the same Resume row in place rather than delete+recreate, so
  // that CareerAnalysis rows already pointing at this resumeId keep working
  // — their resumeSnapshot is a frozen JSONB copy taken at analysis time
  // (see createAnalysis in career-analysis.service.ts), never a live read of
  // this row, so changing the row's content cannot retroactively change a
  // past analysis. Deleting and recreating would instead cascade-delete
  // every CareerAnalysis on the old row (schema's onDelete: Cascade),
  // destroying history a replace is explicitly meant to preserve.
  async replaceResume(
    userId: string,
    id: string,
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

    const existing = await this.resumeRepository.findByIdAndUserId(
      userId,
      id,
    );
    if (!existing) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Resume not found",
      );
    }

    const { verifiedMimeType, fileUrl, filePath, rawText, structuredResume } =
      await this.saveAndParseFile(file);

    const updatedCount = await this.resumeRepository.updateByIdAndUserId(
      id,
      userId,
      {
        title: inputData.title || file.originalname,
        originalFileName: file.originalname,
        mimeType: verifiedMimeType,
        fileSize: file.size,
        fileUrl,
        filePath,
        rawText,
        structuredResume: structuredResume as Prisma.InputJsonValue,
      },
    );

    if (updatedCount === 0) {
      // Row vanished between the read above and this write (e.g. deleted
      // from another tab). The new file already landed in storage under a
      // fresh path with nothing pointing at it — clean it up rather than
      // leaving an orphan, same best-effort discipline saveAndParseFile
      // already applies to its own parse-failure branch.
      try {
        await this.storageModule.deleteFile(filePath);
      } catch (cleanupError) {
        logger.error("Failed to clean up orphaned file after lost race", {
          resumeId: id,
          filePath,
          cleanupError,
        });
      }
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Resume not found",
      );
    }

    // Old file is deleted only after the new row write is confirmed, and
    // only best-effort — a resume uploaded before filePath was tracked has
    // no old file to clean up, matching deleteResume's same nullable check.
    if (existing.filePath) {
      try {
        await this.storageModule.deleteFile(existing.filePath);
      } catch (cleanupError) {
        logger.error("Failed to delete previous resume file from storage", {
          resumeId: id,
          filePath: existing.filePath,
          cleanupError,
        });
      }
    }

    return this.getResumeById(userId, id);
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

  // Deletes the resume row (cascades to its career analyses via the
  // schema's onDelete: Cascade) first, then best-effort cleans up the
  // Cloudinary file — matches AuthService.deleteAccount's ordering. Deleting
  // the DB row first means a failed or short-circuited delete never leaves
  // storage cleaned up under a row that's still there; the reverse order
  // could destroy the file and then 404 on the DB delete, leaving the row
  // pointing at nothing. Resumes uploaded before filePath was tracked have
  // no way to locate their Cloudinary object, so cleanup is skipped for
  // those (logged, not thrown) rather than failing the whole delete over
  // storage cleanup.
  async deleteResume(userId: string, id: string): Promise<void> {
    const resume = await this.resumeRepository.findByIdAndUserId(userId, id);
    if (!resume) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Resume not found",
      );
    }

    const deletedCount = await this.resumeRepository.deleteByIdAndUserId(
      id,
      userId,
    );
    if (deletedCount === 0) {
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
        logger.error("Failed to delete resume file from storage", {
          resumeId: id,
          filePath: resume.filePath,
          cleanupError,
        });
      }
    }
  }
}
