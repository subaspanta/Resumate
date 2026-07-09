# ADR-0004: API Client and Error Envelope Contract

## Status
Accepted

## Context

[`docs/architecture/reuse.md` §3.2](../reuse.md#32-api-layer-modularization)
recommends a thin API factory with a strongly typed response envelope,
typed domain errors, and centralized header/retry mechanics — while warning
that an overly opaque factory abstraction slows down debugging, and that a
missing typed error envelope causes per-feature error branching.

ResumeForge already centralizes API mechanics as a single client, not (yet)
a hook factory:

- `frontend/src/api/client.ts` — one shared `axiosClient` (base URL,
  `withCredentials`, timeout, headers from `frontend/src/api/config.ts`)
  with a response interceptor.
- `frontend/src/api/api-error.ts` — `normalizeAxiosError` converts *every*
  axios failure (including network errors, status 0) into a flat `ApiError`
  class with a typed `ApiErrorCode` union, `status`, and `details`. This
  union is the frontend half of the wire contract with the backend.
- `backend/src/constants/error-codes.ts` — the backend's `ERROR_CODES`
  (see ADR-0005 on why this is now the *only* such file) is the backend
  half of that same contract.
- Canonical code list is defined once, in
  [`docs/architecture/api-design.md`](../api-design.md) (lines ~499-508):
  `INVALID_CREDENTIALS`, `EMAIL_ALREADY_EXISTS`, `UNAUTHORIZED`, `FORBIDDEN`,
  `RESOURCE_NOT_FOUND`, `FILE_TOO_LARGE`, `UNSUPPORTED_FILE_TYPE`,
  `PARSING_FAILED`, `VALIDATION_FAILED`, `INTERNAL_SERVER_ERROR`.

**Drift found and fixed as part of this ADR being written:** the backend
had two divergent `error-codes.ts` files, and `auth.service.ts` /
`validate-request.ts` emitted codes (`USER_ALREADY_EXISTS`, `USER_NOT_FOUND`,
`VALIDATION_ERROR`) that didn't match the frontend's `ApiErrorCode` union or
the spec. This caused a real bug: `LoginForm`/`RegisterForm` read
`error.response.data.error` (the raw axios shape) instead of the
interceptor's already-normalized `ApiError`, so their specific-error
branches (e.g. "email already exists") never matched and users always saw
the generic fallback message. Both the code-mismatch and the read-path bug
are fixed as part of adopting this ADR.

## Decision

1. `docs/architecture/api-design.md` is the **single canonical source** for
   wire error codes. `backend/src/constants/error-codes.ts` and
   `frontend/src/api/api-error.ts`'s `ApiErrorCode` union must both match it
   exactly — no code exists in one without the other.
2. Per-resource `*.service.ts` files (e.g.
   `frontend/src/features/auth/auth.service.ts`) are the standard for now,
   not a generated hook factory. `reuse.md` itself warns an opaque factory
   slows debugging — with a single resource (`auth`) today, a factory would
   be premature abstraction (see Alternatives).
3. All API-consuming code must branch on the normalized `ApiError`
   (`isApiError(error)`, then `.code`/`.status`/`.message`/`.details`),
   never on the raw axios/`response.data` shape. The interceptor in
   `frontend/src/api/client.ts` is the only place raw axios errors should be
   handled.
4. `axiosClient` (`frontend/src/api/client.ts`) is the only HTTP client
   instance in the frontend — one shared instance, not one per feature —
   so header/retry/base-URL changes happen in one place.

## Alternatives considered

- **Build the `HookCreator` factory now** — rejected until a second and
  third resource (`resume`, `analysis`) exist; premature abstraction over
  one resource has no payoff and matches `reuse.md`'s own caution about
  opaque factories. Revisit this decision once `resume.service.ts` and
  `analysis.service.ts` exist and show real duplication.
- **Let each feature define its own error-code subset** — rejected; this is
  exactly the drift this ADR fixes.

## Consequences

**Positive:** one contract, enforced by TypeScript on both sides (a typo or
new backend code that isn't added to the frontend union fails to compile at
the call site, not silently at runtime).

**Negative:** every new wire error code requires a coordinated edit to both
`backend/src/constants/error-codes.ts` and
`frontend/src/api/api-error.ts` — no code generation ties them together
today.

## Migration notes

When a second resource module is added (`resume`, `analysis`), reassess the
"factory vs. per-resource service" decision in this ADR. If `resume.service.ts`
and `analysis.service.ts` show significant structural duplication with
`auth.service.ts`, extract a small factory then — informed by real
duplication, not speculation.
