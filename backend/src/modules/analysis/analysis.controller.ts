import { Request, Response, NextFunction } from "express";
import { AnalysisService } from "./analysis.service.js";
import { HTTP_STATUS } from "../../constants/http-status.js";

export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

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

  generateRewriteSuggestions = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.sub;
      const { analysisId, section, originalBullet } = req.body;
      const data = await this.analysisService.generateRewriteSuggestions(userId, {
        analysisId,
        section,
        originalBullet,
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
      const userId = req.user!.sub;
      const { suggestionId } = req.params;
      const { status, rejectionReason } = req.body;
      const data = await this.analysisService.updateSuggestionStatus(
        userId,
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

  getLatestAnalysis = async (
    req: Request<{ resumeId: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.sub;
      const { resumeId } = req.params;
      const data = await this.analysisService.getLatestAnalysisForResume(
        userId,
        resumeId,
      );
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getAnalysisHistory = async (
    req: Request<{ resumeId: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.sub;
      const { resumeId } = req.params;
      const data = await this.analysisService.getAnalysisHistory(
        userId,
        resumeId,
      );
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteAnalysis = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.sub;
      const { id } = req.params;
      await this.analysisService.deleteAnalysis(userId, id);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: { id },
      });
    } catch (error) {
      next(error);
    }
  };

  mergeAcceptedSuggestions = async (
    req: Request<{ resumeId: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.sub;
      const { resumeId } = req.params;
      const merged = await this.analysisService.mergeAcceptedSuggestions(
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
