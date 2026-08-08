import { Request, Response, NextFunction } from "express";
import { RoadmapService } from "./roadmap.service.js";
import { HTTP_STATUS } from "../../constants/http-status.js";

export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  generate = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.sub;
      const data = await this.roadmapService.generateRoadmap(
        userId,
        req.params.id,
      );
      res.status(HTTP_STATUS.CREATED).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  getForAnalysis = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.sub;
      // Null is a legitimate answer: an analysis without a roadmap yet is a
      // normal state, not a missing resource.
      const data = await this.roadmapService.getRoadmapForAnalysis(
        userId,
        req.params.id,
      );
      res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: Request<{ roadmapId: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.sub;
      const data = await this.roadmapService.getRoadmapById(
        userId,
        req.params.roadmapId,
      );
      res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };

  updateTask = async (
    req: Request<{ taskId: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.sub;
      const data = await this.roadmapService.setTaskCompletion(
        userId,
        req.params.taskId,
        req.body.completed,
      );
      res.status(HTTP_STATUS.OK).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };
}
