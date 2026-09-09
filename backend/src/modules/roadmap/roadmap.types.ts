import { z } from "zod";
import { GapStatus } from "../../generated/client/index.js";

// Roadmap agent output contains task content only; selection and scheduling stay application-owned.

export const roadmapTaskContentSchema = z.object({
  // Validated against the gaps supplied by the application.
  skillSlug: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  // Buildable work, not a reading list.
  projectTask: z.string().min(1).max(2000),
  expectedEvidence: z.string().min(1).max(1000),
  resources: z.array(z.string().max(300)).max(5),
});

export const roadmapAgentOutputSchema = z.object({
  tasks: z.array(roadmapTaskContentSchema).min(1),
});

export type RoadmapAgentOutput = z.infer<typeof roadmapAgentOutputSchema>;

// Gap context excludes priority and week so AI cannot influence sequencing.
export type RoadmapGapBrief = {
  skillSlug: string;
  skillName: string;
  // Application-derived status.
  status: GapStatus;
  // Hand-authored role rationale.
  rationale: string;
};

export type RoadmapAgentInput = {
  roleTitle: string;
  gaps: RoadmapGapBrief[];
  // Tasks should extend existing projects.
  existingProjects: { name: string; summary: string }[];
};

export interface RoadmapAgent {
  generateTasks(input: RoadmapAgentInput): Promise<RoadmapAgentOutput>;
}

export const updateRoadmapTaskSchema = z.object({
  // completedAt is server-derived.
  completed: z.boolean(),
  // Omitted note leaves the stored note unchanged; notes ground reassessment.
  completionNote: z.string().max(1000).optional(),
});

// Validate UUID params before Prisma sees them.
export const roadmapIdParamSchema = z.object({
  roadmapId: z.string().uuid(),
});

export const roadmapTaskIdParamSchema = z.object({
  taskId: z.string().uuid(),
});
