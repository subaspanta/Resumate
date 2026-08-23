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
import { logger } from "../../config/logger.js";

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly storageModule: StorageModule,
    private readonly googleAuthProvider: GoogleAuthProvider,
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

    // A Google-only account has no password to compare against. The dummy-hash
    // fallback below would handle the null safely, but it would tell the user
    // their password is wrong when the real answer is that this account has no
    // password — a dead end they can never resolve by retyping it.
    //
    // This branch returns faster than a bcrypt compare, which reveals that an
    // account exists on this address and is Google-linked. Accepted: the
    // alternative is a sign-in page that can never explain itself.
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

  /** Resolves an account after a conflict on the sign-in path: the link-write
   *  matched nothing, or the insert lost a unique-constraint race. Both mean
   *  another request touched this account between our read and our write.
   *
   *  Keyed on googleId and ONLY googleId. Re-reading by email here would
   *  resolve to a row that may carry a *different* Google identity, handing
   *  this sign-in an account it does not own — the exact takeover this flow
   *  exists to prevent. Do not "simplify" this to findUserByEmail; the email
   *  parameter is for logging only. */
  /** The ONLY way this service reads a user by Google identity.
   *
   *  Every result is checked to actually carry the googleId that was asked
   *  for. The repository query is already keyed on it, so a mismatch can only
   *  mean the lookup was rewritten (to findUserByEmail, to a fuzzy match, to a
   *  cache) or its select drifted — this turns that class of mistake from a
   *  silent account handover into a loud 409. Callers must not call
   *  authRepository.findUserByGoogleId directly and skip this. */
  private async findByGoogleIdChecked(
    googleId: string,
  ): Promise<GoogleLinkedUser | null> {
    const user = await this.authRepository.findUserByGoogleId(googleId);
    if (!user) return null;

    if (user.googleId !== googleId) {
      logger.error("Google identity lookup returned a mismatched googleId", {
        expectedGoogleId: googleId,
        actualGoogleId: user.googleId,
        userId: user.id,
      });
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

    // Nothing carries this googleId, so either the winning insert rolled back,
    // or this email is already bound to a different Google identity (a
    // recycled or reassigned address). Neither is recoverable here, and
    // neither may fall through to an email-keyed lookup.
    logger.warn("Google sign-in could not resolve an account after a conflict", {
      googleId,
      email,
    });
    throw this.accountConflict();
  }

  // Deliberately does not say *why*. The conflicting account may be
  // password-only, Google-only, or both, and naming the cause would confirm
  // that an account exists on this address at all — exactly what someone who
  // just acquired a recycled address would want to learn.
  private accountConflict(): AppError {
    return new AppError(
      HTTP_STATUS.CONFLICT,
      ERROR_CODES.OAUTH_ACCOUNT_CONFLICT,
      "We couldn't sign you in with Google. Try the method you originally signed up with, or contact support.",
    );
  }

  async loginWithGoogle(code: string): Promise<AuthResponse> {
    // Wrapped here as well as inside GoogleOAuthProvider: the provider is an
    // injected interface, so this service cannot assume every implementation
    // classifies its own failures. classifyGoogleAuthError passes an existing
    // AppError through untouched, so double-wrapping costs nothing.
    let profile: GoogleProfile;
    try {
      profile = await this.googleAuthProvider.exchangeCodeForProfile(code);
    } catch (err) {
      throw classifyGoogleAuthError(err);
    }

    // Auto-linking on an unverified address would let anyone who can register
    // that address at Google take over an existing ResuMate account.
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

      // count === 0 means the row gained a googleId between the read above and
      // this write. Do NOT reuse `byEmail` here — the identity it now carries
      // may not be this caller's.
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
        // Either unique index can fire: googleId means a concurrent callback
        // for this same identity committed first; email means the address was
        // claimed between our read and this insert. The recovery is the same
        // either way, and is safe because it resolves by googleId, never email.
        logger.warn("Google sign-in insert lost a unique-constraint race", {
          googleId: profile.googleId,
          constraint: (err.meta as { target?: string[] } | undefined)?.target,
        });
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

    // Parallel, not sequential: each deleteFile is an independent Cloudinary
    // round trip, and a serial loop pays their full latency once per resume.
    // Each iteration catches its own failure, so one bad delete can neither
    // reject the whole Promise.all nor block the ones after it — matching
    // the account-still-gone-either-way reasoning above.
    await Promise.all(
      filePaths.map(async (filePath) => {
        try {
          await this.storageModule.deleteFile(filePath);
        } catch (cleanupError) {
          logger.error(
            "Failed to delete resume file during account deletion",
            { userId, filePath, cleanupError },
          );
        }
      }),
    );
  }
}
