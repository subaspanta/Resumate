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
    // Express 5 makes req.query a read-only getter that re-parses the URL on
    // every access, so it can neither be reassigned nor mutated in place.
    // Shadow it with an own data property holding the validated/transformed value.
    Object.defineProperty(req, "query", {
      value: result.data,
      writable: true,
      configurable: true,
      enumerable: true,
    });
    next();
  };
