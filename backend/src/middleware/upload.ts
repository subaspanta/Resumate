import multer, { FileFilterCallback } from "multer";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../types/app-error.js";
import { ERROR_CODES } from "../constants/error-codes.js";
import { HTTP_STATUS } from "../constants/http-status.js";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(
      new AppError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.UNSUPPORTED_FILE_TYPE,
        "Only PDF and DOCX files are supported",
      ),
    );
    return;
  }
  cb(null, true);
};

const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 1 },
  fileFilter,
});

export const uploadSingleFile =
  (fieldName: string) => (req: Request, res: Response, next: NextFunction) => {
    multerUpload.single(fieldName)(req, res, (err: unknown) => {
      if (!err) {
        next();
        return;
      }

      if (err instanceof AppError) {
        next(err);
        return;
      }

      if (err instanceof multer.MulterError) {
        let appError: AppError | null = null;
        const code = err.code as string;

        switch (code) {
          case "LIMIT_FILE_SIZE":
            appError = new AppError(
              HTTP_STATUS.BAD_REQUEST,
              ERROR_CODES.FILE_TOO_LARGE,
              `File exceeds the ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB limit`,
            );
            break;
          case "LIMIT_FILE_COUNT":
            appError = new AppError(
              HTTP_STATUS.BAD_REQUEST,
              ERROR_CODES.VALIDATION_FAILED,
              "Only 1 file is allowed",
            );
            break;
          case "LIMIT_UNEXPECTED_FILE":
            appError = new AppError(
              HTTP_STATUS.BAD_REQUEST,
              ERROR_CODES.VALIDATION_FAILED,
              `File must be uploaded to the '${fieldName}' field`,
            );
            break;
          case "LIMIT_PART_COUNT":
            appError = new AppError(
              HTTP_STATUS.BAD_REQUEST,
              ERROR_CODES.VALIDATION_FAILED,
              "Too many parts in the request",
            );
            break;
          case "LIMIT_FIELD_COUNT":
            appError = new AppError(
              HTTP_STATUS.BAD_REQUEST,
              ERROR_CODES.VALIDATION_FAILED,
              "Too many fields in the request",
            );
            break;
        }

        if (appError) {
          next(appError);
          return;
        }
      }

      next(err);
    });
  };
