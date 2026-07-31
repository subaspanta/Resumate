import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { AnalysisRepository } from "../analysis/analysis.repository.js";
import { ResumeRepository } from "../resume/resume.repository.js";
import { AnalysisService } from "../analysis/analysis.service.js";
import { JobParserAgentService } from "../analysis/agents/job-parser.agent.js";
import { RewriteAgentService } from "../analysis/agents/rewrite.agent.js";
import { ExportController } from "./export.controller.js";

const router = Router();

const analysisRepository = new AnalysisRepository();
const resumeRepository = new ResumeRepository();
const jobParserAgent = new JobParserAgentService();
const rewriteAgent = new RewriteAgentService();
const analysisService = new AnalysisService(
  analysisRepository,
  resumeRepository,
  jobParserAgent,
  rewriteAgent,
);
const exportController = new ExportController(analysisService);

router.post(
  "/resumes/:resumeId/export",
  requireAuth,
  exportController.exportResumePDF,
);

export default router;
