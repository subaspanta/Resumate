import { NextFunction, Request, Response } from "express";
import { z, ZodType } from "zod";

import { AppError } from "../types/app-error.js";
import { ERROR_CODES } from "../types/error-codes.js";

export const validateRequest =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new AppError(
          400,
          ERROR_CODES.VALIDATION_ERROR,
          "Validation failed",
          z.treeifyError(result.error),
        ),
      );
    }

    req.body = result.data;

    next();
  };
