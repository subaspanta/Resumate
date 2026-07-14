import { fileTypeFromBuffer } from "file-type";
import type { Prisma } from "../../generated/client/index.js";
import { ERROR_CODES } from "../../constants/error-codes.js";
import { HTTP_STATUS } from "../../constants/http-status.js";
import { AppError } from "../../types/app-error.js";
import { ResumeRepository } from "./resume.repository.js";
import { ParsingModule, StorageModule } from "./resume.types.js";

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

  async listResumesByUserId(userId: string) {
    return this.resumeRepository.findResumesByUserId(userId);
  }

  private async verifyFileType(buffer: Buffer): Promise<string> {
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
    await this.verifyFileType(file.buffer);

    const verifiedMimeType = await this.verifyFileType(file.buffer);

    const [storageOutcome, parsingOutcome] = await Promise.allSettled([
      this.storageModule.saveFile(
        file.buffer,
        file.originalname,
        verifiedMimeType,
      ),
      this.parsingModule.parseResume(file.buffer),
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
    const { url: fileUrl } = storageOutcome.value;
    const { rawText, structuredResume } = parsingOutcome.value;

    return this.resumeRepository.createResume({
      title: inputData.title || file.originalname,
      originalFileName: file.originalname,
      mimeType: verifiedMimeType,
      fileSize: file.size,
      fileUrl,
      rawText,
      structuredResume: structuredResume as Prisma.InputJsonValue,
      user: { connect: { id: userId } },
    });
  }
  async listResumes(userId: string) {
    return this.resumeRepository.findResumesByUserId(userId);
  }
}
