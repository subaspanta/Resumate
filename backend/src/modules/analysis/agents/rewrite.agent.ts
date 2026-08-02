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
import { validateAgentOutput } from "../../../utils/agent-output-validator.js";
import {
  RewriteValidationResult,
  validateRewrite,
  validateSummaryRewrite,
} from "./rewrite-validator.js";
import { classifyGeminiError } from "../../ai/gemini-error.js";
import { GEMINI_CALL_TIMEOUT_MS } from "../../ai/gemini-timeout.js";

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
    return this.rewrite(
      input,
      this.buildBulletPrompt(input),
      "rewrite this bullet",
      validateRewrite,
    );
  }

  async rewriteProject(input: RewriteBulletInput): Promise<RewriteOutput> {
    return this.rewrite(
      input,
      this.buildProjectPrompt(input),
      "rewrite this project description",
      // Same bullet-shaped validator, reused as-is — a project description
      // fails the same way a bullet does (invented dates/companies, drift).
      validateRewrite,
    );
  }

  async rewriteSummary(input: RewriteBulletInput): Promise<RewriteOutput> {
    return this.rewrite(
      input,
      this.buildSummaryPrompt(input),
      "rewrite this summary",
      validateSummaryRewrite,
    );
  }

  private async rewrite(
    input: RewriteBulletInput,
    prompt: string,
    label: string,
    validate: (original: string, rewrite: string) => RewriteValidationResult,
  ): Promise<RewriteOutput> {
    const responseText = await this.callGemini(prompt, label);
    const parsed = this.parseAndValidate(responseText);

    const survivors = parsed.suggestions.filter(
      (suggestion) => validate(input.originalBullet, suggestion).valid,
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

  // Shared job-context block for every prompt builder below. Renders only
  // the fields that are actually present — a title-only submission has no
  // requirements/skills, and the prompt shouldn't imply otherwise.
  // userContext isn't rendered yet (no real source of it exists), but the
  // field already flows through RewriteBulletInput so wiring it in later is
  // a change to this one function, not every prompt or call site.
  private buildContextBlock(input: RewriteBulletInput): string {
    const { jobContext } = input;
    const lines: string[] = [`Job title: ${jobContext.title}`];
    if (jobContext.company) lines.push(`Company: ${jobContext.company}`);
    lines.push(`Experience level: ${jobContext.experienceLevel}`);
    if (jobContext.skills.length > 0) {
      lines.push(`Job skills: ${JSON.stringify(jobContext.skills)}`);
    }
    if (jobContext.requirements.length > 0) {
      lines.push(`Job requirements: ${JSON.stringify(jobContext.requirements)}`);
    }
    return lines.join("\n");
  }

  private buildBulletPrompt(input: RewriteBulletInput): string {
    return `You are a resume-bullet editor. Rewrite the given resume bullet into 1
sharper alternative. Keep the rewrite concise and factual.

STRICT RULES:
- Do NOT invent dates, company names, metrics, or achievements not present in the
  original bullet. Only rephrase and sharpen existing content.
- You may optionally align terminology with the job context below, but only by
  rewording — never by adding facts the original does not contain.
- Keep the same scope of achievement. Do not exaggerate.
- The rewrite should stay close in length to the original.

EXAMPLES:

Original: "Responsible for making the website faster"
Job requirements: ["performance optimization", "React"]
Good rewrite: "Optimized website performance, reducing page load times"

Original: "Worked on the team that built the payments feature"
Job requirements: ["backend development", "payment systems"]
Good rewrite: "Contributed to building the payments feature as part of the team"

Original: "Did customer support and answered tickets"
Job requirements: ["customer service", "communication"]
Good rewrite: "Delivered customer support by resolving incoming tickets"

Now rewrite this bullet. Return exactly 1 suggestion.

Original: "${input.originalBullet}"
${this.buildContextBlock(input)}`;
  }

  private buildProjectPrompt(input: RewriteBulletInput): string {
    return `You are a resume editor. Rewrite the given project description into 1
sharper alternative. Keep the rewrite concise and factual.

STRICT RULES:
- Do NOT invent technologies, metrics, or outcomes not present in the original
  description. Only rephrase and sharpen existing content.
- You may optionally align terminology with the job context below, but only by
  rewording — never by adding facts the original does not contain.
- Keep the same scope of what the project actually does. Do not exaggerate.
- The rewrite should stay close in length to the original.

EXAMPLES:

Original: "Made a website for tracking expenses"
Job requirements: ["React", "state management"]
Good rewrite: "Built a web application for tracking personal expenses"

Now rewrite this project description. Return exactly 1 suggestion.

Original: "${input.originalBullet}"
${this.buildContextBlock(input)}`;
  }

  private buildSummaryPrompt(input: RewriteBulletInput): string {
    return `You are a resume editor. Rewrite the given professional summary paragraph
into 1 sharper alternative. Keep the rewrite close to the original in length.

STRICT RULES:
- Do NOT invent skills, years of experience, job titles, or achievements not present
  in the original summary. Only rephrase and sharpen existing content.
- You may optionally align terminology with the job context below, but only by
  rewording — never by adding facts the original does not contain.
- Do not exaggerate scope, seniority, or impact beyond what the original states.
- The rewrite should stay close in length to the original — a summary is a short
  paragraph, not a single line, so do not compress it into a bullet.

EXAMPLE:

Original: "Frontend developer with experience building React applications. Enjoys
solving UI problems and working with modern JavaScript frameworks."
Job requirements: ["React", "TypeScript", "team collaboration"]
Good rewrite: "Frontend developer experienced in building React applications, focused
on solving UI problems with modern JavaScript frameworks."

Now rewrite this summary. Return exactly 1 suggestion.

Original: "${input.originalBullet}"
${this.buildContextBlock(input)}`;
  }

  private async callGemini(prompt: string, label: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
        config: {
          temperature: 0.3,
          // gemini-flash-latest spends part of this budget on internal
          // "thinking" tokens before writing visible output — 512 left too
          // little room for the actual JSON, truncating it mid-string and
          // failing every rewrite request. Confirmed via usageMetadata:
          // thinking alone consumed ~420 of a 512 budget.
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
          responseSchema: REWRITE_SCHEMA,
          httpOptions: { timeout: GEMINI_CALL_TIMEOUT_MS },
        },
      });
      return response.text ?? "";
    } catch (err) {
      throw classifyGeminiError(err, label);
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
