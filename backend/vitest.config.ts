import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    // Test files share one real Postgres database, so they must not run
    // concurrently.
    fileParallelism: false,
    // Only source tests. Without this, running the suite after `npm run build`
    // also collects the compiled copies under dist/, which duplicates every
    // test and fails outright — the generated Prisma client is not emitted
    // there, so dist/lib/prisma.js cannot resolve its import.
    include: ["src/**/*.test.ts"],
    exclude: ["dist/**", "node_modules/**"],
  },
});
