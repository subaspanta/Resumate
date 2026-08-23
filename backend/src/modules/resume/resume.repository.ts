import { Prisma, Resume } from "../../generated/client/index.js";
import { prisma } from "../../lib/prisma.js";
import { ResumePage } from "./resume.types.js";

export class ResumeRepository {
  async create(data: Prisma.ResumeCreateInput): Promise<Resume> {
    return prisma.resume.create({ data });
  }
  async findManyByUserId(
    userId: string,
    options: { limit: number; cursor?: string },
  ): Promise<ResumePage> {
    const { limit, cursor } = options;

    // Fetch one extra row to detect whether a further page exists.
    const rows = await prisma.resume.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        originalFileName: true,
        fileSize: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return { items, nextCursor };
  }
  async findByIdAndUserId(userId: string, id: string) {
    return prisma.resume.findFirst({
      where: { id, userId },
      select: {
        id: true,
        title: true,
        originalFileName: true,
        structuredResume: true,
        rawText: true,
        fileSize: true,
        filePath: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Ownership-scoped write. deleteMany rather than delete: Prisma's delete
  // accepts only a unique field in `where`, so a userId filter is impossible
  // and the write would have to trust the earlier findByIdAndUserId read.
  // Here the write carries the ownership predicate itself. Returns the row
  // count so the caller can treat 0 (vanished or reassigned between the read
  // and this write) as not-found rather than a silent no-op.
  async deleteByIdAndUserId(id: string, userId: string): Promise<number> {
    const result = await prisma.resume.deleteMany({ where: { id, userId } });
    return result.count;
  }

  // Same ownership-scoped updateMany reasoning as deleteByIdAndUserId:
  // update() only accepts a unique `where`, so the predicate has to live on
  // this write rather than trusting the caller's earlier read. Replace keeps
  // the same row id on purpose — CareerAnalysis.resumeSnapshot is a frozen
  // JSONB copy taken at analysis time, not a live join to this row, so
  // updating the content in place cannot retroactively change any existing
  // analysis, while a delete+recreate would cascade-delete all of them.
  async updateByIdAndUserId(
    id: string,
    userId: string,
    data: Prisma.ResumeUpdateManyMutationInput,
  ): Promise<number> {
    const result = await prisma.resume.updateMany({
      where: { id, userId },
      data,
    });
    return result.count;
  }
}
