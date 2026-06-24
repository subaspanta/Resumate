import { env } from './env.js';

export const logger = {
  info: (...args: any[]) => {
    if (!env.isTest) {
      console.log(`[${new Date().toISOString()}] ℹ️`, ...args);
    }
  },
  error: (...args: any[]) => {
    console.error(`[${new Date().toISOString()}] ❌`, ...args);
  },
  warn: (...args: any[]) => {
    if (!env.isTest) {
      console.warn(`[${new Date().toISOString()}] ⚠️`, ...args);
    }
  },
  debug: (...args: any[]) => {
    if (env.isDevelopment) {
      console.debug(`[${new Date().toISOString()}] 🔍`, ...args);
    }
  },
};