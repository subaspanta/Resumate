import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { aiRateLimit } from "../../middleware/ai-rate-limit.js";
import {
  validateParams,
  validateQuery,
  validateRequest,
} from "../../middleware/validate-request.js";
import {
  analysisIdParamSchema,
  createCareerAnalysisSchema,
  listCareerAnalysesQuerySchema,
} from "./career-analysis.types.js";
import {
  careerAnalysisController,
  roadmapController,
} from "../../container.js";

const router = Router();

// aiRateLimit must follow requireAuth — it keys on req.user.sub to cap spend
// per user rather than per IP.
router.post(
  "/",
  requireAuth,
  aiRateLimit,
  validateRequest(createCareerAnalysisSchema),
  careerAnalysisController.create,
);

router.get(
  "/",
  requireAuth,
  validateQuery(listCareerAnalysesQuerySchema),
  careerAnalysisController.list,
);

router.get(
  "/:id",
  requireAuth,
  validateParams(analysisIdParamSchema),
  careerAnalysisController.getById,
);

router.delete(
  "/:id",
  requireAuth,
  validateParams(analysisIdParamSchema),
  careerAnalysisController.remove,
);

// Roadmap generation is a sub-resource of the analysis it belongs to, so it
// lives here rather than under /roadmaps. Explicit POST, never a lazy side
// effect of a read — a GET wouldn't carry aiRateLimit.
//
// validateParams runs before aiRateLimit so a malformed id is rejected without
// consuming the caller's AI budget.
router.post(
  "/:id/roadmap",
  requireAuth,
  validateParams(analysisIdParamSchema),
  aiRateLimit,
  roadmapController.generate,
);

router.get(
  "/:id/roadmap",
  requireAuth,
  validateParams(analysisIdParamSchema),
  roadmapController.getForAnalysis,
);

export default router;
