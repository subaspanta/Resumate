// Client timeout for Gemini routes must exceed server's worst-case total.
// Server timers start after auth/body/prompt are processed, so equal values
// would always expire client-side first — hiding real AI errors and marking
// successful operations as failed.
//
// Worst-case upload: text extraction (10s) + structuring (60s) = 90s total,
// plus overhead for transfer and DB writes. Must stay above backend's
// GEMINI_CALL_TIMEOUT_MS + PARSING_TIMEOUT_MS.
export const AI_CALL_TIMEOUT_MS = 90_000;

export const apiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
} as const;
