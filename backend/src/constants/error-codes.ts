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
  // An analysis already has a roadmap. Generating a second one would either
  // orphan the first or silently discard task completions the user earned,
  // so the caller must delete the existing roadmap deliberately instead.
  ROADMAP_ALREADY_EXISTS: "ROADMAP_ALREADY_EXISTS",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  // The OAuth callback's `state` was missing or didn't match the nonce we
  // stored in the oauthState cookie — a CSRF attempt, or a stale/duplicated
  // consent tab whose cookie has already been consumed.
  OAUTH_STATE_INVALID: "OAUTH_STATE_INVALID",
  // The code-for-token exchange failed: bad or expired code, network failure,
  // or an id_token we couldn't verify against Google's keys.
  OAUTH_EXCHANGE_FAILED: "OAUTH_EXCHANGE_FAILED",
  // Google reports email_verified !== true. Auto-linking on an unverified
  // address would let anyone who can register that address at Google take over
  // an existing ResuMate account.
  OAUTH_EMAIL_NOT_VERIFIED: "OAUTH_EMAIL_NOT_VERIFIED",
  // The exchange succeeded, but no account can be safely resolved for this
  // Google identity: the address is spoken for by a different identity, or the
  // row that would have carried it is gone. Distinct from
  // OAUTH_EXCHANGE_FAILED, which means we never got a trustworthy profile at
  // all — collapsing the two would make a permanent account-state problem look
  // like a transient network blip. The user-facing message must not say which
  // condition applied, nor assume the conflicting account has a password: it
  // may be password-only, Google-only, or both, and disclosing that confirms
  // an account exists on an address the caller may have just acquired.
  OAUTH_ACCOUNT_CONFLICT: "OAUTH_ACCOUNT_CONFLICT",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
