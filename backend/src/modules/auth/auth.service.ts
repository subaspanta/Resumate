import crypto from "crypto";
import { AppError } from "../../types/app-error.js";
import { ERROR_CODES } from "../../constants/error-codes.js";
import { AuthRepository } from "./auth.repository.js";
import { LoginUserInput, RegisterUserInput } from "./auth.schema.js";
import bcrypt from "bcrypt";
import {
  AuthResponse,
  GoogleLinkedUser,
  RefreshResult,
  SafeUser,
} from "./auth.types.js";
import {
  GoogleAuthProvider,
  GoogleProfile,
} from "./google/google-auth.types.js";
import { classifyGoogleAuthError } from "./google/google-auth-error.js";
import { HTTP_STATUS } from "../../constants/http-status.js";
import { env } from "../../config/env.js";
import {
  DUMMY_PASSWORD_HASH,
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} from "../../utils/tokens.js";
import { Prisma } from "../../generated/client/index.js";
import { StorageModule } from "../storage/storage.types.js";
import { Logger } from "../../config/logger.js";

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly storageModule: StorageModule,
    private readonly googleAuthProvider: GoogleAuthProvider,
    private readonly logger: Logger,
  ) {}
  private throwInvalidCredentials(): never {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.INVALID_CREDENTIALS,
      "Invalid email or password",
    );
  }
  private throwInvalidRefreshToken(): never {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
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
          HTTP_STATUS.CONFLICT,
          ERROR_CODES.EMAIL_ALREADY_EXISTS,
          "User with this email already exists",
        );
      }
      throw err;
    }
  }
  async login(data: LoginUserInput): Promise<AuthResponse> {
    const user = await this.authRepository.findUserByEmail(data.email);

    // Google-only accounts have no password; fail fast with clear message
    if (user && user.passwordHash === null) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.INVALID_CREDENTIALS,
        "This account uses Google sign-in. Continue with Google instead.",
      );
    }

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
  buildGoogleAuthUrl(state: string): string {
    return this.googleAuthProvider.buildAuthUrl(state);
  }

  // Resolves by googleId ONLY. Re-reading by email would risk account takeover.
  private async findByGoogleIdChecked(
    googleId: string,
  ): Promise<GoogleLinkedUser | null> {
    const user = await this.authRepository.findUserByGoogleId(googleId);
    if (!user) return null;

    if (user.googleId !== googleId) {
      this.logger.error(
        "Google identity lookup returned a mismatched googleId",
        {
          expectedGoogleId: googleId,
          actualGoogleId: user.googleId,
          userId: user.id,
        },
      );
      throw this.accountConflict();
    }

    return user;
  }

  private async resolveAfterRace(
    googleId: string,
    email: string,
  ): Promise<GoogleLinkedUser> {
    const user = await this.findByGoogleIdChecked(googleId);

    if (user) {
      return user;
    }
    // Cannot fall back to email-based lookup - would enable account takeover
    this.logger.warn(
      "Google sign-in could not resolve an account after a conflict",
      {
        googleId,
        email,
      },
    );
    throw this.accountConflict();
  }

  // Deliberately vague to avoid email enumeration
  private accountConflict(): AppError {
    return new AppError(
      HTTP_STATUS.CONFLICT,
      ERROR_CODES.OAUTH_ACCOUNT_CONFLICT,
      "We couldn't sign you in with Google. Try the method you originally signed up with, or contact support.",
    );
  }

  async loginWithGoogle(code: string): Promise<AuthResponse> {
    let profile: GoogleProfile;
    try {
      profile = await this.googleAuthProvider.exchangeCodeForProfile(code);
    } catch (err) {
      throw classifyGoogleAuthError(err, this.logger);
    }

    // Prevents takeover of unverified email addresses
    if (!profile.emailVerified) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.OAUTH_EMAIL_NOT_VERIFIED,
        "Your Google email address is not verified. Verify it with Google and try again.",
      );
    }

    const user = await this.resolveGoogleUser(profile);
    const { accessToken, refreshToken } = await this.issueTokens(user);

    // googleId is an internal identity detail — strip it so the response shape
    // stays exactly what the password path returns.
    const { googleId: _googleId, ...safeUser } = user;

    return { user: safeUser, accessToken, refreshToken };
  }

  private async resolveGoogleUser(
    profile: GoogleProfile,
  ): Promise<GoogleLinkedUser> {
    const byGoogleId = await this.findByGoogleIdChecked(profile.googleId);
    if (byGoogleId) return byGoogleId;

    const byEmail = await this.authRepository.findUserByEmail(profile.email);

    if (byEmail) {
      const linked = await this.authRepository.linkGoogleIdIfUnlinked(
        byEmail.id,
        profile.googleId,
      );

      // Race condition: another request linked this account first
      if (linked === 0) {
        return this.resolveAfterRace(profile.googleId, profile.email);
      }

      const { passwordHash: _passwordHash, ...safeUser } = byEmail;
      return { ...safeUser, googleId: profile.googleId };
    }

    try {
      const created = await this.authRepository.createUser({
        name: profile.name,
        email: profile.email,
        googleId: profile.googleId,
      });
      return { ...created, googleId: profile.googleId };
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        // Unique constraint race: googleId or email conflict
        this.logger.warn(
          "Google sign-in insert lost a unique-constraint race",
          {
            googleId: profile.googleId,
            constraint: (err.meta as { target?: string[] } | undefined)?.target,
          },
        );
        return this.resolveAfterRace(profile.googleId, profile.email);
      }
      throw err;
    }
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

    // Natural expiry is not a theft signal
    if (stored.expiresAt < new Date()) {
      this.throwInvalidRefreshToken();
    }

    // Atomically claim token; if already revoked, cascade revoke whole family
    const claimed = await this.authRepository.revokeRefreshTokenIfLive(
      stored.id,
    );

    if (!claimed) {
      await this.authRepository.revokeFamily(stored.familyId);
      this.throwInvalidRefreshToken();
    }

    const user = await this.authRepository.findUserByIdOmittingPassword(
      payload.sub,
    );

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
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "User not found",
      );
    }

    return user;
  }

  // Collects file paths before cascade delete; storage cleanup is best-effort
  async deleteAccount(userId: string): Promise<void> {
    const filePaths = await this.authRepository.findResumeFilePaths(userId);

    const deletedCount = await this.authRepository.deleteUser(userId);
    if (deletedCount === 0) {
      throw new AppError(
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        "User not found",
      );
    }

    // Parallel deletion; failures logged but don't block account deletion
    await Promise.all(
      filePaths.map(async (filePath) => {
        try {
          await this.storageModule.deleteFile(filePath);
        } catch (cleanupError) {
          this.logger.error(
            "Failed to delete resume file during account deletion",
            {
              userId,
              filePath,
              cleanupError,
            },
          );
        }
      }),
    );
  }
}
