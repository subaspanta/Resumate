export type DashboardState =
  "firstTime" | "readyToStart" | "workspaceReady" | "error";

export type AnalysisStatus = "none" | "unexported" | "exported";

export type DashboardView = "firstTime" | "default" | "active";

export interface ResumeSummary {
  id: string;
  title: string;
  originalFileName: string;
  createdAt: string;
  updatedAt: string;
  analysisStatus: AnalysisStatus;
  lastEditedAt?: string;
  fileName?: string;
  suggestionsCount?: number;
}

// GET /resumes is cursor-paginated — matches backend ResumePage.
export interface ResumePage {
  items: ResumeSummary[];
  nextCursor: string | null;
}

export interface StructuredResumeExperience {
  title: string;
  company: string | null;
  workMode?: "remote" | "hybrid" | "onsite" | null;
  location?: string | null;
  startDate?: string;
  endDate?: string;
  bullets: string[];
  // Pre-`bullets` rows stored one string here instead of an array. Read-only
  // legacy tolerance so an old resumeSnapshot still renders — never write it.
  description?: string;
}

export interface StructuredResumeEducation {
  degree: string;
  institution: string;
  year?: string;
}

// null category = uncategorized — either a legacy flat skills array (no
// headings) or the backward-compat shape a resume coerces into if it never
// had explicit skill groupings.
export interface SkillGroup {
  category: string | null;
  items: string[];
}

export interface StructuredResumeProject {
  name: string;
  bullets: string[];
  // See StructuredResumeExperience.description — same legacy shape.
  description?: string;
}

export interface Certification {
  name: string;
  issuer?: string | null;
  issueDate?: string | null;
  expiryDate?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
}

export interface CustomSection {
  heading: string;
  bullets: string[];
}

// Missing key = visible. Only an explicit `false` hides a section — mirrors
// the backend's filterVisibleSections check (`=== false`, never `!== true`).
export interface EnabledSections {
  summary?: boolean;
  experience?: boolean;
  projects?: boolean;
  education?: boolean;
  skills?: boolean;
  certifications?: boolean;
  customSections?: Record<string, boolean>;
}

export interface StructuredResume {
  name?: string;
  contact?: {
    email?: string;
    phone?: string;
    location?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  summary?: string;
  experience: StructuredResumeExperience[];
  education: StructuredResumeEducation[];
  skills: SkillGroup[];
  projects: StructuredResumeProject[];
  certifications: Certification[];
  customSections: CustomSection[];
}

export interface Resume extends ResumeSummary {
  fileSize: number;
  rawText: string;
  structuredResume: StructuredResume;
  // null in the DB until the user toggles a section at least once.
  enabledSections?: EnabledSections | null;
}

export type CreateResumeInput = FormData;

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

export interface DashboardStateInput {
  resumes: ResumeSummary[];
  loadError: boolean;
}

// "Continue Working" (workspaceReady) fires when ANY resume has unfinished
// tailoring work — not just the most recently uploaded one. Once every
// resume has been exported at least once, there's nothing left to
// continue, so it falls back to readyToStart (same screen as "never
// started" — no separate "all done" state to design for yet).
export function deriveDashboardState(
  input: DashboardStateInput,
): DashboardState {
  if (input.loadError) return "error";
  if (input.resumes.length === 0) return "firstTime";
  const hasUnfinishedWork = input.resumes.some(
    (r) => r.analysisStatus === "unexported",
  );
  return hasUnfinishedWork ? "workspaceReady" : "readyToStart";
}

export function stateToLayoutKey(state: DashboardState): DashboardView {
  switch (state) {
    case "firstTime":
      return "firstTime";
    case "readyToStart":
      return "default";
    case "workspaceReady":
      return "active";
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

export function getSidebarOffset(
  isCollapsible: boolean,
  isSidebarCollapsed: boolean,
): string {
  return isCollapsible && isSidebarCollapsed
    ? "var(--spacing-sidebar-collapsed-width)"
    : "var(--spacing-sidebar-width)";
}
