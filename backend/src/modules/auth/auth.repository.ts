import { User, Prisma, RefreshToken } from "../../generated/client/index.js";
import { prisma } from "../../lib/prisma.js";
import { GoogleLinkedUser, SafeUser } from "./auth.types.js";

export class AuthRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /** Selects `googleId` alongside the usual SafeUser fields — not cosmetic:
   *  AuthService.resolveAfterRace asserts that the row it gets back carries
   *  exactly the googleId it asked for, and cannot check that if the field
   *  isn't selected. */
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

  /** Attaches a Google identity to an account that has none.
   *
   *  `googleId: null` sits on the WRITE, not just on the read that preceded
   *  it. That predicate is the account-takeover guard, not a nicety: a row
   *  that gained a different Google identity between our read and this update
   *  simply matches nothing, so it can never be rebound to the caller's
   *  identity.
   *
   *  Returns 0 for three different reasons — already linked to this same
   *  googleId (a concurrent callback), linked to a *different* googleId, or
   *  the row is gone. The caller cannot tell them apart from the count alone
   *  and must re-resolve by googleId; see AuthService.resolveAfterRace. */
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
