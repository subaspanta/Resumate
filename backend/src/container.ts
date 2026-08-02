// Composition root: every repository/service/agent is built exactly once
// here, then wired into controllers. Route files import the finished
// controllers instead of constructing their own copy of the dependency
// graph — previously AnalysisRepository, ResumeRepository, and
// AnalysisService were each instantiated 3x (analysis/resume/export routes),
// as separate, redundant instances of the same stateless objects.
import { AuthRepository } from "./modules/auth/auth.repository.js";
import { AuthService } from "./modules/auth/auth.service.js";
import { AuthController } from "./modules/auth/auth.controller.js";

import { ResumeRepository } from "./modules/resume/resume.repository.js";
import { ResumeService } from "./modules/resume/resume.service.js";
import { ResumeController } from "./modules/resume/resume.controller.js";
import { CloudinaryStorageModule } from "./modules/storage/cloudinary-storage-module.js";
import { ParsingService } from "./modules/parsing/parsing.service.js";
import { AIStructuringService } from "./modules/ai/ai.service.js";

import { AnalysisRepository } from "./modules/analysis/analysis.repository.js";
import { AnalysisService } from "./modules/analysis/analysis.service.js";
import { AnalysisController } from "./modules/analysis/analysis.controller.js";
import { JobParserAgentService } from "./modules/analysis/agents/job-parser.agent.js";
import { RewriteAgentService } from "./modules/analysis/agents/rewrite.agent.js";

import { ExportController } from "./modules/export/export.controller.js";

// --- repositories ---
const authRepository = new AuthRepository();
const resumeRepository = new ResumeRepository();
const analysisRepository = new AnalysisRepository();

// --- shared modules / agents ---
const cloudinaryStorageModule = new CloudinaryStorageModule();
const aiStructuringModule = new AIStructuringService();
const parsingModule = new ParsingService(aiStructuringModule);
const jobParserAgent = new JobParserAgentService();
const rewriteAgent = new RewriteAgentService();

// --- services ---
const authService = new AuthService(authRepository);
const resumeService = new ResumeService(
  resumeRepository,
  cloudinaryStorageModule,
  parsingModule,
  analysisRepository,
);
const analysisService = new AnalysisService(
  analysisRepository,
  resumeRepository,
  jobParserAgent,
  rewriteAgent,
);

// --- controllers ---
export const authController = new AuthController(authService);
export const resumeController = new ResumeController(resumeService);
export const analysisController = new AnalysisController(analysisService);
export const exportController = new ExportController(analysisService);
