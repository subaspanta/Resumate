export interface ResumeSummary {
  id: string;
  title: string;
  lastEditedAt: string; // ISO string — format at render time, not in the API layer
  atsScore: number;
}
