import { Request, Response, NextFunction } from "express";
import { ResumeService } from "./resume.service.js";
import { AppError } from "../../types/app-error.js";
import { ERROR_CODES } from "../../constants/error-codes.js";
import { HTTP_STATUS } from "../../constants/http-status.js";

export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  listResumes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // if (!req.user) {
      //   throw new AppError(
      //     HTTP_STATUS.UNAUTHORIZED,
      //     ERROR_CODES.UNAUTHORIZED,
      //     "User authentication required",
      //   );
      // }
      const userId = req.user?.sub;
      const resumes = await this.resumeService.listResumesByUserId(userId!);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: resumes,
      });
    } catch (error) {
      next(error);
    }
  };

  // TO DO: Implement getResumeById method in ResumeController
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
      const userId = req.user!.sub;
      const resume = await this.resumeService.uploadResume(
        userId,
        req.file!,
        req.body,
      );
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: resume,
      });
    } catch (error) {
      next(error);
    }
  };
}
