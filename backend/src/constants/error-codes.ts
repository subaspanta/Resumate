// Single source of truth for API error codes.
//
// These are the *wire* codes returned in the error envelope
// (`{ success: false, error: { code, message, details } }`). They must stay
// in lockstep with the contract in `docs/architecture/api-design.md` and the
// frontend `ApiErrorCode` union in `frontend/src/api/api-error.ts`.
// See ADR-0004 (API Client & Error Envelope Contract).
export const ERROR_CODES = {
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
  UNAUTHORIZED: "UNAUTHORIZED",
  REFRESH_TOKEN_INVALID: "REFRESH_TOKEN_INVALID",
  FORBIDDEN: "FORBIDDEN",
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  UNSUPPORTED_FILE_TYPE: "UNSUPPORTED_FILE_TYPE",
  PARSING_FAILED: "PARSING_FAILED",
  VALIDATION_FAILED: "VALIDATION_FAILED",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  STORAGE_FAILED: "STORAGE_FAILED",
  RESUME_NOT_FOUND: "RESUME_NOT_FOUND",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
