import { Prisma, Resume } from "../../generated/client/index.js";
import { prisma } from "../../lib/prisma.js";
import { RawResumePage } from "./resume.types.js";

export class ResumeRepository {
  async create(data: Prisma.ResumeCreateInput): Promise<Resume> {
    return prisma.resume.create({ data });
  }
  async findManyByUserId(
    userId: string,
    options: { limit: number; cursor?: string },
  ): Promise<RawResumePage> {
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
        enabledSections: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateSectionVisibility(
    userId: string,
    id: string,
    enabledSections: Prisma.InputJsonValue,
  ) {
    return prisma.resume.update({
      where: { id, userId },
      data: { enabledSections },
      select: {
        id: true,
        title: true,
        originalFileName: true,
        structuredResume: true,
        rawText: true,
        fileSize: true,
        filePath: true,
        enabledSections: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteById(id: string): Promise<void> {
    await prisma.resume.delete({ where: { id } });
  }
}
