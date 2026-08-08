import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { validateRequest } from "../../middleware/validate-request.js";
import { updateRoadmapTaskSchema } from "./roadmap.types.js";
import { roadmapController } from "../../container.js";

const router = Router();

router.get("/:roadmapId", requireAuth, roadmapController.getById);

export default router;

// Task completion is mounted separately at /roadmap-tasks — a task is
// addressed by its own id, not through the roadmap that holds it.
export const roadmapTaskRouter = Router();

roadmapTaskRouter.patch(
  "/:taskId",
  requireAuth,
  validateRequest(updateRoadmapTaskSchema),
  roadmapController.updateTask,
);
