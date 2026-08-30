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
