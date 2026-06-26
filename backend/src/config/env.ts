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
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
  isTest: process.env.NODE_ENV === "test",
} as const;

console.log(" Environment loaded from:", envPath);
console.log(" NODE_ENV:", env.NODE_ENV);
console.log(" PORT:", env.PORT);
