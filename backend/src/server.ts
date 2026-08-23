import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { prisma } from "./lib/prisma.js";

// The force-exit timer is only useful if it fires before whoever signalled us
// runs out of patience and SIGKILLs — otherwise it is dead code and the pool
// is never drained. `tsx watch` kills at 5s, so dev needs a tighter budget
// than a production supervisor (k8s defaults to a 30s grace period).
const SHUTDOWN_TIMEOUT_MS = env.isDevelopment ? 3_000 : 10_000;

const server = app.listen(env.PORT, () => {
  logger.info({
    message: "Server started",
    port: env.PORT,
    environment: env.NODE_ENV,
    startedAt: new Date().toISOString(),
  });
});

server.on("error", (error) => {
  logger.error(error);
  process.exit(1);
});

// Graceful shutdown
let isShuttingDown = false;

const gracefulShutdown = (signal: string, exitCode = 0) => {
  if (isShuttingDown) {
    // A second signal means whoever is stopping us wants out now — an
    // operator hitting Ctrl-C again, or a supervisor escalating. Honour it
    // rather than swallowing it and looking hung.
    logger.warn({ message: "Second shutdown signal, exiting now", signal });
    process.exit(exitCode || 1);
  }
  isShuttingDown = true;

  logger.info({
    message: "Graceful shutdown initiated",
    signal,
  });

  const forceExitTimer = setTimeout(() => {
    // Say *what* held us open. Without this the only evidence is the
    // supervisor's "didn't exit in time" message, which names nothing —
    // an in-flight request and a stuck $disconnect() look identical from
    // outside. Node reports the handle kinds still keeping the loop alive.
    logger.error({
      message: " Could not close connections in time, forcefully shutting down",
      activeResources: process.getActiveResourcesInfo(),
    });
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);

  // Only stops accepting new connections; the callback still waits on any
  // request already in flight. This app can hold one for up to
  // GEMINI_CALL_TIMEOUT_MS (60s), which is why the force timer above has to be
  // able to fire. Idle keep-alive sockets are not a concern — Node closes
  // those itself on close().
  server.close(() => {
    logger.info("HTTP server closed");
    void prisma.$disconnect().finally(() => {
      clearTimeout(forceExitTimer);
      logger.info(" Process terminated");
      process.exit(exitCode);
    });
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// A bug that throws outside any try/catch (or a rejected promise nobody
// awaits) leaves the process in an unknown state — continuing to serve
// requests from there risks worse, harder-to-debug failures than a clean
// exit. Route both through the same graceful-shutdown path so in-flight
// requests still get a chance to finish instead of dropping instantly.
process.on("uncaughtException", (error) => {
  logger.error({ message: "Uncaught exception", error });
  gracefulShutdown("uncaughtException", 1);
});

process.on("unhandledRejection", (reason) => {
  logger.error({ message: "Unhandled rejection", reason });
  gracefulShutdown("unhandledRejection", 1);
});

export default server;
