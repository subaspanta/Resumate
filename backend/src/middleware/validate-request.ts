import { NextFunction, Request, Response } from "express";
import { z, ZodType } from "zod";

import { AppError } from "../types/app-error.js";
import { ERROR_CODES } from "../constants/error-codes.js";

export const validateRequest =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new AppError(
          400,
          ERROR_CODES.VALIDATION_FAILED,
          "Validation failed",
          z.treeifyError(result.error),
        ),
      );
    }

    req.body = result.data;

    next();
  };

export const validateParams =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return next(
        new AppError(
          400,
          ERROR_CODES.VALIDATION_FAILED,
          "Validation failed",
          z.treeifyError(result.error),
        ),
      );
    }
    req.params = result.data as typeof req.params;
    next();
  };

export const validateQuery =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return next(
        new AppError(
          400,
          ERROR_CODES.VALIDATION_FAILED,
          "Validation failed",
          z.treeifyError(result.error),
        ),
      );
    }

    Object.defineProperty(req, "query", {
      value: result.data,
      writable: true,
      configurable: true,
      enumerable: true,
    });
    next();
  };
