// src/api/api-error.ts
import { AxiosError } from "axios";

// Must match ERROR_CODES in backend/src/constants/error-codes.ts.
// Omitting a code here removes type safety for branching, but runtime still works.
export type ApiErrorCode =
  | "INVALID_CREDENTIALS"
  | "EMAIL_ALREADY_EXISTS"
  | "UNAUTHORIZED"
  | "REFRESH_TOKEN_INVALID"
  | "FORBIDDEN"
  | "RESOURCE_NOT_FOUND"
  | "FILE_TOO_LARGE"
  | "UNSUPPORTED_FILE_TYPE"
  | "PARSING_FAILED"
  | "VALIDATION_FAILED"
  | "MALFORMED_JSON"
  | "INTERNAL_SERVER_ERROR"
  | "STORAGE_FAILED"
  | "GEMINI_API_ERROR"
  | "GEMINI_RATE_LIMITED"
  | "AI_VALIDATION_FAILED"
  | "AI_GROUNDING_FAILED"
  | "ROADMAP_ALREADY_EXISTS"
  | "RATE_LIMIT_EXCEEDED"
  | "OAUTH_STATE_INVALID"
  | "OAUTH_EXCHANGE_FAILED"
  | "OAUTH_EMAIL_NOT_VERIFIED"
  | "OAUTH_ACCOUNT_CONFLICT";

interface ApiErrorPayload {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details: unknown[];
  };
}

export class ApiError extends Error {
  readonly status: number;
  readonly code?: ApiErrorCode;
  readonly details?: unknown[];

  constructor(
    message: string,
    status: number,
    code?: ApiErrorCode,
    details?: unknown[],
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function normalizeAxiosError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const status = error.response?.status ?? 0;
    const payload = error.response?.data as ApiErrorPayload | undefined;

    if (status === 0) {
      return new ApiError("Network error — please check your connection.", 0);
    }

    return new ApiError(
      payload?.error?.message ??
        error.message ??
        "An unexpected error occurred.",
      status,
      payload?.error?.code,
      payload?.error?.details,
    );
  }

  return new ApiError(
    error instanceof Error ? error.message : "An unexpected error occurred.",
    0,
  );
}
