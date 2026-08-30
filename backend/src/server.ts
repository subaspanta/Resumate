import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { prisma } from "./lib/prisma.js";

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

let isShuttingDown = false;

const gracefulShutdown = (signal: string, exitCode = 0) => {
  if (isShuttingDown) {
    logger.warn({ message: "Second shutdown signal, exiting now", signal });
    process.exit(exitCode || 1);
  }
  isShuttingDown = true;

  logger.info({
    message: "Graceful shutdown initiated",
    signal,
  });

  const forceExitTimer = setTimeout(() => {
    logger.error({
      message: " Could not close connections in time, forcefully shutting down",
      activeResources: process.getActiveResourcesInfo(),
    });
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);

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

process.on("uncaughtException", (error) => {
  logger.error({ message: "Uncaught exception", error });
  gracefulShutdown("uncaughtException", 1);
});

process.on("unhandledRejection", (reason) => {
  logger.error({ message: "Unhandled rejection", reason });
  gracefulShutdown("unhandledRejection", 1);
});

export default server;
