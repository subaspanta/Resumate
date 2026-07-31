import {
  Analysis,
  Prisma,
  Suggestion,
  SuggestionStatus,
} from "../../generated/client/index.js";
import { prisma } from "../../lib/prisma.js";

type NewSuggestion = {
  original: string;
  suggested: string;
  section: string | null;
  status: SuggestionStatus;
};

export class AnalysisRepository {
  // Analysis rows are immutable (write-once); only Suggestion rows mutate.
  async create(data: Prisma.AnalysisCreateInput): Promise<Analysis> {
    return prisma.analysis.create({ data });
  }

  async createAnalysis(input: {
    resumeId: string;
    userId: string;
    jobDescription: string;
    parsedJob: Prisma.InputJsonValue;
    resumeSnapshot: Prisma.InputJsonValue;
    analysisResult: Prisma.InputJsonValue;
  }): Promise<string> {
    const analysis = await prisma.analysis.create({
      data: {
        jobDescription: input.jobDescription,
        parsedJob: input.parsedJob,
        resumeSnapshot: input.resumeSnapshot,
        analysisResult: input.analysisResult,
        resume: { connect: { id: input.resumeId } },
        user: { connect: { id: input.userId } },
      },
      select: { id: true },
    });
    return analysis.id;
  }

  async saveSuggestions(
    analysisId: string,
    suggestions: NewSuggestion[],
  ): Promise<Suggestion[]> {
    return prisma.suggestion.createManyAndReturn({
      data: suggestions.map((s) => ({
        analysisId,
        original: s.original,
        suggested: s.suggested,
        section: s.section,
        status: s.status,
      })),
    });
  }

  // Ownership-decision read only — never used to authorize the write itself.
  async findSuggestionWithOwner(
    suggestionId: string,
  ): Promise<{ id: string; analysis: { userId: string } } | null> {
    return prisma.suggestion.findUnique({
      where: { id: suggestionId },
      select: { id: true, analysis: { select: { userId: true } } },
    });
  }

  // Ownership-scoped write: the `analysis: { userId }` filter keeps the
  // update itself safe even though the service already decided 403 vs 404
  // via findSuggestionWithOwner. Returns null if the row vanished or its
  // owner changed between the read and this write (race), rather than
  // throwing — caller treats that as not-found.
  async updateSuggestionStatus(
    suggestionId: string,
    userId: string,
    status: SuggestionStatus,
    rejectionReason?: string,
  ): Promise<Suggestion | null> {
    const result = await prisma.suggestion.updateMany({
      where: { id: suggestionId, analysis: { userId } },
      data: { status, rejectionReason: rejectionReason ?? null },
    });
    if (result.count === 0) return null;
    return prisma.suggestion.findUnique({ where: { id: suggestionId } });
  }

  async findLatestByResumeId(resumeId: string): Promise<Analysis | null> {
    return prisma.analysis.findFirst({
      where: { resumeId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findManyByResumeId(resumeId: string): Promise<
    Pick<Analysis, "id" | "resumeId" | "jobDescription" | "createdAt">[]
  > {
    return prisma.analysis.findMany({
      where: { resumeId },
      select: {
        id: true,
        resumeId: true,
        jobDescription: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async deleteById(id: string): Promise<void> {
    await prisma.analysis.delete({ where: { id } });
  }

  async getAnalysisWithSuggestions(
    analysisId: string,
  ): Promise<(Analysis & { suggestions: Suggestion[] }) | null> {
    return prisma.analysis.findUnique({
      where: { id: analysisId },
      include: { suggestions: true },
    });
  }

  // Applied suggestions across every analysis of a given resume — used to merge
  // accepted rewrites back onto the resume.
  async findAppliedSuggestionsByResumeId(
    resumeId: string,
  ): Promise<Suggestion[]> {
    return prisma.suggestion.findMany({
      where: { status: "applied", analysis: { resumeId } },
    });
  }
}
