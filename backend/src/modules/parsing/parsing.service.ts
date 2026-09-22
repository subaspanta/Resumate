import {
  AIStructuringModule,
  ParsingModule,
  StructuredResume,
} from "./parsing.types.js";
import { AppError } from "../../types/app-error.js";
import { ERROR_CODES } from "../../constants/error-codes.js";
import { HTTP_STATUS } from "../../constants/http-status.js";
import { runExtraction } from "./extraction-runner.js";

// Limits pathological local PDF/DOCX extraction.
const PARSING_TIMEOUT_MS = 10_000;

export class ParsingService implements ParsingModule {
  constructor(private readonly aiStructuringModule: AIStructuringModule) {}

  async parseResume(
    buffer: Buffer,
    mimeType: string,
  ): Promise<{ rawText: string; structuredResume: StructuredResume }> {
    const rawText = await this.extractText(buffer, mimeType);

    if (!rawText || rawText.trim().length < 20) {
      throw new AppError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        ERROR_CODES.PARSING_FAILED,
        "Could not extract readable text from this file",
      );
    }

    const structuredResume =
      await this.aiStructuringModule.structureResume(rawText);

    return { rawText, structuredResume };
  }

  private async extractText(buffer: Buffer, mimeType: string): Promise<string> {
    if (mimeType === "application/pdf") {
      return runExtraction(
        buffer,
        mimeType,
        PARSING_TIMEOUT_MS,
        "PDF text extraction",
      );
    } else if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return runExtraction(
        buffer,
        mimeType,
        PARSING_TIMEOUT_MS,
        "DOCX text extraction",
      );
    } else {
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.UNSUPPORTED_FILE_TYPE,
        "Unsupported file type for parsing",
      );
    }
  }
}
