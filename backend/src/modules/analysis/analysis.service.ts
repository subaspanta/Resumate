import { AnalysisRepository } from "./analysis.repository.js";
import { ResumeRepository } from "../resume/resume.repository.js";
import { AppError } from "../../types/app-error.js";
import { ERROR_CODES } from "../../constants/error-codes.js";
import { HTTP_STATUS } from "../../constants/http-status.js";
import { Analysis, Prisma, Suggestion } from "../../generated/client/index.js";
import {
  AnalysisResult,
  GetRewriteSuggestionsInput,
  JobParserAgent,
  MarketAgent,
  MarketIntelOutput,
  ParsedJob,
  RewriteAgent,
  RewriteBulletInput,
  RewriteOutput,
} from "./analysis.types.js";

export class AnalysisService {
  constructor(
    private readonly analysisRepository: AnalysisRepository,
    private readonly resumeRepository: ResumeRepository,
    private readonly jobParserAgent: JobParserAgent,
    private readonly rewriteAgent: RewriteAgent,
  ) {}

  // Preview/lookup step — intentionally does NOT persist. Market intel is a
  // read-only enrichment returned directly to the caller; nothing is written
  // to the Analysis table here.
  // async getMarketIntel(jobTitle: string): Promise<MarketIntelOutput> {
  //   //  return this.marketAgent.getMarketIntel(jobTitle);
  // }

  // Preview step — mirrors getMarketIntel: parses the job description and
  // returns the result directly without persisting.
  async parseJobDescription(rawText: string): Promise<ParsedJob> {
    return this.jobParserAgent.parseJobDescription(rawText);
  }

  // Preview step — returns validated rewrite suggestions directly without
  // persisting.
  async rewriteBullet(input: RewriteBulletInput): Promise<RewriteOutput> {
    return this.rewriteAgent.rewriteBullet(input);
  }

  // Persisting step — runs the job parser + market agent, then writes an
  // Analysis row snapshotting the resume and storing the AI results.
  async createAnalysis(
    userId: string,
    resumeId: string,
    jobDescription: string,
  ): Promise<{
    analysisId: string;
    parsedJob: ParsedJob;
    marketIntel: MarketIntelOutput;
  }> {
    const resume = await this.resumeRepository.findByIdAndUserId(
      userId,
      resumeId,
    );
    if (!resume) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Resume not found",
      );
    }

    const parsedJob =
      await this.jobParserAgent.parseJobDescription(jobDescription);
    // const marketIntel = await this.marketAgent.getMarketIntel(parsedJob.title);

    const analysisResult: AnalysisResult = { marketIntel, parsedJob };

    const analysisId = await this.analysisRepository.createAnalysis({
      resumeId,
      userId,
      jobDescription,
      parsedJob: parsedJob as unknown as Prisma.InputJsonValue,
      resumeSnapshot: resume.structuredResume as Prisma.InputJsonValue,
      analysisResult: analysisResult as unknown as Prisma.InputJsonValue,
    });

    return { analysisId, parsedJob, marketIntel };
  }

  // Persisting step — verifies ownership, runs the rewrite agent (validator runs
  // internally), and saves the surviving suggestions as pending rows.
  async getRewriteSuggestions(
    userId: string,
    input: GetRewriteSuggestionsInput,
  ): Promise<Suggestion[]> {
    const analysis = await this.analysisRepository.getAnalysisWithSuggestions(
      input.analysisId,
    );
    if (!analysis || analysis.userId !== userId) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Analysis not found",
      );
    }

    const { suggestions } = await this.rewriteAgent.rewriteBullet({
      originalBullet: input.originalBullet,
      jobRequirements: input.jobRequirements,
    });

    return this.analysisRepository.saveSuggestions(
      input.analysisId,
      suggestions.map((suggested) => ({
        original: input.originalBullet,
        suggested,
        section: null,
        status: "pending",
      })),
    );
  }

  async updateSuggestionStatus(
    suggestionId: string,
    status: "applied" | "rejected",
    rejectionReason?: string,
  ): Promise<Suggestion> {
    return this.analysisRepository.updateSuggestionStatus(
      suggestionId,
      status,
      rejectionReason,
    );
  }

  async getAnalysisById(
    userId: string,
    analysisId: string,
  ): Promise<Analysis & { suggestions: Suggestion[] }> {
    const analysis =
      await this.analysisRepository.getAnalysisWithSuggestions(analysisId);
    if (!analysis || analysis.userId !== userId) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Analysis not found",
      );
    }
    return analysis;
  }

  // Merge-on-READ: applies accepted suggestions onto the resume's structured
  // data via naive string replacement. Fragile by design — this is a stopgap
  // until bullets are individually addressable (per-bullet IDs), at which point
  // this becomes a structured merge instead of text substitution.
  //
  // Lives in the analyses service (not resumes) because the merge depends on
  // analysis-derived suggestions, though it operates on a resume resource.
  async getMergedResume(userId: string, resumeId: string): Promise<unknown> {
    const resume = await this.resumeRepository.findByIdAndUserId(
      userId,
      resumeId,
    );
    if (!resume) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Resume not found",
      );
    }

    const applied =
      await this.analysisRepository.findAppliedSuggestionsByResumeId(resumeId);
    return this.applySuggestions(resume.structuredResume, applied);
  }

  private applySuggestions(
    base: Prisma.JsonValue,
    suggestions: Suggestion[],
  ): unknown {
    let merged = JSON.stringify(base);
    for (const suggestion of suggestions) {
      merged = merged.split(suggestion.original).join(suggestion.suggested);
    }
    return JSON.parse(merged);
  }
}
