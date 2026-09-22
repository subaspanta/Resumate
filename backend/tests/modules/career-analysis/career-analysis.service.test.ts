import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "../../../src/lib/prisma.js";
import { logger } from "../../../src/config/logger.js";
import {
  CareerAnalysisRepository,
  STALE_ANALYSIS_AFTER_MS,
  STALE_ANALYSIS_REASON,
} from "../../../src/modules/career-analysis/career-analysis.repository.js";
import { CareerAnalysisService } from "../../../src/modules/career-analysis/career-analysis.service.js";
import { ResumeRepository } from "../../../src/modules/resume/resume.repository.js";
import { RoleRepository } from "../../../src/modules/role/role.repository.js";
import { RoleService } from "../../../src/modules/role/role.service.js";
import { AppError } from "../../../src/types/app-error.js";
import {
  EvidenceAgent,
  EvidenceAgentInput,
  EvidenceAgentOutput,
} from "../../../src/modules/career-analysis/career-analysis.types.js";
import {
  CompletedTaskRow,
  CompletedWorkReader,
} from "../../../src/modules/roadmap/roadmap.repository.js";

const REAL_BULLET =
  "Built and shipped REST endpoints in Node.js backed by PostgreSQL";
const REAL_PROJECT_BULLET =
  "Wrote integration tests for the checkout flow using Vitest";

// Fake agent: returns whatever the test scripts, and records what it was
// asked. No network, no Gemini key needed.
function fakeAgent(
  build: (input: EvidenceAgentInput) => EvidenceAgentOutput,
): EvidenceAgent & { lastInput?: EvidenceAgentInput } {
  const agent = {
    lastInput: undefined as EvidenceAgentInput | undefined,
    async assessEvidence(input: EvidenceAgentInput) {
      agent.lastInput = input;
      return build(input);
    },
  };
  return agent;
}

function failingAgent(error: unknown): EvidenceAgent {
  return {
    async assessEvidence() {
      throw error;
    },
  };
}

// Fake completed-work reader: returns whatever the test scripts, so
// reassessment tests never need a real Roadmap/RoadmapTask fixture.
function fakeCompletedWorkReader(
  rows: CompletedTaskRow[] = [],
): CompletedWorkReader {
  return {
    async findCompletedTasksForAnalysis() {
      return rows;
    },
  };
}

function buildService(
  agent: EvidenceAgent,
  completedWorkReader: CompletedWorkReader = fakeCompletedWorkReader(),
) {
  const roleRepository = new RoleRepository(prisma);
  return new CareerAnalysisService(
    new CareerAnalysisRepository(prisma),
    new ResumeRepository(prisma),
    new RoleService(roleRepository),
    agent,
    completedWorkReader,
    logger,
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
        projects: [{ name: "Shop", bullets: [REAL_PROJECT_BULLET] }],
        education: [],
        skills: [{ category: "Tools", items: ["Docker"] }],
        certifications: [],
        customSections: [],
      },
    },
  });
}

