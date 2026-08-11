import { describe, expect, it, vi } from "vitest";
import { TimeoutError, withTimeout } from "../../src/utils/with-timeout.js";

function delay<T>(value: T, ms: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function delayReject(error: unknown, ms: number): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(error), ms));
}

describe("withTimeout", () => {
  it("resolves with the value when the promise settles before the deadline", async () => {
    const result = await withTimeout(delay("done", 10), 100, "test op");
    expect(result).toBe("done");
  });

  it("rejects with TimeoutError when the deadline passes first", async () => {
    await expect(
      withTimeout(delay("too slow", 100), 10, "test op"),
    ).rejects.toBeInstanceOf(TimeoutError);
  });

  it("TimeoutError message names the label and the configured duration", async () => {
    await expect(
      withTimeout(delay("too slow", 100), 10, "Resume storage upload"),
    ).rejects.toThrow("Resume storage upload timed out after 10ms");
  });

  it("preserves the original rejection when the promise fails before the deadline", async () => {
    const original = new Error("upstream failure");
    await expect(
      withTimeout(delayReject(original, 10), 100, "test op"),
    ).rejects.toBe(original);
  });

  it("clears the timer once the promise resolves, so it doesn't fire later", async () => {
    const clearSpy = vi.spyOn(global, "clearTimeout");
    try {
      const result = await withTimeout(delay("done", 10), 50, "test op");
      expect(result).toBe("done");
      expect(clearSpy).toHaveBeenCalled();
    } finally {
      clearSpy.mockRestore();
    }
  });

  it("clears the timer once the promise rejects, so the timeout never fires", async () => {
    const clearSpy = vi.spyOn(global, "clearTimeout");
    const original = new Error("upstream failure");
    try {
      await expect(
        withTimeout(delayReject(original, 10), 50, "test op"),
      ).rejects.toBe(original);
      expect(clearSpy).toHaveBeenCalled();
    } finally {
      clearSpy.mockRestore();
    }
  });
});
