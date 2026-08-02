import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../../.env");

dotenv.config({ path: envPath });
const requiredEnvVars = [
  "PORT",
  "DATABASE_URL",
  "JWT_SECRET",
  "BCRYPT_SALT_ROUNDS",
  "ACCESS_TOKEN_EXPIRES_IN",
  "COOKIE_MAX_AGE",
  "REFRESH_TOKEN_SECRET",
  "REFRESH_COOKIE_MAX_AGE",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "FRONTEND_URL",
] as const;

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`,
  );
}

export const env = {
  PORT: parseInt(process.env.PORT || "3000", 10),
  SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 12),
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
  COOKIE_MAX_AGE: parseInt(process.env.COOKIE_MAX_AGE || "900000", 10),
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
  REFRESH_COOKIE_MAX_AGE: parseInt(
    process.env.REFRESH_COOKIE_MAX_AGE || "604800000",
    10,
  ),
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
  isTest: process.env.NODE_ENV === "test",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY as string,
  FRONTEND_URL: process.env.FRONTEND_URL as string,
} as const;

if (env.NODE_ENV !== "production") {
  console.log(" Environment loaded from:", envPath);
  console.log(" NODE_ENV:", env.NODE_ENV);
  console.log(" PORT:", env.PORT);
}
