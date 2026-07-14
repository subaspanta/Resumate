/*
  Warnings:

  - Added the required column `familyId` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable (nullable first — existing rows have no known family)
ALTER TABLE "refresh_tokens" ADD COLUMN     "familyId" UUID;

-- Backfill: each pre-existing token becomes its own single-token family
UPDATE "refresh_tokens" SET "familyId" = gen_random_uuid() WHERE "familyId" IS NULL;

-- Now enforce NOT NULL
ALTER TABLE "refresh_tokens" ALTER COLUMN "familyId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "refresh_tokens_familyId_idx" ON "refresh_tokens"("familyId");
