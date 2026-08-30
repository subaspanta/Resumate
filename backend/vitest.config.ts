import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],

    // Tests share one Postgres database, so run files sequentially.
    fileParallelism: false,

    // Only collect source tests; built tests in dist/ would run twice.
    include: ["tests/**/*.test.ts"],
    exclude: ["dist/**", "node_modules/**"],

    // Enable tsx so Worker threads can load TypeScript test dependencies.
    env: {
      NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ""} --import tsx`.trim(),
    },
  },
});
