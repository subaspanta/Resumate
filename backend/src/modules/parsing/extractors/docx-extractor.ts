import mammoth from "mammoth";
import { logger } from "../../../config/logger.js";

export async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  if (result.messages.length > 0) {
    logger.warn("mammoth DOCX conversion messages:", result.messages);
  }
  return result.value;
}
