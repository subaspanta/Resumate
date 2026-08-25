import { beforeEach, describe, expect, it, vi } from "vitest";

// dispatchExtraction is called directly here (never spawned), so mocking the
// extractor modules works the same way parsing.service.test.ts always
// mocked them, before extraction moved into a worker thread.
vi.mock("../../../src/modules/parsing/extractors/pdf-extractor.js", () => ({
  extractTextFromPdf: vi.fn(),
}));
vi.mock("../../../src/modules/parsing/extractors/docx-extractor.js", () => ({
  extractTextFromDocx: vi.fn(),
}));

import { extractTextFromPdf } from "../../../src/modules/parsing/extractors/pdf-extractor.js";
import { extractTextFromDocx } from "../../../src/modules/parsing/extractors/docx-extractor.js";
import { dispatchExtraction } from "../../../src/modules/parsing/extraction-dispatch.js";

describe("dispatchExtraction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("routes application/pdf to the PDF extractor", async () => {
    vi.mocked(extractTextFromPdf).mockResolvedValue("pdf text");

    const result = await dispatchExtraction(
      Buffer.from("pdf-bytes"),
      "application/pdf",
    );

    expect(result).toBe("pdf text");
    expect(extractTextFromPdf).toHaveBeenCalledWith(Buffer.from("pdf-bytes"));
    expect(extractTextFromDocx).not.toHaveBeenCalled();
  });

  it("routes the DOCX mimetype to the DOCX extractor", async () => {
    vi.mocked(extractTextFromDocx).mockResolvedValue("docx text");

    const result = await dispatchExtraction(
      Buffer.from("docx-bytes"),
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );

    expect(result).toBe("docx text");
    expect(extractTextFromDocx).toHaveBeenCalledWith(
      Buffer.from("docx-bytes"),
    );
    expect(extractTextFromPdf).not.toHaveBeenCalled();
  });

  it("propagates an extractor failure", async () => {
    vi.mocked(extractTextFromPdf).mockRejectedValue(
      new Error("Invalid PDF structure."),
    );

    await expect(
      dispatchExtraction(Buffer.from("garbage"), "application/pdf"),
    ).rejects.toThrow("Invalid PDF structure.");
  });
});
