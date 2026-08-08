import {
  AnalysisEventType,
  CareerAnalysis,
  CareerAnalysisStatus,
  Prisma,
} from "../../generated/client/index.js";
import { prisma } from "../../lib/prisma.js";
import { GapStatus, EvidenceStrength } from "../../generated/client/index.js";

export type NewEvidenceRow = {
  skillId: string;
  strength: EvidenceStrength;
  quote: string;
  sourceSection: string;
  sourceLabel: string;
};

export type NewGapRow = {
  skillId: string;
  status: GapStatus;
  priority: number;
  reasoning: string;
};

export type CompleteAnalysisInput = {
  analysisId: string;
  readinessScore: number;
  readinessBreakdown: Prisma.InputJsonValue;
  evidence: NewEvidenceRow[];
  gaps: NewGapRow[];
};

// Shape returned to callers reading a full analysis. Skill rows are joined in
// so the client gets names, not bare uuids.
export type CareerAnalysisWithResults = Prisma.CareerAnalysisGetPayload<{
  include: {
    role: { select: { slug: true; title: true } };
    evidence: { include: { skill: { select: { slug: true; name: true } } } };
    gaps: { include: { skill: { select: { slug: true; name: true } } } };
  };
}>;

export class CareerAnalysisRepository {
  async createPending(input: {
    userId: string;
    resumeId: string;
    roleId: string;
    resumeSnapshot: Prisma.InputJsonValue;
    roleSnapshot: Prisma.InputJsonValue;
  }): Promise<CareerAnalysis> {
    return prisma.careerAnalysis.create({
      data: {
        userId: input.userId,
        resumeId: input.resumeId,
        roleId: input.roleId,
        status: "analyzing",
        resumeSnapshot: input.resumeSnapshot,
        roleSnapshot: input.roleSnapshot,
        events: { create: { type: "analysis_started" } },
      },
    });
  }

  // Writes the whole result of one analysis atomically.
  //
  // Evidence, gaps, score, breakdown, and status must land together: a partial
  // write would leave an analysis marked complete whose readiness score does
  // not match the gaps that produced it, and nothing downstream could tell.
  // The @@unique([careerAnalysisId, skillId]) on SkillGap means a retry of the
  // same analysis fails loudly here rather than silently double-writing gaps.
  async completeAnalysis(
    input: CompleteAnalysisInput,
  ): Promise<CareerAnalysisWithResults> {
    return prisma.$transaction(async (tx) => {
      if (input.evidence.length > 0) {
        await tx.candidateSkillEvidence.createMany({
          data: input.evidence.map((row) => ({
            careerAnalysisId: input.analysisId,
            ...row,
          })),
        });
      }

      await tx.skillGap.createMany({
        data: input.gaps.map((row) => ({
          careerAnalysisId: input.analysisId,
          ...row,
        })),
      });

      await tx.analysisEvent.create({
        data: {
          careerAnalysisId: input.analysisId,
          type: "analysis_completed",
          payload: { readinessScore: input.readinessScore },
        },
      });

      return tx.careerAnalysis.update({
        where: { id: input.analysisId },
        data: {
          status: "complete",
          readinessScore: input.readinessScore,
          readinessBreakdown: input.readinessBreakdown,
          completedAt: new Date(),
        },
        include: {
          role: { select: { slug: true, title: true } },
          evidence: {
            include: { skill: { select: { slug: true, name: true } } },
          },
          gaps: {
            include: { skill: { select: { slug: true, name: true } } },
            orderBy: { priority: "asc" },
          },
        },
      });
    });
  }

  // Records a failure outside any transaction: the analysis row must survive
  // to explain itself, so this deliberately does not roll back with whatever
  // failed.
  async markFailed(analysisId: string, reason: string): Promise<void> {
    await prisma.careerAnalysis.update({
      where: { id: analysisId },
      data: {
        status: "failed",
        failureReason: reason,
        events: {
          create: { type: "analysis_failed" as AnalysisEventType },
        },
      },
    });
  }

  // Ownership-decision read. Returns the owner alongside the row so the
  // service can distinguish 404 (absent) from 403 (someone else's).
  async findByIdWithOwner(
    analysisId: string,
  ): Promise<{ id: string; userId: string } | null> {
    return prisma.careerAnalysis.findUnique({
      where: { id: analysisId },
      select: { id: true, userId: true },
    });
  }

  async findByIdWithResults(
    analysisId: string,
  ): Promise<CareerAnalysisWithResults | null> {
    return prisma.careerAnalysis.findUnique({
      where: { id: analysisId },
      include: {
        role: { select: { slug: true, title: true } },
        evidence: { include: { skill: { select: { slug: true, name: true } } } },
        gaps: {
          include: { skill: { select: { slug: true, name: true } } },
          orderBy: { priority: "asc" },
        },
      },
    });
  }

  // User-scoped list. The where clause carries userId so a foreign analysis
  // can never appear, independent of any check the service also makes.
  async findManyByUserId(
    userId: string,
    filter: { resumeId?: string } = {},
  ): Promise<
    Pick<
      CareerAnalysis,
      | "id"
      | "resumeId"
      | "roleId"
      | "status"
      | "readinessScore"
      | "createdAt"
      | "completedAt"
    >[]
  > {
    return prisma.careerAnalysis.findMany({
      where: { userId, ...(filter.resumeId ? { resumeId: filter.resumeId } : {}) },
      select: {
        id: true,
        resumeId: true,
        roleId: true,
        status: true,
        readinessScore: true,
        createdAt: true,
        completedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Ownership-scoped delete: the userId in the filter makes the write itself
  // safe, not just the read that preceded it. Returns false when the row
  // vanished or changed owner between the two.
  async deleteByIdAndUserId(
    analysisId: string,
    userId: string,
  ): Promise<boolean> {
    const result = await prisma.careerAnalysis.deleteMany({
      where: { id: analysisId, userId },
    });
    return result.count > 0;
  }

  async findStatusById(
    analysisId: string,
  ): Promise<{ status: CareerAnalysisStatus } | null> {
    return prisma.careerAnalysis.findUnique({
      where: { id: analysisId },
      select: { status: true },
    });
  }
}
