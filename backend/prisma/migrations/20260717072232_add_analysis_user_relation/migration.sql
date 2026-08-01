/*
  Warnings:

  - Added the required column `userId` to the `analyses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "analyses" ADD COLUMN     "userId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "analyses_userId_idx" ON "analyses"("userId");

-- AddForeignKey
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
