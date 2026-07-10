export interface ResumeSummary {
  id: string;
  title: string;
  lastEditedAt: string;
  atsScore: number;
  targetJob?: string | null;
  fileName?: string;
  suggestionsCount?: number;
}

export type DashboardView = "firstTime" | "default" | "active";

export function getDashboardView(resumes: ResumeSummary[]): DashboardView {
  if (resumes.length === 0) return "firstTime";
  const hasPendingSuggestions = resumes.some(
    (resume) => (resume.suggestionsCount ?? 0) > 0
  );
  return hasPendingSuggestions ? "active" : "default";
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
  view: DashboardView,
  isSidebarCollapsed: boolean
): string {
  if (view === "firstTime") return "var(--spacing-sidebar-width)";
  return isSidebarCollapsed
    ? "var(--spacing-sidebar-collapsed-width)"
    : "var(--spacing-sidebar-width)";
}
