// src/api/api-error.ts
import { AxiosError } from "axios";

// Matches the exact set of codes in the API spec's Error Codes table.
// A union (not `string`) means a typo or a new backend code that isn't
// added here fails to compile at the call site, instead of silently
// falling through as an unhandled string.
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
  | "INTERNAL_SERVER_ERROR";

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
