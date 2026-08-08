import { GoogleGenAI, Type } from "@google/genai";
import { AppError } from "../../../types/app-error.js";
import { ERROR_CODES } from "../../../constants/error-codes.js";
import { HTTP_STATUS } from "../../../constants/http-status.js";
import { validateAgentOutput } from "../../../utils/agent-output-validator.js";
import { classifyGeminiError } from "../../ai/gemini-error.js";
import { GEMINI_CALL_TIMEOUT_MS } from "../../ai/gemini-timeout.js";
import { StructuredResume } from "../../parsing/parsing.types.js";
import {
  EvidenceAgent,
  EvidenceAgentInput,
  EvidenceAgentOutput,
  evidenceAgentOutputSchema,
  SOURCE_SECTIONS,
} from "../career-analysis.types.js";

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

  // Serializes only the parts of the resume a quote can legitimately come
  // from. Contact details are withheld — they are PII, and no skill evidence
  // should ever be attributed to a phone number.
  //
  // Every entry is labelled with its index, and those indices must match the
  // order buildResumeHaystack walks the same arrays in. That correspondence is
  // what makes sourceIndex resolvable: the model cites [2], the validator
  // grounds the quote against entry 2, and the backend derives the label from
  // entry 2. If the two orderings ever diverge, provenance silently points at
  // the wrong job.
  private serializeResume(resume: StructuredResume): string {
    const sections: string[] = [];

    if (resume.summary) {
      sections.push(`## Summary\n[0] ${resume.summary}`);
    }

    if (resume.experience?.length) {
      const entries = resume.experience.map((entry, index) => {
        const header = [entry.title, entry.company].filter(Boolean).join(" — ");
        const dates = [entry.startDate, entry.endDate]
          .filter(Boolean)
          .join(" to ");
        const bullets = (entry.bullets ?? []).map((b) => `- ${b}`).join("\n");
        return `[${index}] ${header}${dates ? ` (${dates})` : ""}\n${bullets}`;
      });
      sections.push(`## Experience\n${entries.join("\n\n")}`);
    }

    if (resume.projects?.length) {
      const entries = resume.projects.map((project, index) => {
        const bullets = (project.bullets ?? []).map((b) => `- ${b}`).join("\n");
        return `[${index}] ${project.name}\n${bullets}`;
      });
      sections.push(`## Projects\n${entries.join("\n\n")}`);
    }

    if (resume.skills?.length) {
      const groups = resume.skills.map(
        (group, index) =>
          `[${index}] ${group.category ?? "Other"}: ${group.items.join(", ")}`,
      );
      sections.push(`## Skills\n${groups.join("\n")}`);
    }

    if (resume.education?.length) {
      const entries = resume.education.map(
        (entry, index) =>
          `[${index}] ${[entry.degree, entry.institution, entry.year].filter(Boolean).join(", ")}`,
      );
      sections.push(`## Education\n${entries.join("\n")}`);
    }

    if (resume.certifications?.length) {
      const entries = resume.certifications.map(
        (cert, index) =>
          `[${index}] ${[cert.name, cert.issuer].filter(Boolean).join(", ")}`,
      );
      sections.push(`## Certifications\n${entries.join("\n")}`);
    }

    return sections.join("\n\n");
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

Resume:
${this.serializeResume(input.resume)}`;
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
