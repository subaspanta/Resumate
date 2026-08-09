// Mirrors backend/src/modules/roadmap/roadmap.repository.ts (RoadmapWithTasks)
// and prisma/schema.prisma.

interface SkillRef {
  slug: string;
  name: string;
}

export interface RoadmapTask {
  id: string;
  weekNumber: number;
  orderInWeek: number;
  title: string;
  description: string;
  projectTask: string;
  expectedEvidence: string;
  resources: string[] | null;
  completed: boolean;
  completedAt: string | null;
  // What the user wrote about completing this task — the only groundable
  // evidence a reassessment can find. Optional on the toggle request; a
  // plain checkbox click sends none and leaves the stored note untouched.
  completionNote: string | null;
  skillGap: { id: string; status: string; skill: SkillRef } | null;
}

export interface Roadmap {
  id: string;
  careerAnalysisId: string;
  // Actual scheduled week count, not always 4 — a candidate with fewer gaps
  // gets a shorter roadmap. Never hardcode 4 weeks when rendering.
  weekCount: number;
  createdAt: string;
  tasks: RoadmapTask[];
}

// PATCH /roadmap-tasks/:taskId response — a bare task row, no skillGap join,
// unlike a task read as part of a full roadmap.
export type RoadmapTaskRow = Omit<RoadmapTask, "skillGap">;
