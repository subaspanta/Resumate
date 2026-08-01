-- CreateEnum
CREATE TYPE "SuggestionStatus" AS ENUM ('pending', 'applied', 'rejected');

-- CreateTable
CREATE TABLE "suggestions" (
    "id" UUID NOT NULL,
    "analysisId" UUID NOT NULL,
    "original" TEXT NOT NULL,
    "suggested" TEXT NOT NULL,
    "section" VARCHAR(50),
    "status" "SuggestionStatus" NOT NULL DEFAULT 'pending',
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "suggestions_analysisId_idx" ON "suggestions"("analysisId");

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
