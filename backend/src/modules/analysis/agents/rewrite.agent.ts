import { GoogleGenAI, Type } from "@google/genai";
import { env } from "../../../config/env.js";
import { AppError } from "../../../types/app-error.js";
import { ERROR_CODES } from "../../../constants/error-codes.js";
import { HTTP_STATUS } from "../../../constants/http-status.js";
import {
  RewriteAgent,
  RewriteBulletInput,
  RewriteOutput,
  rewriteOutputSchema,
} from "../analysis.types.js";
import { validateAgentOutput } from "./validator.js";
import { validateRewrite } from "./rewrite-validator.js";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

// Gemini structured-output schema mirroring RewriteOutput's shape.
const REWRITE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["suggestions"],
};

export class RewriteAgentService implements RewriteAgent {
  async rewriteBullet(input: RewriteBulletInput): Promise<RewriteOutput> {
    const responseText = await this.callGemini(input);
    const parsed = this.parseAndValidate(responseText);

    const survivors = parsed.suggestions.filter(
      (suggestion) => validateRewrite(input.originalBullet, suggestion).valid,
    );

    if (survivors.length < 1) {
      throw new AppError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        ERROR_CODES.REWRITE_VALIDATION_FAILED,
        "No rewrite suggestion passed content validation. Please try again.",
      );
    }

    return { suggestions: survivors };
  }

  private buildPrompt(input: RewriteBulletInput): string {
    return `You are a resume-bullet editor. Rewrite the given resume bullet into 3
sharper alternatives. Keep each rewrite concise and factual.

STRICT RULES:
- Do NOT invent dates, company names, metrics, or achievements not present in the
  original bullet. Only rephrase and sharpen existing content.
- You may optionally align terminology with the provided job requirements, but only
  by rewording — never by adding facts the original does not contain.
- Keep the same scope of achievement. Do not exaggerate.
- Each rewrite should stay close in length to the original.

EXAMPLES:

Original: "Responsible for making the website faster"
Job requirements: ["performance optimization", "React"]
Good rewrites:
1. "Optimized website performance, reducing page load times"
2. "Improved front-end performance across the web application"
3. "Led performance optimization work for the company website"

Original: "Worked on the team that built the payments feature"
Job requirements: ["backend development", "payment systems"]
Good rewrites:
1. "Contributed to building the payments feature as part of the team"
2. "Helped develop the payment processing feature"
3. "Collaborated on delivering the payments feature"

Original: "Did customer support and answered tickets"
Job requirements: ["customer service", "communication"]
Good rewrites:
1. "Delivered customer support by resolving incoming tickets"
2. "Handled customer service and ticket resolution"
3. "Provided customer support, responding to and resolving tickets"

Now rewrite this bullet. Return exactly 3 suggestions.

Original: "${input.originalBullet}"
Job requirements: ${JSON.stringify(input.jobRequirements)}`;
  }

  private async callGemini(input: RewriteBulletInput): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: this.buildPrompt(input),
        config: {
          temperature: 0.3,
          maxOutputTokens: 512,
          responseMimeType: "application/json",
          responseSchema: REWRITE_SCHEMA,
        },
      });
      return response.text ?? "";
    } catch (err) {
      throw new AppError(
        HTTP_STATUS.SERVICE_UNAVAILABLE,
        ERROR_CODES.GEMINI_API_ERROR,
        "Unable to rewrite this bullet at this time. Please try again later.",
      );
    }
  }

  private parseAndValidate(responseText: string): RewriteOutput {
    let parsed: unknown;
    try {
      parsed = JSON.parse(responseText);
    } catch (err) {
      throw new AppError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        ERROR_CODES.REWRITE_VALIDATION_FAILED,
        "AI returned an unexpected response format",
      );
    }

    return validateAgentOutput(rewriteOutputSchema, parsed, {
      requiredArrayFields: ["suggestions"],
    });
  }
}
