import { beforeEach, describe, expect, it, vi } from "vitest";

// Extraction now runs inside a worker_threads Worker (extraction-runner.ts),
// which spawns a fresh module graph vi.mock cannot reach into — so this
// suite mocks the runner itself rather than the extractors. Real worker
// behavior (success, cancellation, worker-side errors) is covered by
// extraction-runner.test.ts against the real worker; this file only tests
// ParsingService's own responsibilities around that call.
vi.mock("../../../src/modules/parsing/extraction-runner.js", () => ({
  runExtraction: vi.fn(),
}));

import { runExtraction } from "../../../src/modules/parsing/extraction-runner.js";
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

describe("ParsingService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resolves normally when PDF extraction finishes before the deadline", async () => {
    vi.mocked(runExtraction).mockResolvedValue(REAL_TEXT);
    const service = new ParsingService(fakeAiStructuringModule());

    const result = await service.parseResume(
      Buffer.from("pdf-bytes"),
      "application/pdf",
    );

    expect(result.rawText).toBe(REAL_TEXT);
  });

  it("resolves normally when DOCX extraction finishes before the deadline", async () => {
    vi.mocked(runExtraction).mockResolvedValue(REAL_TEXT);
    const service = new ParsingService(fakeAiStructuringModule());

    const result = await service.parseResume(
      Buffer.from("docx-bytes"),
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );

    expect(result.rawText).toBe(REAL_TEXT);
  });

  it("propagates a timeout rejection from the runner unchanged", async () => {
    vi.mocked(runExtraction).mockRejectedValue(new Error("timed out"));
    const service = new ParsingService(fakeAiStructuringModule());

    await expect(
      service.parseResume(Buffer.from("pdf-bytes"), "application/pdf"),
    ).rejects.toThrow(/timed out/);
  });

  it("still throws PARSING_FAILED for genuinely empty extracted text, unrelated to timeout", async () => {
    vi.mocked(runExtraction).mockResolvedValue("   ");
    const service = new ParsingService(fakeAiStructuringModule());

    await expect(
      service.parseResume(Buffer.from("pdf-bytes"), "application/pdf"),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("rejects an unsupported mimetype without ever calling the runner", async () => {
    const service = new ParsingService(fakeAiStructuringModule());

    await expect(
      service.parseResume(Buffer.from("bytes"), "image/png"),
    ).rejects.toMatchObject({ code: "UNSUPPORTED_FILE_TYPE" });
    expect(runExtraction).not.toHaveBeenCalled();
  });
});
