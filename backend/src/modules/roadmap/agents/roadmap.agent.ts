import { GoogleGenAI, Type } from "@google/genai";
import { AppError } from "../../../types/app-error.js";
import { ERROR_CODES } from "../../../constants/error-codes.js";
import { HTTP_STATUS } from "../../../constants/http-status.js";
import { validateAgentOutput } from "../../../utils/agent-output-validator.js";
import { classifyGeminiError } from "../../ai/gemini-error.js";
import { GEMINI_CALL_TIMEOUT_MS } from "../../ai/gemini-timeout.js";
import {
  RoadmapAgent,
  RoadmapAgentInput,
  RoadmapAgentOutput,
  roadmapAgentOutputSchema,
} from "../roadmap.types.js";

// Gemini structured-output schema mirroring RoadmapAgentOutput.
//
// No weekNumber, no priority, no order, no completed. The application already
// chose which gaps matter and what order they come in; the model supplies
// prose for that decision, it does not participate in it.
const ROADMAP_OUTPUT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    tasks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          skillSlug: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          projectTask: { type: Type.STRING },
          expectedEvidence: { type: Type.STRING },
          resources: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: [
          "skillSlug",
          "title",
          "description",
          "projectTask",
          "expectedEvidence",
          "resources",
        ],
      },
    },
  },
  required: ["tasks"],
};

export class RoadmapAgentService implements RoadmapAgent {
  // Client injected so the agent can be faked in tests, matching the evidence
  // agent and AIStructuringService.
  constructor(private readonly ai: GoogleGenAI) {}

  async generateTasks(input: RoadmapAgentInput): Promise<RoadmapAgentOutput> {
    const responseText = await this.callGemini(this.buildPrompt(input));
    return this.parseResponse(responseText);
  }

  private buildPrompt(input: RoadmapAgentInput): string {
    const gapList = input.gaps
      .map(
        (gap) =>
          `- ${gap.skillSlug} (${gap.skillName}) — current evidence: ${gap.status}. Why the role needs it: ${gap.rationale}`,
      )
      .join("\n");

    const projectList = input.existingProjects.length
      ? input.existingProjects
          .map((project) => `- ${project.name}: ${project.summary}`)
          .join("\n")
      : "(none listed on the resume)";

    return `You are writing practical learning tasks for an early-career developer
working toward a ${input.roleTitle} role.

You will be given a fixed list of skill gaps. Write exactly one task for each,
using the skill's slug verbatim as "skillSlug". Do not add tasks, drop tasks,
reorder them, or comment on which matters most — that has already been decided.

For each task:
- "title": a short imperative name for the work, e.g. "Add integration tests to
  your task tracker".
- "description": two or three sentences on what to learn and why it closes this
  specific gap.
- "projectTask": the concrete thing to build. Prefer extending one of the
  candidate's existing projects listed below over inventing a new tutorial
  project — improving real work produces better evidence than a throwaway demo.
- "expectedEvidence": what should exist when the task is done, stated so it
  could be shown to an employer, e.g. "8-10 tests covering the checkout flow,
  and a documented test command in the README".
- "resources": up to five short pointers — official documentation, a specific
  guide, a named tool. Name real, well-known resources only; if you are unsure
  a resource exists, leave it out rather than inventing a title or URL.

Do NOT assign weeks, order, priority, difficulty ratings, or completion status.
Do NOT claim the candidate has already done any of this. Write the task content
only.

Skill gaps to address:
${gapList}

The candidate's existing projects:
${projectList}`;
  }

  private async callGemini(prompt: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: ROADMAP_OUTPUT_SCHEMA,
          httpOptions: { timeout: GEMINI_CALL_TIMEOUT_MS },
        },
      });
      return response.text ?? "";
    } catch (err) {
      throw classifyGeminiError(err, "generate your roadmap");
    }
  }

  private parseResponse(responseText: string): RoadmapAgentOutput {
    let parsed: unknown;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      throw new AppError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        ERROR_CODES.AI_VALIDATION_FAILED,
        "AI returned an unexpected response format",
      );
    }

    return validateAgentOutput(roadmapAgentOutputSchema, parsed, {
      requiredArrayFields: ["tasks"],
    });
  }
}
