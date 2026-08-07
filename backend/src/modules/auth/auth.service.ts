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

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}
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
}
