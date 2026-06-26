import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

type JwtPayload = {
  sub: string;
  email: string;
};

const JWT_SECRET = env.JWT_SECRET;

export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "15m",
  });
}

export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}
