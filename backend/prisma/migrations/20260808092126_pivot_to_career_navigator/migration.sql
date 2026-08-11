-- CreateEnum
CREATE TYPE "SkillImportance" AS ENUM ('critical', 'important', 'nice_to_have');

-- CreateEnum
CREATE TYPE "EvidenceStrength" AS ENUM ('experience_backed', 'project_backed', 'mentioned');

-- CreateEnum
CREATE TYPE "GapStatus" AS ENUM ('strong', 'developing', 'weak_evidence', 'missing');

-- CreateEnum
CREATE TYPE "CareerAnalysisStatus" AS ENUM ('pending', 'analyzing', 'complete', 'failed');

-- CreateEnum
CREATE TYPE "AnalysisEventType" AS ENUM ('analysis_started', 'analysis_completed', 'analysis_failed', 'roadmap_generated', 'task_completed', 'task_uncompleted');

-- DropForeignKey
ALTER TABLE "analyses" DROP CONSTRAINT "analyses_resumeId_fkey";

-- DropForeignKey
ALTER TABLE "analyses" DROP CONSTRAINT "analyses_userId_fkey";

-- DropForeignKey
ALTER TABLE "suggestions" DROP CONSTRAINT "suggestions_analysisId_fkey";

-- AlterTable
ALTER TABLE "resumes" DROP COLUMN "enabledSections";

-- DropTable
DROP TABLE "analyses";

-- DropTable
DROP TABLE "suggestions";

-- DropEnum
DROP TYPE "SuggestionStatus";

-- CreateTable
CREATE TABLE "skills" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "aliases" VARCHAR(100)[],
    "category" VARCHAR(50),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" TEXT NOT NULL,
    "seedVersion" VARCHAR(20) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_skill_requirements" (
    "id" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "skillId" UUID NOT NULL,
    "importance" "SkillImportance" NOT NULL,
    "rationale" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "role_skill_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_analyses" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "status" "CareerAnalysisStatus" NOT NULL DEFAULT 'pending',
    "resumeId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "resumeSnapshot" JSONB NOT NULL,
    "roleSnapshot" JSONB NOT NULL,
    "readinessScore" INTEGER,
    "readinessBreakdown" JSONB,
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(6),

    CONSTRAINT "career_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidate_skill_evidence" (
    "id" UUID NOT NULL,
    "careerAnalysisId" UUID NOT NULL,
    "skillId" UUID NOT NULL,
    "strength" "EvidenceStrength" NOT NULL,
    "quote" TEXT NOT NULL,
    "sourceSection" VARCHAR(30) NOT NULL,
    "sourceLabel" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "candidate_skill_evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_gaps" (
    "id" UUID NOT NULL,
    "careerAnalysisId" UUID NOT NULL,
    "skillId" UUID NOT NULL,
    "status" "GapStatus" NOT NULL,
    "priority" INTEGER NOT NULL,
    "reasoning" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skill_gaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmaps" (
    "id" UUID NOT NULL,
    "careerAnalysisId" UUID NOT NULL,
    "weekCount" INTEGER NOT NULL DEFAULT 4,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roadmaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmap_tasks" (
    "id" UUID NOT NULL,
    "roadmapId" UUID NOT NULL,
    "skillGapId" UUID,
    "weekNumber" INTEGER NOT NULL,
    "orderInWeek" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "resources" JSONB,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(6),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roadmap_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analysis_events" (
    "id" UUID NOT NULL,
    "careerAnalysisId" UUID NOT NULL,
    "type" "AnalysisEventType" NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analysis_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "skills_slug_key" ON "skills"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "roles_slug_key" ON "roles"("slug");

-- CreateIndex
CREATE INDEX "role_skill_requirements_roleId_idx" ON "role_skill_requirements"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "role_skill_requirements_roleId_skillId_key" ON "role_skill_requirements"("roleId", "skillId");

-- CreateIndex
CREATE INDEX "career_analyses_userId_idx" ON "career_analyses"("userId");

-- CreateIndex
CREATE INDEX "career_analyses_resumeId_idx" ON "career_analyses"("resumeId");

-- CreateIndex
CREATE INDEX "career_analyses_userId_createdAt_idx" ON "career_analyses"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "candidate_skill_evidence_careerAnalysisId_idx" ON "candidate_skill_evidence"("careerAnalysisId");

-- CreateIndex
CREATE INDEX "skill_gaps_careerAnalysisId_idx" ON "skill_gaps"("careerAnalysisId");

-- CreateIndex
CREATE UNIQUE INDEX "skill_gaps_careerAnalysisId_skillId_key" ON "skill_gaps"("careerAnalysisId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "roadmaps_careerAnalysisId_key" ON "roadmaps"("careerAnalysisId");

-- CreateIndex
CREATE INDEX "roadmap_tasks_roadmapId_weekNumber_orderInWeek_idx" ON "roadmap_tasks"("roadmapId", "weekNumber", "orderInWeek");

-- CreateIndex
CREATE INDEX "analysis_events_careerAnalysisId_createdAt_idx" ON "analysis_events"("careerAnalysisId", "createdAt");

-- AddForeignKey
ALTER TABLE "role_skill_requirements" ADD CONSTRAINT "role_skill_requirements_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_skill_requirements" ADD CONSTRAINT "role_skill_requirements_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_analyses" ADD CONSTRAINT "career_analyses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_analyses" ADD CONSTRAINT "career_analyses_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "career_analyses" ADD CONSTRAINT "career_analyses_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_skill_evidence" ADD CONSTRAINT "candidate_skill_evidence_careerAnalysisId_fkey" FOREIGN KEY ("careerAnalysisId") REFERENCES "career_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_skill_evidence" ADD CONSTRAINT "candidate_skill_evidence_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_gaps" ADD CONSTRAINT "skill_gaps_careerAnalysisId_fkey" FOREIGN KEY ("careerAnalysisId") REFERENCES "career_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_gaps" ADD CONSTRAINT "skill_gaps_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmaps" ADD CONSTRAINT "roadmaps_careerAnalysisId_fkey" FOREIGN KEY ("careerAnalysisId") REFERENCES "career_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap_tasks" ADD CONSTRAINT "roadmap_tasks_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "roadmaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap_tasks" ADD CONSTRAINT "roadmap_tasks_skillGapId_fkey" FOREIGN KEY ("skillGapId") REFERENCES "skill_gaps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_events" ADD CONSTRAINT "analysis_events_careerAnalysisId_fkey" FOREIGN KEY ("careerAnalysisId") REFERENCES "career_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

