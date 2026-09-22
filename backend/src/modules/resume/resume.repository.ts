import {
  PrismaClient,
  Prisma,
  Resume,
} from "../../generated/client/index.js";
import { ResumePage } from "./resume.types.js";

export class ResumeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: Prisma.ResumeCreateInput): Promise<Resume> {
    return this.prisma.resume.create({ data });
  }
  async findManyByUserId(
    userId: string,
    options: { limit: number; cursor?: string },
  ): Promise<ResumePage> {
    const { limit, cursor } = options;

    // Fetch one extra row to detect next page.
    const rows = await this.prisma.resume.findMany({
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
    return this.prisma.resume.findFirst({
      where: { id, userId },
      select: {
        id: true,
        title: true,
        originalFileName: true,
        mimeType: true,
        structuredResume: true,
        rawText: true,
        fileSize: true,
        filePath: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Keep ownership predicate on delete write.
  async deleteByIdAndUserId(id: string, userId: string): Promise<number> {
    const result = await this.prisma.resume.deleteMany({ where: { id, userId } });
    return result.count;
  }

  // Keep ownership predicate on update write.
  async updateByIdAndUserId(
    id: string,
    userId: string,
    data: Prisma.ResumeUpdateManyMutationInput,
  ): Promise<number> {
    const result = await this.prisma.resume.updateMany({
      where: { id, userId },
      data,
    });
    return result.count;
  }
}
