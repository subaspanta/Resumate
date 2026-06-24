import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { AppError } from "./types/app-error.js";
import { StatusCodes } from "http-status-codes";

const API_PREFIX = "/api/v1";
const app = express();
app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

// Logging middleware
if (env.isDevelopment) {
  app.use(morgan("dev"));
}

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get(`${API_PREFIX}/health`, (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      status: "ok",
      environment: "...",
      timestamp: "...",
    },
  });
});

// API routes
// app.use(API_PREFIX, routes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    error: {
      code: StatusCodes.NOT_FOUND,
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
});

// Global error handler
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);

  const statusCode = err.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
  const code = err.code ?? "INTERNAL_SERVER_ERROR";
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(env.isDevelopment && { details: err.details }),
    },
  });
});

export default app;
