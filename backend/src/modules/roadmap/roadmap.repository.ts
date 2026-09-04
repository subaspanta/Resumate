import {
  Prisma,
  PrismaClient,
  Roadmap,
  RoadmapTask,
} from "../../generated/client/index.js";

export type NewRoadmapTaskRow = {
  skillGapId: string;
  weekNumber: number;
  orderInWeek: number;
  title: string;
  description: string;
  projectTask: string;
  expectedEvidence: string;
  resources: Prisma.InputJsonValue;
};

export type RoadmapWithTasks = Prisma.RoadmapGetPayload<{
  include: {
    tasks: {
      include: {
        skillGap: {
          include: { skill: { select: { slug: true; name: true } } };
        };
      };
    };
  };
}>;

// The read reassessment needs: completed tasks plus the AI-authored context
// (projectTask/expectedEvidence) needed to interpret a note — never a source
// of quotable text itself. See career-analysis.service.ts#reassessAnalysis.
export type CompletedTaskRow = {
  id: string;
  completedAt: Date | null;
  completionNote: string | null;
  projectTask: string;
  expectedEvidence: string;
  skillGap: { skill: { slug: string; name: string } } | null;
};

// Narrow read-only port CareerAnalysisService depends on. Deliberately not
// RoadmapService: RoadmapService already depends on CareerAnalysisService for
// ownership, so depending back would make container.ts unconstructable.
export interface CompletedWorkReader {
  findCompletedTasksForAnalysis(
    careerAnalysisId: string,
  ): Promise<CompletedTaskRow[]>;
}

export class RoadmapRepository implements CompletedWorkReader {
  constructor(private readonly prisma: PrismaClient) {}

  // Creates the roadmap and every task in one transaction. A roadmap with a
  // partial set of tasks would present the user with a plan missing weeks,
  // indistinguishable from one that was deliberately shorter.
  //
  // Roadmap.careerAnalysisId is @unique, so two concurrent generations race
  // here and the loser fails on the constraint (P2002) rather than both
  // writing. The constraint is the real concurrency guard; the service's
  // existsForAnalysis check only avoids paying for a Gemini call in the
  // common case, and it cannot close the window on its own. The service
  // catches P2002 and maps it to the same 409 that check produces.
  async createWithTasks(input: {
    careerAnalysisId: string;
    weekCount: number;
    tasks: NewRoadmapTaskRow[];
  }): Promise<RoadmapWithTasks> {
    return this.prisma.$transaction(async (tx) => {
      const roadmap = await tx.roadmap.create({
        data: {
          careerAnalysisId: input.careerAnalysisId,
          weekCount: input.weekCount,
          tasks: { create: input.tasks },
        },
      });

      await tx.analysisEvent.create({
        data: {
          careerAnalysisId: input.careerAnalysisId,
          type: "roadmap_generated",
          payload: { taskCount: input.tasks.length },
        },
      });

      return tx.roadmap.findUniqueOrThrow({
        where: { id: roadmap.id },
        include: {
          tasks: {
            include: {
              skillGap: {
                include: { skill: { select: { slug: true, name: true } } },
              },
            },
            orderBy: [{ weekNumber: "asc" }, { orderInWeek: "asc" }],
          },
        },
      });
    });
  }

  async findByAnalysisId(
    careerAnalysisId: string,
  ): Promise<RoadmapWithTasks | null> {
    return this.prisma.roadmap.findUnique({
      where: { careerAnalysisId },
      include: {
        tasks: {
          include: {
            skillGap: {
              include: { skill: { select: { slug: true, name: true } } },
            },
          },
          orderBy: [{ weekNumber: "asc" }, { orderInWeek: "asc" }],
        },
      },
    });
  }

  async existsForAnalysis(careerAnalysisId: string): Promise<boolean> {
    const existing = await this.prisma.roadmap.findUnique({
      where: { careerAnalysisId },
      select: { id: true },
    });
    return existing !== null;
  }

