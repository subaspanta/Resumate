import { Router } from "express";
import { validateRequest } from "../../middleware/validate-request.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import {
  createAnalysisInputSchema,
  getRewriteSuggestionsInputSchema,
  updateSuggestionStatusInputSchema,
} from "./analysis.types.js";
import { analysisController } from "../../container.js";

const router = Router();

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

router.delete("/:id", requireAuth, analysisController.deleteAnalysis);

export default router;
