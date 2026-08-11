import { GoogleGenAI, Type } from "@google/genai";
import { AppError } from "../../../types/app-error.js";
import { ERROR_CODES } from "../../../constants/error-codes.js";
import { HTTP_STATUS } from "../../../constants/http-status.js";
import { validateAgentOutput } from "../../../utils/agent-output-validator.js";
import { classifyGeminiError } from "../../ai/gemini-error.js";
import { GEMINI_CALL_TIMEOUT_MS } from "../../ai/gemini-timeout.js";
import {
  EvidenceAgent,
  EvidenceAgentInput,
  EvidenceAgentOutput,
  evidenceAgentOutputSchema,
  SOURCE_SECTIONS,
} from "../career-analysis.types.js";
import {
  buildSourceItems,
  renderSourceItemsForPrompt,
} from "../resume-source-items.js";

// Gemini structured-output schema mirroring EvidenceAgentOutput.
//
// Note what it cannot express: no status, priority, score, importance, or
// week. The application decides all of those, so there is deliberately no
// field through which the model could smuggle a judgement.
const EVIDENCE_OUTPUT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    assessments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          skillSlug: { type: Type.STRING },
          found: { type: Type.BOOLEAN },
          evidence: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                quote: { type: Type.STRING },
                strength: {
                  type: Type.STRING,
                  enum: ["experience_backed", "project_backed", "mentioned"],
                },
                sourceSection: {
                  type: Type.STRING,
                  enum: [...SOURCE_SECTIONS],
                },
                // A reference, not a label. The backend derives the display
                // label from the snapshot entry this points at.
                sourceIndex: { type: Type.INTEGER },
              },
              required: ["quote", "strength", "sourceSection", "sourceIndex"],
            },
          },
        },
        required: ["skillSlug", "found", "evidence"],
      },
    },
  },
  required: ["assessments"],
};

export class EvidenceAgentService implements EvidenceAgent {
  // Client injected rather than constructed at module scope. The agents this
  // replaces built their own, which is why neither could be tested without
  // mocking the whole @google/genai module.
  constructor(private readonly ai: GoogleGenAI) {}

  async assessEvidence(
    input: EvidenceAgentInput,
  ): Promise<EvidenceAgentOutput> {
    const responseText = await this.callGemini(this.buildPrompt(input));
    return this.parseResponse(responseText);
  }

  private buildPrompt(input: EvidenceAgentInput): string {
    const skillList = input.requiredSkills
      .map((skill) => {
        const aliases = skill.aliases.length
          ? ` (also counts: ${skill.aliases.join(", ")})`
          : "";
        return `- ${skill.slug}: ${skill.name}${aliases}`;
      })
      .join("\n");

    return `You are a resume evidence extractor. For each skill in the list below,
report what the resume actually demonstrates about it — nothing more.

Rules:
- Assess ONLY the skills listed. Never add a skill that is not in the list.
- Return exactly one entry per listed skill, using the skill's slug verbatim.
- Set "found" to false when the resume does not demonstrate the skill, and
  leave "evidence" empty.
- Every "quote" must be copied character-for-character from the resume text
  below. Do not paraphrase, summarize, fix typos, translate, or stitch
  fragments together. A quote that does not appear verbatim will be discarded.
- Quote enough text to be meaningful — at least a full phrase, not one word.
- "strength" means:
    experience_backed — the quote comes from a work experience entry.
    project_backed    — the quote comes from a project entry.
    mentioned         — the skill only appears in a list with no supporting
                        narrative describing what was done with it.
- "sourceSection" must be the section the quote was taken from, one of:
  ${SOURCE_SECTIONS.join(", ")}.
- "sourceIndex" is the number in square brackets on the entry the quote came
  from, e.g. a quote from "[2] Backend Intern — Acme Corp" has sourceIndex 2.
  The quote must appear in THAT entry; evidence citing the wrong entry is
  discarded.

Do NOT judge whether the candidate is qualified, rate them, rank the skills by
importance, decide what they should learn, recommend anything, or write any
commentary. Return only quotes and their source references. You are reporting
what the document says, not evaluating the person.

Target role: ${input.role.title}
${input.role.description}

Skills to assess:
${skillList}
${this.buildCompletedWorkContext(input.completedWorkContext)}
Resume:
${renderSourceItemsForPrompt(input.sourceItems ?? buildSourceItems(input.resume))}`;
  }

  // Reassessment only. Describes what each completion note is a response to,
  // so the model can interpret a terse note like "did this, tests pass" — but
  // explicitly forbids quoting the assignment text itself, since it was
  // written by this system, not the candidate.
  private buildCompletedWorkContext(
    context: EvidenceAgentInput["completedWorkContext"],
  ): string {
    if (!context || context.length === 0) return "";

    const items = context
      .map(
        (c) =>
          `- Skill: ${c.skillName}\n  Assignment: ${c.projectTask} (should prove: ${c.expectedEvidence})`,
      )
      .join("\n");

    return `
The candidate has since completed roadmap work. Each item below names the
skill it targets and the assignment they were given. What they wrote about
completing it appears in the "Completed roadmap work" section below, as a
numbered, quotable entry.

${items}

The "Assignment" and "should prove" text above was written by this system,
not the candidate. NEVER quote it or treat it as evidence — quote only the
candidate's own words from a numbered section.
`;
  }

  private async callGemini(prompt: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: EVIDENCE_OUTPUT_SCHEMA,
          httpOptions: { timeout: GEMINI_CALL_TIMEOUT_MS },
        },
      });
      return response.text ?? "";
    } catch (err) {
      throw classifyGeminiError(err, "analyze this resume");
    }
  }

  private parseResponse(responseText: string): EvidenceAgentOutput {
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

    // requiredArrayFields on "assessments": an empty array means the model
    // returned a hollow shell rather than assessing anything, which would
    // otherwise score every skill as missing and look like a real result.
    return validateAgentOutput(evidenceAgentOutputSchema, parsed, {
      requiredArrayFields: ["assessments"],
    });
  }
}
