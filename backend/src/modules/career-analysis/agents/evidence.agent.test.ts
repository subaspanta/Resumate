import { describe, expect, it, vi } from "vitest";
import type { GoogleGenAI } from "@google/genai";
import { EvidenceAgentService } from "./evidence.agent.js";
import { EvidenceAgentInput } from "../career-analysis.types.js";
import { StructuredResume } from "../../parsing/parsing.types.js";
import { AppError } from "../../../types/app-error.js";

function fakeGeminiClient(responseText: string): GoogleGenAI {
  return {
    models: {
      generateContent: vi.fn().mockResolvedValue({ text: responseText }),
    },
  } as unknown as GoogleGenAI;
}

function failingGeminiClient(error: unknown): GoogleGenAI {
  return {
    models: { generateContent: vi.fn().mockRejectedValue(error) },
  } as unknown as GoogleGenAI;
}

// Captures the prompt the agent sends, so tests can assert on what the model
// is and is not told.
function capturingGeminiClient(responseText: string) {
  const generateContent = vi.fn().mockResolvedValue({ text: responseText });
  const client = { models: { generateContent } } as unknown as GoogleGenAI;
  return {
    client,
    prompt: () => generateContent.mock.calls[0][0].contents as string,
    config: () => generateContent.mock.calls[0][0].config,
  };
}

const RESUME: StructuredResume = {
  name: "Test Candidate",
  contact: { email: "candidate@example.com", phone: "+977-9800000000" },
  summary: "Final-year student focused on backend development",
  experience: [
    {
      title: "Backend Intern",
      company: "Acme Corp",
      startDate: "2025-06",
      endDate: "2025-12",
      bullets: ["Built REST endpoints in Node.js and Express"],
    },
  ],
  projects: [
    { name: "Task Tracker", bullets: ["Modeled the schema in PostgreSQL"] },
  ],
  education: [{ degree: "BSc CSIT", institution: "Example University" }],
  skills: [{ category: "Tools", items: ["Docker", "Git"] }],
  certifications: [],
  customSections: [],
};

const INPUT: EvidenceAgentInput = {
  resume: RESUME,
  role: { title: "Backend Engineer", description: "Builds server-side systems" },
  requiredSkills: [
    { slug: "nodejs", name: "Node.js", aliases: ["node", "express"] },
    { slug: "docker", name: "Docker", aliases: ["container"] },
  ],
};

const VALID_RESPONSE = JSON.stringify({
  assessments: [
    {
      skillSlug: "nodejs",
      found: true,
      evidence: [
        {
          quote: "Built REST endpoints in Node.js and Express",
          strength: "experience_backed",
          sourceSection: "experience",
          sourceIndex: 0,
        },
      ],
    },
    {
      skillSlug: "docker",
      found: false,
      evidence: [],
    },
  ],
});

