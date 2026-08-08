import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import resumeRoutes from "../modules/resume/resume.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/resumes", resumeRoutes);

export default router;
