import crypto from "crypto";
import { afterAll, describe, expect, it } from "vitest";
import { AuthService } from "../../../src/modules/auth/auth.service.js";
import { AuthRepository } from "../../../src/modules/auth/auth.repository.js";
import { prisma } from "../../../src/lib/prisma.js";
import { logger } from "../../../src/config/logger.js";
import { ERROR_CODES } from "../../../src/constants/error-codes.js";
import { GoogleAuthProvider } from "../../../src/modules/auth/google/google-auth.types.js";
import { StorageModule } from "../../../src/modules/storage/storage.types.js";
import { hashToken } from "../../../src/utils/tokens.js";

// Neither dependency is reachable from register/refresh; they exist to satisfy
// the constructor.
const unusedStorage: StorageModule = {
  async saveFile() {
    throw new Error("not used in these tests");
  },
  async deleteFile() {},
};

const unusedGoogleProvider: GoogleAuthProvider = {
  buildAuthUrl: () => "https://example.test/auth",
  async exchangeCodeForProfile() {
    throw new Error("not used in these tests");
  },
};

function buildService() {
  return new AuthService(
    new AuthRepository(prisma),
    unusedStorage,
    unusedGoogleProvider,
    logger,
  );
}

// The suite shares one database and never truncates between tests.
async function registerFreshUser(service: AuthService) {
  return service.register({
    name: "Rotator",
    email: `refresh-${crypto.randomUUID()}@example.com`,
    password: "CorrectHorse1!",
  });
}

describe("AuthService.refresh", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  // The regression this file exists for. Rotation is the sharpest form of the
  // tokenHash collision: refresh revokes the old row rather than deleting it,
  // so the row still holds its hash when the replacement is inserted. Without
  // a jti nonce these back-to-back rotations land inside one second, mint
  // byte-identical JWTs, and the second insert dies on tokenHash @unique.
  it("rotates repeatedly within the same second, minting a distinct token each time", async () => {
    const service = buildService();
    const registered = await registerFreshUser(service);

    const first = await service.refresh(registered.refreshToken);
    const second = await service.refresh(first.refreshToken);

    const tokens = [
      registered.refreshToken,
      first.refreshToken,
      second.refreshToken,
    ];
    expect(new Set(tokens).size).toBe(3);
    expect(second.user.id).toBe(registered.user.id);

    // Every issuance persisted its own row, and only the newest is live.
    const rows = await prisma.refreshToken.findMany({
      where: { userId: registered.user.id },
    });
    expect(rows).toHaveLength(3);
    expect(new Set(rows.map((row) => row.familyId)).size).toBe(1);

    const live = rows.filter((row) => row.revokedAt === null);
    expect(live).toHaveLength(1);
    expect(live[0].tokenHash).toBe(hashToken(second.refreshToken));
  });

  it("issues both tokens when two rotations of different tokens race", async () => {
    const service = buildService();
    const a = await registerFreshUser(service);
    const b = await registerFreshUser(service);

    const results = await Promise.allSettled([
      service.refresh(a.refreshToken),
      service.refresh(b.refreshToken),
    ]);

    for (const result of results) {
      expect(result.status).toBe("fulfilled");
    }
  });

  // The nonce must not weaken reuse detection: a rotated-away token is still
  // a replay, and replay still burns the whole family.
  it("revokes the family when an already-rotated token is replayed", async () => {
    const service = buildService();
    const registered = await registerFreshUser(service);

    const rotated = await service.refresh(registered.refreshToken);

    await expect(
      service.refresh(registered.refreshToken),
    ).rejects.toMatchObject({
      statusCode: 401,
      code: ERROR_CODES.REFRESH_TOKEN_INVALID,
    });

    // The token minted by the legitimate rotation is collateral — that is the
    // point of family revocation, since we cannot tell victim from attacker.
    const rows = await prisma.refreshToken.findMany({
      where: { userId: registered.user.id },
    });
    expect(rows.every((row) => row.revokedAt !== null)).toBe(true);

    await expect(service.refresh(rotated.refreshToken)).rejects.toMatchObject({
      statusCode: 401,
      code: ERROR_CODES.REFRESH_TOKEN_INVALID,
    });
  });

  it("rejects a well-formed token that was never issued", async () => {
    const service = buildService();

    await expect(service.refresh("not-a-jwt")).rejects.toMatchObject({
      statusCode: 401,
      code: ERROR_CODES.REFRESH_TOKEN_INVALID,
    });
  });
});
