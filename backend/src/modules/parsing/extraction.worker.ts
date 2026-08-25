import { parentPort } from "node:worker_threads";
import { dispatchExtraction } from "./extraction-dispatch.js";

// AppError isn't clonable across the worker/main-thread boundary, so a
// failure crosses as a plain {ok:false, message} envelope — the runner
// reconstructs a plain Error from it, which is all resume.service.ts's
// Promise.allSettled branch needs (any rejected promise).
parentPort!.once(
  "message",
  async ({ buffer, mimeType }: { buffer: Buffer; mimeType: string }) => {
    try {
      const text = await dispatchExtraction(buffer, mimeType);
      parentPort!.postMessage({ ok: true, text });
    } catch (err) {
      parentPort!.postMessage({
        ok: false,
        message: err instanceof Error ? err.message : String(err),
      });
    }
  },
);
