import { afterAll, describe, expect, it } from "vitest";
import { AuthService } from "../../../src/modules/auth/auth.service.js";
import { AuthRepository } from "../../../src/modules/auth/auth.repository.js";
import { prisma } from "../../../src/lib/prisma.js";
import { logger } from "../../../src/config/logger.js";
import { AppError } from "../../../src/types/app-error.js";
import { ERROR_CODES } from "../../../src/constants/error-codes.js";
import {
  GoogleAuthProvider,
  GoogleProfile,
} from "../../../src/modules/auth/google/google-auth.types.js";
import { StorageModule } from "../../../src/modules/storage/storage.types.js";

// Fake provider: returns whatever the test scripts, never touches the network.
// Safe to call repeatedly — the concurrency cases below invoke it twice.
function fakeProvider(profile: GoogleProfile): GoogleAuthProvider {
  return {
    buildAuthUrl: (state: string) => `https://example.test/auth?state=${state}`,
    async exchangeCodeForProfile() {
      return profile;
    },
  };
}

function failingProvider(error: unknown): GoogleAuthProvider {
  return {
    buildAuthUrl: () => "https://example.test/auth",
    async exchangeCodeForProfile(): Promise<GoogleProfile> {
      throw error;
    },
  };
}

// Storage is only reached by deleteAccount, never by the Google paths.
const unusedStorage: StorageModule = {
  async saveFile() {
    throw new Error("not used in these tests");
  },
  async deleteFile() {},
};

function buildService(
  provider: GoogleAuthProvider,
  repository: AuthRepository = new AuthRepository(prisma),
) {
  return new AuthService(repository, unusedStorage, provider, logger);
}

function googleProfile(overrides: Partial<GoogleProfile> = {}): GoogleProfile {
  const unique = crypto.randomUUID();
  return {
    googleId: `sub-${unique}`,
    email: `google-${unique}@example.com`,
    emailVerified: true,
    name: "Google User",
    ...overrides,
  };
}

