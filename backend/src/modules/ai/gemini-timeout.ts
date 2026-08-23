// Without an explicit timeout, a hung Gemini call holds its connection open
// for however long the SDK's own default allows (not something we've chosen
// deliberately), tying up server resources on a request that isn't coming
// back.
//
// This is the *inner* budget and must stay strictly below the client's, which
// lives in frontend/src/api/config.ts as AI_CALL_TIMEOUT_MS. The client's
// clock starts at dispatch while this one starts only once auth, body
// transfer and prompt building are done, so matching the two numbers would
// still expire on the client first — and nothing here aborts on client
// disconnect, so the request would go on to succeed after the user was shown
// a failure. Raising this means raising that.
export const GEMINI_CALL_TIMEOUT_MS = 60_000;
