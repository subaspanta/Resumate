import { GoogleGenAI, Type } from "@google/genai";
import { env } from "../../../config/env.js";
import { AppError } from "../../../types/app-error.js";
import { ERROR_CODES } from "../../../constants/error-codes.js";
import { HTTP_STATUS } from "../../../constants/http-status.js";
import { JobParserAgent, ParsedJob, parsedJobSchema } from "../analysis.types.js";
import { validateAgentOutput } from "./validator.js";
import { classifyGeminiError } from "../../ai/gemini-error.js";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

// Gemini structured-output schema mirroring ParsedJob's shape.
const PARSED_JOB_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    company: { type: Type.STRING, nullable: true },
    requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
    skills: { type: Type.ARRAY, items: { type: Type.STRING } },
    experienceLevel: {
      type: Type.STRING,
      enum: ["entry", "mid", "senior"],
    },
  },
  required: ["title", "company", "requirements", "skills", "experienceLevel"],
};

export class JobParserAgentService implements JobParserAgent {
  async parseJobDescription(rawText: string): Promise<ParsedJob> {
    const responseText = await this.callGemini(rawText);
    return this.parseAndValidate(responseText);
  }

  private buildPrompt(rawText: string): string {
    return `You are a job-posting parser. Extract structured fields from the raw
job description text below.

Extract:
- "title": the job title.
- "company": the hiring company name, or null if the posting does not name one.
- "requirements": a list of stated requirements (qualifications, responsibilities).
- "skills": a list of concrete skills or technologies mentioned.
- "experienceLevel": one of "entry", "mid", or "senior", inferred from the text.

Only use information present in the job description. Do not invent a company name
if none is given — return null instead.

Job description text:
${rawText}`;
  }

  private async callGemini(rawText: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: this.buildPrompt(rawText),
        config: {
          responseMimeType: "application/json",
          responseSchema: PARSED_JOB_SCHEMA,
        },
      });
      return response.text ?? "";
    } catch (err) {
      throw classifyGeminiError(err, "parse the job description");
    }
  }

  private parseAndValidate(responseText: string): ParsedJob {
    let parsed: unknown;
    try {
      parsed = JSON.parse(responseText);
    } catch (err) {
      throw new AppError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        ERROR_CODES.JOB_PARSING_FAILED,
        "AI returned an unexpected response format",
      );
    }

    // No requiredArrayFields here: unlike a rewrite (where an empty result
    // signals a hallucinated/dropped response), a short title-only input is
    // valid and legitimately yields empty requirements/skills — that's
    // correct output, not a sign something went wrong.
    return validateAgentOutput(parsedJobSchema, parsed);
  }
}
