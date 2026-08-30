import jwt, { JwtPayload } from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env.js";
import { ERROR_CODES } from "../constants/error-codes.js";
import { AppError } from "../types/app-error.js";

const JWT_SECRET = env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = env.REFRESH_TOKEN_SECRET;

export const DUMMY_PASSWORD_HASH =
  "$2b$12$7Z0g1y6Q5z8Fq3J9kL1eOeW8vG9x5Y6zQ1a2b3c4d5e6f7g8h9i0j";

function isTokenPayload(
  payload: unknown,
): payload is { sub: string; email: string } & JwtPayload {
  return (
    typeof payload === "object" &&
    payload !== null &&
    typeof (payload as any).sub === "string" &&
    typeof (payload as any).email === "string"
  );
}

export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyAccessToken(
  token: string,
): ({ sub: string; email: string } & JwtPayload) | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return isTokenPayload(payload) ? payload : null;
  } catch {
    return null;
  }
}

export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(
    { ...payload, jti: crypto.randomUUID() },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: Math.floor(env.REFRESH_COOKIE_MAX_AGE / 1000),
    } as jwt.SignOptions,
  );
}

export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    const payload = jwt.verify(token, REFRESH_TOKEN_SECRET);
    return isTokenPayload(payload) ? payload : null;
  } catch {
    return null;
  }
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
