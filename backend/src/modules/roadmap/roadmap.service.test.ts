import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "../../lib/prisma.js";
import { RoadmapRepository } from "./roadmap.repository.js";
import { RoadmapService } from "./roadmap.service.js";
import { CareerAnalysisRepository } from "../career-analysis/career-analysis.repository.js";
import { CareerAnalysisService } from "../career-analysis/career-analysis.service.js";
import { ResumeRepository } from "../resume/resume.repository.js";
import { RoleRepository } from "../role/role.repository.js";
import { RoleService } from "../role/role.service.js";
import { AppError } from "../../types/app-error.js";
import {
  EvidenceAgent,
  EvidenceAgentInput,
} from "../career-analysis/career-analysis.types.js";
import {
  RoadmapAgent,
  RoadmapAgentInput,
  RoadmapAgentOutput,
} from "./roadmap.types.js";

const REAL_BULLET =
  "Built and shipped REST endpoints in Node.js backed by PostgreSQL";

// Writes one task per gap it is handed — a well-behaved model.
function fakeRoadmapAgent(
  override?: (input: RoadmapAgentInput) => RoadmapAgentOutput,
): RoadmapAgent & { lastInput?: RoadmapAgentInput } {
  const agent = {
    lastInput: undefined as RoadmapAgentInput | undefined,
    async generateTasks(input: RoadmapAgentInput) {
      agent.lastInput = input;
      if (override) return override(input);
      return {
        tasks: input.gaps.map((gap) => ({
          skillSlug: gap.skillSlug,
          title: `Learn ${gap.skillName}`,
          description: `Close the ${gap.skillName} gap.`,
          projectTask: "Extend your existing project.",
          expectedEvidence: "A commit and a short README section.",
          resources: ["official docs"],
        })),
      };
    },
  };
  return agent;
}

// Reports one grounded quote for nodejs, nothing for anything else — enough
// to leave real gaps for a roadmap to address.
const evidenceAgent: EvidenceAgent = {
  async assessEvidence(input: EvidenceAgentInput) {
    return {
      assessments: input.requiredSkills.map((skill) =>
        skill.slug === "nodejs"
          ? {
              skillSlug: skill.slug,
              found: true,
              evidence: [
                {
                  quote: REAL_BULLET,
                  strength: "experience_backed" as const,
                  sourceSection: "experience" as const,
                  sourceIndex: 0,
                },
              ],
            }
          : { skillSlug: skill.slug, found: false, evidence: [] },
      ),
    };
  },
};

function buildRoadmapService(agent: RoadmapAgent) {
  return new RoadmapService(
    new RoadmapRepository(),
    new CareerAnalysisRepository(),
    agent,
  );
}

function buildAnalysisService() {
  return new CareerAnalysisService(
    new CareerAnalysisRepository(),
    new ResumeRepository(),
    new RoleService(new RoleRepository()),
    evidenceAgent,
  );
}

async function createUser(name: string) {
  return prisma.user.create({
    data: {
      name,
      email: `${name.toLowerCase()}-${crypto.randomUUID()}@example.com`,
      passwordHash: "irrelevant-for-this-test",
    },
  });
}

async function createResume(userId: string) {
  return prisma.resume.create({
    data: {
      userId,
      title: "Resume",
      originalFileName: "resume.pdf",
      mimeType: "application/pdf",
      fileSize: 1,
      fileUrl: "https://example.com/resume.pdf",
      rawText: "raw text",
      structuredResume: {
        summary: "Final-year student",
        experience: [
          {
            title: "Backend Intern",
            company: "Acme Corp",
            bullets: [REAL_BULLET],
          },
        ],
        projects: [
          { name: "Task Tracker", bullets: ["Built a CRUD task tracker"] },
        ],
        education: [],
        skills: [],
        certifications: [],
        customSections: [],
      },
    },
  });
}

// A complete analysis with real gaps, built through the real pipeline.
async function seedAnalysis(userId: string) {
  const resume = await createResume(userId);
  return buildAnalysisService().createAnalysis(
    userId,
    resume.id,
    "backend-engineer",
  );
}

