import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodIssue } from "zod";
import { AppError } from "../types/app-error.js";
import { ERROR_CODES } from "../constants/error-codes.js";

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues
        .map((e: ZodIssue) => `${e.path.join(".")}: ${e.message}`)
        .join(", ");

      next(new AppError(400, ERROR_CODES.VALIDATION_FAILED, message));
      return;
    }

    req.body = result.data;
    next();
  };
};
