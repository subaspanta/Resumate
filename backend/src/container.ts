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

import { RoleRepository } from "./modules/role/role.repository.js";
import { RoleService } from "./modules/role/role.service.js";
import { RoleController } from "./modules/role/role.controller.js";

import { CareerAnalysisRepository } from "./modules/career-analysis/career-analysis.repository.js";
import { CareerAnalysisService } from "./modules/career-analysis/career-analysis.service.js";
import { CareerAnalysisController } from "./modules/career-analysis/career-analysis.controller.js";
import { EvidenceAgentService } from "./modules/career-analysis/agents/evidence.agent.js";

import { RoadmapRepository } from "./modules/roadmap/roadmap.repository.js";
import { RoadmapService } from "./modules/roadmap/roadmap.service.js";
import { RoadmapController } from "./modules/roadmap/roadmap.controller.js";
import { RoadmapAgentService } from "./modules/roadmap/agents/roadmap.agent.js";

// One shared Gemini client for every agent. Agents take it as a constructor
// parameter rather than building their own at module scope — the old
// agents this replaced did the latter, which is why neither could be
// faked in a test without mocking the whole @google/genai module.
const geminiClient = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

// --- repositories ---
const authRepository = new AuthRepository();
const resumeRepository = new ResumeRepository();
const roleRepository = new RoleRepository();
const careerAnalysisRepository = new CareerAnalysisRepository();
const roadmapRepository = new RoadmapRepository();

// --- shared modules / agents ---
const cloudinaryStorageModule = new CloudinaryStorageModule();
const aiStructuringModule = new AIStructuringService(geminiClient);
const parsingModule = new ParsingService(aiStructuringModule);
const evidenceAgent = new EvidenceAgentService(geminiClient);
const roadmapAgent = new RoadmapAgentService(geminiClient);

// --- services ---
const authService = new AuthService(authRepository);
const roleService = new RoleService(roleRepository);
const careerAnalysisService = new CareerAnalysisService(
  careerAnalysisRepository,
  resumeRepository,
  roleService,
  evidenceAgent,
);
const resumeService = new ResumeService(
  resumeRepository,
  cloudinaryStorageModule,
  parsingModule,
);

// --- controllers ---
export const authController = new AuthController(authService);
export const resumeController = new ResumeController(resumeService);
export const roleController = new RoleController(roleService);
const roadmapService = new RoadmapService(
  roadmapRepository,
  careerAnalysisService,
  roadmapAgent,
);

export const careerAnalysisController = new CareerAnalysisController(
  careerAnalysisService,
);
export const roadmapController = new RoadmapController(roadmapService);
