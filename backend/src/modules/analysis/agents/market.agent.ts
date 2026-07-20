import { GoogleGenAI, Type } from "@google/genai";
import { env } from "../../../config/env.js";
import { AppError } from "../../../types/app-error.js";
import { ERROR_CODES } from "../../../constants/error-codes.js";
import { HTTP_STATUS } from "../../../constants/http-status.js";
import {
  MarketAgent,
  MarketIntelOutput,
  marketIntelOutputSchema,
} from "../analysis.types.js";
import { NEPALI_MARKET_DATA } from "./market.data.js";
import { validateAgentOutput } from "./validator.js";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

// Gemini structured-output schema mirroring MarketIntelOutput's shape.
const MARKET_INTEL_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    company: { type: Type.STRING },
    industry: { type: Type.STRING },
    techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
    experienceLevel: { type: Type.STRING },
    salaryRangeNPR: {
      type: Type.OBJECT,
      properties: {
        min: { type: Type.NUMBER },
        max: { type: Type.NUMBER },
      },
      required: ["min", "max"],
    },
    atsKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
    commonRequirements: { type: Type.ARRAY, items: { type: Type.STRING } },
    nepaliContext: { type: Type.STRING },
  },
  required: [
    "company",
    "industry",
    "techStack",
    "experienceLevel",
    "salaryRangeNPR",
    "atsKeywords",
    "commonRequirements",
    "nepaliContext",
  ],
};

export class MarketAgentService implements MarketAgent {
  async getMarketIntel(jobTitle: string): Promise<MarketIntelOutput> {
    const responseText = await this.callGemini(jobTitle);
    return this.parseAndValidate(responseText);
  }

  private buildPrompt(jobTitle: string): string {
    return `You are a labor-market analyst for Nepal's tech industry. Using the
reference dataset below as grounding context, produce market intelligence for
the job title: "${jobTitle}".

Reference dataset (Nepali market):
${JSON.stringify(NEPALI_MARKET_DATA, null, 2)}

Return market intelligence tailored to the Nepali tech market. Base salary
ranges and requirements on the reference norms. Do not invent companies that
are not plausible for this market. "nepaliContext" should briefly explain any
Nepal-specific hiring considerations relevant to this role.`;
  }

  private async callGemini(jobTitle: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: this.buildPrompt(jobTitle),
        config: {
          responseMimeType: "application/json",
          responseSchema: MARKET_INTEL_SCHEMA,
        },
      });
      return response.text ?? "";
    } catch (err) {
      throw new AppError(
        HTTP_STATUS.SERVICE_UNAVAILABLE,
        ERROR_CODES.GEMINI_API_ERROR,
        "Unable to fetch market intelligence at this time. Please try again later.",
      );
    }
  }

  private parseAndValidate(responseText: string): MarketIntelOutput {
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

    return validateAgentOutput(marketIntelOutputSchema, parsed, {
      requiredArrayFields: ["techStack", "atsKeywords", "commonRequirements"],
    });
  }
}
