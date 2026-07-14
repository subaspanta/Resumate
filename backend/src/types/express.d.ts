import { JwtPayload } from "jsonwebtoken";

type AuthPayload = { sub: string; email: string } & JwtPayload;

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export {};