describe("AuthService.loginWithGoogle", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates an account with no password for a new verified email", async () => {
    const profile = googleProfile();
    const service = buildService(fakeProvider(profile));

    const result = await service.loginWithGoogle("any-code");

    expect(result.user.email).toBe(profile.email);
    expect(result.accessToken).toBeTruthy();

    const row = await prisma.user.findUniqueOrThrow({
      where: { id: result.user.id },
    });
    expect(row.googleId).toBe(profile.googleId);
    expect(row.passwordHash).toBeNull();

    // googleId is internal — it must not ride along in the response shape.
    expect(result.user).not.toHaveProperty("googleId");
  });

  it("links an existing password account without touching its password", async () => {
    const profile = googleProfile();
    const existing = await prisma.user.create({
      data: {
        name: "Existing",
        email: profile.email,
        passwordHash: "original-hash",
      },
    });

    const result = await buildService(fakeProvider(profile)).loginWithGoogle(
      "any-code",
    );

    expect(result.user.id).toBe(existing.id);

    const row = await prisma.user.findUniqueOrThrow({
      where: { id: existing.id },
    });
    expect(row.googleId).toBe(profile.googleId);
    expect(row.passwordHash).toBe("original-hash");

    const sameEmail = await prisma.user.findMany({
      where: { email: profile.email },
    });
    expect(sameEmail).toHaveLength(1);
  });

  it("returns the same row for a returning Google user", async () => {
    const profile = googleProfile();
    const service = buildService(fakeProvider(profile));

    const first = await service.loginWithGoogle("any-code");
    const second = await service.loginWithGoogle("any-code");

    expect(second.user.id).toBe(first.user.id);
    const rows = await prisma.user.findMany({
      where: { email: profile.email },
    });
    expect(rows).toHaveLength(1);
  });

  it("refuses an unverified Google email and writes nothing", async () => {
    const profile = googleProfile({ emailVerified: false });
    const service = buildService(fakeProvider(profile));

    await expect(service.loginWithGoogle("any-code")).rejects.toMatchObject({
      statusCode: 401,
      code: ERROR_CODES.OAUTH_EMAIL_NOT_VERIFIED,
    });

    const rows = await prisma.user.findMany({
      where: { email: profile.email },
    });
    expect(rows).toHaveLength(0);
  });

  it("surfaces a provider failure as an AppError, never the raw error", async () => {
    const service = buildService(failingProvider(new Error("socket hang up")));

    const error = await service.loginWithGoogle("bad-code").catch((e) => e);

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe(ERROR_CODES.OAUTH_EXCHANGE_FAILED);
    expect(error.message).not.toContain("socket hang up");
  });

  it("persists the refresh token, proving issueTokens was reused", async () => {
    const profile = googleProfile();
    const result = await buildService(fakeProvider(profile)).loginWithGoogle(
      "any-code",
    );

    const tokens = await prisma.refreshToken.findMany({
      where: { userId: result.user.id },
    });
    expect(tokens).toHaveLength(1);
    expect(tokens[0].revokedAt).toBeNull();
  });

  // The interleaving these cover only exists while both calls are in flight,
  // so they must run concurrently rather than as sequential awaits.
  //
  // What they assert is *account* convergence — one row, one identity — and
  // that both racers get a session: refresh tokens carry a jti nonce, so two
  // issuances in the same second no longer collide on the @unique tokenHash.
  it("converges on one row when two sign-ins race for a new identity", async () => {
    const profile = googleProfile();
    const service = buildService(fakeProvider(profile));

    const results = await Promise.allSettled([
      service.loginWithGoogle("code-a"),
      service.loginWithGoogle("code-b"),
    ]);

    // Exactly one account must exist.
    const rows = await prisma.user.findMany({
      where: { email: profile.email },
    });
    expect(rows).toHaveLength(1);
    expect(rows[0].googleId).toBe(profile.googleId);

    // Both racers must succeed, and neither may resolve to another account.
    for (const result of results) {
      expect(result.status).toBe("fulfilled");
      if (result.status === "fulfilled") {
        expect(result.value.user.id).toBe(rows[0].id);
      }
    }
  });

  it("links once when two sign-ins race for an existing account", async () => {
    const profile = googleProfile();
    const existing = await prisma.user.create({
      data: {
        name: "Racer",
        email: profile.email,
        passwordHash: "original-hash",
      },
    });
    const service = buildService(fakeProvider(profile));

    const results = await Promise.allSettled([
      service.loginWithGoogle("code-a"),
      service.loginWithGoogle("code-b"),
    ]);

    const row = await prisma.user.findUniqueOrThrow({
      where: { id: existing.id },
    });
    expect(row.googleId).toBe(profile.googleId);
    expect(row.passwordHash).toBe("original-hash");

    // No duplicate account was created by the losing call.
    const sameEmail = await prisma.user.findMany({
      where: { email: profile.email },
    });
    expect(sameEmail).toHaveLength(1);

    for (const result of results) {
      expect(result.status).toBe("fulfilled");
      if (result.status === "fulfilled") {
        expect(result.value.user.id).toBe(existing.id);
      }
    }
  });

  it("refuses to rebind an email already held by a different Google identity", async () => {
    const email = `recycled-${crypto.randomUUID()}@example.com`;
    const original = await prisma.user.create({
      data: {
        name: "Original",
        email,
        googleId: `sub-original-${crypto.randomUUID()}`,
      },
    });

    const service = buildService(
      fakeProvider(
        googleProfile({
          email,
          googleId: `sub-different-${crypto.randomUUID()}`,
        }),
      ),
    );

    await expect(service.loginWithGoogle("any-code")).rejects.toMatchObject({
      statusCode: 409,
      code: ERROR_CODES.OAUTH_ACCOUNT_CONFLICT,
    });

    // The takeover assertion: the incumbent identity is untouched.
    const row = await prisma.user.findUniqueOrThrow({
      where: { id: original.id },
    });
    expect(row.googleId).toBe(original.googleId);
  });

  it("refuses to return a user whose googleId does not match the one being resolved", async () => {
    // Tests above all drive resolveAfterRace through a correct repository, so
    // they pass whether or not the invariant check exists. This one attacks it
    // directly: the stub stands in for a future refactor that "simplifies" the
    // recovery lookup to findUserByEmail, which would resolve to a row
    // belonging to someone else's Google identity.
    const email = `victim-${crypto.randomUUID()}@example.com`;
    const victim = await prisma.user.create({
      data: {
        name: "Victim",
        email,
        googleId: `sub-victim-${crypto.randomUUID()}`,
      },
    });

    const repository = new AuthRepository(prisma);
    const contractViolatingRepo = Object.assign(
      Object.create(AuthRepository.prototype) as AuthRepository,
      repository,
      {
        // Returns the victim regardless of which googleId was asked for.
        async findUserByGoogleId() {
          return {
            id: victim.id,
            name: victim.name,
            email: victim.email,
            googleId: victim.googleId,
            createdAt: victim.createdAt,
            updatedAt: victim.updatedAt,
          };
        },
      },
    );

    // Force the recovery path: the email collides with the victim's row, whose
    // googleId is already set, so the link write matches nothing.
    const attacker = googleProfile({
      email,
      googleId: `sub-attacker-${crypto.randomUUID()}`,
    });
    const service = buildService(fakeProvider(attacker), contractViolatingRepo);

    await expect(service.loginWithGoogle("any-code")).rejects.toMatchObject({
      statusCode: 409,
      code: ERROR_CODES.OAUTH_ACCOUNT_CONFLICT,
    });

    // The concrete harm the invariant prevents: no session minted for an
    // account the caller does not own.
    const tokens = await prisma.refreshToken.findMany({
      where: { userId: victim.id },
    });
    expect(tokens).toHaveLength(0);
  });
});
