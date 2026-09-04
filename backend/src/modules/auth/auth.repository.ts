import { User, Prisma, RefreshToken } from "../../generated/client/index.js";
import { prisma } from "../../lib/prisma.js";
import { GoogleLinkedUser, SafeUser } from "./auth.types.js";

export class AuthRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  // Includes googleId to verify ownership after race conditions
  async findUserByGoogleId(googleId: string): Promise<GoogleLinkedUser | null> {
    return prisma.user.findUnique({
      where: { googleId },
      select: {
        id: true,
        name: true,
        email: true,
        googleId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Atomically links googleId only if currently null (prevents takeover)
  async linkGoogleIdIfUnlinked(
    userId: string,
    googleId: string,
  ): Promise<number> {
    const result = await prisma.user.updateMany({
      where: { id: userId, googleId: null },
      data: { googleId },
    });
    return result.count;
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

  // Atomically revokes only if not already revoked (prevents replay)
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

  // Cleanup: expired tokens immediately, revoked after retention period
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

  // Fetch file paths before cascade delete removes resume records
  async findResumeFilePaths(userId: string): Promise<string[]> {
    const resumes = await prisma.resume.findMany({
      where: { userId, filePath: { not: null } },
      select: { filePath: true },
    });
    return resumes
      .map((r) => r.filePath)
      .filter((path): path is string => path !== null);
  }

  // Cascades to all related records; returns count to detect missing user
  async deleteUser(userId: string): Promise<number> {
    const result = await prisma.user.deleteMany({ where: { id: userId } });
    return result.count;
  }
}
