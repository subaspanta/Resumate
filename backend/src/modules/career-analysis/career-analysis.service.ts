import { Prisma } from "../../generated/client/index.js";
import { AppError } from "../../types/app-error.js";
import { ERROR_CODES } from "../../constants/error-codes.js";
import { HTTP_STATUS } from "../../constants/http-status.js";
import { ResumeRepository } from "../resume/resume.repository.js";
import { RoleService } from "../role/role.service.js";
import { buildRoleSnapshot } from "../role/role-snapshot.js";
import { normalizeStructuredResume } from "../parsing/normalize-resume.js";
import { validateEvidenceGrounding } from "../../utils/career-output-validator.js";
import { logger } from "../../config/logger.js";
import {
  CareerAnalysisRepository,
  CareerAnalysisWithResults,
  CompletedCareerAnalysis,
  STALE_ANALYSIS_AFTER_MS,
} from "./career-analysis.repository.js";
import { mapAssessmentsToGaps } from "./evidence-mapping.js";
import { EvidenceAgent } from "./career-analysis.types.js";

export class CareerAnalysisService {
  constructor(
    private readonly careerAnalysisRepository: CareerAnalysisRepository,
    private readonly resumeRepository: ResumeRepository,
    private readonly roleService: RoleService,
    private readonly evidenceAgent: EvidenceAgent,
  ) {}

  // The full analysis pipeline. The ordering is the product's core guarantee,
  // so it is worth stating plainly:
  //
  //   1. load + freeze inputs        (application)
  //   2. ask the model for evidence  (AI)
  //   3. GROUND that evidence        (validator)  <- the seam
  //   4. derive status/priority      (application)
  //   5. score readiness             (application)
  //   6. persist atomically          (application)
  //
  // Nothing between steps 3 and 6 consults the model, and nothing before step
  // 3 is trusted.
  async createAnalysis(
    userId: string,
    resumeId: string,
    roleSlug: string,
  ): Promise<CompletedCareerAnalysis> {
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

    // Throws 404 on an unknown slug, so a bad role can never reach the prompt.
    const role = await this.roleService.getRoleBySlug(roleSlug);

    if (role.requirements.length === 0) {
      throw new AppError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        ERROR_CODES.VALIDATION_FAILED,
        "This role has no skill requirements configured yet",
      );
    }

    // Freeze both inputs before doing anything with them. The resume is
    // normalized first because rows written by older builds can still hold a
    // pre-migration shape, and the snapshot is what every future read of this
    // analysis sees forever.
    const resumeSnapshot = normalizeStructuredResume(resume.structuredResume, {
      resumeId,
      source: "createCareerAnalysis",
    });
    const roleSnapshot = buildRoleSnapshot(role);

    const analysis = await this.careerAnalysisRepository.createPending({
      userId,
      resumeId,
      roleId: role.id,
      resumeSnapshot: resumeSnapshot as unknown as Prisma.InputJsonValue,
      roleSnapshot: roleSnapshot as unknown as Prisma.InputJsonValue,
    });

