import { extractTextFromPdf } from "./extractors/pdf-extractor.js";
import { extractTextFromDocx } from "./extractors/docx-extractor.js";
import { Logger } from "../../config/logger.js";

// Called only after MIME validation.
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
