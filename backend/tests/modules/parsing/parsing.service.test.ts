import { describe, expect, it, vi } from "vitest";

// The extractors are hardcoded internal calls inside ParsingService (not
// constructor-injected like everything else in this codebase), so there's
// no fake-object seam to stall them through. Module-mocking them is the only
// way to prove the timeout is actually wired to the real call sites — a
// deliberate, scoped exception to the codebase's usual fake-via-constructor
// convention.
vi.mock("../../../src/modules/parsing/extractors/pdf-extractor.js", () => ({
  extractTextFromPdf: vi.fn(),
}));
vi.mock("../../../src/modules/parsing/extractors/docx-extractor.js", () => ({
  extractTextFromDocx: vi.fn(),
}));

import { extractTextFromPdf } from "../../../src/modules/parsing/extractors/pdf-extractor.js";
import { extractTextFromDocx } from "../../../src/modules/parsing/extractors/docx-extractor.js";
import { ParsingService } from "../../../src/modules/parsing/parsing.service.js";
import { AIStructuringModule } from "../../../src/modules/parsing/parsing.types.js";
import { AppError } from "../../../src/types/app-error.js";

const REAL_TEXT =
  "Backend Engineer at Acme Corp. Built REST APIs with Node.js and PostgreSQL.";

function fakeAiStructuringModule(): AIStructuringModule {
  return {
    async structureResume() {
      return {
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        customSections: [],
      };
    },
  };
}

function neverSettles<T>(): Promise<T> {
  return new Promise<T>(() => {});
}

describe("ParsingService — extraction timeout", () => {
  it("resolves normally when PDF extraction finishes before the deadline", async () => {
    vi.mocked(extractTextFromPdf).mockResolvedValue(REAL_TEXT);
    const service = new ParsingService(fakeAiStructuringModule());

    const result = await service.parseResume(
      Buffer.from("pdf-bytes"),
      "application/pdf",
    );

    expect(result.rawText).toBe(REAL_TEXT);
  });

  it("resolves normally when DOCX extraction finishes before the deadline", async () => {
    vi.mocked(extractTextFromDocx).mockResolvedValue(REAL_TEXT);
    const service = new ParsingService(fakeAiStructuringModule());

    const result = await service.parseResume(
      Buffer.from("docx-bytes"),
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );

    expect(result.rawText).toBe(REAL_TEXT);
  });

  it("rejects when PDF extraction stalls past the timeout, instead of hanging forever", async () => {
    vi.mocked(extractTextFromPdf).mockReturnValue(neverSettles<string>());
    const service = new ParsingService(fakeAiStructuringModule());

    await expect(
      service.parseResume(Buffer.from("pdf-bytes"), "application/pdf"),
    ).rejects.toThrow(/timed out/);
  }, 15_000);

  it("rejects when DOCX extraction stalls past the timeout, instead of hanging forever", async () => {
    vi.mocked(extractTextFromDocx).mockReturnValue(neverSettles<string>());
    const service = new ParsingService(fakeAiStructuringModule());

    await expect(
      service.parseResume(
        Buffer.from("docx-bytes"),
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ),
    ).rejects.toThrow(/timed out/);
  }, 15_000);

  it("still throws PARSING_FAILED for genuinely empty extracted text, unrelated to timeout", async () => {
    vi.mocked(extractTextFromPdf).mockResolvedValue("   ");
    const service = new ParsingService(fakeAiStructuringModule());

    await expect(
      service.parseResume(Buffer.from("pdf-bytes"), "application/pdf"),
    ).rejects.toBeInstanceOf(AppError);
  });
});
