import { describe, expect, it } from "vitest";
import { runExtraction } from "../../../src/modules/parsing/extraction-runner.js";
import { TimeoutError } from "../../../src/utils/with-timeout.js";

// A genuinely valid, hand-built one-page PDF ("Hello World" text stream,
// correct xref table) — verified against the real pdf-parse package before
// being embedded here. Proves the whole mechanism (worker spawn, message
// protocol, dispatchExtraction, pdf-parse) works end to end at least once
// outside a mock.
const MINIMAL_VALID_PDF = Buffer.from(
  "JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA0IDAgUiA+PiA+PiAvTWVkaWFCb3ggWzAgMCAzMDAgMTQ0XSAvQ29udGVudHMgNSAwIFIgPj4KZW5kb2JqCjQgMCBvYmoKPDwgL1R5cGUgL0ZvbnQgL1N1YnR5cGUgL1R5cGUxIC9CYXNlRm9udCAvSGVsdmV0aWNhID4+CmVuZG9iago1IDAgb2JqCjw8IC9MZW5ndGggNDMgPj4Kc3RyZWFtCkJUIC9GMSAyNCBUZiAxMDAgMTAwIFRkIChIZWxsbyBXb3JsZCkgVGogRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyNDEgMDAwMDAgbiAKMDAwMDAwMDMxMSAwMDAwMCBuIAp0cmFpbGVyCjw8IC9Sb290IDEgMCBSIC9TaXplIDYgPj4Kc3RhcnR4cmVmCjQwNAolJUVPRg==",
  "base64",
);

// MIME-sniffable but structurally invalid — no xref table pdf-parse can
// actually read. Same pattern as resume.service.test.ts's fixture.
const GARBAGE_PDF = Buffer.from(
  "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF",
);

describe("runExtraction — real worker, no mocks", () => {
  it("extracts real text through the actual extraction worker", async () => {
    const text = await runExtraction(
      MINIMAL_VALID_PDF,
      "application/pdf",
      10_000,
      "PDF text extraction",
    );

    expect(text).toContain("Hello World");
  });

  it("rejects promptly on structurally invalid content, not a hang", async () => {
    await expect(
      runExtraction(
        GARBAGE_PDF,
        "application/pdf",
        10_000,
        "PDF text extraction",
      ),
    ).rejects.toThrow();
  });
});

describe("runExtraction — cancellation", () => {
  it("terminates a genuinely busy-looping worker at the deadline, without blocking the caller's event loop", async () => {
    const workerUrl = new URL(
      "./fixtures/busy-loop.worker.js",
      import.meta.url,
    );
    const timeoutMs = 300;

    let ticks = 0;
    const tickInterval = setInterval(() => ticks++, 20);
    const start = Date.now();

    await expect(
      runExtraction(
        Buffer.from("irrelevant"),
        "irrelevant",
        timeoutMs,
        "busy loop test",
        workerUrl,
      ),
    ).rejects.toThrow(TimeoutError);

    const elapsed = Date.now() - start;
    clearInterval(tickInterval);

    // Settles close to the deadline, not after the busy loop's own 5s
    // duration — proves terminate() actually cut real work short, the
    // property with-timeout.ts could never provide.
    expect(elapsed).toBeLessThan(timeoutMs + 2_000);

    // The main thread's own timer kept firing throughout the wait — proves
    // the busy loop was isolated to its own thread and never blocked this
    // one. Generous lower bound to avoid CI flakiness.
    const expectedTicks = elapsed / 20;
    expect(ticks).toBeGreaterThan(expectedTicks * 0.4);
  }, 10_000);
});
