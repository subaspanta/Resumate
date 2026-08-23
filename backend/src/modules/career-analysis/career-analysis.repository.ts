import {
  AnalysisEventType,
  CareerAnalysis,
  Prisma,
} from "../../generated/client/index.js";
import { prisma } from "../../lib/prisma.js";
import { GapStatus, EvidenceStrength } from "../../generated/client/index.js";
import { GEMINI_CALL_TIMEOUT_MS } from "../ai/gemini-timeout.js";

// Shown to the user on a reaped analysis, so it has to explain the state
// rather than name the mechanism.
export const STALE_ANALYSIS_REASON =
  "Analysis did not finish — it was interrupted before completing";

// How long an analysis may sit in `analyzing` before it is considered dead.
//
// Derived, not guessed: one synchronous analysis is bounded by the Gemini call
// (GEMINI_CALL_TIMEOUT_MS) plus the completion transaction (15s), so anything
// older than that cannot still be running. The multiplier is slack for a
// loaded event loop — being late to reap costs nothing, reaping a live
// analysis would destroy a result the user is still waiting for.
export const STALE_ANALYSIS_AFTER_MS = GEMINI_CALL_TIMEOUT_MS * 3;

export type NewEvidenceRow = {
  skillId: string;
  strength: EvidenceStrength;
  quote: string;
  sourceSection: string;
  sourceLabel: string;
};

export type NewGapRow = {
  skillId: string;
  status: GapStatus;
  priority: number;
  reasoning: string;
};

// How far through its roadmap an analysis is. Counted in the repository
// rather than the client: completion state is application-owned, and a count
// assembled in a component would be a second definition of "progress" free to
// drift from this one.
export type RoadmapProgress = {
  total: number;
  completed: number;
  weekCount: number;
};

export type CompleteAnalysisInput = {
  analysisId: string;
  readinessScore: number;
  readinessBreakdown: Prisma.InputJsonValue;
  evidence: NewEvidenceRow[];
  gaps: NewGapRow[];
};

// Shape returned to callers reading a full analysis. Skill rows are joined in
// so the client gets names, not bare uuids.
export type CareerAnalysisWithResults = Prisma.CareerAnalysisGetPayload<{
  include: {
    role: { select: { slug: true; title: true } };
    evidence: { include: { skill: { select: { slug: true; name: true } } } };
    gaps: { include: { skill: { select: { slug: true; name: true } } } };
  };
}>;

// What completeAnalysis returns: the same shape minus the two frozen snapshots.
//
// They are large JSONB blobs and no client reads them off the create response —
// pulling them back across the wire inside the transaction lengthens it for
// nothing. A later GET of the same analysis still includes them, so nothing
// that legitimately needs a snapshot loses access to it.
export type CompletedCareerAnalysis = Omit<
  CareerAnalysisWithResults,
  "resumeSnapshot" | "roleSnapshot"
>;

// A root analysis with just the fields reassessment needs to decide
// eligibility and rebuild the agent input. Deliberately not
// CareerAnalysisWithResults — that pulls in evidence/gaps this caller does
// not need and the two snapshot JSONB blobs are the only large fields it
// actually wants.
export type RootAnalysisForReassessment = {
  id: string;
  userId: string;
  resumeId: string;
  roleId: string;
  status: CareerAnalysis["status"];
  completedAt: Date | null;
  resumeSnapshot: Prisma.JsonValue;
  roleSnapshot: Prisma.JsonValue;
};

export class CareerAnalysisRepository {
  async createPending(input: {
    userId: string;
    resumeId: string;
    roleId: string;
    resumeSnapshot: Prisma.InputJsonValue;
    roleSnapshot: Prisma.InputJsonValue;
  }): Promise<CareerAnalysis> {
    return prisma.careerAnalysis.create({
      data: {
        userId: input.userId,
        resumeId: input.resumeId,
        roleId: input.roleId,
        status: "analyzing",
        resumeSnapshot: input.resumeSnapshot,
        roleSnapshot: input.roleSnapshot,
        events: { create: { type: "analysis_started" } },
      },
    });
  }

  // Same shape as createPending, plus the revision lineage. Writes its own
  // "reassessment_started" event rather than "analysis_started" so the audit
  // trail can tell a reassessment apart from an original analysis.
  async createPendingRevision(input: {
    parentAnalysisId: string;
    revision: number;
    userId: string;
    resumeId: string;
    roleId: string;
    resumeSnapshot: Prisma.InputJsonValue;
    roleSnapshot: Prisma.InputJsonValue;
  }): Promise<CareerAnalysis> {
    return prisma.careerAnalysis.create({
      data: {
        userId: input.userId,
        resumeId: input.resumeId,
        roleId: input.roleId,
        parentAnalysisId: input.parentAnalysisId,
        revision: input.revision,
        status: "analyzing",
        resumeSnapshot: input.resumeSnapshot,
        roleSnapshot: input.roleSnapshot,
        events: { create: { type: "reassessment_started" } },
      },
    });
  }

