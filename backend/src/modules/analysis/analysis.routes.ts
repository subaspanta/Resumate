import { Router } from "express";
import { validateRequest } from "../../middleware/validate-request.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import {
  createAnalysisInputSchema,
  getRewriteSuggestionsInputSchema,
  jobDescriptionInputSchema,
  marketIntelInputSchema,
  rewriteBulletInputSchema,
  updateSuggestionStatusInputSchema,
} from "./analysis.types.js";
import { AnalysisRepository } from "./analysis.repository.js";
import { ResumeRepository } from "../resume/resume.repository.js";
import { AnalysisService } from "./analysis.service.js";
import { AnalysisController } from "./analysis.controller.js";
import { MarketAgentService } from "./agents/market.agent.js";
import { JobParserAgentService } from "./agents/job-parser.agent.js";
import { RewriteAgentService } from "./agents/rewrite.agent.js";

const router = Router();

const analysisRepository = new AnalysisRepository();
const resumeRepository = new ResumeRepository();
const marketAgent = new MarketAgentService();
const jobParserAgent = new JobParserAgentService();
const rewriteAgent = new RewriteAgentService();
const analysisService = new AnalysisService(
  analysisRepository,
  resumeRepository,
  marketAgent,
  jobParserAgent,
  rewriteAgent,
);
const analysisController = new AnalysisController(analysisService);

router.post(
  "/market",
  validateRequest(marketIntelInputSchema),
  requireAuth,
  analysisController.getMarketIntel,
);

router.post(
  "/job-desc",
  validateRequest(jobDescriptionInputSchema),
  requireAuth,
  analysisController.parseJobDescription,
);

router.post(
  "/rewrite-bullet",
  validateRequest(rewriteBulletInputSchema),
  requireAuth,
  analysisController.rewriteBullet,
);

router.post(
  "/",
  validateRequest(createAnalysisInputSchema),
  requireAuth,
  analysisController.createAnalysis,
);

router.post(
  "/rewrite-suggestions",
  validateRequest(getRewriteSuggestionsInputSchema),
  requireAuth,
  analysisController.getRewriteSuggestions,
);

router.patch(
  "/suggestions/:suggestionId",
  validateRequest(updateSuggestionStatusInputSchema),
  requireAuth,
  analysisController.updateSuggestionStatus,
);

router.get(
  "/resumes/:resumeId/merged",
  requireAuth,
  analysisController.getMergedResume,
);

router.get("/:id", requireAuth, analysisController.getAnalysisById);

export default router;
