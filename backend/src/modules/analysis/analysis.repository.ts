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

  async updateSuggestionStatus(
    suggestionId: string,
    status: SuggestionStatus,
    rejectionReason?: string,
  ): Promise<Suggestion> {
    return prisma.suggestion.update({
      where: { id: suggestionId },
      data: { status, rejectionReason: rejectionReason ?? null },
    });
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
