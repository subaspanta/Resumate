import { ApiError } from "@google/genai";
import { AppError } from "../../types/app-error.js";
import { ERROR_CODES } from "../../constants/error-codes.js";
import { HTTP_STATUS } from "../../constants/http-status.js";
import { Logger } from "../../config/logger.js";

// Map Gemini failures to safe client errors while logging raw SDK details.
export function classifyGeminiError(
  err: unknown,
  what: string,
  logger: Logger,
): AppError {
  if (err instanceof ApiError && err.status === 429) {
    logger.error("Gemini call rate-limited", { what, error: err });
    return new AppError(
      HTTP_STATUS.SERVICE_UNAVAILABLE,
      ERROR_CODES.GEMINI_RATE_LIMITED,
      "AI service is busy right now. Please try again in a moment.",
    );
  }
  logger.error("Gemini call failed", { what, error: err });
  return new AppError(
    HTTP_STATUS.SERVICE_UNAVAILABLE,
    ERROR_CODES.GEMINI_API_ERROR,
    `Unable to ${what} at this time. Please try again later.`,
  );
}
