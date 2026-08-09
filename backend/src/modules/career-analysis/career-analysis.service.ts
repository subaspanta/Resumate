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
import { EvidenceAgent, RoleSnapshot } from "./career-analysis.types.js";
import { CompletedWorkReader } from "../roadmap/roadmap.repository.js";
import { buildReassessmentSourceItems } from "./resume-source-items.js";
import { StructuredResume } from "../parsing/parsing.types.js";

export class CareerAnalysisService {
  constructor(
    private readonly careerAnalysisRepository: CareerAnalysisRepository,
    private readonly resumeRepository: ResumeRepository,
    private readonly roleService: RoleService,
    private readonly evidenceAgent: EvidenceAgent,
    // Narrow read-only port onto the roadmap module, needed only for
    // reassessment (reads which tasks are completed and their notes).
    // Deliberately not RoadmapService: RoadmapService already depends on this
    // service for ownership, so depending back would cycle container.ts.
    private readonly completedWorkReader: CompletedWorkReader,
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

  // Re-runs evidence assessment for an existing analysis after the user has
  // completed roadmap work, producing a new revision rather than mutating the
  // original.
  //
  //   1. ownership                              (application, before any AI call)
  //   2. load root + validate state              (application)
  //   3. check the eligibility clock              (application)
  //   4. reuse the FROZEN snapshots               (application — no re-parse)
  //   5. ask the model, now with completion notes (AI — same evidence agent)
  //   6. GROUND that evidence                     (validator — the seam, unchanged)
  //   7. derive status/priority, score, persist   (application — same functions)
  //
  // Explicitly NOT automatic on every task toggle — every AI call has a cost,
  // and firing one per checkbox click would burn the aiRateLimit budget on
  // noise. The user must ask for this.
  async reassessAnalysis(
    userId: string,
    analysisId: string,
  ): Promise<CompletedCareerAnalysis> {
    // Ownership before anything else, including any read that might trigger
    // an AI call further down.
    await this.assertAnalysisOwner(userId, analysisId);

    const root =
      await this.careerAnalysisRepository.findRootForReassessment(analysisId);
    // assertAnalysisOwner already proved this row (or its root) exists and
    // belongs to userId, so a miss here would be a race, not a normal 404.
    if (!root || root.userId !== userId) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Analysis not found",
      );
    }

