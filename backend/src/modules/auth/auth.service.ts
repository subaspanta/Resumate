import crypto from "crypto";
import { AppError } from "../../types/app-error.js";
import { ERROR_CODES } from "../../constants/error-codes.js";
import { AuthRepository } from "./auth.repository.js";
import { LoginUserInput, RegisterUserInput } from "./auth.schema.js";
import bcrypt from "bcrypt";
import { AuthResponse, RefreshResult, SafeUser } from "./auth.types.js";
import { env } from "../../config/env.js";
import {
  DUMMY_PASSWORD_HASH,
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} from "../../utils/tokens.js";
import { Prisma } from "../../generated/client/edge.js";
import { StorageModule } from "../storage/storage.types.js";
import { logger } from "../../config/logger.js";

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly storageModule: StorageModule,
  ) {}
  private throwInvalidCredentials(): never {
    throw new AppError(
      401,
      ERROR_CODES.INVALID_CREDENTIALS,
      "Invalid email or password",
    );
  }
  private throwInvalidRefreshToken(): never {
    throw new AppError(
      401,
      ERROR_CODES.REFRESH_TOKEN_INVALID,
      "Refresh token is invalid or expired",
    );
  }
  private async issueTokens(
    user: { id: string; email: string },
    familyId: string = crypto.randomUUID(),
  ) {
    const accessToken = generateAccessToken({
      sub: user.id,
      email: user.email,
    });
    const refreshToken = generateRefreshToken({
      sub: user.id,
      email: user.email,
    });

    await this.authRepository.createRefreshToken({
      userId: user.id,
      familyId,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + env.REFRESH_COOKIE_MAX_AGE),
    });

    return { accessToken, refreshToken };
  }
  async register(data: RegisterUserInput): Promise<AuthResponse> {
    const passwordHash = await bcrypt.hash(data.password, env.SALT_ROUNDS);

    try {
      const newUser = await this.authRepository.createUser({
        name: data.name,
        email: data.email,
        passwordHash,
      });
      const { accessToken, refreshToken } = await this.issueTokens(newUser);
      return { user: newUser, accessToken, refreshToken };
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        throw new AppError(
          409,
          ERROR_CODES.EMAIL_ALREADY_EXISTS,
          "User with this email already exists",
        );
      }
      throw err;
    }
  }
  async login(data: LoginUserInput): Promise<AuthResponse> {
    const user = await this.authRepository.findUserByEmail(data.email);
    const passwordHash = user?.passwordHash ?? DUMMY_PASSWORD_HASH;

    const isPasswordValid = await bcrypt.compare(data.password, passwordHash);

    if (!user || !isPasswordValid) {
      this.throwInvalidCredentials();
    }

    const { passwordHash: _passwordHash, ...safeUser } = user;

    const { accessToken, refreshToken } = await this.issueTokens(safeUser);

    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  }
  async refresh(rawRefreshToken: string): Promise<RefreshResult> {
    if (typeof rawRefreshToken !== "string" || rawRefreshToken.length === 0) {
      this.throwInvalidRefreshToken();
    }

    const payload = verifyRefreshToken(rawRefreshToken);

    if (!payload?.sub) {
      this.throwInvalidRefreshToken();
    }

    const tokenHash = hashToken(rawRefreshToken);
    const stored = await this.authRepository.findRefreshTokenByHash(tokenHash);

    // Unknown token (never issued, or already cleaned up) — nothing to
    // cascade-revoke.
    if (!stored) {
      this.throwInvalidRefreshToken();
    }

    // Natural expiry is not a theft signal — don't cascade-revoke a
    // legitimate session that simply went stale.
    if (stored.expiresAt < new Date()) {
      this.throwInvalidRefreshToken();
    }

    // Atomically claim the token: succeeds only if it hasn't been revoked
    // yet. Losing this claim means either the token was already rotated
    // (reuse — theft signal) or a concurrent request won a genuine race.
    // Both are indistinguishable at the DB layer, so both revoke the whole
    // family — the standard, accepted tradeoff of refresh-token rotation.
    const claimed = await this.authRepository.revokeRefreshTokenIfLive(
      stored.id,
    );

    if (!claimed) {
      await this.authRepository.revokeFamily(stored.familyId);
      this.throwInvalidRefreshToken();
    }

    const user = await this.authRepository.findUserByIdOmittingPassword(payload.sub);

    if (!user) {
      this.throwInvalidRefreshToken();
    }

    const { accessToken, refreshToken } = await this.issueTokens(
      user,
      stored.familyId,
    );

    return { user, accessToken, refreshToken };
  }
  async logout(rawRefreshToken?: string): Promise<void> {
    if (!rawRefreshToken) return;
    await this.authRepository.revokeRefreshTokenByHash(
      hashToken(rawRefreshToken),
    );
  }
  async getCurrentUser(userId: string): Promise<SafeUser> {
    const user = await this.authRepository.findUserByIdOmittingPassword(userId);

    if (!user) {
      throw new AppError(404, ERROR_CODES.RESOURCE_NOT_FOUND, "User not found");
    }

    return user;
  }

  // Collects resume file paths before the cascade delete removes the rows
  // that are the only record of them, then deletes the user — cascading to
  // resumes, career analyses, evidence, gaps, roadmaps, tasks, analysis
  // events, and refresh tokens per the schema's onDelete: Cascade. Storage
  // cleanup is best-effort and runs after the DB delete succeeds, matching
  // ResumeService.deleteResume: the account is gone either way, and a
  // leftover Cloudinary object is a cost to clean up later, not a reason to
  // leave the account undeletable.
  async deleteAccount(userId: string): Promise<void> {
    const filePaths = await this.authRepository.findResumeFilePaths(userId);

    const deletedCount = await this.authRepository.deleteUser(userId);
    if (deletedCount === 0) {
      throw new AppError(404, ERROR_CODES.RESOURCE_NOT_FOUND, "User not found");
    }

    for (const filePath of filePaths) {
      try {
        await this.storageModule.deleteFile(filePath);
      } catch (cleanupError) {
        logger.error("Failed to delete resume file during account deletion", {
          userId,
          filePath,
          cleanupError,
        });
      }
    }
  }
}
