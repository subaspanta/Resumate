import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/http-status.js";
import { ERROR_CODES } from "../constants/error-codes.js";

// Guards the two Google OAuth routes. Keyed by IP rather than req.user, unlike
// aiRateLimit — there is no session at this point in the flow, by definition.
// ipKeyGenerator normalizes IPv6 addresses to a subnet so differing textual
// forms of the same address can't be used to dodge the limit.
//
// 20 / 15 min: a real sign-in is one redirect plus one callback, so the ceiling
// only bites scripted code-guessing and consent-screen spam.
export const oauthRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => ipKeyGenerator(req.ip ?? "unknown"),
  handler: (_req: Request, res: Response) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      error: {
        code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
        message:
          "Too many sign-in attempts. Please wait a few minutes and try again.",
      },
    });
  },
});
