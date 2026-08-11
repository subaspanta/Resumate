import { z } from "zod";
import { GapStatus } from "../../generated/client/index.js";

// --- Roadmap agent (AI call #3) ---------------------------------------------
//
// The model is handed gaps the application already selected and ordered. It
// writes task content for them and nothing else: there is no field for which
// gap to address, which week it belongs to, how urgent it is, or whether it is
// done. Those are all application decisions, so the schema gives the model no
// way to express them.

export const roadmapTaskContentSchema = z.object({
  // Echoed back so a task can be matched to the gap it was written for. The
  // validator rejects any value not in the set the application sent.
  skillSlug: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  // What the user should build. The PRD asks for evidence, not reading lists.
  projectTask: z.string().min(1).max(2000),
  expectedEvidence: z.string().min(1).max(1000),
  resources: z.array(z.string().max(300)).max(5),
});

export const roadmapAgentOutputSchema = z.object({
  tasks: z.array(roadmapTaskContentSchema).min(1),
});

export type RoadmapTaskContent = z.infer<typeof roadmapTaskContentSchema>;
export type RoadmapAgentOutput = z.infer<typeof roadmapAgentOutputSchema>;

// What the agent is told about one gap. Deliberately excludes priority and
// week: the model must not learn the ordering, or it starts writing "first,
// focus on..." into content the application already sequenced.
export type RoadmapGapBrief = {
  skillSlug: string;
  skillName: string;
  // The application's own judgement, carried as the enum rather than a bare
  // string so it cannot drift from what readiness.ts derived.
  status: GapStatus;
  // Hand-authored seed text explaining why the role needs this skill.
  rationale: string;
};

export type RoadmapAgentInput = {
  roleTitle: string;
  gaps: RoadmapGapBrief[];
  // Existing projects, so tasks can extend real work rather than inventing
  // disconnected tutorial projects (PRD section 5).
  existingProjects: { name: string; summary: string }[];
};

export interface RoadmapAgent {
  generateTasks(input: RoadmapAgentInput): Promise<RoadmapAgentOutput>;
}

// --- Request schemas --------------------------------------------------------

export const updateRoadmapTaskSchema = z.object({
  // completedAt is derived server-side — accepting it would let users forge
  // their own progress history.
  completed: z.boolean(),
  // Optional: a plain checkbox click sends no note. Absent means "leave
  // whatever is stored alone" (distinct from an explicit "" that clears it).
  // This is the only groundable evidence a reassessment can find — see
  // resume-source-items.ts's buildReassessmentSourceItems.
  completionNote: z.string().max(1000).optional(),
});

export type UpdateRoadmapTaskInput = z.infer<typeof updateRoadmapTaskSchema>;

// Route params. Without these a malformed id reaches Prisma's uuid cast and
// surfaces as a generic 500 instead of a 400.
export const roadmapIdParamSchema = z.object({
  roadmapId: z.string().uuid(),
});

export const roadmapTaskIdParamSchema = z.object({
  taskId: z.string().uuid(),
});
