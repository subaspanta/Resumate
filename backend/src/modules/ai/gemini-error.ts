import { ApiError } from "@google/genai";
import { AppError } from "../../types/app-error.js";
import { ERROR_CODES } from "../../constants/error-codes.js";
import { HTTP_STATUS } from "../../constants/http-status.js";
import { logger } from "../../config/logger.js";

// Classifies a Gemini SDK failure into an honest, user-facing AppError.
// `what` is a short label ("structure resume", "analyze this resume",
// "generate your roadmap") so the fallback message stays specific to the call
// site rather than collapsing to one generic string.
//
// The AppError message is deliberately generic — the raw SDK error is logged
// here instead, since it's the only place all three call sites funnel
// through and none of them carry a userId/resumeId/analysisId to log with.
export function classifyGeminiError(err: unknown, what: string): AppError {
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