  // The root analysis a reassessment is derived from, resolved by walking
  // parentAnalysisId when the caller passed a revision id. Read-only; never
  // used to authorize a write on its own (assertAnalysisOwner still runs
  // first in the service).
  async findRootForReassessment(
    analysisId: string,
  ): Promise<RootAnalysisForReassessment | null> {
    const row = await prisma.careerAnalysis.findUnique({
      where: { id: analysisId },
      select: {
        id: true,
        userId: true,
        resumeId: true,
        roleId: true,
        status: true,
        completedAt: true,
        resumeSnapshot: true,
        roleSnapshot: true,
        parentAnalysisId: true,
      },
    });
    if (!row) return null;
    if (row.parentAnalysisId === null) return row;
    // A revision id was passed. Revisions form a flat list under one root —
    // never a chain — so this is at most one more hop.
    return prisma.careerAnalysis.findUnique({
      where: { id: row.parentAnalysisId },
      select: {
        id: true,
        userId: true,
        resumeId: true,
        roleId: true,
        status: true,
        completedAt: true,
        resumeSnapshot: true,
        roleSnapshot: true,
      },
    });
  }

  // Latest revision under a root, or null if it has never been reassessed.
  // Drives the reassessment eligibility clock: "since the last revision, or
  // since the original analysis if there isn't one yet."
  async findLatestRevision(
    parentAnalysisId: string,
  ): Promise<{ id: string; revision: number; createdAt: Date } | null> {
    return prisma.careerAnalysis.findFirst({
      where: { parentAnalysisId },
      select: { id: true, revision: true, createdAt: true },
      orderBy: { revision: "desc" },
    });
  }

  // Writes the whole result of one analysis atomically.
  //
  // Evidence, gaps, score, breakdown, and status must land together: a partial
  // write would leave an analysis marked complete whose readiness score does
  // not match the gaps that produced it, and nothing downstream could tell.
  // The @@unique([careerAnalysisId, skillId]) on SkillGap means a retry of the
  // same analysis fails loudly here rather than silently double-writing gaps.
  async completeAnalysis(
    input: CompleteAnalysisInput,
  ): Promise<CompletedCareerAnalysis> {
    return prisma.$transaction(
      async (tx) => {
        if (input.evidence.length > 0) {
          await tx.candidateSkillEvidence.createMany({
            data: input.evidence.map((row) => ({
              careerAnalysisId: input.analysisId,
              ...row,
            })),
          });
        }

        await tx.skillGap.createMany({
          data: input.gaps.map((row) => ({
            careerAnalysisId: input.analysisId,
            ...row,
          })),
        });

        await tx.analysisEvent.create({
          data: {
            careerAnalysisId: input.analysisId,
            type: "analysis_completed",
            payload: { readinessScore: input.readinessScore },
          },
        });

        return tx.careerAnalysis.update({
          where: { id: input.analysisId },
          data: {
            status: "complete",
            readinessScore: input.readinessScore,
            readinessBreakdown: input.readinessBreakdown,
            completedAt: new Date(),
          },
          // Both snapshots are excluded from the read-back: they are large
          // JSONB blobs already known to the caller, and fetching them here
          // only lengthens the transaction. A later GET still returns them.
          omit: { resumeSnapshot: true, roleSnapshot: true },
          include: {
            role: { select: { slug: true, title: true } },
            evidence: {
              include: { skill: { select: { slug: true, name: true } } },
            },
            gaps: {
              include: { skill: { select: { slug: true, name: true } } },
              orderBy: { priority: "asc" },
            },
          },
        });
      },
      // Default is 5s. This transaction runs on a connection that just held a
      // Gemini call open for up to 60s, and writes one row per required skill
      // plus one per surviving quote — comfortably under 15s, but not always
      // under 5 on a loaded database.
      { timeout: 15_000 },
    );
  }

  // Records a failure outside any transaction: the analysis row must survive
  // to explain itself, so this deliberately does not roll back with whatever
  // failed.
  //
  // The `status: "analyzing"` predicate is load-bearing. An analysis that
  // already reached `complete` holds real gaps, evidence, and a score; a late
  // or duplicate failure must never overwrite that status and present a valid
  // result as failed. updateMany (not update) is what allows a non-unique
  // field in `where` — the count then tells us whether the guard held.
  //
  // Returns whether the row actually transitioned, so the event log can stay
  // consistent with the status: no transition, no analysis_failed event.
  async markFailed(analysisId: string, reason: string): Promise<boolean> {
    const result = await prisma.careerAnalysis.updateMany({
      where: { id: analysisId, status: "analyzing" },
      data: { status: "failed", failureReason: reason },
    });

    if (result.count === 0) return false;

    // Separate statement rather than a nested `events: { create }`, which
    // updateMany does not support. Only reached when the guard above held.
    await prisma.analysisEvent.create({
      data: {
        careerAnalysisId: analysisId,
        type: "analysis_failed" as AnalysisEventType,
      },
    });
    return true;
  }

