import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { uploadSingleFile } from "../../middleware/upload.js";
import { listResumesQuerySchema, uploadResumeSchema } from "./resume.schema.js";
import {
  validateQuery,
  validateRequest,
} from "../../middleware/validate-request.js";
import { resumeController, analysisController } from "../../container.js";

const router = Router();

// Latest-analysis and history logically belong to the analysis module, but
// the frontend already calls them under /resumes/:resumeId/... — mirrors
// export.routes.ts's existing precedent of reusing the shared AnalysisService
// for a couple of cross-module routes.

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
