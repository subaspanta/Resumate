import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { validateParams } from "../../middleware/validate-request.js";
import { roleSlugParamSchema } from "./role.schema.js";
import { roleController } from "../../container.js";

const router = Router();

// Read-only seed data. No aiRateLimit — these routes never call Gemini.
router.get("/", requireAuth, roleController.list);

router.get(
  "/:slug",
  requireAuth,
  validateParams(roleSlugParamSchema),
  roleController.getBySlug,
);

export default router;
