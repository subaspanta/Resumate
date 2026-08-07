import { AnalysisRepository } from "./analysis.repository.js";
import { ResumeRepository } from "../resume/resume.repository.js";
import { AppError } from "../../types/app-error.js";
import { ERROR_CODES } from "../../constants/error-codes.js";
import { HTTP_STATUS } from "../../constants/http-status.js";
import { Analysis, Prisma, Suggestion } from "../../generated/client/index.js";
import {
  AnalysisResult,
  GenerateRewriteSuggestionsInput,
  JobParserAgent,
  ParsedJob,
  RewriteAgent,
  RewriteBulletInput,
  RewriteOutput,
  SuggestionSection,
} from "./analysis.types.js";
import { flattenSkills, matchSkills, SkillsMatch } from "./skills-match.js";
import { normalizeStructuredResume } from "../parsing/normalize-resume.js";
import { filterVisibleSections } from "../parsing/filter-resume-sections.js";
import { StructuredResume } from "../parsing/parsing.types.js";

const REWRITE_BY_SECTION: Record<
  SuggestionSection,
  (agent: RewriteAgent, input: RewriteBulletInput) => Promise<RewriteOutput>
> = {
  bullet: (agent, input) => agent.rewriteBullet(input),
  project: (agent, input) => agent.rewriteProject(input),
  summary: (agent, input) => agent.rewriteSummary(input),
};

export class AnalysisService {
  constructor(
    private readonly analysisRepository: AnalysisRepository,
    private readonly resumeRepository: ResumeRepository,
    private readonly jobParserAgent: JobParserAgent,
    private readonly rewriteAgent: RewriteAgent,
  ) {}

  // Persisting step — runs the job parser, then writes an Analysis row
  // snapshotting the resume and storing the AI results.
  async createAnalysis(
    userId: string,
    resumeId: string,
    jobDescription: string,
  ): Promise<{
    analysisId: string;
    parsedJob: ParsedJob;
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

    const analysisResult: AnalysisResult = { parsedJob };

    // Normalize before freezing the snapshot — resume.structuredResume is a
    // Json column that may still hold a pre-migration shape (e.g. flat
    // string[] skills). Without this, that shape is what every future read
    // of this analysis sees forever, since the snapshot never changes again.
    const normalizedResume = normalizeStructuredResume(
      resume.structuredResume,
      { resumeId, source: "createAnalysis" },
    );

    const analysisId = await this.analysisRepository.createAnalysis({
      resumeId,
      userId,
      jobDescription,
      parsedJob: parsedJob as unknown as Prisma.InputJsonValue,
      resumeSnapshot: normalizedResume as unknown as Prisma.InputJsonValue,
      analysisResult: analysisResult as unknown as Prisma.InputJsonValue,
    });

    return { analysisId, parsedJob };
  }

