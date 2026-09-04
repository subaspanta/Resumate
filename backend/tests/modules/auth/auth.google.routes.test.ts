import { afterAll, describe, expect, it } from "vitest";
import express from "express";
import cookieParser from "cookie-parser";
import request from "supertest";
import app from "../../../src/app.js";
import { prisma } from "../../../src/lib/prisma.js";
import { AuthController } from "../../../src/modules/auth/auth.controller.js";
import { AuthService } from "../../../src/modules/auth/auth.service.js";
import { AuthRepository } from "../../../src/modules/auth/auth.repository.js";
import { logger } from "../../../src/config/logger.js";
import { AppError } from "../../../src/types/app-error.js";
import { ERROR_CODES } from "../../../src/constants/error-codes.js";
import {
  googleCallbackQuerySchema,
  loginUserSchema,
} from "../../../src/modules/auth/auth.schema.js";
import {
  validateQuery,
  validateRequest,
} from "../../../src/middleware/validate-request.js";
import {
  GoogleAuthProvider,
  GoogleProfile,
} from "../../../src/modules/auth/google/google-auth.types.js";
import { StorageModule } from "../../../src/modules/storage/storage.types.js";

function cookiesOf(res: request.Response): string[] {
  const raw = res.headers["set-cookie"];
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

describe("Google OAuth routes (real container)", () => {
  // These all fail before the container's real GoogleOAuthProvider is reached,
  // so no request here touches Google's network.
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("redirects to Google and sets a hardened state cookie", async () => {
    const res = await request(app).get("/api/v1/auth/google");

    expect(res.status).toBe(302);
    expect(res.headers.location).toMatch(/^https:\/\/accounts\.google\.com\//);

    const state = cookiesOf(res).find((c) => c.startsWith("oauthState="));
    expect(state).toBeDefined();
    // A state cookie readable by JS, or scoped to "/", weakens the CSRF guard
    // the whole flow rests on.
    expect(state).toContain("HttpOnly");
    expect(state).toMatch(/SameSite=Lax/i);
    expect(state).toContain("Path=/api/v1/auth");
  });

  it("rejects a callback with no query params", async () => {
    const res = await request(app).get("/api/v1/auth/google/callback");

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe(ERROR_CODES.VALIDATION_FAILED);
  });

  it("rejects a callback with no state cookie", async () => {
    const res = await request(app).get(
      "/api/v1/auth/google/callback?code=abc&state=xyz",
    );

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe(ERROR_CODES.OAUTH_STATE_INVALID);
  });

  it("rejects a callback whose state does not match the cookie", async () => {
    const res = await request(app)
      .get("/api/v1/auth/google/callback?code=abc&state=xyz")
      .set("Cookie", ["oauthState=something-else"]);

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe(ERROR_CODES.OAUTH_STATE_INVALID);
  });
});

// The success path cannot run against the real container: it gets past the
// state check and into the real GoogleOAuthProvider, which would call Google.
// The container builds everything eagerly at import, so there is no seam to
// swap a fake into the shared app — mount a hand-wired controller instead.
// Real repository against the real DB, fake only the outbound edge, matching
// the idiom in career-analysis.service.test.ts.
function buildAppWithFakeProvider(profile: GoogleProfile) {
  const provider: GoogleAuthProvider = {
    buildAuthUrl: (state) => `https://accounts.google.com/fake?state=${state}`,
    async exchangeCodeForProfile() {
      return profile;
    },
  };

  const storage: StorageModule = {
    async saveFile() {
      throw new Error("not used in these tests");
    },
    async deleteFile() {},
  };

  const controller = new AuthController(
    new AuthService(new AuthRepository(prisma), storage, provider, logger),
  );

  const testApp = express();
  testApp.use(express.json());
  testApp.use(cookieParser());
  testApp.get("/api/v1/auth/google", controller.googleRedirect);
  testApp.get(
    "/api/v1/auth/google/callback",
    validateQuery(googleCallbackQuerySchema),
    controller.googleCallback,
  );
  testApp.post(
    "/api/v1/auth/login",
    validateRequest(loginUserSchema),
    controller.login,
  );

  // Mirrors the envelope shape of the real handler in app.ts.
  testApp.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      if (err instanceof AppError) {
        res
          .status(err.statusCode)
          .json({
            success: false,
            error: { code: err.code, message: err.message },
          });
        return;
      }
      res.status(500).json({
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_SERVER_ERROR,
          message: "Internal Server Error",
        },
      });
    },
  );

  return testApp;
}

describe("Google OAuth callback success path", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("clears the state cookie and sets the session cookies on success", async () => {
    const unique = crypto.randomUUID();
    const testApp = buildAppWithFakeProvider({
      googleId: `sub-${unique}`,
      email: `callback-${unique}@example.com`,
      emailVerified: true,
      name: "Callback User",
    });

    const state = "a-known-state-value";
    const res = await request(testApp)
      .get(`/api/v1/auth/google/callback?code=good-code&state=${state}`)
      .set("Cookie", [`oauthState=${state}`]);

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe(process.env.FRONTEND_URL);

    const cookies = cookiesOf(res);
    const cleared = cookies.find((c) => c.startsWith("oauthState="));

    expect(cleared).toBeDefined();
    // Empty value plus an expiry in the past is what actually removes it.
    // Assert the date is past rather than matching a literal epoch string —
    // Express documents only "sets its expiration date in the past".
    expect(cleared).toMatch(/^oauthState=;/);
    const expires = cleared!.match(/Expires=([^;]+)/)?.[1];
    expect(expires).toBeDefined();
    expect(new Date(expires!).getTime()).toBeLessThan(Date.now());

    // Express only clears a cookie when clearCookie's attributes match the
    // ones res.cookie set. A differing Path emits a normal-looking Set-Cookie
    // while the stale nonce survives in the browser, replayable for its full
    // 10-minute life.
    expect(cleared).toContain("Path=/api/v1/auth");
    expect(cleared).toContain("HttpOnly");
    expect(cleared).toMatch(/SameSite=Lax/i);

    // And the session was actually issued alongside it.
    expect(cookies.some((c) => c.startsWith("accessToken="))).toBe(true);
    expect(cookies.some((c) => c.startsWith("refreshToken="))).toBe(true);

    // No JSON body — a browser navigation, not a fetch.
    expect(res.body).toEqual({});
  });

  it("rejects a password login for a Google-only account", async () => {
    const unique = crypto.randomUUID();
    const email = `googleonly-${unique}@example.com`;
    await prisma.user.create({
      data: { name: "Google Only", email, googleId: `sub-${unique}` },
    });

    const testApp = buildAppWithFakeProvider({
      googleId: `sub-${unique}`,
      email,
      emailVerified: true,
      name: "Google Only",
    });

    const res = await request(testApp)
      .post("/api/v1/auth/login")
      .send({ email, password: "whatever-they-type" });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe(ERROR_CODES.INVALID_CREDENTIALS);
    expect(res.body.error.message).toContain("Google");
  });
});
