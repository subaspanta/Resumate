import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { uploadSingleFile } from "../../middleware/upload.js";
import { ResumeController } from "./resume.controller.js";
import { ResumeService } from "./resume.service.js";
import { ResumeRepository } from "./resume.repository.js";
import { listResumesQuerySchema, uploadResumeSchema } from "./resume.schema.js";
import {
  validateQuery,
  validateRequest,
} from "../../middleware/validate-request.js";
import { CloudinaryStorageModule } from "../storage/cloudinary-storage-module.js";
import { ParsingService } from "../parsing/parsing.service.js";
import { AIStructuringService } from "../ai/ai.service.js";
import { AnalysisRepository } from "../analysis/analysis.repository.js";
import { AnalysisService } from "../analysis/analysis.service.js";
import { AnalysisController } from "../analysis/analysis.controller.js";
import { JobParserAgentService } from "../analysis/agents/job-parser.agent.js";
import { RewriteAgentService } from "../analysis/agents/rewrite.agent.js";

const router = Router();

const resumeRepository = new ResumeRepository();
const cloudinaryStorageModule = new CloudinaryStorageModule();
const aiStructuringModule = new AIStructuringService();
const parsingModule = new ParsingService(aiStructuringModule);

// Latest-analysis and history logically belong to the analysis module, but
// the frontend already calls them under /resumes/:resumeId/... — mirrors
// export.routes.ts's existing precedent of standing up its own local
// AnalysisService for a couple of cross-module routes. ResumeService also
// needs this repository directly, to merge each resume's export status
// into the list response.
const analysisRepository = new AnalysisRepository();

const resumeService = new ResumeService(
  resumeRepository,
  cloudinaryStorageModule,
  parsingModule,
  analysisRepository,
);
const resumeController = new ResumeController(resumeService);

const jobParserAgent = new JobParserAgentService();
const rewriteAgent = new RewriteAgentService();
const analysisService = new AnalysisService(
  analysisRepository,
  resumeRepository,
  jobParserAgent,
  rewriteAgent,
);
const analysisController = new AnalysisController(analysisService);

router.post(
  "/",
  requireAuth,
  uploadSingleFile("resume"),
  validateRequest(uploadResumeSchema),
  resumeController.upload,
);

router.get(
  "/",
  requireAuth,
  validateQuery(listResumesQuerySchema),
  resumeController.list,
);

router.get("/:id", requireAuth, resumeController.getById);

router.delete("/:id", requireAuth, resumeController.remove);

router.get(
  "/:resumeId/latest-analysis",
  requireAuth,
  analysisController.getLatestAnalysis,
);

router.get(
  "/:resumeId/analyses",
  requireAuth,
  analysisController.getAnalysisHistory,
);

export default router;