  // Persisting step — verifies ownership, runs the rewrite agent (validator runs
  // internally), and saves the surviving suggestions as pending rows.
  async generateRewriteSuggestions(
    userId: string,
    input: GenerateRewriteSuggestionsInput,
  ): Promise<Suggestion[]> {
    const analysis = await this.analysisRepository.findAnalysisWithSuggestions(
      input.analysisId,
    );
    if (!analysis || analysis.userId !== userId) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Analysis not found",
      );
    }

    const jobContext = analysis.parsedJob as unknown as ParsedJob;

    const { suggestions } = await REWRITE_BY_SECTION[input.section](
      this.rewriteAgent,
      {
        originalBullet: input.originalBullet,
        jobContext,
      },
    );

    return this.analysisRepository.saveSuggestions(
      input.analysisId,
      suggestions.map((suggested) => ({
        original: input.originalBullet,
        suggested,
        section: input.section,
        status: "pending",
      })),
    );
  }

  // A resume with zero analyses is a normal state, not an error — only a
  // missing/foreign resume is 404. Returns null (not a thrown error) when
  // the resume exists but has never been analyzed.
  async getLatestAnalysisForResume(
    userId: string,
    resumeId: string,
  ): Promise<Analysis | null> {
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
    const analysis =
      await this.analysisRepository.findLatestByResumeId(resumeId);
    if (!analysis) return null;

    return {
      ...analysis,
      resumeSnapshot: normalizeStructuredResume(analysis.resumeSnapshot, {
        resumeId,
        source: "getLatestAnalysisForResume",
      }) as unknown as Prisma.JsonValue,
    };
  }

  async getAnalysisHistory(
    userId: string,
    resumeId: string,
  ): Promise<
    Pick<Analysis, "id" | "resumeId" | "jobDescription" | "createdAt">[]
  > {
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
    return this.analysisRepository.findManyByResumeId(resumeId);
  }

  async deleteAnalysis(userId: string, analysisId: string): Promise<void> {
    const analysis =
      await this.analysisRepository.findAnalysisWithSuggestions(analysisId);
    if (!analysis || analysis.userId !== userId) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Analysis not found",
      );
    }
    await this.analysisRepository.deleteById(analysisId);
  }

  async updateSuggestionStatus(
    userId: string,
    suggestionId: string,
    status: "applied" | "rejected",
    rejectionReason?: string,
  ): Promise<Suggestion> {
    const existing =
      await this.analysisRepository.findSuggestionWithOwner(suggestionId);
    if (!existing) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Suggestion not found",
      );
    }
    if (existing.analysis.userId !== userId) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
        "You do not have access to this suggestion",
      );
    }

    const updated = await this.analysisRepository.updateSuggestionStatus(
      suggestionId,
      userId,
      status,
      rejectionReason,
    );
    if (!updated) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Suggestion not found",
      );
    }
    return updated;
  }

  async getAnalysisById(
    userId: string,
    analysisId: string,
  ): Promise<
    Analysis & { suggestions: Suggestion[]; skillsMatch: SkillsMatch }
  > {
    const analysis =
      await this.analysisRepository.findAnalysisWithSuggestions(analysisId);
    if (!analysis || analysis.userId !== userId) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Analysis not found",
      );
    }

    // Normalize once and reuse: rows written before createAnalysis started
    // normalizing (or before this fix existed at all) can still carry a
    // pre-migration resumeSnapshot shape, so every read has to defend, not
    // just the skills-match calculation below.
    const normalizedSnapshot = normalizeStructuredResume(
      analysis.resumeSnapshot,
      { resumeId: analysis.resumeId, source: "getAnalysisById" },
    );
    const resumeSkills = flattenSkills(normalizedSnapshot.skills);
    const jobSkills =
      (analysis.parsedJob as { skills?: string[] } | null)?.skills ?? [];

    return {
      ...analysis,
      resumeSnapshot: normalizedSnapshot as unknown as Prisma.JsonValue,
      skillsMatch: matchSkills(resumeSkills, jobSkills),
    };
  }

  // Merge-on-READ: applies accepted suggestions onto the resume's structured
  // data via naive string replacement. Fragile by design — this is a stopgap
  // until bullets are individually addressable (per-bullet IDs), at which point
  // this becomes a structured merge instead of text substitution.
  //
  // Lives in the analyses service (not resumes) because the merge depends on
  // analysis-derived suggestions, though it operates on a resume resource.
  async mergeAcceptedSuggestions(
    userId: string,
    resumeId: string,
  ): Promise<StructuredResume> {
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
    // Normalize AFTER the merge: applySuggestions substitutes over the raw
    // serialized JSON, so it has to see the stored text unchanged. Section
    // visibility is applied last since it filters the normalized shape, not
    // the raw JSON the merge operates on.
    const merged = normalizeStructuredResume(
      this.applySuggestions(resume.structuredResume, applied),
      { resumeId, source: "mergeAcceptedSuggestions" },
    );
    return filterVisibleSections(merged, resume.enabledSections);
  }

  // Ownership check happens inside mergeAcceptedSuggestions — kept as a separate
  // method (not folded into mergeAcceptedSuggestions itself) so the write is an
  // explicit, visible step at the export call site rather than a hidden
  // side effect of a read-named method.
  async exportResume(
    userId: string,
    resumeId: string,
  ): Promise<StructuredResume> {
    const merged = await this.mergeAcceptedSuggestions(userId, resumeId);
    await this.analysisRepository.markLatestExported(resumeId);
    return merged;
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
