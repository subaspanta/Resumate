import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // Declared here (not just as an npm script) so `prisma migrate reset`
    // re-seeds the role model automatically — without it a reset leaves the
    // database with no roles, and every analysis 404s.
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
