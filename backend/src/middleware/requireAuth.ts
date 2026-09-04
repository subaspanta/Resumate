import { Request, Response, NextFunction } from "express";
import { AppError } from "../types/app-error.js";
import { ERROR_CODES } from "../constants/error-codes.js";
import { HTTP_STATUS } from "../constants/http-status.js";
import { verifyAccessToken } from "../utils/tokens.js";

const unauthorizedError = () =>
  new AppError(
    HTTP_STATUS.UNAUTHORIZED,
    ERROR_CODES.UNAUTHORIZED,
    "Authentication token is missing or invalid",
  );

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.accessToken;
  const payload = token ? verifyAccessToken(token) : null;
  if (!payload) {
    throw unauthorizedError();
  }
  req.user = payload;

  next();
};
