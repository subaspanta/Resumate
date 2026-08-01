import { z } from "zod";
import { AppError } from "../../../types/app-error.js";
import { ERROR_CODES } from "../../../constants/error-codes.js";
import { HTTP_STATUS } from "../../../constants/http-status.js";

// Shared guardrail for every agent: re-validate parsed AI JSON against its Zod
// schema rather than trusting Gemini's responseSchema enforcement blindly, then
// run cheap sanity checks that catch empty/hallucinated output the schema alone
// would accept.
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
