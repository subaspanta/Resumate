import { ApiError } from "@google/genai";
import { AppError } from "../../types/app-error.js";
import { ERROR_CODES } from "../../constants/error-codes.js";
import { HTTP_STATUS } from "../../constants/http-status.js";

// Classifies a Gemini SDK failure into an honest, user-facing AppError.
// `what` is a short label ("structure resume", "parse the job description",
// "rewrite this bullet") so the fallback message stays specific to the call
// site, matching what each agent already said before this helper existed.
export function classifyGeminiError(err: unknown, what: string): AppError {
  if (err instanceof ApiError && err.status === 429) {
    return new AppError(
      HTTP_STATUS.SERVICE_UNAVAILABLE,
      ERROR_CODES.GEMINI_RATE_LIMITED,
      "AI service is busy right now. Please try again in a moment.",
    );
  }
  return new AppError(
    HTTP_STATUS.SERVICE_UNAVAILABLE,
    ERROR_CODES.GEMINI_API_ERROR,
    `Unable to ${what} at this time. Please try again later.`,
  );
}
