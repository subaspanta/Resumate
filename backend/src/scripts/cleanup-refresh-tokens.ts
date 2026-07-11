// Deletes expired/revoked refresh_tokens rows so the table doesn't grow
// unbounded. Not scheduled by this app — no job-scheduler dependency exists
// here today. Invoke externally, e.g. via an OS cron entry:
//   0 3 * * * cd /path/to/backend && npm run tokens:cleanup
import { prisma } from "../lib/prisma.js";
import { AuthRepository } from "../modules/auth/auth.repository.js";

// Revoked rows are kept this long before deletion so a just-detected theft
// (family revocation) stays inspectable for a while.
const REVOKED_RETENTION_MS = 24 * 60 * 60 * 1000;

async function main() {
  const authRepository = new AuthRepository();
  const deletedCount = await authRepository.deleteStaleRefreshTokens(
    REVOKED_RETENTION_MS,
  );
  console.log(`Deleted ${deletedCount} stale refresh token(s).`);
}

main()
  .catch((error) => {
    console.error("Refresh token cleanup failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
