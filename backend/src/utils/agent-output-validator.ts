import { z } from "zod";
import { AppError } from "../types/app-error.js";
import { ERROR_CODES } from "../constants/error-codes.js";
import { HTTP_STATUS } from "../constants/http-status.js";

// Re-validates AI output against its Zod schema and checks for required content.
export function validateAgentOutput<T>(
  schema: z.ZodType<T>,
  raw: unknown,
  options: {
    // Array fields that must contain at least one element — empty arrays here
    // usually mean the model returned a hollow, hallucinated shell.
    requiredArrayFields?: string[];
  } = {},
): T {
  if (raw === null || raw === undefined) {
    throwValidationFailed("AI returned an empty response");
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    throwValidationFailed(
      "AI output did not match the expected shape",
      parsed.error.flatten(),
    );
  }

  const value = parsed.data as Record<string, unknown>;
  for (const field of options.requiredArrayFields ?? []) {
    const arr = value[field];
    if (Array.isArray(arr) && arr.length === 0) {
      throwValidationFailed(
        `AI output is missing expected content in "${field}"`,
      );
    }
  }

  return parsed.data;
}

function throwValidationFailed(message: string, details?: unknown): never {
  throw new AppError(
    HTTP_STATUS.UNPROCESSABLE_ENTITY,
    ERROR_CODES.AI_VALIDATION_FAILED,
    message,
    details,
  );
}
