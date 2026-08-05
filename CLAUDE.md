# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

ResuMate — resume tailoring app. User uploads a PDF/DOCX resume, pastes a full job description, and gets AI-generated bullet rewrites they can accept or reject, then exports a tailored PDF.

Two apps, no monorepo tooling — [backend/](backend/) (Express 5 + Prisma + Postgres) and [frontend/](frontend/) (Next.js 16 App Router). Each has its own `package.json`; there is no root package.json. Run commands from inside the respective directory.

## Commands

```bash
# backend/
npm run dev                     # tsx watch src/server.ts
npm run build                   # tsc → dist/
npm start                       # node dist/server.js
npm test                        # vitest run (all)
npx vitest run src/modules/ai/ai.service.test.ts   # single file
npx vitest run -t "rejects invented dates"         # single test by name
npm run tokens:cleanup          # prune expired refresh tokens

npx prisma migrate dev --name <name>   # create + apply migration
npx prisma generate                    # regenerate client → src/generated/client

# frontend/
npm run dev / build / start
npm run lint                    # eslint (no test suite on the frontend)
```

Backend tests hit a **real Postgres test database**. [backend/vitest.setup.ts](backend/vitest.setup.ts) loads `.env` then overrides with `.env.test` (which points `DATABASE_URL` at `resumecoach_test`). `fileParallelism: false` is deliberate — test files share that database and must not run concurrently.

## Environment

Backend `.env` is validated at boot by [backend/src/config/env.ts](backend/src/config/env.ts) — it throws on any missing var in its `requiredEnvVars` list, so the server won't start half-configured. Add new vars to both that list and [backend/.env.example](backend/.env.example). Note `GEMINI_API_KEY` is read but _not_ in the required list.

Frontend needs `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5000/api/v1`).

`docs/` and `.claude/` are gitignored — docs there (ARCHITECTURE.md, API.md, DATA-MODEL.md, PRD) are local-only and may not exist in a fresh clone.

## Backend architecture

Request chain, uniform across every module:

```
Route → validateRequest (Zod) → requireAuth → Controller → Service → Repository → DB
```

- **Route** — URL, verb, middleware order only. No logic.
- **Controller** — reads `req`/`res`, calls exactly one service method, sends the envelope, `catch(e) { next(e) }`. No DB, no business rules.
- **Service** — business rules, **ownership checks**, orchestration; throws `AppError`. No Express types, no raw Prisma.
- **Repository** — Prisma queries with explicit `select` (omit `passwordHash` and friends). Returns data or `null`, never throws.

`requireAuth` proves _identity_, not _ownership_. Any service loading a specific row must verify it belongs to `req.user.sub` — return 404 for a missing/foreign resource, 403 when the row exists but belongs to someone else (see `updateSuggestionStatus` in [analysis.service.ts](backend/src/modules/analysis/analysis.service.ts)).

**Composition root:** [backend/src/container.ts](backend/src/container.ts) constructs every repository, service, agent, and controller exactly once and exports the finished controllers. Route files import controllers from the container — never `new` a service inside a route. Services take their dependencies as constructor interfaces (`StorageModule`, `ParsingModule`, `JobParserAgent`, `RewriteAgent`), which is what makes them unit-testable with fakes.

**Middleware order:** `validateRequest` before `requireAuth` normally (reject garbage cheaply). Multipart routes invert it — `req.body` doesn't exist until multer runs — so upload routes go `requireAuth` → `uploadSingleFile` → `validateRequest`, keeping auth first among what _can_ run first so an unauthenticated request never buffers a file into memory. See [resume.routes.ts](backend/src/modules/resume/resume.routes.ts).

**Validation split:** shape/type/format → Zod schema; anything needing the DB (email uniqueness) → service.

Express 5 makes `req.query` a read-only re-parsing getter, so `validateQuery` shadows it with `Object.defineProperty` rather than assigning.

### Error contract

Throw `AppError(status, code, message, details?)` when _you_ decide a request is invalid; let anything unexpected bubble to the global handler in [app.ts](backend/src/app.ts). Only a real `AppError` gets its message forwarded to the client — everything else (raw Prisma errors etc.) is flattened to a generic 500, since their messages leak schema details. `details` is dev-only.

Use `ERROR_CODES` and `HTTP_STATUS` constants — no raw status literals, no new response envelope shapes. Envelope is always `{ success, data }` or `{ success: false, error: { code, message } }`.

### AI layer

Gemini (`@google/genai`, model `gemini-flash-latest`) is called from three places: resume structuring ([ai.service.ts](backend/src/modules/ai/ai.service.ts)), job-description parsing, and bullet rewriting ([modules/analysis/agents/](backend/src/modules/analysis/agents/)). Rules that hold across all of them:

