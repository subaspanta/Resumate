import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import {
  validateParams,
  validateRequest,
} from "../../middleware/validate-request.js";
import {
  roadmapIdParamSchema,
  roadmapTaskIdParamSchema,
  updateRoadmapTaskSchema,
} from "./roadmap.types.js";
import { roadmapController } from "../../container.js";

const router = Router();

router.get(
  "/:roadmapId",
  requireAuth,
  validateParams(roadmapIdParamSchema),
  roadmapController.getById,
);

export default router;

// Task completion is mounted separately at /roadmap-tasks — a task is
// addressed by its own id, not through the roadmap that holds it.
export const roadmapTaskRouter = Router();

roadmapTaskRouter.patch(
  "/:taskId",
  requireAuth,
  validateParams(roadmapTaskIdParamSchema),
  validateRequest(updateRoadmapTaskSchema),
  roadmapController.updateTask,
);
