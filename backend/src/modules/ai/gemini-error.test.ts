import { describe, expect, it } from "vitest";
import { ApiError } from "@google/genai";
import { classifyGeminiError } from "./gemini-error.js";
import { ERROR_CODES } from "../../constants/error-codes.js";
import { HTTP_STATUS } from "../../constants/http-status.js";

describe("classifyGeminiError", () => {
  it("classifies a 429 ApiError as rate-limited", () => {
    const err = new ApiError({ status: 429, message: "quota exceeded" });
    const result = classifyGeminiError(err, "do the thing");
    expect(result.statusCode).toBe(HTTP_STATUS.SERVICE_UNAVAILABLE);
    expect(result.code).toBe(ERROR_CODES.GEMINI_RATE_LIMITED);
  });

  it("classifies a non-429 ApiError as a generic outage", () => {
    const err = new ApiError({ status: 500, message: "internal error" });
    const result = classifyGeminiError(err, "do the thing");
    expect(result.statusCode).toBe(HTTP_STATUS.SERVICE_UNAVAILABLE);
    expect(result.code).toBe(ERROR_CODES.GEMINI_API_ERROR);
  });

  it("classifies a generic Error as a generic outage", () => {
    const err = new Error("network timeout");
    const result = classifyGeminiError(err, "do the thing");
    expect(result.statusCode).toBe(HTTP_STATUS.SERVICE_UNAVAILABLE);
    expect(result.code).toBe(ERROR_CODES.GEMINI_API_ERROR);
    expect(result.message).toContain("do the thing");
  });
});
