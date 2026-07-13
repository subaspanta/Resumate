import { Prisma, Resume } from "../../generated/client/index.js";
import { prisma } from "../../lib/prisma.js";
import { ResumeSummary } from "./resume.types.js";

export class ResumeRepository {
  async createResume(data: Prisma.ResumeCreateInput): Promise<Resume> {
    return prisma.resume.create({ data });
  }
  async findResumesByUserId(userId: string): Promise<ResumeSummary[]> {
    return prisma.resume.findMany({
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
    });
  }
}
