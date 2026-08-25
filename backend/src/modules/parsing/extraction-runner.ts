import { Worker } from "node:worker_threads";
import { TimeoutError } from "../../utils/with-timeout.js";

type ExtractionResult =
  | { ok: true; text: string }
  | { ok: false; message: string };

// Runs extraction in its own thread so a timeout can actually terminate the
// work, not just stop waiting for it — unlike with-timeout.ts (whose own
// comment admits it "has no way to cancel...a synchronous parsing call
// already running"), worker.terminate() genuinely kills the thread. Every
// terminal path below clears the timer and terminates the worker exactly
// once, guarded by `settled`: success, extraction error, timeout, worker
// error, and unexpected exit all converge on the same cleanup.
//
// workerUrl defaults to the real extraction worker but can be overridden by
// tests to point at a different script (e.g. a busy-loop fixture that proves
// cancellation actually stops CPU-bound work) without needing a file that
// reliably hangs pdf-parse.
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

    // Structured-clone COPY, not a transfer. resume.service.ts's
    // saveAndParseFile runs storageModule.saveFile(file.buffer) and
    // parsingModule.parseResume(file.buffer, ...) concurrently on the same
    // buffer via Promise.allSettled — transferring the underlying
    // ArrayBuffer would detach it out from under the concurrent Cloudinary
    // upload. The 2MB cap makes the copy cheap; correctness here matters
    // more than avoiding it.
    worker.postMessage({ buffer, mimeType });
  });
}
