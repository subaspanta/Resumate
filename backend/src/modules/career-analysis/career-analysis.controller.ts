import { Request, Response, NextFunction } from "express";
import { CareerAnalysisService } from "./career-analysis.service.js";
import { HTTP_STATUS } from "../../constants/http-status.js";
import { ListCareerAnalysesQuery } from "./career-analysis.types.js";

export class CareerAnalysisController {
  constructor(
    private readonly careerAnalysisService: CareerAnalysisService,
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.sub;
      const { resumeId, roleSlug } = req.body;
      const data = await this.careerAnalysisService.createAnalysis(
        userId,
        resumeId,
        roleSlug,
      );
      res.status(HTTP_STATUS.CREATED).json({ success: true, data });
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
      const data = await this.careerAnalysisService.getAnalysisById(
        userId,
        req.params.id,
      );
      res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.sub;
      const { resumeId, limit, cursor } =
        req.query as unknown as ListCareerAnalysesQuery;
      const data = await this.careerAnalysisService.listAnalyses(userId, {
        resumeId,
        limit,
        cursor,
      });
      res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  remove = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.sub;
      await this.careerAnalysisService.deleteAnalysis(userId, req.params.id);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: { id: req.params.id },
      });
    } catch (error) {
      next(error);
    }
  };

  reassess = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.sub;
      const data = await this.careerAnalysisService.reassessAnalysis(
        userId,
        req.params.id,
      );
      res.status(HTTP_STATUS.CREATED).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  getRevisions = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.sub;
      const data = await this.careerAnalysisService.getRevisions(
        userId,
        req.params.id,
      );
      res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };
}