describe("EvidenceAgentService", () => {
  it("returns the validated assessments", async () => {
    const agent = new EvidenceAgentService(fakeGeminiClient(VALID_RESPONSE));
    const result = await agent.assessEvidence(INPUT);

    expect(result.assessments).toHaveLength(2);
    expect(result.assessments[0].skillSlug).toBe("nodejs");
    expect(result.assessments[0].evidence[0].strength).toBe(
      "experience_backed",
    );
  });

  it("sends the skill vocabulary and its aliases", async () => {
    const { client, prompt } = capturingGeminiClient(VALID_RESPONSE);
    await new EvidenceAgentService(client).assessEvidence(INPUT);

    expect(prompt()).toContain("nodejs");
    expect(prompt()).toContain("Node.js");
    // Aliases are what let the model count "Express" as Node.js evidence
    // without inventing its own vocabulary.
    expect(prompt()).toContain("express");
  });

  // The test that keeps the seam from eroding. Importance and rationale are
  // deliberately withheld: a model told that Docker is critical inflates the
  // evidence it reports for Docker, and the application would then score that
  // inflation as fact.
  it("never tells the model how important a skill is", async () => {
    const { client, prompt } = capturingGeminiClient(VALID_RESPONSE);
    await new EvidenceAgentService(client).assessEvidence(INPUT);

    const sent = prompt();
    expect(sent).not.toContain("critical");
    expect(sent).not.toContain("important");
    expect(sent).not.toContain("nice_to_have");
    expect(sent).not.toContain("priority");
    expect(sent).not.toContain("readiness");
  });

  it("instructs the model not to evaluate the candidate", async () => {
    const { client, prompt } = capturingGeminiClient(VALID_RESPONSE);
    await new EvidenceAgentService(client).assessEvidence(INPUT);

    expect(prompt()).toContain("Do NOT judge whether the candidate is qualified");
  });

  it("does not send contact details to the model", async () => {
    const { client, prompt } = capturingGeminiClient(VALID_RESPONSE);
    await new EvidenceAgentService(client).assessEvidence(INPUT);

    const sent = prompt();
    expect(sent).not.toContain("candidate@example.com");
    expect(sent).not.toContain("9800000000");
  });

  it("sends the resume text quotes must be drawn from", async () => {
    const { client, prompt } = capturingGeminiClient(VALID_RESPONSE);
    await new EvidenceAgentService(client).assessEvidence(INPUT);

    const sent = prompt();
    expect(sent).toContain("Built REST endpoints in Node.js and Express");
    expect(sent).toContain("Modeled the schema in PostgreSQL");
  });

  it("numbers each entry so the model can cite it by index", async () => {
    const { client, prompt } = capturingGeminiClient(VALID_RESPONSE);
    await new EvidenceAgentService(client).assessEvidence(INPUT);

    const sent = prompt();
    expect(sent).toContain("[0] Backend Intern — Acme Corp");
    expect(sent).toContain("[0] Task Tracker");
    expect(sent).toContain('"sourceIndex" is the number in square brackets');
  });

  it("asks for source references, never a display label", async () => {
    const { client, prompt } = capturingGeminiClient(VALID_RESPONSE);
    await new EvidenceAgentService(client).assessEvidence(INPUT);

    // The backend derives sourceLabel from the snapshot; the model must not
    // author the company or job title the user sees as provenance.
    expect(prompt()).not.toContain("sourceLabel");
  });

  it("applies the shared call timeout and structured-output config", async () => {
    const { client, config } = capturingGeminiClient(VALID_RESPONSE);
    await new EvidenceAgentService(client).assessEvidence(INPUT);

    expect(config().httpOptions.timeout).toBe(60_000);
    expect(config().responseMimeType).toBe("application/json");
    expect(config().responseSchema).toBeDefined();
  });

  it("rejects malformed JSON", async () => {
    const agent = new EvidenceAgentService(fakeGeminiClient("not json at all"));
    await expect(agent.assessEvidence(INPUT)).rejects.toThrow(AppError);
  });

  it("rejects output that does not match the schema", async () => {
    const agent = new EvidenceAgentService(
      fakeGeminiClient(
        JSON.stringify({
          assessments: [{ skillSlug: "nodejs", found: "yes please" }],
        }),
      ),
    );
    await expect(agent.assessEvidence(INPUT)).rejects.toThrow(AppError);
  });

  it("rejects an empty assessment list rather than scoring everything missing", async () => {
    const agent = new EvidenceAgentService(
      fakeGeminiClient(JSON.stringify({ assessments: [] })),
    );
    await expect(agent.assessEvidence(INPUT)).rejects.toThrow(AppError);
  });

  it("wraps a Gemini failure in an AppError", async () => {
    const agent = new EvidenceAgentService(
      failingGeminiClient(new Error("socket hang up")),
    );
    await expect(agent.assessEvidence(INPUT)).rejects.toThrow(AppError);
  });
});
