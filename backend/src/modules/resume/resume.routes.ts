import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { uploadSingleFile } from "../../middleware/upload.js";
import { aiRateLimit } from "../../middleware/ai-rate-limit.js";
import {
  listResumesQuerySchema,
  resumeIdParamSchema,
  uploadResumeSchema,
} from "./resume.schema.js";
import {
  validateParams,
  validateQuery,
  validateRequest,
} from "../../middleware/validate-request.js";
import { resumeController } from "../../container.js";

const router = Router();

// Multipart inverts the usual order: req.body doesn't exist until multer has
// run, so validateRequest can't go first. requireAuth stays first among what
// can, so an unauthenticated request never buffers a file into memory.
router.post(
  "/",
  requireAuth,
  aiRateLimit,
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

router.get(
  "/:id",
  requireAuth,
  validateParams(resumeIdParamSchema),
  resumeController.getById,
);

// Same middleware inversion as POST / above, and for the same reason —
// multer has to run before validateRequest can read req.body.
router.put(
  "/:id",
  requireAuth,
  aiRateLimit,
  uploadSingleFile("resume"),
  validateRequest(uploadResumeSchema),
  resumeController.replace,
);

router.delete(
  "/:id",
  requireAuth,
  validateParams(resumeIdParamSchema),
  resumeController.remove,
);

export default router;
