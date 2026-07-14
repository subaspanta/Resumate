/*
  Warnings:

  - You are about to drop the column `pdfUrl` on the `resumes` table. All the data in the column will be lost.
  - Added the required column `fileUrl` to the `resumes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "resumes" DROP COLUMN "pdfUrl",
ADD COLUMN     "fileUrl" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "analyses_resumeId_createdAt_idx" ON "analyses"("resumeId", "createdAt" DESC);
