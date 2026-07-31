import { describe, expect, it, vi } from "vitest";
import type { GoogleGenAI } from "@google/genai";
import { AIStructuringService } from "./ai.service.js";

function fakeGeminiClient(responseText: string): GoogleGenAI {
  return {
    models: {
      generateContent: vi.fn().mockResolvedValue({ text: responseText }),
    },
  } as unknown as GoogleGenAI;
}

describe("AIStructuringService.structureResume", () => {
  it("includes a projects array in the structured output", async () => {
    const mockResponse = JSON.stringify({
      name: "Jane Doe",
      contact: { email: null, phone: null, location: null },
      summary: null,
      experience: [],
      education: [],
      skills: ["React"],
      projects: [
        { name: "Portfolio site", description: "Built with Next.js" },
      ],
    });
    const service = new AIStructuringService(fakeGeminiClient(mockResponse));

    const result = await service.structureResume("raw resume text");

    expect(result.projects).toEqual([
      { name: "Portfolio site", description: "Built with Next.js" },
    ]);
  });
});