- Every call passes `httpOptions: { timeout: GEMINI_CALL_TIMEOUT_MS }` (60s, matched to the frontend's own timeout so the server stops working on requests the client abandoned).
- Every call wraps failures in `classifyGeminiError(err, context)`.
- Every model response is validated with `validateAgentOutput(schema, parsed)` before it leaves the module — never trust raw JSON from the model.
- Every AI-calling route mounts `aiRateLimit` (10 req / 5 min, keyed on `req.user.sub`, must run _after_ `requireAuth`) to cap API spend.

Two distinct validators exist and are not interchangeable: [agent-output-validator.ts](backend/src/utils/agent-output-validator.ts) checks one output against its schema in isolation; [rewrite-validator.ts](backend/src/modules/analysis/agents/rewrite-validator.ts) compares a rewrite _against its original_ to catch hallucinated dates, invented company names, and length drift.

### Data model notes

Postgres via Prisma; client generated to `src/generated/client` (import from there, not `@prisma/client`). Core rows: `User` → `Resume` → `Analysis` → `Suggestion`, all `onDelete: Cascade`.

Two things worth knowing before touching the tailoring flow:

- `Analysis` stores a `resumeSnapshot` — the resume's structured JSON frozen at analysis time, so later resume edits don't retroactively change past analyses.
- Suggestions are **merged on read**, not written back into the resume. `getMergedResume` applies accepted suggestions by naive string replacement over the serialized JSON. This is a known-fragile stopgap until bullets have individual IDs; don't build new features on the assumption that the stored resume reflects accepted suggestions.

Resume upload runs storage and parsing concurrently via `Promise.allSettled`, then compensates: storage-failed → nothing to clean up; parsing-failed → delete the orphaned Cloudinary file (best-effort, logged, never fails the request over cleanup). Uploaded file type is verified from the **buffer's magic bytes** (`file-type`), not the client-supplied MIME.

## Frontend architecture

Next.js App Router. `@/*` maps to the frontend root, so imports look like `@/src/features/...` and `@/components/ui/...`.

```
app/                    routes only — no business logic; also holds globals.css + styles/
components/ui/          shadcn/Radix primitives
src/api/                axios client + normalized error envelope
src/features/<name>/    <name>.hooks.ts + <name>.service.ts + types.ts (+ components/)
src/components/         feature-specific composed components
src/providers/ src/lib/
```

**State ownership** — server data and cache belong to TanStack Query; form state to react-hook-form + Zod `zodResolver`; local UI state to `useState`. Don't mirror query data anywhere else.

**Errors** — [src/api/client.ts](frontend/src/api/client.ts) normalizes every axios failure to a flat `ApiError`. Branch on `isApiError(error)` + `error.code`; never read `error.response.data.error` directly.

**Auth** — HttpOnly cookie sessions; `/auth/me` via `useAuth()` is the _only_ client hydration path. The axios interceptor handles 401 refresh-and-retry with a single-flight queue, and deliberately skips the refresh flow for `/auth/me`, `/auth/login`, `/auth/register`, `/auth/refresh` — a 401 from those means the session is genuinely gone.

**Styling** — Tailwind v4 plus a hand-written CSS layer. [app/globals.css](frontend/app/globals.css) imports design tokens (`styles/theme.css`, `shadcn-theme.css`, `base.css`) then one file per component area under `app/styles/components/`. New component styles go in a new file there and get imported into `globals.css` — don't inline large style blocks in TSX.

Naming: components PascalCase with a default export; hooks/services camelCase with `.hooks.ts` / `.service.ts`; route segments kebab-case.

## Conventions

- Backend is ESM (`"type": "module"`, `moduleResolution: NodeNext`) — **relative imports must carry the `.js` extension**, even from `.ts` files.
- Comments in this codebase explain _why_, especially where a choice looks wrong at a glance (Express 5 query shadowing, merge-on-read fragility, the multipart middleware inversion). Match that when adding non-obvious code; don't add narration for obvious code.
- Commit messages: `type(scope): summary`, e.g. `feat(backend): …`, `fix(frontend): …`.

## Plan Mode Checklist

Before generating plan touching backend, verify:

- Ownership check needed? (404 vs 403)
- New AI call? → needs timeout, classifyGeminiError, correct validator (agent-output-validator vs rewrite-validator), aiRateLimit
- New env var? → add to requiredEnvVars + .env.example
- Schema change? → needs migration
- New service method? → constructor interface, no raw Prisma/Express types
- Multipart route? → middleware order inverted (requireAuth first)
