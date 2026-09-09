import { Prisma } from "../../generated/client/index.js";
import { AppError } from "../../types/app-error.js";
import { ERROR_CODES } from "../../constants/error-codes.js";
import { HTTP_STATUS } from "../../constants/http-status.js";
import { CareerAnalysisService } from "../career-analysis/career-analysis.service.js";
import { RoleSnapshot } from "../career-analysis/career-analysis.types.js";
import { validateRoadmapGrounding } from "../../utils/career-output-validator.js";
import { StructuredResume } from "../parsing/parsing.types.js";
import { RoadmapRepository, RoadmapWithTasks } from "./roadmap.repository.js";
import { RoadmapAgent, RoadmapGapBrief } from "./roadmap.types.js";
import {
  buildRoadmapSchedule,
  DEFAULT_MAX_SCHEDULED_GAPS,
} from "./roadmap-ordering.js";

export class RoadmapService {
  // CareerAnalysisService owns analysis authorization.
  constructor(
    private readonly roadmapRepository: RoadmapRepository,
    private readonly careerAnalysisService: CareerAnalysisService,
    private readonly roadmapAgent: RoadmapAgent,
  ) {}

  // Application selects and schedules gaps; AI supplies only task content.
  async generateRoadmap(
    userId: string,
    analysisId: string,
  ): Promise<RoadmapWithTasks> {
    await this.careerAnalysisService.assertAnalysisOwner(userId, analysisId);

    // Never replace a roadmap implicitly; completions must survive retries.
    if (await this.roadmapRepository.existsForAnalysis(analysisId)) {
      throw new AppError(
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.ROADMAP_ALREADY_EXISTS,
        "This analysis already has a roadmap",
      );
    }

    // Load only roadmap inputs; the service rechecks ownership.
    const analysis =
      await this.careerAnalysisService.getAnalysisForRoadmapGeneration(
        userId,
        analysisId,
      );
    if (analysis.status !== "complete") {
      throw new AppError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        ERROR_CODES.VALIDATION_FAILED,
        "This analysis has not finished successfully yet",
      );
    }

    // Select and schedule gaps deterministically from application-owned priority.
    const scheduled = buildRoadmapSchedule(
      analysis.gaps.map((gap) => ({
        id: gap.id,
        slug: gap.skill.slug,
        name: gap.skill.name,
        priority: gap.priority,
        status: gap.status,
      })),
      DEFAULT_MAX_SCHEDULED_GAPS,
    );

