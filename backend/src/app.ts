import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { AppError } from "./types/app-error.js";
import { ERROR_CODES } from "./constants/error-codes.js";
import { StatusCodes } from "http-status-codes";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import { prisma } from "./lib/prisma.js";
import { Prisma } from "./generated/client/index.js";

const API_PREFIX = "/api/v1";
const app = express();
app.use(helmet());

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

if (env.isDevelopment) {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cookieParser());

// Health check endpoint — actually checks DB connectivity, not just that the
// process is alive
app.get(`${API_PREFIX}/health`, async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        status: "ok",
        environment: env.NODE_ENV,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error({ message: "Health check failed", error });
    // Unlike the global error handler's AppError.details (gated to dev
    // because it can carry Prisma schema internals), this payload is
    // operational status infra polls for — never gated behind isDevelopment.
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: "Service is degraded",
        details: {
          status: "degraded",
          environment: env.NODE_ENV,
          timestamp: new Date().toISOString(),
        },
      },
    });
  }
});

app.use(API_PREFIX, routes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    error: {
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
});

// Global error handler
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);

  // express.json() throws a SyntaxError (type "entity.parse.failed") on an
  // unparseable request body. Remap it to a proper client-facing validation
  // error instead of letting it fall through to a generic 500-shaped code.
  if (
    err instanceof SyntaxError &&
    "type" in err &&
    (err as { type?: string }).type === "entity.parse.failed"
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: {
        code: ERROR_CODES.MALFORMED_JSON,
        message: "Request body is not valid JSON",
      },
    });
  }

  // A P2024 means the pool has no connection to hand out in time — distinct
  // from a generic Prisma error, since it points at pool sizing/load rather
  // than a query bug. Logged distinctly for oncall; client still gets the
  // same generic 500 as any other unclassified error, no Prisma internals.
  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2024"
  ) {
    logger.error({
      message: "Database connection pool exhausted",
      code: err.code,
    });
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
      },
    });
  }

  // Only an actual AppError carries a client-safe message — anything else
  // (an uncaught Prisma error, etc.) may embed schema/column details in its
  // message, so it gets a generic one instead of leaking that outside dev.
  const isAppError = err instanceof AppError;
  const statusCode = isAppError
    ? err.statusCode
    : StatusCodes.INTERNAL_SERVER_ERROR;
  const code = isAppError ? err.code : ERROR_CODES.INTERNAL_SERVER_ERROR;
  const message = isAppError ? err.message : "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(env.isDevelopment && {
        details: isAppError ? err.details : undefined,
      }),
    },
  });
});

export default app;
