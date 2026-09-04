import { describe, expect, it, vi } from "vitest";
import type { GoogleGenAI } from "@google/genai";
import { AIStructuringService } from "../../../src/modules/ai/ai.service.js";
import { logger } from "../../../src/config/logger.js";

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
      skills: [{ category: null, items: ["React"] }],
      projects: [
        { name: "Portfolio site", bullets: ["Built with Next.js"] },
      ],
      certifications: [],
      customSections: [],
    });
    const service = new AIStructuringService(
      fakeGeminiClient(mockResponse),
      logger,
    );

    const result = await service.structureResume("raw resume text");

    expect(result.projects).toEqual([
      { name: "Portfolio site", bullets: ["Built with Next.js"] },
    ]);
  });

  it("includes grouped skills, certifications, and custom sections in the structured output", async () => {
    const mockResponse = JSON.stringify({
      name: "Jane Doe",
      contact: { email: null, phone: null, location: null },
      summary: null,
      experience: [],
      education: [],
      skills: [
        { category: "Backend", items: ["Python", "Django"] },
        { category: null, items: ["Excel"] },
      ],
      projects: [],
      certifications: [
        {
          name: "AWS Certified Solutions Architect – Associate",
          issuer: "Amazon Web Services",
          issueDate: "2022-03",
          expiryDate: "2025-03",
          credentialId: null,
          credentialUrl: null,
        },
      ],
      customSections: [
        { heading: "Publications", bullets: ["Co-authored a paper."] },
      ],
    });
    const service = new AIStructuringService(
      fakeGeminiClient(mockResponse),
      logger,
    );

    const result = await service.structureResume("raw resume text");

    expect(result.skills).toEqual([
      { category: "Backend", items: ["Python", "Django"] },
      { category: null, items: ["Excel"] },
    ]);
    expect(result.certifications).toEqual([
      {
        name: "AWS Certified Solutions Architect – Associate",
        issuer: "Amazon Web Services",
        issueDate: "2022-03",
        expiryDate: "2025-03",
        credentialId: null,
        credentialUrl: null,
      },
    ]);
    expect(result.customSections).toEqual([
      { heading: "Publications", bullets: ["Co-authored a paper."] },
    ]);
  });
});
