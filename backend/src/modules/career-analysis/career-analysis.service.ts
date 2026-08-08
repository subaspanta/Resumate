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
} from "./career-analysis.repository.js";
import { mapAssessmentsToGaps } from "./evidence-mapping.js";
import {
  EvidenceAgent,
  RoleSnapshot,
} from "./career-analysis.types.js";

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
  ): Promise<CareerAnalysisWithResults> {
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

  async getAnalysisById(
    userId: string,
    analysisId: string,
  ): Promise<CareerAnalysisWithResults> {
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
    return this.careerAnalysisRepository.findManyByUserId(userId, { resumeId });
  }

  async deleteAnalysis(userId: string, analysisId: string): Promise<void> {
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

  // Used by the roadmap module, which needs the frozen role vocabulary rather
  // than today's requirement rows.
  async getRoleSnapshot(analysisId: string): Promise<RoleSnapshot | null> {
    const analysis =
      await this.careerAnalysisRepository.findByIdWithResults(analysisId);
    if (!analysis) return null;
    return analysis.roleSnapshot as unknown as RoleSnapshot;
  }
}
