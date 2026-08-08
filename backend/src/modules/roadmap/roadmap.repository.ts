import { Prisma, Roadmap, RoadmapTask } from "../../generated/client/index.js";
import { prisma } from "../../lib/prisma.js";

export type NewRoadmapTaskRow = {
  skillGapId: string;
  weekNumber: number;
  orderInWeek: number;
  title: string;
  description: string;
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

export class RoadmapRepository {
  // Creates the roadmap and every task in one transaction. A roadmap with a
  // partial set of tasks would present the user with a plan missing weeks,
  // indistinguishable from one that was deliberately shorter.
  //
  // Roadmap.careerAnalysisId is @unique, so two concurrent generations race
  // here and the loser fails on the constraint rather than both writing —
  // which is what makes the service's 409 check safe against a TOCTOU gap.
  async createWithTasks(input: {
    careerAnalysisId: string;
    weekCount: number;
    tasks: NewRoadmapTaskRow[];
  }): Promise<RoadmapWithTasks> {
    return prisma.$transaction(async (tx) => {
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
    return prisma.roadmap.findUnique({
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
    const existing = await prisma.roadmap.findUnique({
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
    return prisma.roadmapTask.findUnique({
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
  ): Promise<RoadmapTask | null> {
    const result = await prisma.roadmapTask.updateMany({
      where: { id: taskId, roadmap: { careerAnalysis: { userId } } },
      // completedAt is derived here, never accepted from the client — a
      // user-supplied timestamp would let anyone forge their own progress
      // history.
      data: { completed, completedAt: completed ? new Date() : null },
    });
    if (result.count === 0) return null;
    return prisma.roadmapTask.findUnique({ where: { id: taskId } });
  }

  async recordTaskEvent(
    careerAnalysisId: string,
    completed: boolean,
    taskId: string,
  ): Promise<void> {
    await prisma.analysisEvent.create({
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
    return prisma.roadmap.findUnique({
      where: { id: roadmapId },
      select: {
        id: true,
        careerAnalysis: { select: { userId: true } },
      },
    });
  }

  async findById(roadmapId: string): Promise<RoadmapWithTasks | null> {
    return prisma.roadmap.findUnique({
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
}
