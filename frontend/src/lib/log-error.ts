// Single seam for reporting unhandled errors (ErrorBoundary catches, etc.).
// Swap the console.error below for a Sentry/OpenTelemetry call when
// observability is wired up — call sites don't need to change.
// See ADR-0004 and docs/architecture/conventions.md (error taxonomy).
export function logError(error: unknown, context?: Record<string, unknown>) {
  console.error("[logError]", error, context ?? {});
}
