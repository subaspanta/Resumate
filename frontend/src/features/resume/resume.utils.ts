import type {
  DashboardState,
  DashboardStateInput,
  DashboardView,
} from "./types";

// Mirrors the backend's normalizeStructuredResume: real array wins, legacy
// `description` becomes one bullet, otherwise nothing.
export function entryBullets(entry: {
  bullets?: string[];
  description?: string;
}): string[] {
  if (Array.isArray(entry.bullets)) return entry.bullets;
  return entry.description ? [entry.description] : [];
}

// Mirrors the backend's actual limits (multer's MAX_FILE_SIZE_BYTES and
// fileFilter in upload.ts) so the UI's stated limits are true, and lets a
// bad file get rejected client-side instead of after a full round trip.
// Not a security boundary on its own — the server enforces these for real.
export const MAX_RESUME_FILE_SIZE_BYTES = 2 * 1024 * 1024;
// octet-stream and "" are accepted because multer accepts octet-stream and
// the real check is the buffer's magic bytes server-side. Browsers report one
// of those for a valid PDF often enough — drag-and-drop, no registered
// handler — that rejecting them here blocks uploads the server would take.
export const ALLOWED_RESUME_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream",
  "",
]);

export function validateResumeFile(file: File): string | null {
  if (!ALLOWED_RESUME_MIME_TYPES.has(file.type)) {
    return "Only PDF and DOCX files are supported.";
  }
  if (file.size > MAX_RESUME_FILE_SIZE_BYTES) {
    return "File exceeds the 2MB limit.";
  }
  return null;
}

export function deriveDashboardState(
  input: DashboardStateInput,
): DashboardState {
  if (input.loadError) return "error";
  if (input.resumes.length === 0) return "firstTime";
  return "readyToStart";
}

export function stateToLayoutKey(state: DashboardState): DashboardView {
  switch (state) {
    case "firstTime":
      return "firstTime";
    case "readyToStart":
      return "default";
    case "error":
      return "default";
  }
}

export function getGreetingName(name?: string): string {
  if (!name) return "there";
  return name.split(" ")[0];
}

export function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
