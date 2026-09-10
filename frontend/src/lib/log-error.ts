export function logError(error: unknown, context?: Record<string, unknown>) {
  console.error("[logError]", error, context ?? {});
}
