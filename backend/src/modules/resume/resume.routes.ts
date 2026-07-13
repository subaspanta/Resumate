import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { uploadSingleFile } from "../../middleware/upload.js";
import { ResumeController } from "./resume.controller.js";
import { ResumeService } from "./resume.service.js";
import { ResumeRepository } from "./resume.repository.js";
import { StubParsingModule } from "../parsing/parsing.types.js";
import { LocalStorageModule } from "../storage/storage.types.js";
import { uploadResumeSchema } from "./resume.schema.js";
import { validateBody } from "../../middleware/validateBody.js";

const router = Router();
const resumeRepository = new ResumeRepository();
// ResumeService expects three arguments; provide repository plus placeholders for the other two
const resumeService = new ResumeService(
  new ResumeRepository(),
  new LocalStorageModule(),
  new StubParsingModule(),
);
const resumeController = new ResumeController(resumeService);

router.post(
  "/",
  requireAuth,
  uploadSingleFile("resume"),
  validateBody(uploadResumeSchema),
  resumeController.uploadResume,
);

router.get("/", requireAuth, resumeController.listResumes);

router.get("/:id", requireAuth, resumeController.getResumeById);

export default router;
