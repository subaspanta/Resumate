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

// Explicit, user-triggered re-run of evidence assessment against completed
// roadmap work — never automatic on a task-completion toggle, since every AI
// call has a cost. Same middleware ordering as POST /:id/roadmap: validate
// the id before spending the caller's AI budget.
router.post(
  "/:id/reassess",
  requireAuth,
  validateParams(analysisIdParamSchema),
  aiRateLimit,
  careerAnalysisController.reassess,
);

// Plain read, no aiRateLimit — lets the frontend render before/after
// readiness without re-running the AI call.
router.get(
  "/:id/revisions",
  requireAuth,
  validateParams(analysisIdParamSchema),
  careerAnalysisController.getRevisions,
);

export default router;
