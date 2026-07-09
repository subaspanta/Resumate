# ADR-0003: Authentication and Session Strategy

## Status
Accepted, with one deferred item (refresh-token rotation) tracked below.

## Context

[`docs/architecture/reuse.md` §5](../reuse.md#5-session-management-deep-dive)
found a prior codebase with client-writable, non-HttpOnly cookies and a
mixed custom/NextAuth session model, and recommended: a single auth
paradigm, server-set HttpOnly+Secure+SameSite cookies, short-lived access
tokens with refresh rotation, and an explicit `/me` hydration endpoint
instead of scattered cookie parsing.

ResumeForge's actual implementation (`backend/src/modules/auth/`,
`backend/src/middleware/requireAuth.ts`, `backend/src/utils/tokens.ts`,
`frontend/src/features/auth/`) already meets most of this bar:

- Single auth paradigm — custom JWT + cookie, no parallel framework session
  system.
- `accessToken` cookie is set **server-side** via `res.cookie()` in
  `AuthController.sendAuthresponse` with `httpOnly: true`, `secure:
  env.NODE_ENV === "production"`, `sameSite: "strict"` — this is the exact
  fix `reuse.md` §5.2 called out as missing in the reference codebase.
- `requireAuth` middleware (`backend/src/middleware/requireAuth.ts`) verifies
  the JWT and populates `req.user` — a real, if narrow, authorization layer
  per §5.3.
- `GET /auth/me` (`AuthController.me`) is the explicit hydration endpoint
  `reuse.md` §5.4 recommends, consumed by `useAuth()`
  (`frontend/src/features/auth/auth.hooks.ts`) via React Query — not
  client-side cookie parsing.

**Gap:** `generateAccessToken` (`backend/src/utils/tokens.ts`) issues a
single 15-minute JWT with **no refresh token**. When it expires, the user is
silently logged out (`requireAuth` throws `UNAUTHORIZED`, `AuthProvider`
redirects to `/login`) — there is no silent-refresh or rotation path.

## Decision

1. Ratify the current model as the standard: server-set HttpOnly + Secure +
   SameSite=strict cookie, JWT access token, `requireAuth` middleware,
   `/auth/me` as the sole client hydration path. No parallel session system
   is to be introduced (e.g. do not add NextAuth alongside this).
2. Explicitly record the missing refresh-token rotation as **known and
   deferred**, not accidental. Do not silently work around expiry (e.g. by
   lengthening the access-token TTL) as a substitute — see Migration notes.
3. CSRF: `sameSite: "strict"` provides meaningful CSRF mitigation for a
   cookie-based token given this is a same-site app; a dedicated CSRF token
   is not required today but should be revisited if a cross-site integration
   (e.g. a third-party embed) is ever added.

## Alternatives considered

- **Move to NextAuth wholesale** — rejected for now; the custom
  implementation is small, already correct on cookie flags, and a rewrite
  isn't justified until a requirement (OAuth providers, SSO) demands it.
- **Store the access token in localStorage/client JS** — rejected; defeats
  the HttpOnly protection this codebase already has correctly in place.
- **Extend access-token TTL instead of adding refresh** — rejected as a
  long-term fix; widens the exposure window if a token is ever leaked.

## Consequences

**Positive:** current implementation is security-sound on cookie handling —
better than the reference codebase `reuse.md` was written against.

**Negative:** users are logged out every 15 minutes with no silent refresh,
which is a real UX gap once ResumeForge sees regular use (long resume-review
sessions).

## Migration notes

When refresh-token rotation is implemented:
- Add a `refreshToken` (longer-lived, also HttpOnly/Secure/SameSite,
  narrower path e.g. `/api/v1/auth/refresh`) issued alongside `accessToken`.
- Add `POST /auth/refresh` that verifies the refresh token, rotates it
  (issue new refresh token, invalidate old — store a hash or version marker
  server-side for revocation), and issues a new access token.
- Add revocation on logout (already clears `accessToken`; extend
  `AuthController.logout` to also invalidate the refresh token server-side,
  not just clear the cookie).
- Frontend: `frontend/src/api/client.ts`'s axios interceptor is the correct
  place to add a 401 → attempt-refresh-once → retry-original-request flow,
  keeping this logic centralized rather than duplicated per call site (see
  ADR-0004).
