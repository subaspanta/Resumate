import { Router } from "express";
import { validateRequest } from "../../middleware/validate-request.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { aiRateLimit } from "../../middleware/ai-rate-limit.js";
import {
  createAnalysisInputSchema,
  generateRewriteSuggestionsInputSchema,
  updateSuggestionStatusInputSchema,
} from "./analysis.types.js";
import { analysisController } from "../../container.js";

const router = Router();

router.post(
  "/",
  requireAuth,
  aiRateLimit,
  validateRequest(createAnalysisInputSchema),
  analysisController.createAnalysis,
);

router.post(
  "/rewrite-suggestions",
  requireAuth,
  aiRateLimit,
  validateRequest(generateRewriteSuggestionsInputSchema),
  analysisController.generateRewriteSuggestions,
);

router.patch(
  "/suggestions/:suggestionId",
  requireAuth,
  validateRequest(updateSuggestionStatusInputSchema),
  analysisController.updateSuggestionStatus,
);

router.get(
  "/resumes/:resumeId/merged",
  requireAuth,
  analysisController.mergeAcceptedSuggestions,
);

router.get("/:id", requireAuth, analysisController.getAnalysisById);

router.delete("/:id", requireAuth, analysisController.deleteAnalysis);

export default router;
