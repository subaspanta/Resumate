import { describe, expect, it, vi } from "vitest";
import type { GoogleGenAI } from "@google/genai";
import { RoadmapAgentService } from "./roadmap.agent.js";
import { RoadmapAgentInput } from "../roadmap.types.js";
import { AppError } from "../../../types/app-error.js";

function capturingClient(responseText: string) {
  const generateContent = vi.fn().mockResolvedValue({ text: responseText });
  const client = { models: { generateContent } } as unknown as GoogleGenAI;
  return {
    client,
    prompt: () => generateContent.mock.calls[0][0].contents as string,
    config: () => generateContent.mock.calls[0][0].config,
  };
}

function fakeClient(responseText: string): GoogleGenAI {
  return {
    models: {
      generateContent: vi.fn().mockResolvedValue({ text: responseText }),
    },
  } as unknown as GoogleGenAI;
}

const INPUT: RoadmapAgentInput = {
  roleTitle: "Backend Engineer",
  gaps: [
    {
      skillSlug: "testing",
      skillName: "Automated Testing",
      status: "missing",
      rationale: "Integration tests make refactors survivable.",
    },
    {
      skillSlug: "docker",
      skillName: "Docker & Containers",
      status: "weak_evidence",
      rationale: "Reproducible environments are the normal artifact.",
    },
  ],
  existingProjects: [
    { name: "Task Tracker", summary: "A CRUD app with a REST API" },
  ],
};

const VALID_RESPONSE = JSON.stringify({
  tasks: [
    {
      skillSlug: "testing",
      title: "Add integration tests",
      description: "Learn Vitest and cover the API.",
      projectTask: "Add tests to Task Tracker.",
      expectedEvidence: "10 tests and a documented command.",
      resources: ["Vitest docs"],
    },
    {
      skillSlug: "docker",
      title: "Containerize the app",
      description: "Learn Dockerfiles.",
      projectTask: "Write a Dockerfile for Task Tracker.",
      expectedEvidence: "A working docker-compose setup.",
      resources: ["Docker docs"],
    },
  ],
});

describe("RoadmapAgentService", () => {
  it("returns validated task content", async () => {
    const agent = new RoadmapAgentService(fakeClient(VALID_RESPONSE));
    const result = await agent.generateTasks(INPUT);

    expect(result.tasks).toHaveLength(2);
    expect(result.tasks[0].skillSlug).toBe("testing");
    expect(result.tasks[0].expectedEvidence).toBeTruthy();
  });

  it("sends the selected gaps and their rationale", async () => {
    const { client, prompt } = capturingClient(VALID_RESPONSE);
    await new RoadmapAgentService(client).generateTasks(INPUT);

    const sent = prompt();
    expect(sent).toContain("testing");
    expect(sent).toContain("Automated Testing");
    expect(sent).toContain("Integration tests make refactors survivable");
  });

  // The seam guard for this agent: the application already chose the gaps and
  // their order, so the model must not be told either.
  it("never tells the model the week, order, or priority of a gap", async () => {
    const { client, prompt } = capturingClient(VALID_RESPONSE);
    await new RoadmapAgentService(client).generateTasks(INPUT);

    const sent = prompt();

    // Only the lines describing the gaps matter — the instruction paragraph
    // legitimately says the words "week", "order", and "priority" while
    // forbidding them, so a whole-prompt substring check would contradict
    // itself.
    const gapLines = sent
      .split("\n")
      .filter((line) => line.startsWith("- ") && line.includes("("));

    expect(gapLines).toHaveLength(INPUT.gaps.length);
    for (const line of gapLines) {
      expect(line).not.toMatch(/week/i);
      expect(line).not.toMatch(/priorit/i);
      expect(line).not.toMatch(/\border\b/i);
      expect(line).not.toMatch(/\b[1-4]\b/);
    }

    expect(sent).toContain("Do NOT assign weeks, order, priority");
  });

  it("asks the model to build on existing projects", async () => {
    const { client, prompt } = capturingClient(VALID_RESPONSE);
    await new RoadmapAgentService(client).generateTasks(INPUT);

    const sent = prompt();
    expect(sent).toContain("Task Tracker");
    expect(sent).toContain("over inventing a new tutorial");
  });

  it("says so plainly when the candidate has no projects", async () => {
    const { client, prompt } = capturingClient(VALID_RESPONSE);
    await new RoadmapAgentService(client).generateTasks({
      ...INPUT,
      existingProjects: [],
    });

    expect(prompt()).toContain("(none listed on the resume)");
  });

  it("applies the shared timeout and structured-output config", async () => {
    const { client, config } = capturingClient(VALID_RESPONSE);
    await new RoadmapAgentService(client).generateTasks(INPUT);

    expect(config().httpOptions.timeout).toBe(60_000);
    expect(config().responseMimeType).toBe("application/json");
    expect(config().responseSchema).toBeDefined();
  });

  it("rejects malformed JSON", async () => {
    const agent = new RoadmapAgentService(fakeClient("not json"));
    await expect(agent.generateTasks(INPUT)).rejects.toThrow(AppError);
  });

  it("rejects output that does not match the schema", async () => {
    const agent = new RoadmapAgentService(
      fakeClient(JSON.stringify({ tasks: [{ skillSlug: "testing" }] })),
    );
    await expect(agent.generateTasks(INPUT)).rejects.toThrow(AppError);
  });

  it("rejects an empty task list", async () => {
    const agent = new RoadmapAgentService(
      fakeClient(JSON.stringify({ tasks: [] })),
    );
    await expect(agent.generateTasks(INPUT)).rejects.toThrow(AppError);
  });

  it("wraps a Gemini failure in an AppError", async () => {
    const client = {
      models: {
        generateContent: vi.fn().mockRejectedValue(new Error("socket hang up")),
      },
    } as unknown as GoogleGenAI;

    await expect(
      new RoadmapAgentService(client).generateTasks(INPUT),
    ).rejects.toThrow(AppError);
  });
});
