// Budget for the routes that make a Gemini call. This has to be strictly
// larger than the server's worst case for those routes, not equal to it:
// the client's clock starts when the request is dispatched, the server's
// GEMINI_CALL_TIMEOUT_MS clock only starts once auth, body transfer and
// prompt building are done. Equal numbers therefore always expire on the
// client first, which both hides the server's classified AI error and — since
// nothing on the backend aborts on client disconnect — reports "failed" for
// work that goes on to succeed and persist.
//
// Worst case is the upload pipeline: text extraction (10s) then structuring
// (60s), run in sequence. 90s clears that with room for transfer and the DB
// write. Keep this above backend GEMINI_CALL_TIMEOUT_MS + PARSING_TIMEOUT_MS.
export const AI_CALL_TIMEOUT_MS = 90_000;

export const apiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
} as const;