  // Fails analyses that have been `analyzing` longer than the window.
  //
  // V1 runs analysis synchronously inside the request, so the only thing that
  // can move a row out of `analyzing` is the request that created it. If that
  // request dies — client disconnect, process restart, deploy mid-call — the
  // row has no other exit and stays `analyzing` forever. This is the exit.
  //
  // No queue or background worker: this is called on the read paths, so a
  // stale row is reaped the next time anyone looks at it. That is enough
  // precisely because a row nobody ever reads again harms nobody.
  //
  // The `startedBefore` cutoff is what makes this safe to run concurrently
  // with a live analysis: an in-flight request is by definition younger than
  // the cutoff, so it is never touched. updateMany applies the predicate to
  // the write itself, so a row that completes between the cutoff being
  // computed and this statement running no longer matches `analyzing` and is
  // left alone.
  async failStaleAnalyses(
    userId: string,
    startedBefore: Date,
  ): Promise<number> {
    const result = await prisma.careerAnalysis.updateMany({
      where: {
        userId,
        status: "analyzing",
        createdAt: { lt: startedBefore },
      },
      data: {
        status: "failed",
        failureReason: STALE_ANALYSIS_REASON,
      },
    });
    return result.count;
  }

  // Ownership-decision read. Returns the owner alongside the row so the
  // service can distinguish 404 (absent) from 403 (someone else's).
  async findByIdWithOwner(
    analysisId: string,
  ): Promise<{ id: string; userId: string } | null> {
    return prisma.careerAnalysis.findUnique({
      where: { id: analysisId },
      select: { id: true, userId: true },
    });
  }

  async findByIdWithResults(
    analysisId: string,
  ): Promise<CareerAnalysisWithResults | null> {
    return prisma.careerAnalysis.findUnique({
      where: { id: analysisId },
      include: {
        role: { select: { slug: true, title: true } },
        evidence: { include: { skill: { select: { slug: true, name: true } } } },
        gaps: {
          include: { skill: { select: { slug: true, name: true } } },
          orderBy: { priority: "asc" },
        },
      },
    });
  }

  // User-scoped list. The where clause carries userId so a foreign analysis
  // can never appear, independent of any check the service also makes.
  //
  // parentAnalysisId: null excludes reassessment revisions — the dashboard
  // shows one entry per analysis, and a revision is presented as part of its
  // root (via GET /:id/revisions), not as a sibling list row. Every row
  // written before reassessment existed has parentAnalysisId null already, so
  // this is a no-op until the first reassessment is created.
  async findManyByUserId(
    userId: string,
    filter: { resumeId?: string } = {},
  ): Promise<
    (Pick<
      CareerAnalysis,
      | "id"
      | "resumeId"
      | "roleId"
      | "status"
      | "readinessScore"
      | "createdAt"
      | "completedAt"
    > & {
      hasRoadmap: boolean;
      roadmapProgress: RoadmapProgress | null;
      role: { slug: string; title: string };
    })[]
  > {
    const rows = await prisma.careerAnalysis.findMany({
      where: {
        userId,
        parentAnalysisId: null,
        ...(filter.resumeId ? { resumeId: filter.resumeId } : {}),
      },
      select: {
        id: true,
        resumeId: true,
        roleId: true,
        status: true,
        readinessScore: true,
        createdAt: true,
        completedAt: true,
        // The list row renders the role by name; without this join the client
        // would have to fetch the whole role list purely to map a uuid.
        role: { select: { slug: true, title: true } },
        // Existence plus progress. The dashboard's "continue where you left
        // off" card needs how many tasks are done, and _count aggregates in
        // Postgres — the completed-task select returns ids only, never the
        // task prose columns, which are large and useless to a counter.
        roadmap: {
          select: {
            id: true,
            weekCount: true,
            _count: { select: { tasks: true } },
            tasks: { where: { completed: true }, select: { id: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return rows.map(({ roadmap, ...rest }) => ({
      ...rest,
      hasRoadmap: roadmap !== null,
      roadmapProgress: roadmap
        ? {
            total: roadmap._count.tasks,
            completed: roadmap.tasks.length,
            weekCount: roadmap.weekCount,
          }
        : null,
    }));
  }

  // Revision summaries under one root, oldest first — for GET
  // /career-analyses/:id/revisions. No snapshots, no evidence/gaps: the
  // frontend only needs enough to render a before/after readiness list.
  async findRevisionsByRootId(rootId: string): Promise<
    Pick<
      CareerAnalysis,
      "id" | "revision" | "status" | "readinessScore" | "createdAt" | "completedAt"
    >[]
  > {
    return prisma.careerAnalysis.findMany({
      where: { parentAnalysisId: rootId },
      select: {
        id: true,
        revision: true,
        status: true,
        readinessScore: true,
        createdAt: true,
        completedAt: true,
      },
      orderBy: { revision: "asc" },
    });
  }

  // Ownership-scoped delete: the userId in the filter makes the write itself
  // safe, not just the read that preceded it. Returns false when the row
  // vanished or changed owner between the two.
  async deleteByIdAndUserId(
    analysisId: string,
    userId: string,
  ): Promise<boolean> {
    const result = await prisma.careerAnalysis.deleteMany({
      where: { id: analysisId, userId },
    });
    return result.count > 0;
  }
}