describe("CareerAnalysisService.createAnalysis", () => {
  let userId: string;
  let resumeId: string;

  beforeAll(async () => {
    const user = await createUser("CareerPipeline");
    userId = user.id;
    resumeId = (await createResume(userId)).id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("returns 404 for a resume belonging to someone else", async () => {
    const intruder = await createUser("CareerIntruder");
    const service = buildService(fakeAgent(() => ({ assessments: [] })));

    await expect(
      service.createAnalysis(intruder.id, resumeId, "backend-engineer"),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it("returns 404 for an unknown role before calling the model", async () => {
    const agent = fakeAgent(() => ({ assessments: [] }));
    const service = buildService(agent);

    await expect(
      service.createAnalysis(userId, resumeId, "underwater-basket-weaver"),
    ).rejects.toThrow(AppError);
    // The model must never be asked about a role that does not exist.
    expect(agent.lastInput).toBeUndefined();
  });

  it("scores grounded evidence and persists the breakdown", async () => {
    const service = buildService(
      fakeAgent((input) => ({
        assessments: input.requiredSkills.map((skill) => {
          if (skill.slug === "nodejs") {
            return {
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
            };
          }
          return { skillSlug: skill.slug, found: false, evidence: [] };
        }),
      })),
    );

    const analysis = await service.createAnalysis(
      userId,
      resumeId,
      "backend-engineer",
    );

    expect(analysis.status).toBe("complete");
    expect(analysis.readinessScore).toBeGreaterThan(0);
    expect(analysis.readinessBreakdown).toBeTruthy();

    const nodeGap = analysis.gaps.find((g) => g.skill.slug === "nodejs");
    expect(nodeGap?.status).toBe("strong");

    // completeAnalysis omits the snapshots from its return, so read the stored
    // row — which also proves the snapshot was actually persisted rather than
    // merely echoed back.
    const stored = await prisma.careerAnalysis.findUniqueOrThrow({
      where: { id: analysis.id },
      select: { roleSnapshot: true },
    });
    // Every other required skill still gets a row rather than vanishing.
    expect(analysis.gaps.length).toBe(
      (stored.roleSnapshot as unknown as { skills: unknown[] }).skills.length,
    );
  });

  it("derives sourceLabel from the snapshot, ignoring anything the model implies", async () => {
    const service = buildService(
      fakeAgent((input) => ({
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
      })),
    );

    const analysis = await service.createAnalysis(
      userId,
      resumeId,
      "backend-engineer",
    );
    const evidence = analysis.evidence.find((e) => e.skill.slug === "nodejs");

    expect(evidence?.sourceLabel).toBe("Backend Intern — Acme Corp");
  });

  it("drops hallucinated evidence and scores the skill as missing", async () => {
    const service = buildService(
      fakeAgent((input) => ({
        assessments: input.requiredSkills.map((skill) =>
          skill.slug === "docker"
            ? {
                skillSlug: skill.slug,
                found: true,
                evidence: [
                  {
                    quote: "Led migration of 40 microservices to Kubernetes",
                    strength: "experience_backed" as const,
                    sourceSection: "experience" as const,
                    sourceIndex: 0,
                  },
                ],
              }
            : { skillSlug: skill.slug, found: false, evidence: [] },
        ),
      })),
    );

    const analysis = await service.createAnalysis(
      userId,
      resumeId,
      "backend-engineer",
    );

    const dockerGap = analysis.gaps.find((g) => g.skill.slug === "docker");
    expect(dockerGap?.status).toBe("missing");
    // The invented quote must not have been written anywhere.
    expect(analysis.evidence.some((e) => e.quote.includes("Kubernetes"))).toBe(
      false,
    );
  });

  it("rejects the whole analysis when the model invents a skill", async () => {
    const service = buildService(
      fakeAgent(() => ({
        assessments: [
          { skillSlug: "quantum-computing", found: true, evidence: [] },
        ],
      })),
    );

    await expect(
      service.createAnalysis(userId, resumeId, "backend-engineer"),
    ).rejects.toMatchObject({ code: "AI_GROUNDING_FAILED" });
  });

  it("marks the analysis failed when the model call fails, and keeps the row", async () => {
    const service = buildService(
      failingAgent(new AppError(503, "GEMINI_API_ERROR", "AI unavailable")),
    );

    await expect(
      service.createAnalysis(userId, resumeId, "backend-engineer"),
    ).rejects.toMatchObject({ code: "GEMINI_API_ERROR" });

    const failed = await prisma.careerAnalysis.findFirst({
      where: { userId, status: "failed" },
      orderBy: { createdAt: "desc" },
    });
    expect(failed).not.toBeNull();
    expect(failed?.failureReason).toBe("AI unavailable");
  });

  // Regression: markFailed used to update on id alone, so any failure raised
  // after an analysis had completed would overwrite a valid result — real
  // gaps, evidence, and a score — with status "failed".
  it("never marks a completed analysis as failed", async () => {
    const analysis = await buildService(
      fakeAgent((input) => ({
        assessments: input.requiredSkills.map((skill) => ({
          skillSlug: skill.slug,
          found: false,
          evidence: [],
        })),
      })),
    ).createAnalysis(userId, resumeId, "backend-engineer");
    expect(analysis.status).toBe("complete");

    const repository = new CareerAnalysisRepository(prisma);
    const transitioned = await repository.markFailed(
      analysis.id,
      "late failure",
    );

    // The guard held: no transition, and the stored row is untouched.
    expect(transitioned).toBe(false);
    const stored = await prisma.careerAnalysis.findUniqueOrThrow({
      where: { id: analysis.id },
    });
    expect(stored.status).toBe("complete");
    expect(stored.failureReason).toBeNull();
    expect(stored.readinessScore).not.toBeNull();

    // And no analysis_failed event was logged for a failure that never
    // happened.
    const failedEvents = await prisma.analysisEvent.count({
      where: { careerAnalysisId: analysis.id, type: "analysis_failed" },
    });
    expect(failedEvents).toBe(0);
  });

  it("records an analysis_failed event when a real failure transitions the row", async () => {
    const service = buildService(
      failingAgent(new AppError(503, "GEMINI_API_ERROR", "AI unavailable")),
    );

    await expect(
      service.createAnalysis(userId, resumeId, "backend-engineer"),
    ).rejects.toMatchObject({ code: "GEMINI_API_ERROR" });

    const failed = await prisma.careerAnalysis.findFirstOrThrow({
      where: { userId, status: "failed" },
      orderBy: { createdAt: "desc" },
    });
    const events = await prisma.analysisEvent.count({
      where: { careerAnalysisId: failed.id, type: "analysis_failed" },
    });
    expect(events).toBe(1);
  });

  it("never sends importance or rationale to the model", async () => {
    const agent = fakeAgent((input) => ({
      assessments: input.requiredSkills.map((skill) => ({
        skillSlug: skill.slug,
        found: false,
        evidence: [],
      })),
    }));
    const service = buildService(agent);

    await service.createAnalysis(userId, resumeId, "backend-engineer");

    const sentKeys = Object.keys(agent.lastInput!.requiredSkills[0]);
    expect(sentKeys.sort()).toEqual(["aliases", "name", "slug"]);
  });

  it("freezes the role snapshot on the analysis", async () => {
    const agent = fakeAgent((input) => ({
      assessments: input.requiredSkills.map((skill) => ({
        skillSlug: skill.slug,
        found: false,
        evidence: [],
      })),
    }));
    const analysis = await buildService(agent).createAnalysis(
      userId,
      resumeId,
      "backend-engineer",
    );

    const stored = await prisma.careerAnalysis.findUniqueOrThrow({
      where: { id: analysis.id },
      select: { roleSnapshot: true },
    });
    const snapshot = stored.roleSnapshot as unknown as {
      slug: string;
      seedVersion: string;
      skills: { importance: string }[];
    };
    expect(snapshot.slug).toBe("backend-engineer");
    expect(snapshot.seedVersion).toBeTruthy();
    // Importance lives in the snapshot (the scorer needs it) even though it
    // was withheld from the prompt.
    expect(snapshot.skills[0].importance).toBeTruthy();
  });
});

describe("CareerAnalysisService ownership", () => {
  let ownerId: string;
  let intruderId: string;
  let analysisId: string;

  beforeAll(async () => {
    ownerId = (await createUser("CareerOwner")).id;
    intruderId = (await createUser("CareerOutsider")).id;
    const resume = await createResume(ownerId);

    const service = buildService(
      fakeAgent((input) => ({
        assessments: input.requiredSkills.map((skill) => ({
          skillSlug: skill.slug,
          found: false,
          evidence: [],
        })),
      })),
    );
    analysisId = (
      await service.createAnalysis(ownerId, resume.id, "frontend-engineer")
    ).id;
  });

  it("returns 403 when reading another user's analysis", async () => {
    const service = buildService(fakeAgent(() => ({ assessments: [] })));
    await expect(
      service.getAnalysisById(intruderId, analysisId),
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it("returns 404 for an analysis that does not exist", async () => {
    const service = buildService(fakeAgent(() => ({ assessments: [] })));
    await expect(
      service.getAnalysisById(ownerId, crypto.randomUUID()),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it("returns 403 when deleting another user's analysis", async () => {
    const service = buildService(fakeAgent(() => ({ assessments: [] })));
    await expect(
      service.deleteAnalysis(intruderId, analysisId),
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it("lists only the requesting user's analyses", async () => {
    const service = buildService(fakeAgent(() => ({ assessments: [] })));
    const mine = await service.listAnalyses(ownerId, { limit: 20 });
    const theirs = await service.listAnalyses(intruderId, { limit: 20 });

    expect(mine.items.some((a) => a.id === analysisId)).toBe(true);
    expect(theirs.items.some((a) => a.id === analysisId)).toBe(false);
  });

  it("returns 404 when filtering the list by someone else's resume", async () => {
    const service = buildService(fakeAgent(() => ({ assessments: [] })));
    const foreignResume = await createResume(ownerId);

    // An empty list would read as "no analyses" rather than "not yours".
    await expect(
      service.listAnalyses(intruderId, {
        resumeId: foreignResume.id,
        limit: 20,
      }),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it("reports hasRoadmap only for analyses that actually have one", async () => {
    const service = buildService(fakeAgent(() => ({ assessments: [] })));

    const beforeList = await service.listAnalyses(ownerId, { limit: 20 });
    const beforeRow = beforeList.items.find((a) => a.id === analysisId);
    expect(beforeRow?.hasRoadmap).toBe(false);

    await prisma.roadmap.create({
      data: { careerAnalysisId: analysisId },
    });

    const afterList = await service.listAnalyses(ownerId, { limit: 20 });
    const afterRow = afterList.items.find((a) => a.id === analysisId);
    expect(afterRow?.hasRoadmap).toBe(true);

    // Cleanup so later tests in this describe block (which also read
    // beforeAll's analysisId) see the pre-roadmap state they expect.
    await prisma.roadmap.delete({ where: { careerAnalysisId: analysisId } });
  });

  it("counts roadmap task progress on the list row", async () => {
    const service = buildService(fakeAgent(() => ({ assessments: [] })));

    const beforeRow = (
      await service.listAnalyses(ownerId, { limit: 20 })
    ).items.find((a) => a.id === analysisId);
    expect(beforeRow?.roadmapProgress).toBeNull();

    const roadmap = await prisma.roadmap.create({
      data: { careerAnalysisId: analysisId, weekCount: 2 },
    });
    await prisma.roadmapTask.createMany({
      data: [0, 1, 2].map((i) => ({
        roadmapId: roadmap.id,
        weekNumber: 1,
        orderInWeek: i,
        title: `Task ${i}`,
        description: "d",
        projectTask: "p",
        expectedEvidence: "e",
        // Only the first is done, so a count that ignored `completed` would
        // report 3 and pass a weaker assertion.
        completed: i === 0,
      })),
    });

    const afterRow = (
      await service.listAnalyses(ownerId, { limit: 20 })
    ).items.find((a) => a.id === analysisId);
    expect(afterRow?.roadmapProgress).toEqual({
      total: 3,
      completed: 1,
      weekCount: 2,
    });

    // Tasks cascade with the roadmap.
    await prisma.roadmap.delete({ where: { careerAnalysisId: analysisId } });
  });

  it("joins the role title onto the list row", async () => {
    const service = buildService(fakeAgent(() => ({ assessments: [] })));
    const row = (
      await service.listAnalyses(ownerId, { limit: 20 })
    ).items.find((a) => a.id === analysisId);

    // The dashboard renders this instead of fetching the whole role list to
    // map a uuid it already has.
    expect(row?.role.title).toBeTruthy();
    expect(row?.role.slug).toBeTruthy();
  });

  it("deletes the analysis and its results when the owner asks", async () => {
    const resume = await createResume(ownerId);
    const service = buildService(
      fakeAgent((input) => ({
        assessments: input.requiredSkills.map((skill) => ({
          skillSlug: skill.slug,
          found: false,
          evidence: [],
        })),
      })),
    );
    const created = await service.createAnalysis(
      ownerId,
      resume.id,
      "backend-engineer",
    );

    await service.deleteAnalysis(ownerId, created.id);

    expect(
      await prisma.careerAnalysis.findUnique({ where: { id: created.id } }),
    ).toBeNull();
    // Cascade: gaps must not outlive the analysis they belong to.
    expect(
      await prisma.skillGap.count({ where: { careerAnalysisId: created.id } }),
    ).toBe(0);
  });
});

// V1 runs analysis synchronously inside the request, so nothing but the
// originating request can move a row out of `analyzing`. If that request dies
// (client disconnect, process restart, deploy mid-call) the row has no other
// exit. These cover the read-path reaper that gives it one.
describe("CareerAnalysisService stale analysis reaping", () => {
  let userId: string;
  let resumeId: string;

  beforeAll(async () => {
    userId = (await createUser("StaleReaper")).id;
    resumeId = (await createResume(userId)).id;
  });

  // Writes a row directly in `analyzing` with a chosen age — the state a
  // killed request leaves behind.
  async function createAbandonedAnalysis(ageMs: number) {
    const role = await prisma.role.findUniqueOrThrow({
      where: { slug: "backend-engineer" },
    });
    return prisma.careerAnalysis.create({
      data: {
        userId,
        resumeId,
        roleId: role.id,
        status: "analyzing",
        resumeSnapshot: {},
        roleSnapshot: {},
        createdAt: new Date(Date.now() - ageMs),
      },
    });
  }

  it("fails an abandoned analyzing row once it is older than the window", async () => {
    const stale = await createAbandonedAnalysis(STALE_ANALYSIS_AFTER_MS + 60_000);
    const service = buildService(fakeAgent(() => ({ assessments: [] })));

    const read = await service.getAnalysisById(userId, stale.id);

    expect(read.status).toBe("failed");
    expect(read.failureReason).toBe(STALE_ANALYSIS_REASON);
  });

  it("leaves an in-flight analysis alone", async () => {
    // Younger than the cutoff: this is what a request still waiting on Gemini
    // looks like, and reaping it would destroy a result the user is waiting for.
    const inFlight = await createAbandonedAnalysis(5_000);
    const service = buildService(fakeAgent(() => ({ assessments: [] })));

    const read = await service.getAnalysisById(userId, inFlight.id);

    expect(read.status).toBe("analyzing");
    expect(read.failureReason).toBeNull();
  });

  it("reaps stale rows on the list path too", async () => {
    const stale = await createAbandonedAnalysis(STALE_ANALYSIS_AFTER_MS + 60_000);
    const service = buildService(fakeAgent(() => ({ assessments: [] })));

    const listed = await service.listAnalyses(userId, { limit: 20 });

    expect(listed.items.find((a) => a.id === stale.id)?.status).toBe(
      "failed",
    );
  });

  it("never touches another user's stale rows", async () => {
    const stale = await createAbandonedAnalysis(STALE_ANALYSIS_AFTER_MS + 60_000);
    const intruderId = (await createUser("StaleIntruder")).id;
    const service = buildService(fakeAgent(() => ({ assessments: [] })));

    await service.listAnalyses(intruderId, { limit: 20 });

    const untouched = await prisma.careerAnalysis.findUniqueOrThrow({
      where: { id: stale.id },
    });
    expect(untouched.status).toBe("analyzing");
  });

  it("does not overwrite an analysis that completed normally", async () => {
    const service = buildService(
      fakeAgent((input) => ({
        assessments: input.requiredSkills.map((skill) => ({
          skillSlug: skill.slug,
          found: false,
          evidence: [],
        })),
      })),
    );
    const completed = await service.createAnalysis(
      userId,
      resumeId,
      "backend-engineer",
    );

    // Age it past the cutoff. Status, not age, is what protects a real result.
    await prisma.careerAnalysis.update({
      where: { id: completed.id },
      data: { createdAt: new Date(Date.now() - STALE_ANALYSIS_AFTER_MS * 2) },
    });

    const read = await service.getAnalysisById(userId, completed.id);

    expect(read.status).toBe("complete");
    expect(read.failureReason).toBeNull();
  });
});

describe("CareerAnalysisService.reassessAnalysis", () => {
  let userId: string;
  let resumeId: string;

  const NOTE =
    "Built a small REST API with Docker and wrote a Dockerfile plus docker-compose for local dev";

  beforeAll(async () => {
    userId = (await createUser("Reassess")).id;
    resumeId = (await createResume(userId)).id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  async function createCompleteAnalysis(reader: CompletedWorkReader) {
    const service = buildService(
      fakeAgent((input) => ({
        assessments: input.requiredSkills.map((skill) => ({
          skillSlug: skill.slug,
          found: false,
          evidence: [],
        })),
      })),
      reader,
    );
    return service.createAnalysis(userId, resumeId, "backend-engineer");
  }

  function completedTask(overrides: Partial<CompletedTaskRow> = {}): CompletedTaskRow {
    return {
      id: crypto.randomUUID(),
      completedAt: new Date(),
      completionNote: NOTE,
      projectTask: "Containerize a small service with Docker",
      expectedEvidence: "A Dockerfile and a working docker-compose setup",
      skillGap: { skill: { slug: "docker", name: "Docker" } },
      ...overrides,
    };
  }

  it("returns 404 for an analysis that does not exist, without calling the model", async () => {
    const agent = fakeAgent(() => ({ assessments: [] }));
    const service = buildService(agent, fakeCompletedWorkReader([completedTask()]));

    await expect(
      service.reassessAnalysis(userId, crypto.randomUUID()),
    ).rejects.toMatchObject({ statusCode: 404 });
    expect(agent.lastInput).toBeUndefined();
  });

  it("returns 403 for someone else's analysis without calling the model", async () => {
    const analysis = await createCompleteAnalysis(fakeCompletedWorkReader());
    const intruder = await createUser("ReassessIntruder2");
    const agent = fakeAgent(() => ({ assessments: [] }));
    const service = buildService(agent, fakeCompletedWorkReader([completedTask()]));

    await expect(
      service.reassessAnalysis(intruder.id, analysis.id),
    ).rejects.toMatchObject({ statusCode: 403 });
    expect(agent.lastInput).toBeUndefined();
  });

  it("rejects reassessing an analysis that has not completed", async () => {
    const role = await prisma.role.findUniqueOrThrow({
      where: { slug: "backend-engineer" },
    });
    const pending = await prisma.careerAnalysis.create({
      data: {
        userId,
        resumeId,
        roleId: role.id,
        status: "analyzing",
        resumeSnapshot: {},
        roleSnapshot: {},
      },
    });
    const agent = fakeAgent(() => ({ assessments: [] }));
    const service = buildService(agent, fakeCompletedWorkReader([completedTask()]));

    await expect(
      service.reassessAnalysis(userId, pending.id),
    ).rejects.toMatchObject({ code: "VALIDATION_FAILED" });
    expect(agent.lastInput).toBeUndefined();
  });

  it("rejects when there is no completed roadmap work at all", async () => {
    const analysis = await createCompleteAnalysis(fakeCompletedWorkReader());
    const agent = fakeAgent(() => ({ assessments: [] }));
    const service = buildService(agent, fakeCompletedWorkReader([]));

    await expect(
      service.reassessAnalysis(userId, analysis.id),
    ).rejects.toMatchObject({ code: "VALIDATION_FAILED" });
    expect(agent.lastInput).toBeUndefined();
  });

  it("rejects when nothing was completed after the analysis finished", async () => {
    const analysis = await createCompleteAnalysis(fakeCompletedWorkReader());
    // Completed BEFORE the analysis existed — e.g. a task somehow predating
    // it. The eligibility clock is `completedAt > since`.
    const oldTask = completedTask({
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    });
    const agent = fakeAgent(() => ({ assessments: [] }));
    const service = buildService(agent, fakeCompletedWorkReader([oldTask]));

    await expect(
      service.reassessAnalysis(userId, analysis.id),
    ).rejects.toMatchObject({ code: "VALIDATION_FAILED" });
    expect(agent.lastInput).toBeUndefined();
  });

  it("rejects when every newly-completed task has a blank note", async () => {
    const analysis = await createCompleteAnalysis(fakeCompletedWorkReader());
    const blank = completedTask({ completionNote: "   " });
    const agent = fakeAgent(() => ({ assessments: [] }));
    const service = buildService(agent, fakeCompletedWorkReader([blank]));

    await expect(
      service.reassessAnalysis(userId, analysis.id),
    ).rejects.toMatchObject({ code: "VALIDATION_FAILED" });
    expect(agent.lastInput).toBeUndefined();
  });

  it("creates a child revision and leaves the parent's readiness untouched", async () => {
    // Original analysis: nothing found, so docker starts at "missing".
    const parent = await createCompleteAnalysis(fakeCompletedWorkReader());
    const parentStoredBefore = await prisma.careerAnalysis.findUniqueOrThrow({
      where: { id: parent.id },
    });

    const reader = fakeCompletedWorkReader([completedTask()]);
    const agent = fakeAgent((input) => ({
      assessments: input.requiredSkills.map((skill) =>
        skill.slug === "docker"
          ? {
              skillSlug: skill.slug,
              found: true,
              evidence: [
                {
                  quote: NOTE,
                  strength: "project_backed" as const,
                  sourceSection: "completed_work" as const,
                  sourceIndex: 0,
                },
              ],
            }
          : { skillSlug: skill.slug, found: false, evidence: [] },
      ),
    }));
    const service = buildService(agent, reader);

    const revision = await service.reassessAnalysis(userId, parent.id);

    expect(revision.id).not.toBe(parent.id);
    const revisionRow = await prisma.careerAnalysis.findUniqueOrThrow({
      where: { id: revision.id },
    });
    expect(revisionRow.parentAnalysisId).toBe(parent.id);
    expect(revisionRow.revision).toBe(1);

    const dockerGap = revision.gaps.find((g) => g.skill.slug === "docker");
    expect(dockerGap?.status).toBe("developing"); // project_backed, not strong

    // The parent's own row is untouched — historical integrity.
    const parentStoredAfter = await prisma.careerAnalysis.findUniqueOrThrow({
      where: { id: parent.id },
    });
    expect(parentStoredAfter.readinessScore).toBe(parentStoredBefore.readinessScore);
    expect(parentStoredAfter.readinessBreakdown).toEqual(
      parentStoredBefore.readinessBreakdown,
    );
    expect(parentStoredAfter.resumeSnapshot).toEqual(
      parentStoredBefore.resumeSnapshot,
    );
  });

  it("feeds the agent the note as a quotable source, not the task text", async () => {
    const parent = await createCompleteAnalysis(fakeCompletedWorkReader());
    const reader = fakeCompletedWorkReader([completedTask()]);
    const agent = fakeAgent((input) => ({
      assessments: input.requiredSkills.map((skill) => ({
        skillSlug: skill.slug,
        found: false,
        evidence: [],
      })),
    }));
    const service = buildService(agent, reader);

    await service.reassessAnalysis(userId, parent.id);

    const sourceItems = agent.lastInput!.sourceItems!;
    expect(sourceItems.completed_work[0].displayText).toBe(NOTE);
    // The AI-authored task text must never appear as a quotable source.
    const allQuotable = Object.values(sourceItems).flat();
    expect(
      allQuotable.some((item) =>
        item.displayText.includes("Containerize a small service"),
      ),
    ).toBe(false);
  });

  it("uses the parent's frozen snapshots, not a fresh resume read", async () => {
    const parent = await createCompleteAnalysis(fakeCompletedWorkReader());
    const parentStored = await prisma.careerAnalysis.findUniqueOrThrow({
      where: { id: parent.id },
    });

    const reader = fakeCompletedWorkReader([completedTask()]);
    const agent = fakeAgent((input) => ({
      assessments: input.requiredSkills.map((skill) => ({
        skillSlug: skill.slug,
        found: false,
        evidence: [],
      })),
    }));
    const service = buildService(agent, reader);

    await service.reassessAnalysis(userId, parent.id);

    expect(agent.lastInput!.resume).toEqual(parentStored.resumeSnapshot);
  });

  it("increments revision on a second reassessment", async () => {
    const parent = await createCompleteAnalysis(fakeCompletedWorkReader());
    const emptyAgent = fakeAgent((input) => ({
      assessments: input.requiredSkills.map((skill) => ({
        skillSlug: skill.slug,
        found: false,
        evidence: [],
      })),
    }));

    const task1 = completedTask({ id: crypto.randomUUID() });
    const rev1 = await buildService(
      emptyAgent,
      fakeCompletedWorkReader([task1]),
    ).reassessAnalysis(userId, parent.id);
    expect(rev1.status).toBe("complete");

    // A second task completed after rev1 was created.
    const task2 = completedTask({
      id: crypto.randomUUID(),
      completedAt: new Date(Date.now() + 1000),
    });
    const rev2 = await buildService(
      emptyAgent,
      fakeCompletedWorkReader([task1, task2]),
    ).reassessAnalysis(userId, parent.id);

    const rev2Row = await prisma.careerAnalysis.findUniqueOrThrow({
      where: { id: rev2.id },
    });
    expect(rev2Row.revision).toBe(2);
  });

  it("marks the revision failed when the model call fails, leaving the parent complete", async () => {
    const parent = await createCompleteAnalysis(fakeCompletedWorkReader());
    const reader = fakeCompletedWorkReader([completedTask()]);
    const service = buildService(
      failingAgent(new AppError(503, "GEMINI_API_ERROR", "AI unavailable")),
      reader,
    );

    await expect(
      service.reassessAnalysis(userId, parent.id),
    ).rejects.toMatchObject({ code: "GEMINI_API_ERROR" });

    const failedRevision = await prisma.careerAnalysis.findFirstOrThrow({
      where: { parentAnalysisId: parent.id, status: "failed" },
    });
    expect(failedRevision.failureReason).toBe("AI unavailable");

    const parentAfter = await prisma.careerAnalysis.findUniqueOrThrow({
      where: { id: parent.id },
    });
    expect(parentAfter.status).toBe("complete");
  });

  it("excludes revisions from the user's analysis list", async () => {
    const parent = await createCompleteAnalysis(fakeCompletedWorkReader());
    const reader = fakeCompletedWorkReader([completedTask()]);
    const agent = fakeAgent((input) => ({
      assessments: input.requiredSkills.map((skill) => ({
        skillSlug: skill.slug,
        found: false,
        evidence: [],
      })),
    }));
    const service = buildService(agent, reader);
    const revision = await service.reassessAnalysis(userId, parent.id);

    const listed = await service.listAnalyses(userId, { limit: 20 });

    // The dashboard shows one entry for the analysis, not one per revision.
    expect(listed.items.filter((a) => a.id === parent.id).length).toBe(1);
    expect(listed.items.some((a) => a.id === revision.id)).toBe(false);
  });

  it("returns revisions oldest-first via getRevisions", async () => {
    const parent = await createCompleteAnalysis(fakeCompletedWorkReader());
    const reader = fakeCompletedWorkReader([completedTask()]);
    const agent = fakeAgent((input) => ({
      assessments: input.requiredSkills.map((skill) => ({
        skillSlug: skill.slug,
        found: false,
        evidence: [],
      })),
    }));
    const service = buildService(agent, reader);
    const revision = await service.reassessAnalysis(userId, parent.id);

    const revisions = await service.getRevisions(userId, parent.id);
    expect(revisions.map((r) => r.id)).toEqual([revision.id]);
    expect(revisions[0].revision).toBe(1);

    // Resolves from a revision id too, not just the root.
    const viaRevision = await service.getRevisions(userId, revision.id);
    expect(viaRevision.map((r) => r.id)).toEqual([revision.id]);
  });
});
