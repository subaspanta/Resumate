import { GoogleGenAI } from "@google/genai";
import {
  AIStructuringModule,
  StructuredResume,
} from "../parsing/parsing.types.js";
import {
  RESUME_SCHEMA,
  RESUME_STRUCTURING_PROMPT,
  structuredResumeSchema,
} from "./ai.types.js";
import { AppError } from "../../types/app-error.js";
import { ERROR_CODES } from "../../constants/error-codes.js";
import { HTTP_STATUS } from "../../constants/http-status.js";
import { env } from "../../config/env.js";
import { classifyGeminiError } from "./gemini-error.js";
import { GEMINI_CALL_TIMEOUT_MS } from "./gemini-timeout.js";
import { validateAgentOutput } from "../../utils/agent-output-validator.js";

export class AIStructuringService implements AIStructuringModule {
  constructor(
    private readonly ai: GoogleGenAI = new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY,
    }),
  ) {}

  async structureResume(rawText: string): Promise<StructuredResume> {
    const responseText = await this.callGemini(rawText);
    return this.parseResponse(responseText);
  }

  private async callGemini(rawText: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: `${RESUME_STRUCTURING_PROMPT}\n\nResume text:\n${rawText}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: RESUME_SCHEMA,
          httpOptions: { timeout: GEMINI_CALL_TIMEOUT_MS },
        },
      });
      return response.text ?? "";
    } catch (err) {
      throw classifyGeminiError(err, "structure resume");
    }
  }
  private parseResponse(responseText: string): StructuredResume {
    let parsed: unknown;
    try {
      parsed = JSON.parse(responseText);
    } catch (err) {
      throw new AppError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        ERROR_CODES.GEMINI_API_ERROR,
        "AI returned an unexpected response format",
      );
    }

    return validateAgentOutput(structuredResumeSchema, parsed);
  }
}
