import { AppError } from "../../../types/app-error.js";
import { ERROR_CODES } from "../../../constants/error-codes.js";
import { HTTP_STATUS } from "../../../constants/http-status.js";
import { logger } from "../../../config/logger.js";

// Classifies a Google OAuth failure into a user-facing AppError, mirroring
// classifyGeminiError: returns the error, call sites throw it.
//
// Every branch collapses to one generic message on purpose. The distinctions
// that matter here (expired code, network failure, unverifiable id_token) are
// all things the user can neither act on nor should learn about, and the
// detail is already in the log line below.
export function classifyGoogleAuthError(err: unknown): AppError {
  // Already ours — an AppError raised deliberately upstream (unverified email,
  // missing claim) carries a specific code and message that must survive.
  if (err instanceof AppError) return err;

  logger.error("Google OAuth exchange failed", err);

  return new AppError(
    HTTP_STATUS.UNAUTHORIZED,
    ERROR_CODES.OAUTH_EXCHANGE_FAILED,
    "Could not complete Google sign-in. Please try again.",
  );
}
