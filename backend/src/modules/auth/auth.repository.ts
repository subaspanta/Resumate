import { User, Prisma, RefreshToken } from "../../generated/client/index.js";
import { prisma } from "../../lib/prisma.js";
import { SafeUser } from "./auth.types.js";

export class AuthRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<SafeUser> {
    return prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  async findUserByIdOmittingPassword(id: string): Promise<SafeUser | null> {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async createRefreshToken(data: {
    userId: string;
    familyId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<RefreshToken> {
    return prisma.refreshToken.create({ data });
  }

  async findRefreshTokenByHash(
    tokenHash: string,
  ): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({
      where: { tokenHash },
    });
  }

  /** Atomically revokes a single token iff it's still live. Returns false if
   *  it was already revoked — either by a concurrent request winning the
   *  race, or by reuse of a previously-rotated token. */
  async revokeRefreshTokenIfLive(id: string): Promise<boolean> {
    const result = await prisma.refreshToken.updateMany({
      where: { id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return result.count === 1;
  }

  async revokeFamily(familyId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async revokeRefreshTokenByHash(tokenHash: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  /** Deletes naturally-expired rows immediately, and revoked rows after
   *  `revokedRetentionMs` so a just-detected theft stays inspectable. */
  async deleteStaleRefreshTokens(revokedRetentionMs: number): Promise<number> {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          {
            revokedAt: {
              not: null,
              lt: new Date(Date.now() - revokedRetentionMs),
            },
          },
        ],
      },
    });
    return result.count;
  }

  /** Cloudinary paths for every resume the user owns, read before the
   *  cascade delete removes the rows that would otherwise be the only
   *  record of them. */
  async findResumeFilePaths(userId: string): Promise<string[]> {
    const resumes = await prisma.resume.findMany({
      where: { userId, filePath: { not: null } },
      select: { filePath: true },
    });
    return resumes
      .map((r) => r.filePath)
      .filter((path): path is string => path !== null);
  }

  /** Deletes the user row. Cascades to resumes, career analyses, evidence,
   *  gaps, roadmaps, tasks, analysis events, and refresh tokens per the
   *  schema's onDelete: Cascade — this is the one write that removes all of
   *  it. Returns the row count so the caller can tell an already-deleted
   *  user apart from a real failure. */
  async deleteUser(userId: string): Promise<number> {
    const result = await prisma.user.deleteMany({ where: { id: userId } });
    return result.count;
  }
}
