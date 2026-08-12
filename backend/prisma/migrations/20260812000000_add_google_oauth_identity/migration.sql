
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "googleId" VARCHAR(255),
ALTER COLUMN "passwordHash" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

