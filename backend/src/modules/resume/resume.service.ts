import { fileTypeFromBuffer } from "file-type";
import type { Prisma } from "../../generated/client/index.js";
import { ERROR_CODES } from "../../constants/error-codes.js";
import { HTTP_STATUS } from "../../constants/http-status.js";
import { AppError } from "../../types/app-error.js";
import { ResumeRepository } from "./resume.repository.js";
import { ParsingModule, StorageModule } from "./resume.types.js";
import { normalizeStructuredResume } from "../parsing/normalize-resume.js";
import { Logger } from "../../config/logger.js";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const extensionForMimeType: Record<string, "pdf" | "docx"> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
};
export class ResumeService {
  constructor(
    private readonly resumeRepository: ResumeRepository,
    private readonly storageModule: StorageModule,
    private readonly parsingModule: ParsingModule,
    private readonly logger: Logger,
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

  // Shared upload/replace pipeline; clean storage if parsing fails.
  private async saveAndParseFile(file: Express.Multer.File): Promise<{
    verifiedMimeType: string;
    filePath: string;
    rawText: string;
    structuredResume: Record<string, unknown>;
  }> {
    const verifiedMimeType = await this.detectAndValidateFileType(
      file.buffer,
    );
    const extension = extensionForMimeType[verifiedMimeType]!;

    const [storageOutcome, parsingOutcome] = await Promise.allSettled([
      this.storageModule.saveFile(file.buffer, {
        extension,
        originalFileName: file.originalname,
      }),
      this.parsingModule.parseResume(file.buffer, verifiedMimeType),
    ]);

    if (storageOutcome.status === "rejected") {
      throw new AppError(
        HTTP_STATUS.SERVICE_UNAVAILABLE,
        ERROR_CODES.STORAGE_FAILED,
        "Unable to store file at this time. Please try again later.",
      );
    }

    if (parsingOutcome.status === "rejected") {
      try {
        await this.storageModule.deleteFile(storageOutcome.value.path);
      } catch (cleanupError) {
        this.logger.error(
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

    const { path: filePath } = storageOutcome.value;
    const { rawText, structuredResume } = parsingOutcome.value;

    return { verifiedMimeType, filePath, rawText, structuredResume };
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

    const { verifiedMimeType, filePath, rawText, structuredResume } =
      await this.saveAndParseFile(file);

    return this.resumeRepository.create({
      title: inputData.title || file.originalname,
      originalFileName: file.originalname,
      mimeType: verifiedMimeType,
      fileSize: file.size,
      filePath,
      rawText,
      structuredResume: structuredResume as Prisma.InputJsonValue,
      user: { connect: { id: userId } },
    });
  }

  // Keep row ID so historical analysis snapshots survive replacement.
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

    const { verifiedMimeType, filePath, rawText, structuredResume } =
      await this.saveAndParseFile(file);

    const updatedCount = await this.resumeRepository.updateByIdAndUserId(
      id,
      userId,
      {
        title: inputData.title || file.originalname,
        originalFileName: file.originalname,
        mimeType: verifiedMimeType,
        fileSize: file.size,
        filePath,
        rawText,
        structuredResume: structuredResume as Prisma.InputJsonValue,
      },
    );

    if (updatedCount === 0) {
      // Concurrent delete left new object unreferenced.
      try {
        await this.storageModule.deleteFile(filePath);
      } catch (cleanupError) {
        this.logger.error("Failed to clean up orphaned file after lost race", {
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

    // Delete old object only after database points to new object.
    if (existing.filePath) {
      try {
        await this.storageModule.deleteFile(existing.filePath);
      } catch (cleanupError) {
        this.logger.error("Failed to delete previous resume file from storage", {
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
    // JSONB may contain legacy shape.
    return {
      ...resume,
      structuredResume: normalizeStructuredResume(resume.structuredResume, {
        resumeId: id,
        source: "getResumeById",
      }, this.logger) as unknown as Prisma.JsonValue,
    };
  }

  async getDownloadUrl(userId: string, id: string): Promise<string> {
    const resume = await this.resumeRepository.findByIdAndUserId(userId, id);
    if (!resume) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Resume not found",
      );
    }
    if (!resume.filePath) {
      throw new AppError(
        HTTP_STATUS.SERVICE_UNAVAILABLE,
        ERROR_CODES.STORAGE_FAILED,
        "Resume file is unavailable. Please upload it again.",
      );
    }
    // Return signed URL only after ownership check.
    return this.storageModule.createDownloadUrl(resume.filePath, {
      extension: extensionForMimeType[resume.mimeType]!,
      originalFileName: resume.originalFileName,
    });
  }

  // Database deletion succeeds even when best-effort storage cleanup fails.
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
        this.logger.error("Failed to delete resume file from storage", {
          resumeId: id,
          filePath: resume.filePath,
          cleanupError,
        });
      }
    }
  }
}
