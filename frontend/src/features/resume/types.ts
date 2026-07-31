import type { AnalysisSummary } from "@/src/features/analysis/types";

export type DashboardState =
  | "firstTime"
  | "readyToStart"
  | "analysisInProgress"
  | "workspaceReady"
  | "error";

export type DashboardView = "firstTime" | "default" | "active";

export interface ResumeSummary {
  id: string;
  title: string;
  originalFileName: string;
  createdAt: string;
  updatedAt: string;
  lastEditedAt?: string;
  atsScore?: number;
  fileName?: string;
  suggestionsCount?: number;
  targetJob?: string | null;
}

export interface StructuredResumeExperience {
  title: string;
  company: string | null;
  workMode?: "remote" | "hybrid" | "onsite" | null;
  location?: string | null;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface StructuredResumeEducation {
  degree: string;
  institution: string;
  year?: string;
}

export interface StructuredResumeProject {
  name: string;
  description?: string;
}

export interface StructuredResume {
  name?: string;
  contact?: { email?: string; phone?: string; location?: string };
  summary?: string;
  experience: StructuredResumeExperience[];
  education: StructuredResumeEducation[];
  skills: string[];
  projects: StructuredResumeProject[];
}

export interface Resume extends ResumeSummary {
  mimeType: string;
  fileSize: number;
  pdfUrl: string;
  rawText: string;
  structuredResume: StructuredResume;
}

export type CreateResumeInput = FormData;

export interface DashboardStateInput {
  resumes: ResumeSummary[];
  latestAnalysis: AnalysisSummary | null;
  loadError: boolean;
}

export function deriveDashboardState(
  input: DashboardStateInput,
): DashboardState {
  if (input.loadError) return "error";
  if (input.resumes.length === 0) return "firstTime";
  if (input.latestAnalysis) return "workspaceReady";
  return "readyToStart";
}

export function stateToLayoutKey(state: DashboardState): DashboardView {
  switch (state) {
    case "firstTime":
      return "firstTime";
    case "readyToStart":
      return "default";
    case "analysisInProgress":
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
