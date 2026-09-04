import { extractTextFromPdf } from "./extractors/pdf-extractor.js";
import { extractTextFromDocx } from "./extractors/docx-extractor.js";
import { Logger } from "../../config/logger.js";

// Pure mime-to-extractor routing, no timeout/worker concerns — this is the
// seam extraction.worker.ts calls inside the worker thread and unit tests
// call directly in-process (mocking the two extractor modules the same way
// parsing.service.test.ts always has). Only ever called with a mimeType
// ParsingService has already validated as supported; there is no
// unsupported-type branch here, because an unsupported type is rejected
// synchronously before a worker is ever spawned.
export async function dispatchExtraction(
  buffer: Buffer,
  mimeType: string,
  logger?: Logger,
): Promise<string> {
  if (mimeType === "application/pdf") {
    return extractTextFromPdf(buffer);
  }
  return logger ? extractTextFromDocx(buffer, logger) : extractTextFromDocx(buffer);
}
