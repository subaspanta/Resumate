import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "../../lib/prisma.js";
import { CareerAnalysisRepository } from "./career-analysis.repository.js";
import { CareerAnalysisService } from "./career-analysis.service.js";
import { ResumeRepository } from "../resume/resume.repository.js";
import { RoleRepository } from "../role/role.repository.js";
import { RoleService } from "../role/role.service.js";
import { AppError } from "../../types/app-error.js";
import {
  EvidenceAgent,
  EvidenceAgentInput,
  EvidenceAgentOutput,
} from "./career-analysis.types.js";

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

function buildService(agent: EvidenceAgent) {
  const roleRepository = new RoleRepository();
  return new CareerAnalysisService(
    new CareerAnalysisRepository(),
    new ResumeRepository(),
    new RoleService(roleRepository),
    agent,
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
    // Every other required skill still gets a row rather than vanishing.
    expect(analysis.gaps.length).toBe(
      (analysis.roleSnapshot as { skills: unknown[] }).skills.length,
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

    const snapshot = analysis.roleSnapshot as {
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
    const mine = await service.listAnalyses(ownerId);
    const theirs = await service.listAnalyses(intruderId);

    expect(mine.some((a) => a.id === analysisId)).toBe(true);
    expect(theirs.some((a) => a.id === analysisId)).toBe(false);
  });

  it("returns 404 when filtering the list by someone else's resume", async () => {
    const service = buildService(fakeAgent(() => ({ assessments: [] })));
    const foreignResume = await createResume(ownerId);

    // An empty list would read as "no analyses" rather than "not yours".
    await expect(
      service.listAnalyses(intruderId, foreignResume.id),
    ).rejects.toMatchObject({ statusCode: 404 });
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
