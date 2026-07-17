import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { uploadSingleFile } from "../../middleware/upload.js";
import { ResumeController } from "./resume.controller.js";
import { ResumeService } from "./resume.service.js";
import { ResumeRepository } from "./resume.repository.js";
import { listResumesQuerySchema, uploadResumeSchema } from "./resume.schema.js";
import {
  validateQuery,
  validateRequest,
} from "../../middleware/validate-request.js";
import { CloudinaryStorageModule } from "../storage/cloudinary-storage-module.js";
import { ParsingService } from "../parsing/parsing.service.js";
import { AIStructuringService } from "../ai/ai.service.js";

const router = Router();

const resumeRepository = new ResumeRepository();
const cloudinaryStorageModule = new CloudinaryStorageModule();
const aiStructuringModule = new AIStructuringService();
const parsingModule = new ParsingService(aiStructuringModule);
const resumeService = new ResumeService(
  resumeRepository,
  cloudinaryStorageModule,
  parsingModule,
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
