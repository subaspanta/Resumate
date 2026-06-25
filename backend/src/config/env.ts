import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (3 levels up from config folder)
// backend/src/config/env.ts -> backend/.env
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

// Alternative: If .env is in the backend folder root
// dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Required environment variables
const requiredEnvVars = ["PORT", "DATABASE_URL", "JWT_SECRET"] as const;

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`,
  );
}

export const env = {
  PORT: parseInt(process.env.PORT || "3000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
  isTest: process.env.NODE_ENV === "test",
} as const;

// Debug: Log environment loading (remove in production)
console.log(
  " Environment loaded from:",
  path.resolve(__dirname, "../../../.env"),
);
console.log(" NODE_ENV:", env.NODE_ENV);
console.log(" PORT:", env.PORT);
