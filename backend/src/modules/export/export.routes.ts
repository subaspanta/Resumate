import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { exportController } from "../../container.js";

const router = Router();

router.post(
  "/resumes/:resumeId/export",
  requireAuth,
  exportController.exportResumePDF,
);

export default router;