    if (root.status !== "complete") {
      throw new AppError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        ERROR_CODES.VALIDATION_FAILED,
        "This analysis has not finished successfully yet",
      );
    }

    const completedTasks =
      await this.completedWorkReader.findCompletedTasksForAnalysis(root.id);
    if (completedTasks.length === 0) {
      throw new AppError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        ERROR_CODES.VALIDATION_FAILED,
        "Generate a roadmap and complete at least one task before reassessing",
      );
    }

    const latest = await this.careerAnalysisRepository.findLatestRevision(
      root.id,
    );
    // Each reassessment consumes the work that justified it: counting from
    // the latest revision (not from the original analysis) is what stops a
    // user pressing Reassess repeatedly on one already-counted task and
    // spending a Gemini call per click for an identical result.
    const since = latest?.createdAt ?? root.completedAt;
    const newlyCompleted = completedTasks.filter(
      (t) => t.completedAt && since && t.completedAt > since,
    );
    if (newlyCompleted.length === 0) {
      throw new AppError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        ERROR_CODES.VALIDATION_FAILED,
        "Complete at least one roadmap task since your last assessment before reassessing",
      );
    }

    // A completed checkbox with no note contributes nothing groundable — see
    // buildReassessmentSourceItems. Telling the user why up front is cheaper
    // than running a 60-second call that provably cannot move their score.
    const withNotes = newlyCompleted.filter((t) => t.completionNote?.trim());
    if (withNotes.length === 0) {
      throw new AppError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        ERROR_CODES.VALIDATION_FAILED,
        "Add a note describing what you built on at least one completed task — reassessment reads what you wrote, not the task description",
      );
    }

    // The parent's snapshots, verbatim — NOT a fresh read of
    // resume.structuredResume and NOT buildRoleSnapshot(role). A reassessment
    // must measure new work against the exact resume and role requirements
    // the original score meant. A changed resume is a new analysis, not a
    // reassessment.
    const resumeSnapshot = root.resumeSnapshot as unknown as StructuredResume;
    const roleSnapshot = root.roleSnapshot as unknown as RoleSnapshot;

    const revision = await this.careerAnalysisRepository.createPendingRevision(
      {
        parentAnalysisId: root.id,
        revision: (latest?.revision ?? 0) + 1,
        userId,
        resumeId: root.resumeId,
        roleId: root.roleId,
        resumeSnapshot: resumeSnapshot as unknown as Prisma.InputJsonValue,
        roleSnapshot: roleSnapshot as unknown as Prisma.InputJsonValue,
      },
    );

    try {
      const completedWork = withNotes.map((t) => ({
        skillName: t.skillGap?.skill.name ?? "Completed work",
        completionNote: t.completionNote!.trim(),
      }));

      const sourceItems = buildReassessmentSourceItems(
        resumeSnapshot,
        completedWork,
      );

      const output = await this.evidenceAgent.assessEvidence({
        resume: resumeSnapshot,
        role: { title: roleSnapshot.title, description: roleSnapshot.description },
        requiredSkills: roleSnapshot.skills.map((skill) => ({
          slug: skill.slug,
          name: skill.name,
          aliases: skill.aliases,
        })),
        sourceItems,
        completedWorkContext: withNotes.map((t) => ({
          skillName: t.skillGap?.skill.name ?? "Completed work",
          projectTask: t.projectTask,
          expectedEvidence: t.expectedEvidence,
        })),
      });

      // Same seam as createAnalysis: everything above is untrusted, and
      // sourceItems here is the exact object the prompt was rendered from, so
      // the validator's index lookups can't drift from what the model saw.
      const { assessments, rejections } = validateEvidenceGrounding(output, {
        roleSnapshot,
        resume: resumeSnapshot,
        sourceItems,
      });

      if (rejections.length > 0) {
        logger.warn("Dropped ungrounded evidence during reassessment", {
          analysisId: revision.id,
          rootAnalysisId: root.id,
          rejected: rejections.length,
          reasons: rejections.map((r) => `${r.skillSlug}:${r.reason}`),
        });
      }

      // Same deterministic functions as the original analysis, run against
      // the same roleSnapshot — that is what makes the two scores comparable.
      const { gaps, readiness } = mapAssessmentsToGaps(
        assessments,
        roleSnapshot,
      );

      const skillIdBySlug = new Map(
        roleSnapshot.skills.map((skill) => [skill.slug, skill.skillId]),
      );

      return await this.careerAnalysisRepository.completeAnalysis({
        analysisId: revision.id,
        readinessScore: readiness.score,
        readinessBreakdown: readiness as unknown as Prisma.InputJsonValue,
        evidence: assessments.flatMap((assessment) =>
          assessment.evidence.map((item) => ({
            skillId: skillIdBySlug.get(assessment.skillSlug)!,
            strength: item.strength,
            quote: item.quote,
            sourceSection: item.sourceSection,
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
      await this.markFailedQuietly(revision.id, error);
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

  // Resolves an analysis id that may be a reassessment revision to its root's
  // id. A Roadmap row is only ever attached to the root (Roadmap has one
  // careerAnalysisId, revisions never get their own), so any module reading
  // a roadmap "for this analysis" must look it up by root id regardless of
  // which revision the caller is actually viewing — otherwise a roadmap that
  // genuinely exists reads back as null the moment a reassessment exists.
  //
  // Public for the same reason assertAnalysisOwner is: RoadmapService needs
  // the same resolution and must not reach past this service into its
  // repository to get it.
  async resolveRootAnalysisId(analysisId: string): Promise<string> {
    const root =
      await this.careerAnalysisRepository.findRootForReassessment(analysisId);
    if (!root) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Analysis not found",
      );
    }
    return root.id;
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

  // Revision summaries for the before/after view. analysisId may be the root
  // or any of its revisions — both resolve to the same list.
  async getRevisions(userId: string, analysisId: string) {
    await this.assertAnalysisOwner(userId, analysisId);
    const root =
      await this.careerAnalysisRepository.findRootForReassessment(analysisId);
    if (!root || root.userId !== userId) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Analysis not found",
      );
    }
    return this.careerAnalysisRepository.findRevisionsByRootId(root.id);
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
