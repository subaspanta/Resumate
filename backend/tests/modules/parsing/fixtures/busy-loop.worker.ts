import { parentPort } from "node:worker_threads";

// Test-only fixture for extraction-runner.test.ts's cancellation test. A
// genuine synchronous, non-yielding CPU-bound loop — the same shape a
// pathological extraction would take — so the test can prove
// worker.terminate() actually interrupts real work mid-flight, not just
// that a promise gets abandoned while the work keeps running regardless
// (with-timeout.ts's failure mode, which this branch replaces).
parentPort!.once("message", () => {
  const end = Date.now() + 5_000;
  while (Date.now() < end) {
    // deliberately empty — burns CPU without ever yielding to the event
    // loop or checking for cancellation itself
  }
  parentPort!.postMessage({ ok: true, text: "should never be seen" });
});