  // Ownership-decision read only — never used to authorize the write itself.
  //
  // Two hops (task -> roadmap -> careerAnalysis) because RoadmapTask has no
  // userId of its own. Denormalizing one would be a second source of truth
  // that can drift from the analysis the task actually belongs to. Explicit
  // nested select rather than include: include would drag both snapshot JSONB
  // blobs across the wire to read one uuid.
  async findTaskWithOwner(taskId: string): Promise<{
    id: string;
    completed: boolean;
    roadmap: { careerAnalysis: { id: string; userId: string } };
  } | null> {
    return this.prisma.roadmapTask.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        completed: true,
        roadmap: {
          select: {
            careerAnalysis: { select: { id: true, userId: true } },
          },
        },
      },
    });
  }

  // Ownership-scoped write. The nested roadmap.careerAnalysis.userId filter
  // makes the update itself safe even though the service already decided 403
  // vs 404 via findTaskWithOwner.
  //
  // updateMany rather than update is load-bearing: Prisma's update accepts
  // only a unique field in `where`, so a relation filter is impossible and the
  // write would have to trust the earlier read. Here the write carries the
  // ownership predicate itself. Returns null when the row vanished or changed
  // owner between the read and this write, which the caller treats as
  // not-found rather than a crash.
  async setTaskCompletion(
    taskId: string,
    userId: string,
    completed: boolean,
    completionNote?: string,
  ): Promise<RoadmapTask | null> {
    const result = await this.prisma.roadmapTask.updateMany({
      where: { id: taskId, roadmap: { careerAnalysis: { userId } } },
      data: {
        // completedAt is derived here, never accepted from the client — a
        // user-supplied timestamp would let anyone forge their own progress
        // history.
        completed,
        completedAt: completed ? new Date() : null,
        // Spread so an absent key leaves the stored note untouched — distinct
        // from an explicit "" clearing it.
        ...(completionNote !== undefined ? { completionNote } : {}),
      },
    });
    if (result.count === 0) return null;
    // Read-back is deliberately unscoped, and that is safe rather than an
    // ownership hole: count > 0 above means the ownership-filtered write just
    // matched this exact id, so the caller's right to see the row is already
    // proven. Re-filtering here would only re-ask a question the write
    // answered. updateMany cannot return the updated row, hence the second
    // round-trip.
    return this.prisma.roadmapTask.findUnique({ where: { id: taskId } });
  }

  async recordTaskEvent(
    careerAnalysisId: string,
    completed: boolean,
    taskId: string,
  ): Promise<void> {
    await this.prisma.analysisEvent.create({
      data: {
        careerAnalysisId,
        type: completed ? "task_completed" : "task_uncompleted",
        payload: { taskId },
      },
    });
  }

  // Ownership-scoped read of a roadmap by its own id, for GET /roadmaps/:id.
  async findByIdWithOwner(roadmapId: string): Promise<{
    id: string;
    careerAnalysis: { userId: string };
  } | null> {
    return this.prisma.roadmap.findUnique({
      where: { id: roadmapId },
      select: {
        id: true,
        careerAnalysis: { select: { userId: true } },
      },
    });
  }

  async findById(roadmapId: string): Promise<RoadmapWithTasks | null> {
    return this.prisma.roadmap.findUnique({
      where: { id: roadmapId },
      include: {
        tasks: {
          include: {
            skillGap: {
              include: { skill: { select: { slug: true, name: true } } },
            },
          },
          orderBy: [{ weekNumber: "asc" }, { orderInWeek: "asc" }],
        },
      },
    });
  }

  // Explicit nested select, not include: include on skillGap.careerAnalysis
  // would drag both snapshot JSONB blobs across the wire to read a skill name.
  async findCompletedTasksForAnalysis(
    careerAnalysisId: string,
  ): Promise<CompletedTaskRow[]> {
    return this.prisma.roadmapTask.findMany({
      where: { roadmap: { careerAnalysisId }, completed: true },
      select: {
        id: true,
        completedAt: true,
        completionNote: true,
        projectTask: true,
        expectedEvidence: true,
        skillGap: { select: { skill: { select: { slug: true, name: true } } } },
      },
      orderBy: [{ weekNumber: "asc" }, { orderInWeek: "asc" }],
    });
  }
}
