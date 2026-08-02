import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

const SHUTDOWN_TIMEOUT_MS = 10_000;

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
const gracefulShutdown = (signal: string) => {
  logger.info({
    message: "Graceful shutdown initiated",
    signal,
  });
  server.close(() => {
    logger.info("HTTP server closed");
    logger.info(" Process terminated");
    process.exit(0);
  });

  setTimeout(() => {
    logger.error(
      " Could not close connections in time, forcefully shutting down",
    );
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);
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
  gracefulShutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
  logger.error({ message: "Unhandled rejection", reason });
  gracefulShutdown("unhandledRejection");
});

export default server;
