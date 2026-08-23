import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/http-status.js";
import { ERROR_CODES } from "../constants/error-codes.js";

// Guards /auth/login and /auth/register. Keyed by IP — like oauthRateLimit,
// there is no session yet at this point in the flow. Tighter than
// oauthRateLimit's 20/15min: unlike an OAuth redirect/callback pair, these
// two routes are the direct target of credential stuffing and scripted
// account creation, so the ceiling has to bite much earlier.
export const authCredentialsRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
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

// Guards /auth/refresh. Also IP-keyed — no session at this point either, and
// the refresh token itself already proves possession, so this exists only to
// cap raw request volume. Looser than authCredentialsRateLimit: the axios
// interceptor calls this automatically on every 401 across every open tab,
// so legitimate traffic is bursty in a way login/register never are.
export const authRefreshRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => ipKeyGenerator(req.ip ?? "unknown"),
  handler: (_req: Request, res: Response) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      error: {
        code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
        message:
          "Too many session refresh attempts. Please wait a few minutes and try again.",
      },
    });
  },
});