describe("RoadmapService.generateRoadmap", () => {
  let userId: string;

  beforeAll(async () => {
    userId = (await createUser("RoadmapOwner")).id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("builds four weeks from the highest-priority gaps", async () => {
    const analysis = await seedAnalysis(userId);
    const roadmap = await buildRoadmapService(
      fakeRoadmapAgent(),
    ).generateRoadmap(userId, analysis.id);

    expect(roadmap.tasks).toHaveLength(4);
    expect(roadmap.tasks.map((t) => t.weekNumber)).toEqual([1, 2, 3, 4]);
    expect(roadmap.weekCount).toBe(4);
  });

  it("orders weeks by the priority the application computed", async () => {
    const analysis = await seedAnalysis(userId);
    const roadmap = await buildRoadmapService(
      fakeRoadmapAgent(),
    ).generateRoadmap(userId, analysis.id);

    const priorities = roadmap.tasks.map((t) => t.skillGap!.priority);
    expect([...priorities]).toEqual([...priorities].sort((a, b) => a - b));
  });

  it("never schedules a skill the candidate is already strong in", async () => {
    const analysis = await seedAnalysis(userId);
    const roadmap = await buildRoadmapService(
      fakeRoadmapAgent(),
    ).generateRoadmap(userId, analysis.id);

    // nodejs was the one grounded, strong skill.
    expect(roadmap.tasks.some((t) => t.skillGap!.skill.slug === "nodejs")).toBe(
      false,
    );
  });

  it("does not tell the model the week or priority of a gap", async () => {
    const analysis = await seedAnalysis(userId);
    const agent = fakeRoadmapAgent();
    await buildRoadmapService(agent).generateRoadmap(userId, analysis.id);

    const sentKeys = Object.keys(agent.lastInput!.gaps[0]).sort();
    expect(sentKeys).toEqual([
      "rationale",
      "skillName",
      "skillSlug",
      "status",
    ]);
  });

  it("gives the model the candidate's existing projects to extend", async () => {
    const analysis = await seedAnalysis(userId);
    const agent = fakeRoadmapAgent();
    await buildRoadmapService(agent).generateRoadmap(userId, analysis.id);

    expect(agent.lastInput!.existingProjects[0].name).toBe("Task Tracker");
  });

  it("creates tasks that are not already complete", async () => {
    const analysis = await seedAnalysis(userId);
    const roadmap = await buildRoadmapService(
      fakeRoadmapAgent(),
    ).generateRoadmap(userId, analysis.id);

    expect(roadmap.tasks.every((t) => t.completed === false)).toBe(true);
    expect(roadmap.tasks.every((t) => t.completedAt === null)).toBe(true);
  });

  it("rejects a second roadmap with 409 rather than replacing the first", async () => {
    const analysis = await seedAnalysis(userId);
    const service = buildRoadmapService(fakeRoadmapAgent());
    const first = await service.generateRoadmap(userId, analysis.id);

    await expect(
      service.generateRoadmap(userId, analysis.id),
    ).rejects.toMatchObject({
      statusCode: 409,
      code: "ROADMAP_ALREADY_EXISTS",
    });

    // The original roadmap and its tasks must be untouched.
    const still = await new RoadmapRepository().findByAnalysisId(analysis.id);
    expect(still!.id).toBe(first.id);
    expect(still!.tasks).toHaveLength(4);
  });

  it("preserves completed task state when a second generation is refused", async () => {
    const analysis = await seedAnalysis(userId);
    const service = buildRoadmapService(fakeRoadmapAgent());
    const roadmap = await service.generateRoadmap(userId, analysis.id);
    await service.setTaskCompletion(userId, roadmap.tasks[0].id, true);

    await expect(
      service.generateRoadmap(userId, analysis.id),
    ).rejects.toMatchObject({ code: "ROADMAP_ALREADY_EXISTS" });

    const task = await prisma.roadmapTask.findUnique({
      where: { id: roadmap.tasks[0].id },
    });
    expect(task!.completed).toBe(true);
    expect(task!.completedAt).not.toBeNull();
  });

  it("returns 403 for another user's analysis", async () => {
    const analysis = await seedAnalysis(userId);
    const intruder = await createUser("RoadmapIntruder");

    await expect(
      buildRoadmapService(fakeRoadmapAgent()).generateRoadmap(
        intruder.id,
        analysis.id,
      ),
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it("returns 404 for an analysis that does not exist", async () => {
    await expect(
      buildRoadmapService(fakeRoadmapAgent()).generateRoadmap(
        userId,
        crypto.randomUUID(),
      ),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it("refuses to build a roadmap from an unfinished analysis", async () => {
    const resume = await createResume(userId);
    const role = await prisma.role.findUniqueOrThrow({
      where: { slug: "backend-engineer" },
    });
    const pending = await prisma.careerAnalysis.create({
      data: {
        userId,
        resumeId: resume.id,
        roleId: role.id,
        status: "failed",
        resumeSnapshot: {},
        roleSnapshot: { slug: "backend-engineer", title: "x", skills: [] },
      },
    });

    await expect(
      buildRoadmapService(fakeRoadmapAgent()).generateRoadmap(
        userId,
        pending.id,
      ),
    ).rejects.toMatchObject({ statusCode: 422 });
  });

  it("rejects the roadmap when the model addresses an unselected skill", async () => {
    const analysis = await seedAnalysis(userId);
    const rogue = fakeRoadmapAgent((input) => ({
      tasks: [
        ...input.gaps.slice(1).map((gap) => ({
          skillSlug: gap.skillSlug,
          title: "T",
          description: "D",
          projectTask: "P",
          expectedEvidence: "E",
          resources: [],
        })),
        {
          skillSlug: "quantum-computing",
          title: "T",
          description: "D",
          projectTask: "P",
          expectedEvidence: "E",
          resources: [],
        },
      ],
    }));

    await expect(
      buildRoadmapService(rogue).generateRoadmap(userId, analysis.id),
    ).rejects.toMatchObject({ code: "AI_GROUNDING_FAILED" });

    // Nothing may have been written.
    expect(
      await new RoadmapRepository().findByAnalysisId(analysis.id),
    ).toBeNull();
  });

  it("rejects the roadmap when the model skips a selected skill", async () => {
    const analysis = await seedAnalysis(userId);
    const lazy = fakeRoadmapAgent((input) => ({
      tasks: input.gaps.slice(0, 2).map((gap) => ({
        skillSlug: gap.skillSlug,
        title: "T",
        description: "D",
        projectTask: "P",
        expectedEvidence: "E",
        resources: [],
      })),
    }));

    await expect(
      buildRoadmapService(lazy).generateRoadmap(userId, analysis.id),
    ).rejects.toThrow(AppError);
  });
});

describe("RoadmapService.setTaskCompletion", () => {
  let ownerId: string;
  let intruderId: string;
  let taskId: string;

  beforeAll(async () => {
    ownerId = (await createUser("TaskOwner")).id;
    intruderId = (await createUser("TaskIntruder")).id;
    const analysis = await seedAnalysis(ownerId);
    const roadmap = await buildRoadmapService(
      fakeRoadmapAgent(),
    ).generateRoadmap(ownerId, analysis.id);
    taskId = roadmap.tasks[0].id;
  });

  it("marks a task complete and stamps completedAt server-side", async () => {
    const updated = await buildRoadmapService(
      fakeRoadmapAgent(),
    ).setTaskCompletion(ownerId, taskId, true);

    expect(updated.completed).toBe(true);
    expect(updated.completedAt).toBeInstanceOf(Date);
  });

  it("clears completedAt when a task is un-completed", async () => {
    const service = buildRoadmapService(fakeRoadmapAgent());
    await service.setTaskCompletion(ownerId, taskId, true);
    const updated = await service.setTaskCompletion(ownerId, taskId, false);

    expect(updated.completed).toBe(false);
    expect(updated.completedAt).toBeNull();
  });

  it("returns 403 for a task belonging to someone else", async () => {
    await expect(
      buildRoadmapService(fakeRoadmapAgent()).setTaskCompletion(
        intruderId,
        taskId,
        true,
      ),
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it("returns 404 for a task that does not exist", async () => {
    await expect(
      buildRoadmapService(fakeRoadmapAgent()).setTaskCompletion(
        ownerId,
        crypto.randomUUID(),
        true,
      ),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it("records an event only on a real transition", async () => {
    const analysis = await seedAnalysis(ownerId);
    const service = buildRoadmapService(fakeRoadmapAgent());
    const roadmap = await service.generateRoadmap(ownerId, analysis.id);
    const target = roadmap.tasks[0].id;

    await service.setTaskCompletion(ownerId, target, true);
    // Same value again — a no-op PATCH must not pad the audit timeline.
    await service.setTaskCompletion(ownerId, target, true);

    const events = await prisma.analysisEvent.count({
      where: { careerAnalysisId: analysis.id, type: "task_completed" },
    });
    expect(events).toBe(1);
  });
});
