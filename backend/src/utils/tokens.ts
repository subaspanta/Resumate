import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";

const JWT_SECRET = env.JWT_SECRET;

export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "15m",
  });
}

export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (
      typeof payload === "object" &&
      payload !== null &&
      "sub" in payload &&
      "email" in payload
    ) {
      return payload as JwtPayload;
    }

    return null;
  } catch {
    return null;
  }
}
