import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import resumeRoutes from "../modules/resume/resume.routes.js";
import analysisRoutes from "../modules/analysis/analysis.routes.js";
import exportRoutes from "../modules/export/export.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/resumes", resumeRoutes);
router.use("/analyses", analysisRoutes);
router.use("/exports", exportRoutes);

export default router;
