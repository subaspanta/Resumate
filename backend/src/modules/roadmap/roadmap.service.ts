import { Prisma } from "../../generated/client/index.js";
import { AppError } from "../../types/app-error.js";
import { ERROR_CODES } from "../../constants/error-codes.js";
import { HTTP_STATUS } from "../../constants/http-status.js";
import { CareerAnalysisRepository } from "../career-analysis/career-analysis.repository.js";
import { RoleSnapshot } from "../career-analysis/career-analysis.types.js";
import { validateRoadmapGrounding } from "../../utils/career-output-validator.js";
import { StructuredResume } from "../parsing/parsing.types.js";
import {
  RoadmapRepository,
  RoadmapWithTasks,
} from "./roadmap.repository.js";
import { RoadmapAgent, RoadmapGapBrief } from "./roadmap.types.js";
import {
  buildRoadmapSchedule,
  DEFAULT_ROADMAP_WEEKS,
} from "./roadmap-ordering.js";

export class RoadmapService {
  constructor(
    private readonly roadmapRepository: RoadmapRepository,
    private readonly careerAnalysisRepository: CareerAnalysisRepository,
    private readonly roadmapAgent: RoadmapAgent,
  ) {}

  // Generates the roadmap for one analysis.
  //
  //   1. ownership + state checks    (application)
  //   2. select the top gaps          (application — deterministic)
  //   3. assign weeks by position     (application — deterministic)
  //   4. ask the model for content    (AI)
  //   5. validate it addressed exactly what it was given
  //   6. persist atomically
  //
  // The model never sees priority or week, so it cannot influence either.
  async generateRoadmap(
    userId: string,
    analysisId: string,
  ): Promise<RoadmapWithTasks> {
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

    // Never silently replace. A second roadmap would either orphan the first
    // or discard task completions the user earned, and neither is something to
    // do as a side effect of a POST. Regeneration, if it ever ships, must be
    // an explicit operation with explicit replacement semantics.
    if (await this.roadmapRepository.existsForAnalysis(analysisId)) {
      throw new AppError(
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.ROADMAP_ALREADY_EXISTS,
        "This analysis already has a roadmap",
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
    if (analysis.status !== "complete") {
      throw new AppError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        ERROR_CODES.VALIDATION_FAILED,
        "This analysis has not finished successfully yet",
      );
    }

    // Deterministic: sort by the priority the application computed, drop
    // skills already rated strong, take the top N, one per week.
    const scheduled = buildRoadmapSchedule(
      analysis.gaps.map((gap) => ({
        id: gap.id,
        slug: gap.skill.slug,
        name: gap.skill.name,
        priority: gap.priority,
        status: gap.status,
      })),
      DEFAULT_ROADMAP_WEEKS,
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

    const gapBriefs: RoadmapGapBrief[] = scheduled.map((gap) => ({
      skillSlug: gap.slug,
      skillName: gap.name,
      status: gap.status,
      rationale: rationaleBySlug.get(gap.slug) ?? "",
    }));

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

    return this.roadmapRepository.createWithTasks({
      careerAnalysisId: analysisId,
      weekCount: DEFAULT_ROADMAP_WEEKS,
      tasks: scheduled.map((gap) => {
        const content = contentBySlug.get(gap.slug)!;
        return {
          skillGapId: gap.id,
          // Week and order come from the application's schedule, never from
          // the model's response ordering.
          weekNumber: gap.weekNumber,
          orderInWeek: gap.orderInWeek,
          title: content.title,
          description: [
            content.description,
            `Build: ${content.projectTask}`,
            `Evidence: ${content.expectedEvidence}`,
          ].join("\n\n"),
          resources: content.resources as unknown as Prisma.InputJsonValue,
        };
      }),
    });
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
    // An analysis without a roadmap yet is a normal state, not an error.
    return this.roadmapRepository.findByAnalysisId(analysisId);
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
