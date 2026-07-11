import jwt, { JwtPayload } from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env.js";

const JWT_SECRET = env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = env.REFRESH_TOKEN_SECRET;

function isTokenPayload(payload: unknown): payload is JwtPayload {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "sub" in payload &&
    "email" in payload
  );
}

export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return isTokenPayload(payload) ? payload : null;
  } catch {
    return null;
  }
}

export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: Math.floor(env.REFRESH_COOKIE_MAX_AGE / 1000),
  } as jwt.SignOptions);
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
