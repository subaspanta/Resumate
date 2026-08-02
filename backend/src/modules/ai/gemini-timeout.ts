// Without an explicit timeout, a hung Gemini call holds its connection open
// for however long the SDK's own default allows (not something we've chosen
// deliberately), tying up server resources on a request that isn't coming
// back. Matches the frontend's AI_CALL_TIMEOUT_MS so the backend doesn't
// keep working on a request the client has already given up on.
export const GEMINI_CALL_TIMEOUT_MS = 60_000;
