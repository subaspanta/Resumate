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
    include: ["tests/**/*.test.ts"],
    exclude: ["dist/**", "node_modules/**"],
    // extraction-runner.ts spawns a real worker_threads Worker to load the
    // .ts extraction worker directly (see extraction-runner.ts's execArgv
    // comment). Vitest transforms test/source files itself but does not
    // register a Node-level loader hook the way `tsx watch` does, so a
    // worker spawned from inside a test can't otherwise resolve a .ts file.
    // Vitest launches its own process from this config, and worker threads
    // inherit env, so setting NODE_OPTIONS here (rather than in the runner
    // itself) is what actually reaches the worker's process.execArgv —
    // scoped to tests only, npm run dev/start are untouched.
    env: {
      NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ""} --import tsx`.trim(),
    },
  },
});
