import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/http-status.js";
import { ERROR_CODES } from "../constants/error-codes.js";

// Guards routes that call Gemini (resume structuring, evidence assessment,
// roadmap generation) from runaway or scripted usage burning API spend. Keyed per
// authenticated user rather than per-IP — must run after requireAuth so
// req.user is populated. 10 requests / 5 minutes comfortably covers real
// usage (each call takes several seconds) while capping worst-case cost.
// req.user should always be set here (route runs after requireAuth), but the
// IP fallback still needs express-rate-limit's ipKeyGenerator — it normalizes
// IPv6 addresses to a subnet so differing textual forms of the same address
// can't be used to dodge the limit.
export const aiRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) =>
    req.user?.sub ?? ipKeyGenerator(req.ip ?? "unknown"),
  handler: (_req: Request, res: Response) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      error: {
        code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
        message:
          "Too many AI requests. Please wait a few minutes and try again.",
      },
    });
  },
});