    try {
      const output = await this.evidenceAgent.assessEvidence({
        resume: resumeSnapshot,
        role: { title: role.title, description: role.description },
        // Vocabulary from the SNAPSHOT, not the live role rows — the prompt
        // and the grounding check must agree on one closed vocabulary.
        requiredSkills: roleSnapshot.skills.map((skill) => ({
          slug: skill.slug,
          name: skill.name,
          aliases: skill.aliases,
        })),
      });

      // The seam. Everything above is untrusted; everything below reads only
      // grounded evidence, and mapAssessmentsToGaps accepts no other type.
      const { assessments, rejections } = validateEvidenceGrounding(output, {
        roleSnapshot,
        resume: resumeSnapshot,
      });

      if (rejections.length > 0) {
        // Logged, never surfaced: over-rejection would otherwise show up only
        // as an unexplained low score. Details carry no resume content.
        logger.warn("Dropped ungrounded evidence during career analysis", {
          analysisId: analysis.id,
          rejected: rejections.length,
          reasons: rejections.map((r) => `${r.skillSlug}:${r.reason}`),
        });
      }

      const { gaps, readiness } = mapAssessmentsToGaps(
        assessments,
        roleSnapshot,
      );

      const skillIdBySlug = new Map(
        roleSnapshot.skills.map((skill) => [skill.slug, skill.skillId]),
      );

      return await this.careerAnalysisRepository.completeAnalysis({
        analysisId: analysis.id,
        readinessScore: readiness.score,
        readinessBreakdown: readiness as unknown as Prisma.InputJsonValue,
        evidence: assessments.flatMap((assessment) =>
          assessment.evidence.map((item) => ({
            skillId: skillIdBySlug.get(assessment.skillSlug)!,
            strength: item.strength,
            quote: item.quote,
            sourceSection: item.sourceSection,
            // Derived by the validator from the snapshot entry the model
            // cited — never model-authored.
            sourceLabel: item.sourceLabel,
          })),
        ),
        gaps: gaps.map((gap) => ({
          skillId: gap.skillId,
          status: gap.status,
          priority: gap.priority,
          reasoning: gap.reasoning,
        })),
      });
    } catch (error) {
      // Mark the row failed and let the original error propagate. The analysis
      // survives so the user sees a failed attempt rather than nothing, and
      // the retry path has something to point at.
      await this.markFailedQuietly(analysis.id, error);
      throw error;
    }
  }

  // A failure recording a failure must not replace the real error — that would
  // turn an honest "AI unavailable" into a confusing database error.
  //
  // The repository only transitions rows still in `analyzing`, so a failure
  // raised after the analysis already completed leaves the completed result
  // intact rather than marking a valid analysis failed.
  private async markFailedQuietly(
    analysisId: string,
    cause: unknown,
  ): Promise<void> {
    const reason =
      cause instanceof AppError ? cause.message : "Analysis failed unexpectedly";
    try {
      await this.careerAnalysisRepository.markFailed(analysisId, reason);
    } catch (markError) {
      logger.error("Failed to mark career analysis as failed", {
        analysisId,
        markError,
      });
    }
  }

  // The one place that decides who may touch an analysis.
  //
  // Public because RoadmapService needs the same rule: a roadmap is a
  // sub-resource of an analysis, so "may I read this roadmap" is really "may I
  // read its analysis". Having roadmap code ask this service — rather than
  // reach into CareerAnalysisRepository itself — means any ownership rule
  // added here applies to both modules automatically.
  //
  // 404 when absent, 403 when it exists but belongs to someone else. This is a
  // decision read only; every write still carries its own ownership predicate,
  // because the row can change owner or vanish between this check and the
  // write.
  async assertAnalysisOwner(userId: string, analysisId: string): Promise<void> {
    const owner =
      await this.careerAnalysisRepository.findByIdWithOwner(analysisId);
    if (!owner) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Analysis not found",
      );
    }
    if (owner.userId !== userId) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
        "You do not have access to this analysis",
      );
    }
  }

  // Fails this user's abandoned `analyzing` rows before a read returns them.
  //
  // V1 is synchronous: nothing but the originating request can finish an
  // analysis, so a row whose request died has no other way out of `analyzing`.
  // Reaping on read rather than on a timer keeps V1 free of a background
  // worker — a stale row is corrected the moment anyone would have seen it,
  // and a row nobody reads again harms nobody.
  //
  // Scoped to the caller's own rows: this runs on a user's read, so it must
  // not become a lever for touching anyone else's data.
  private async reapStaleAnalyses(userId: string): Promise<void> {
    const cutoff = new Date(Date.now() - STALE_ANALYSIS_AFTER_MS);
    try {
      const failed = await this.careerAnalysisRepository.failStaleAnalyses(
        userId,
        cutoff,
      );
      if (failed > 0) {
        logger.warn("Failed stale career analyses on read", { userId, failed });
      }
    } catch (error) {
      // Housekeeping must never break the read it was attached to. The row
      // stays stale and the next read tries again.
      logger.error("Could not reap stale career analyses", { userId, error });
    }
  }

  async getAnalysisById(
    userId: string,
    analysisId: string,
  ): Promise<CareerAnalysisWithResults> {
    await this.assertAnalysisOwner(userId, analysisId);
    await this.reapStaleAnalyses(userId);

    const analysis =
      await this.careerAnalysisRepository.findByIdWithResults(analysisId);
    if (!analysis) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Analysis not found",
      );
    }
    return analysis;
  }

  async listAnalyses(userId: string, resumeId?: string) {
    // Verify the resume belongs to the caller before filtering by it —
    // otherwise a foreign resumeId would silently return an empty list, which
    // reads as "no analyses" rather than "not yours".
    if (resumeId) {
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
    }

    // The list is where a user actually notices a stuck analysis, so reap
    // before building it rather than showing a spinner row that never resolves.
    await this.reapStaleAnalyses(userId);
    return this.careerAnalysisRepository.findManyByUserId(userId, { resumeId });
  }

  async deleteAnalysis(userId: string, analysisId: string): Promise<void> {
    await this.assertAnalysisOwner(userId, analysisId);

    const deleted = await this.careerAnalysisRepository.deleteByIdAndUserId(
      analysisId,
      userId,
    );
    if (!deleted) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Analysis not found",
      );
    }
  }
}
