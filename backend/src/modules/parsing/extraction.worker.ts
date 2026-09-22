import { parentPort } from "node:worker_threads";
import { dispatchExtraction } from "./extraction-dispatch.js";
import { logger } from "../../config/logger.js";

// Worker errors cross thread boundary as plain data.
parentPort!.once(
  "message",
  async ({ buffer, mimeType }: { buffer: Buffer; mimeType: string }) => {
    try {
      const text = await dispatchExtraction(buffer, mimeType, logger);
      parentPort!.postMessage({ ok: true, text });
    } catch (err) {
      parentPort!.postMessage({
        ok: false,
        message: err instanceof Error ? err.message : String(err),
      });
    }
  },
);
