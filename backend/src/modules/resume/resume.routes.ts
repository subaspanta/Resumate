import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { uploadSingleFile } from "../../middleware/upload.js";
import { ResumeController } from "./resume.controller.js";
import { ResumeService } from "./resume.service.js";
import { ResumeRepository } from "./resume.repository.js";

const router = Router();
const resumeRepository = new ResumeRepository();
const resumeService = new ResumeService(resumeRepository);
const resumeController = new ResumeController(resumeService);

router.post(
  "/",
  requireAuth,
  uploadSingleFile("resume"),
  resumeController.uploadResume,
);

router.get("/", requireAuth, resumeController.listResumes);

router.get("/:id", requireAuth, resumeController.getResumeById);

export default router;
