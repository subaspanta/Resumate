import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import resumeRoutes from "../modules/resume/resume.routes.js";
import roleRoutes from "../modules/role/role.routes.js";
import careerAnalysisRoutes from "../modules/career-analysis/career-analysis.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/resumes", resumeRoutes);
router.use("/roles", roleRoutes);
router.use("/career-analyses", careerAnalysisRoutes);

export default router;
