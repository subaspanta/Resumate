// Mirrors RoadmapWithTasks and the Prisma roadmap types.

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
  // Completion note is the evidence source used by reassessment; toggles may omit it.
  completionNote: string | null;
  skillGap: { id: string; status: string; skill: SkillRef } | null;
}

export interface Roadmap {
  id: string;
  careerAnalysisId: string;
  // Actual scheduled week count; candidates with fewer gaps may get fewer than four.
  weekCount: number;
  createdAt: string;
  tasks: RoadmapTask[];
}

// PATCH response is a bare task row without the skill-gap join.
export type RoadmapTaskRow = Omit<RoadmapTask, "skillGap">;