    if (scheduled.length === 0) {
      throw new AppError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        ERROR_CODES.VALIDATION_FAILED,
        "This analysis has no gaps that need work — nothing to build a roadmap from",
      );
    }

    const roleSnapshot = analysis.roleSnapshot as unknown as RoleSnapshot;
    const rationaleBySlug = new Map(
      roleSnapshot.skills.map((skill) => [skill.slug, skill.rationale]),
    );

    // Every scheduled gap was built from this same roleSnapshot a few lines
    // up, so a miss here means the snapshot and the gaps it produced disagree
    // — an invariant violation, not a normal absence. Silently sending an
    // empty rationale to the model would let the roadmap prose go out
    // unexplained instead of surfacing the bug that caused it. Failing before
    // the Gemini call means a broken snapshot never costs an API call.
    const gapBriefs: RoadmapGapBrief[] = scheduled.map((gap) => {
      const rationale = rationaleBySlug.get(gap.slug);
      if (rationale === undefined) {
        throw new AppError(
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          ERROR_CODES.INTERNAL_SERVER_ERROR,
          "Role snapshot is missing a rationale for a scheduled skill",
          { skillSlug: gap.slug },
        );
      }
      return {
        skillSlug: gap.slug,
        skillName: gap.name,
        status: gap.status,
        rationale,
      };
    });

    const output = await this.roadmapAgent.generateTasks({
      roleTitle: roleSnapshot.title,
      gaps: gapBriefs,
      existingProjects: this.summarizeProjects(
        analysis.resumeSnapshot as unknown as StructuredResume,
      ),
    });

    // Throws unless the model wrote exactly one task per selected gap and no
    // others. Weeks are assigned by position below, so a wrong or missing task
    // would silently mislabel every week after it.
    const tasks = validateRoadmapGrounding(output.tasks, {
      selectedSkillSlugs: scheduled.map((gap) => gap.slug),
    });

    const contentBySlug = new Map(tasks.map((task) => [task.skillSlug, task]));

    try {
      return await this.roadmapRepository.createWithTasks({
        careerAnalysisId: analysisId,
        // The actual number of weeks scheduled, not the cap. A candidate with
        // fewer than DEFAULT_ROADMAP_WEEKS gaps left to address gets a
        // shorter roadmap, and the persisted weekCount must say so — a stored
        // 4 next to 2 tasks would claim two blank weeks that don't exist.
        weekCount: scheduled.length,
        tasks: scheduled.map((gap) => {
          const content = contentBySlug.get(gap.slug)!;
          return {
            skillGapId: gap.id,
            // Week and order come from the application's schedule, never from
            // the model's response ordering.
            weekNumber: gap.weekNumber,
            orderInWeek: gap.orderInWeek,
            title: content.title,
            description: content.description,
            // Kept as their own columns rather than concatenated into
            // description: they are separately capped by the agent schema, and
            // the client needs to render "what to build" and "what proves it"
            // distinctly.
            projectTask: content.projectTask,
            expectedEvidence: content.expectedEvidence,
            resources: content.resources as unknown as Prisma.InputJsonValue,
          };
        }),
      });
    } catch (error) {
      // A concurrent generation won the race between existsForAnalysis and
      // this write. The unique constraint on Roadmap.careerAnalysisId is the
      // actual guard; without this mapping the loser would surface as a
      // generic 500 for a state the API already has a code for.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError(
          HTTP_STATUS.CONFLICT,
          ERROR_CODES.ROADMAP_ALREADY_EXISTS,
          "This analysis already has a roadmap",
        );
      }
      throw error;
    }
  }

  // Gives the model enough of each project to extend it, without sending the
  // whole resume a second time.
  private summarizeProjects(
    resume: StructuredResume,
  ): { name: string; summary: string }[] {
    return (resume.projects ?? []).slice(0, 5).map((project) => ({
      name: project.name,
      summary: (project.bullets ?? []).join(" ").slice(0, 300),
    }));
  }

  async getRoadmapForAnalysis(
    userId: string,
    analysisId: string,
  ): Promise<RoadmapWithTasks | null> {
    // A roadmap is only ever attached to the ROOT analysis — a reassessment
    // revision never gets its own row. Resolving here means viewing a
    // revision's page still finds the same roadmap the root sees, instead of
    // reading back null for a roadmap that genuinely exists. One call does
    // both the ownership check and the root resolution — see
    // resolveOwnedRootAnalysisId.
    const rootId = await this.careerAnalysisService.resolveOwnedRootAnalysisId(
      userId,
      analysisId,
    );
    // An analysis without a roadmap yet is a normal state, not an error.
    return this.roadmapRepository.findByAnalysisId(rootId);
  }

  async getRoadmapById(
    userId: string,
    roadmapId: string,
  ): Promise<RoadmapWithTasks> {
    const owner = await this.roadmapRepository.findByIdWithOwner(roadmapId);
    if (!owner) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Roadmap not found",
      );
    }
    if (owner.careerAnalysis.userId !== userId) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
        "You do not have access to this roadmap",
      );
    }

    const roadmap = await this.roadmapRepository.findById(roadmapId);
    if (!roadmap) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Roadmap not found",
      );
    }
    return roadmap;
  }

  // Two-hop ownership: task -> roadmap -> careerAnalysis.userId. Read decides
  // 403 vs 404 (a UX concern); the write carries its own ownership filter (the
  // actual security boundary).
  async setTaskCompletion(
    userId: string,
    taskId: string,
    completed: boolean,
    completionNote?: string,
  ) {
    const existing = await this.roadmapRepository.findTaskWithOwner(taskId);
    if (!existing) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Task not found",
      );
    }
    if (existing.roadmap.careerAnalysis.userId !== userId) {
      throw new AppError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_CODES.FORBIDDEN,
        "You do not have access to this task",
      );
    }

    const updated = await this.roadmapRepository.setTaskCompletion(
      taskId,
      userId,
      completed,
      completionNote,
    );
    // Null means the row was deleted or reassigned between the read above and
    // this write — treat it as gone rather than reporting a success that did
    // not happen.
    if (!updated) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "Task not found",
      );
    }

    // Audit only a real transition. A no-op PATCH re-sending the current value
    // should not pad the timeline with events that imply the user did
    // something.
    if (existing.completed !== completed) {
      await this.roadmapRepository.recordTaskEvent(
        existing.roadmap.careerAnalysis.id,
        completed,
        taskId,
      );
    }

    return updated;
  }
}
