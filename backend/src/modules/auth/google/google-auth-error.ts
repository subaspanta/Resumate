import { AppError } from "../../../types/app-error.js";
import { ERROR_CODES } from "../../../constants/error-codes.js";
import { HTTP_STATUS } from "../../../constants/http-status.js";
import { logger } from "../../../config/logger.js";

// Converts Google OAuth errors to user-facing AppErrors.
// AppErrors pass through unchanged; all others become a generic message.
export function classifyGoogleAuthError(err: unknown): AppError {
  // Preserve deliberate AppErrors (e.g., unverified email)
  if (err instanceof AppError) return err;

  logger.error("Google OAuth exchange failed", err);

  return new AppError(
    HTTP_STATUS.UNAUTHORIZED,
    ERROR_CODES.OAUTH_EXCHANGE_FAILED,
    "Could not complete Google sign-in. Please try again.",
  );
}
