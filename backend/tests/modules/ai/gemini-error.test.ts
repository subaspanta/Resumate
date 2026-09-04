import { describe, expect, it } from "vitest";
import { ApiError } from "@google/genai";
import { classifyGeminiError } from "../../../src/modules/ai/gemini-error.js";
import { ERROR_CODES } from "../../../src/constants/error-codes.js";
import { HTTP_STATUS } from "../../../src/constants/http-status.js";
import { logger } from "../../../src/config/logger.js";

describe("classifyGeminiError", () => {
  it("classifies a 429 ApiError as rate-limited", () => {
    const err = new ApiError({ status: 429, message: "quota exceeded" });
    const result = classifyGeminiError(err, "do the thing", logger);
    expect(result.statusCode).toBe(HTTP_STATUS.SERVICE_UNAVAILABLE);
    expect(result.code).toBe(ERROR_CODES.GEMINI_RATE_LIMITED);
  });

  it("classifies a non-429 ApiError as a generic outage", () => {
    const err = new ApiError({ status: 500, message: "internal error" });
    const result = classifyGeminiError(err, "do the thing", logger);
    expect(result.statusCode).toBe(HTTP_STATUS.SERVICE_UNAVAILABLE);
    expect(result.code).toBe(ERROR_CODES.GEMINI_API_ERROR);
  });

  it("classifies a generic Error as a generic outage", () => {
    const err = new Error("network timeout");
    const result = classifyGeminiError(err, "do the thing", logger);
    expect(result.statusCode).toBe(HTTP_STATUS.SERVICE_UNAVAILABLE);
    expect(result.code).toBe(ERROR_CODES.GEMINI_API_ERROR);
    expect(result.message).toContain("do the thing");
  });
});
