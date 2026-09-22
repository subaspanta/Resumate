import { Worker } from "node:worker_threads";
import { TimeoutError } from "../../utils/with-timeout.js";

type ExtractionResult =
  | { ok: true; text: string }
  | { ok: false; message: string };

// Worker timeout can terminate CPU-bound extraction.
export function runExtraction(
  buffer: Buffer,
  mimeType: string,
  timeoutMs: number,
  label: string,
  workerUrl: URL = new URL("./extraction.worker.js", import.meta.url),
): Promise<string> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerUrl, { execArgv: process.execArgv });
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      worker.terminate();
      reject(new TimeoutError(label, timeoutMs));
    }, timeoutMs);

    worker.once("message", (result: ExtractionResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();
      if (result.ok) {
        resolve(result.text);
      } else {
        reject(new Error(result.message));
      }
    });

    worker.once("error", (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();
      reject(err);
    });

    worker.once("exit", (code) => {
      if (settled || code === 0) return;
      settled = true;
      clearTimeout(timer);
      reject(new Error(`Extraction worker exited unexpectedly (code ${code})`));
    });

    // Copy buffer: storage upload uses it concurrently.
    worker.postMessage({ buffer, mimeType });
  });
}
