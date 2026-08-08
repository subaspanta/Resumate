// Composition root: every repository/service/agent is built exactly once
// here, then wired into controllers. Route files import the finished
// controllers instead of constructing their own copy of the dependency
// graph.
import { GoogleGenAI } from "@google/genai";
import { env } from "./config/env.js";

import { AuthRepository } from "./modules/auth/auth.repository.js";
import { AuthService } from "./modules/auth/auth.service.js";
import { AuthController } from "./modules/auth/auth.controller.js";

import { ResumeRepository } from "./modules/resume/resume.repository.js";
import { ResumeService } from "./modules/resume/resume.service.js";
import { ResumeController } from "./modules/resume/resume.controller.js";
import { CloudinaryStorageModule } from "./modules/storage/cloudinary-storage-module.js";
import { ParsingService } from "./modules/parsing/parsing.service.js";
import { AIStructuringService } from "./modules/ai/ai.service.js";

// One shared Gemini client for every agent. Agents take it as a constructor
// parameter rather than building their own at module scope — the old
// job-parser/rewrite agents did the latter, which is why neither could be
// faked in a test without mocking the whole @google/genai module.
const geminiClient = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

// --- repositories ---
const authRepository = new AuthRepository();
const resumeRepository = new ResumeRepository();

// --- shared modules / agents ---
const cloudinaryStorageModule = new CloudinaryStorageModule();
const aiStructuringModule = new AIStructuringService(geminiClient);
const parsingModule = new ParsingService(aiStructuringModule);

// --- services ---
const authService = new AuthService(authRepository);
const resumeService = new ResumeService(
  resumeRepository,
  cloudinaryStorageModule,
  parsingModule,
);

// --- controllers ---
export const authController = new AuthController(authService);
export const resumeController = new ResumeController(resumeService);
