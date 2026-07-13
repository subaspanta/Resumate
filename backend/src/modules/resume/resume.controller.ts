import { Request, Response, NextFunction } from "express";
import { ResumeService } from "./resume.service.js";
import { AppError } from "../../types/app-error.js";
import { ERROR_CODES } from "../../constants/error-codes.js";
import { HTTP_STATUS } from "../../constants/http-status.js";

export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  listResumes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError(
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_CODES.UNAUTHORIZED,
          "User authentication required",
        );
      }

      const resumes = await this.resumeService.listResumesByUserId(
        req.user.sub,
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: resumes,
      });
    } catch (error) {
      next(error);
    }
  };

  getResumeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.sub;
      const { id } = req.params;
    } catch (error) {
      next(error);
    }
  };

  uploadResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new AppError(
          HTTP_STATUS.BAD_REQUEST,
          ERROR_CODES.VALIDATION_FAILED,
          "No file was uploaded",
        );
      }

      // TODO: pass req.file.buffer to ResumeService to parse + persist the resume.

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: {
          originalFileName: req.file.originalname,
          mimeType: req.file.mimetype,
          fileSize: req.file.size,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
