import { Request, Response, NextFunction } from "express";
import { ResumeService } from "./resume.service.js";
import { AppError } from "../../types/app-error.js";
import { ERROR_CODES } from "../../constants/error-codes.js";
import { HTTP_STATUS } from "../../constants/http-status.js";
import { ListResumesQuery, listResumesQuerySchema } from "./resume.schema.js";

export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.sub;
      const resumes = await this.resumeService.listResumesByUserId(
        userId,
        req.query as unknown as ListResumesQuery,
      );

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: resumes,
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.sub;
      const { id } = req.params;
      const resume = await this.resumeService.getResumeById(userId, id);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: resume,
      });
    } catch (error) {
      next(error);
    }
  };

  upload = async (req: Request, res: Response, next: NextFunction) => {
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
