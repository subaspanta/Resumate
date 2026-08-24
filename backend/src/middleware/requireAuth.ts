import { Request, Response, NextFunction } from "express";
import { AppError } from "../types/app-error.js";
import { ERROR_CODES } from "../constants/error-codes.js";
import { HTTP_STATUS } from "../constants/http-status.js";
import { verifyAccessToken } from "../utils/tokens.js";

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.accessToken;
  if (!token) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.UNAUTHORIZED,
      "Authentication token is missing or invalid",
    );
  }
  const payload = verifyAccessToken(token);
  if (!payload) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.UNAUTHORIZED,
      "Authentication token is missing or invalid",
    );
  }
  req.user = payload;

  next();
};
