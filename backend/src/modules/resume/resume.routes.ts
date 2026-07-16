import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { uploadSingleFile } from "../../middleware/upload.js";
import { ResumeController } from "./resume.controller.js";
import { ResumeService } from "./resume.service.js";
import { ResumeRepository } from "./resume.repository.js";
import { StubParsingModule } from "../parsing/parsing.types.js";
import { listResumesQuerySchema, uploadResumeSchema } from "./resume.schema.js";
import {
  validateQuery,
  validateRequest,
} from "../../middleware/validate-request.js";
import { CloudinaryStorageModule } from "../storage/cloudinary-storage-module.js";

const router = Router();
const resumeRepository = new ResumeRepository();
const resumeService = new ResumeService(
  resumeRepository,
  new CloudinaryStorageModule(),
  new StubParsingModule(),
);
const resumeController = new ResumeController(resumeService);

router.post(
  "/",
  requireAuth,
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

router.get("/:id", requireAuth, resumeController.getById);

export default router;
