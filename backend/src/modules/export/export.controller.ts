import { Request, Response, NextFunction } from "express";
import { AnalysisService } from "../analysis/analysis.service.js";
import { StructuredResume } from "../parsing/parsing.types.js";
import { generateResumePDF } from "./pdf-export.service.js";

export class ExportController {
  constructor(private readonly analysisService: AnalysisService) {}

  exportResumePDF = async (
    req: Request<{ resumeId: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user!.sub;
      const { resumeId } = req.params;

      const merged = await this.analysisService.exportResume(
        userId,
        resumeId,
      );
      const pdf = await generateResumePDF(merged as StructuredResume);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="resume.pdf"',
      );
      res.send(pdf);
    } catch (error) {
      next(error);
    }
  };
}
