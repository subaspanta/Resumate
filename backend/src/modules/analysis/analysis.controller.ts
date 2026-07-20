import { Request, Response, NextFunction } from "express";
import { AnalysisService } from "./analysis.service.js";
import { HTTP_STATUS } from "../../constants/http-status.js";

export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  getMarketIntel = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { jobTitle } = req.body;
      const data = await this.analysisService.getMarketIntel(jobTitle);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  parseJobDescription = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { jobDescription } = req.body;
      const data = await this.analysisService.parseJobDescription(jobDescription);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  rewriteBullet = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { originalBullet, jobRequirements } = req.body;
      const data = await this.analysisService.rewriteBullet({
        originalBullet,
        jobRequirements,
      });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  createAnalysis = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.sub;
      const { resumeId, jobDescription } = req.body;
      const data = await this.analysisService.createAnalysis(
        userId,
        resumeId,
        jobDescription,
      );
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getRewriteSuggestions = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.sub;
      const { analysisId, originalBullet, jobRequirements } = req.body;
      const data = await this.analysisService.getRewriteSuggestions(userId, {
        analysisId,
        originalBullet,
        jobRequirements,
      });
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  updateSuggestionStatus = async (
    req: Request<{ suggestionId: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { suggestionId } = req.params;
      const { status, rejectionReason } = req.body;
      const data = await this.analysisService.updateSuggestionStatus(
        suggestionId,
        status,
        rejectionReason,
      );
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getAnalysisById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.sub;
      const { id } = req.params;
      const data = await this.analysisService.getAnalysisById(userId, id);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getMergedResume = async (
    req: Request<{ resumeId: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.sub;
      const { resumeId } = req.params;
      const merged = await this.analysisService.getMergedResume(
        userId,
        resumeId,
      );
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: { structuredResume: merged },
      });
    } catch (error) {
      next(error);
    }
  };
}
