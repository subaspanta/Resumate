-- AlterEnum
ALTER TYPE "AnalysisEventType" ADD VALUE 'reassessment_started';
ALTER TYPE "AnalysisEventType" ADD VALUE 'reassessment_completed';

-- AlterTable
ALTER TABLE "career_analyses" ADD COLUMN     "parentAnalysisId" UUID,
ADD COLUMN     "revision" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "roadmap_tasks" ADD COLUMN     "completionNote" TEXT;

-- CreateIndex
CREATE INDEX "career_analyses_parentAnalysisId_idx" ON "career_analyses"("parentAnalysisId");

-- CreateIndex
CREATE UNIQUE INDEX "career_analyses_parentAnalysisId_revision_key" ON "career_analyses"("parentAnalysisId", "revision");

-- AddForeignKey
ALTER TABLE "career_analyses" ADD CONSTRAINT "career_analyses_parentAnalysisId_fkey" FOREIGN KEY ("parentAnalysisId") REFERENCES "career_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
