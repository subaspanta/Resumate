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
  MALFORMED_JSON: "MALFORMED_JSON",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  STORAGE_FAILED: "STORAGE_FAILED",
  GEMINI_API_ERROR: "GEMINI_API_ERROR",
  GEMINI_RATE_LIMITED: "GEMINI_RATE_LIMITED",
  AI_VALIDATION_FAILED: "AI_VALIDATION_FAILED",
  // Raised when AI output contradicts the inputs it was derived from — a
  // skill outside the role's requirements, a quote absent from the resume,
  // a roadmap task pinned to another analysis's gap. Distinct from
  // AI_VALIDATION_FAILED, which means the output didn't match its schema.
  AI_GROUNDING_FAILED: "AI_GROUNDING_FAILED",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
