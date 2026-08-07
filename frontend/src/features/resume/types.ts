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

export interface DashboardStateInput {
  resumes: ResumeSummary[];
  loadError: boolean;
}
