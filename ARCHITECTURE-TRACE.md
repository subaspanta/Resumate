# ResuMate — Architecture Trace

Single reference for how a request moves through this app, end to end. Written to stop re-deriving the same flows every session.

Five flows exist:

| # | Flow | Entry point | AI calls | Status |
|---|------|-------------|----------|--------|
| 0 | Auth / session | `POST /auth/register`, `/login`, `/refresh` | — | cross-cutting |
| 1 | Upload + parse | `POST /resumes` | 1 (resume structuring) | traced |
| 2 | Create analysis | `POST /analyses` | 1 (job parsing) | traced |
| 3 | Rewrite suggestions | `POST /analyses/rewrite-suggestions` | 1 per request | traced |
| 4 | Merge + export | `POST /exports/resumes/:resumeId/export` | — | traced |

Every request enters through [backend/src/app.ts](backend/src/app.ts):

```
helmet → cors(FRONTEND_URL, credentials) → morgan(dev only)
→ express.json(10mb) → express.urlencoded(10mb) → cookieParser
→ GET /api/v1/health  (does a real `SELECT 1` — "up" vs "up but can't serve")
→ /api/v1 + routes/index.ts
→ 404 handler
→ global error handler
```

Global error handler rules, in order:
1. `SyntaxError` with `type === "entity.parse.failed"` (bad JSON body) → 400 `MALFORMED_JSON`.
2. `AppError` → its own `statusCode` / `code` / `message`. `details` only in dev.
3. Anything else → flat 500 `INTERNAL_SERVER_ERROR`, generic message. Deliberate: a raw Prisma error message embeds schema and column names.

All wiring is built once in [backend/src/container.ts](backend/src/container.ts). Route files import finished controllers. Nothing `new`s a service.

---

## Flow 0 — Auth and session

### Register / Login

```
POST /api/v1/auth/register
  validateRequest(registerUserSchema)
  → auth.controller.register
  → auth.service.register
      bcrypt.hash(password, SALT_ROUNDS)
      → authRepository.createUser
      → issueTokens(user)
      Prisma P2002 (unique violation) → 409 EMAIL_ALREADY_EXISTS
  → sendAuthResponse: sets 2 cookies, returns { success, data: SafeUser }
```

```
POST /api/v1/auth/login
  → auth.service.login
      findUserByEmail
      passwordHash = user?.passwordHash ?? DUMMY_PASSWORD_HASH
      bcrypt.compare ALWAYS runs
      → !user || !valid  →  401 INVALID_CREDENTIALS (same message either way)
```

`DUMMY_PASSWORD_HASH` in [utils/tokens.ts](backend/src/utils/tokens.ts) exists so a nonexistent email burns the same bcrypt time as a real one. Without it, response latency leaks which emails are registered.

### Cookies

Set in [auth.controller.ts](backend/src/modules/auth/auth.controller.ts):

| Cookie | httpOnly | secure | sameSite | path | maxAge |
|---|---|---|---|---|---|
| `accessToken` | yes | prod only | strict | `/` | `COOKIE_MAX_AGE` |
| `refreshToken` | yes | prod only | strict | `/api/v1/auth` | `REFRESH_COOKIE_MAX_AGE` |

The refresh cookie's narrower `path` means it is not attached to `/resumes`, `/analyses`, `/exports` — it only reaches the auth routes that need it. Reduces exposure surface.

### Refresh-token rotation

`auth.service.refresh` is the most security-dense function in the codebase. Order matters:

```
1. raw token present and a string?            → no  → 401
2. verifyRefreshToken (JWT sig + expiry)      → bad → 401
3. findRefreshTokenByHash(sha256(raw))        → miss → 401   (never issued / pruned)
4. stored.expiresAt < now                     → yes → 401   NOT a theft signal
5. claimRefreshToken(stored.id)  ← ATOMIC
        fail → revokeFamily(stored.familyId) → 401
6. findSafeUserById(payload.sub)              → miss → 401
7. issueTokens(user, stored.familyId)         ← same family carries forward
```

Step 5 is the whole design. The claim is a conditional DB update that only succeeds if the row isn't already revoked. Losing the claim means one of two things — the token was already rotated (stolen token being replayed) or two legit requests raced. The DB cannot tell them apart, so **both** nuke the entire token family. That is the standard, accepted tradeoff of rotation: an occasional forced re-login beats a live stolen session.

Step 4 is the deliberate exception. Natural expiry is not theft, so a stale session doesn't cascade-revoke.

Tokens are stored as `sha256` hashes, never raw. `npm run tokens:cleanup` prunes expired rows.

### requireAuth

[middleware/requireAuth.ts](backend/src/middleware/requireAuth.ts) reads `req.cookies.accessToken`, verifies it, sets `req.user = payload`. Nothing else.

**This proves identity, not ownership.** Every service that loads a specific row re-checks `userId` itself:
- missing or belongs to someone else → **404** (don't confirm existence)
- exists, belongs to someone else, and the resource is already known to the caller → **403** (only `updateSuggestionStatus` does this)

### Frontend session hydration

[frontend/src/api/client.ts](frontend/src/api/client.ts) — one axios interceptor:

```
response error
  → normalizeAxiosError → flat ApiError
  → not 401? / no config? / auth endpoint? / already retried?  → reject as-is
  → mark _retry
  → isRefreshing?  → queue this request in pendingRequests, return a promise
  → POST /auth/refresh
        ok   → flush queue, replay original request
        fail → clear queue, invalidate ["auth","me"], reject
```

`NO_REFRESH_URLS = ["/auth/me", "/auth/login", "/auth/register", "/auth/refresh"]`. A 401 from any of those means the session is genuinely gone — retrying would loop.

Single-flight: `isRefreshing` + `pendingRequests` means 5 concurrent 401s trigger exactly one refresh call, not 5.

`useAuth()` → `GET /auth/me` is the **only** client hydration path. Nothing else reconstructs the user.

---

## Flow 1 — Upload and parse

```
POST /api/v1/resumes    (multipart/form-data, field name "resume")

  requireAuth              ← FIRST, deliberately
  aiRateLimit              ← keyed on req.user.sub
  uploadSingleFile("resume")   ← multer, memory storage, 2MB, 1 file
  validateRequest(uploadResumeSchema)
  → resume.controller.upload
  → resume.service.uploadResume
```

### Middleware order is inverted here

Everywhere else it is `validateRequest → requireAuth` (reject garbage cheaply before touching auth). Multipart inverts it because **`req.body` does not exist until multer has run**, so `validateRequest` cannot go first.

Given that, `requireAuth` goes first among what *can* run first. Consequence: an unauthenticated request never buffers a 2MB file into server memory. See [resume.routes.ts](backend/src/modules/resume/resume.routes.ts).

### Inside uploadResume

```
1. file missing               → 400 VALIDATION_FAILED
2. verifyFileType(buffer)     ← fileTypeFromBuffer, MAGIC BYTES
        not pdf/docx          → 400 UNSUPPORTED_FILE_TYPE

3. Promise.allSettled([
       storageModule.saveFile(buffer),        ← Cloudinary
       parsingModule.parseResume(buffer, mime)  ← extract + Gemini
   ])

4. compensation:
   storage rejected            → 503 STORAGE_FAILED    (nothing written, nothing to clean)
   parsing rejected            → deleteFile(storage.path), then 422 PARSING_FAILED
                                  cleanup wrapped in try/catch — logged, never
                                  fails the request over cleanup

5. both ok → resumeRepository.create({ ..., rawText, structuredResume })
```

**Two independent MIME checks, on purpose.** multer's `fileFilter` checks the *client-supplied* `file.mimetype` — it also allows `application/octet-stream`, because browsers frequently send that for a DOCX. That check is a cheap early filter, not a security boundary; the client controls that header. The real check is `verifyFileType`, which reads the buffer's actual magic bytes and only accepts a genuine PDF or DOCX signature.

**The concurrency.** Storage and parsing are genuinely independent — parsing needs the buffer, not the Cloudinary URL. Running them sequentially would serialize an upload (~1s) behind a Gemini call (up to 60s). `allSettled` (not `all`) is required so a rejection in one doesn't cancel the ability to inspect the other's outcome, which is what makes the compensation step possible.

### parseResume

[parsing.service.ts](backend/src/modules/parsing/parsing.service.ts):

```
extractText(buffer, mime)
  application/pdf   → extractTextFromPdf
  ...wordprocessingml.document → extractTextFromDocx
  else              → 400 UNSUPPORTED_FILE_TYPE   (unreachable; verifyFileType gated it)

rawText.trim().length < 20  → 422 PARSING_FAILED
       ← catches scanned/image-only PDFs, which extract to near-nothing

→ aiStructuringModule.structureResume(rawText)
→ { rawText, structuredResume }
```

Both `rawText` and `structuredResume` are persisted. `rawText` is the recovery path if structuring needs to be re-run.

### structureResume (AI call #1)

[ai.service.ts](backend/src/modules/ai/ai.service.ts):

```
generateContent({
  model: "gemini-flash-latest",
  contents: RESUME_STRUCTURING_PROMPT + rawText,
  config: {
    responseMimeType: "application/json",
    responseSchema: RESUME_SCHEMA,          ← Gemini-side structured output
    httpOptions: { timeout: GEMINI_CALL_TIMEOUT_MS },   ← 60s
  }
})
  catch → classifyGeminiError(err, "structure resume")

→ JSON.parse    fail → 422 GEMINI_API_ERROR
→ validateAgentOutput(structuredResumeSchema, parsed)   ← Zod, OUR side
```

**Two schemas, both needed.** `RESUME_SCHEMA` tells Gemini what shape to emit. `structuredResumeSchema` (Zod) verifies it actually did. Model-side structured output is a strong hint, not a guarantee — never trust raw JSON out of the model.

The 60s timeout is matched to the frontend's own timeout, so the server stops working on a request the client already abandoned.

### normalize-resume — the read-side counterpart

[normalize-resume.ts](backend/src/modules/parsing/normalize-resume.ts) exists because `structuredResume` and `resumeSnapshot` are Postgres `Json` columns. Prisma neither validates their contents nor migrates them when the TypeScript type changes. `StructuredResume` is a promise the database does not keep — a row written by an older build deserializes into a value the compiler believes is well-formed but isn't. Reading `entry.bullets` on such a row throws instead of degrading.

So it is **total and coercive**, the exact opposite of `structuredResumeSchema`:

| | `structuredResumeSchema` (Zod) | `normalizeStructuredResume` |
|---|---|---|
| Input | fresh Gemini output | already-persisted DB JSON |
| On bad data | reject loudly | salvage what's there, default the rest |
| Why | bad model output must not be stored | bad stored data must not crash a read |

Legacy tolerance: pre-`bullets` rows stored one `description` string per entry. `toBullets` resolves a real `bullets` array first, else promotes `description` to a single bullet — kept **whole**, never split on sentences or newlines, because splitting is a guess and a wrong guess is unrecoverable once written back.

Repairs are collected as short tags and logged **once per row**, not per field. Tags name the defect only (`experience[2].bullets:not-an-array`) and never the offending value — that value is a real person's contact details and employment history and must not reach the logs.

---

## Flow 2 — Create analysis

```
POST /api/v1/analyses   { resumeId, jobDescription }

  requireAuth → aiRateLimit → validateRequest(createAnalysisInputSchema)
  → analysis.controller.createAnalysis
  → analysis.service.createAnalysis
```

```
1. resumeRepository.findByIdAndUserId(userId, resumeId)
       null → 404 RESOURCE_NOT_FOUND      ← ownership check
2. jobParserAgent.parseJobDescription(jobDescription)     ← AI call
3. analysisRepository.createAnalysis({
       resumeId, userId, jobDescription,
       parsedJob,
       resumeSnapshot: resume.structuredResume,   ← FROZEN COPY
       analysisResult: { parsedJob },
   })
4. → { analysisId, parsedJob }
```

### resumeSnapshot

The analysis stores its own frozen copy of the resume's structured JSON. Editing or re-uploading the resume later does **not** retroactively change a past analysis. Suggestions generated against v1 of a resume stay meaningful even after the resume becomes v2.

### Job parser agent (AI call #2)

[job-parser.agent.ts](backend/src/modules/analysis/agents/job-parser.agent.ts) — same three-part contract as every AI call in this codebase:

```
timeout 60s  +  classifyGeminiError  +  validateAgentOutput
```

Extracts `title`, `company` (nullable — prompt explicitly says return null rather than invent one), `requirements[]`, `skills[]`, `experienceLevel` ∈ `entry|mid|senior`.

Note the absence of `requiredArrayFields` here. A rewrite returning an empty array signals a dropped or hallucinated response, so that call demands non-empty. A job description legitimately can yield empty `requirements`/`skills` — that's correct output, not a failure.

### Skills matching — no AI

[skills-match.ts](backend/src/modules/analysis/skills-match.ts) is pure set overlap, computed **on read** in `getAnalysisById`, never stored:

```
resumeSkills = analysis.resumeSnapshot.skills ?? []
jobSkills    = analysis.parsedJob.skills ?? []
matched = resumeSkills where normalize(skill) ∈ jobSkillSet
missing = deduped jobSkills where normalize(term) ∉ resumeSkillSet
```

`matched` preserves the resume's original casing (that's what gets displayed); `missing` is normalized lowercase. Matches only against `jobSkills` (a token list), never `jobRequirements` (free-text sentences) — the two aren't comparable.

---

## Flow 3 — Rewrite suggestions

```
POST /api/v1/analyses/rewrite-suggestions
     { analysisId, originalBullet, section: "bullet" | "project" | "summary" }

  requireAuth → aiRateLimit → validateRequest
  → analysis.service.getRewriteSuggestions
```

```
1. getAnalysisWithSuggestions(analysisId)
       !analysis || analysis.userId !== userId  → 404
2. jobContext = analysis.parsedJob
3. REWRITE_BY_SECTION[section](rewriteAgent, { originalBullet, jobContext })
       bullet  → rewriteBullet
       project → rewriteProject
       summary → rewriteSummary
4. saveSuggestions(analysisId, survivors.map(s => ({
       original, suggested: s, section, status: "pending"
   })))
```

`REWRITE_BY_SECTION` is a lookup table, not a switch — the object's type is keyed on `SuggestionSection`, so adding a section to the union is a compile error until the table is filled in.

### The rewrite agent (AI call #3)

[rewrite.agent.ts](backend/src/modules/analysis/agents/rewrite.agent.ts). All three variants share one `rewrite()` method, differing only in prompt and validator:

```
callGemini(prompt, label)
  temperature: 0.3            ← low; this is editing, not creative writing
  maxOutputTokens: 2048
  responseSchema: REWRITE_SCHEMA
  timeout: 60s

→ parseAndValidate → validateAgentOutput(rewriteOutputSchema, parsed,
                                          { requiredArrayFields: ["suggestions"] })
→ survivors = suggestions.filter(s => validate(originalBullet, s).valid)
→ survivors.length < 1  → 422 REWRITE_VALIDATION_FAILED
```

**`maxOutputTokens: 2048` is load-bearing.** `gemini-flash-latest` spends part of its budget on internal "thinking" tokens before emitting visible output. At 512 the thinking alone consumed ~420 tokens (confirmed via `usageMetadata`), leaving too little room for the JSON — it truncated mid-string and failed *every* rewrite request. Do not lower this.

Prompts share `buildContextBlock`, which renders only fields actually present — a job with no parsed skills shouldn't get a prompt line implying otherwise. `userContext` flows through `RewriteBulletInput` but isn't rendered yet; wiring it in later is a change to that one function rather than every prompt.

### The rewrite validator — the second, different validator

Two validators exist and are **not interchangeable**:

| | [agent-output-validator.ts](backend/src/utils/agent-output-validator.ts) | [rewrite-validator.ts](backend/src/modules/analysis/agents/rewrite-validator.ts) |
|---|---|---|
| Compares | output vs its Zod schema | rewrite vs **its original** |
| Catches | wrong shape, missing fields | hallucinated facts, drift |
| Used by | every AI call | rewrite agent only |

`validateRewrite(original, rewrite)` runs four checks, short-circuiting on first failure:

1. **Length** — rewrite > 2× original → reject.
2. **Invented dates** — `DATE_PATTERN` matches `19xx`/`20xx`, English month names, `Present`. Any date token in the rewrite absent from the original → reject.
3. **Invented companies** — `CAPITALIZED_SEQUENCE_PATTERN` matches two or more consecutive capitalized words. Any such sequence not in the original → reject.
4. **Semantic overlap** — tokenize both, strip punctuation, drop stopwords, compare sets. Under 30% of the original's meaningful words retained → reject as drifted.

`validateSummaryRewrite` reuses checks 2 and 3 unchanged (hallucination is hallucination) but loosens the rest, because prose naturally pulls in more connective words than a bullet:

| Check | bullet | summary |
|---|---|---|
| Max length | 2.0× | 1.5× |
| Min length | — | 0.5× (a summary compressed to a one-liner is a failure) |
| Min overlap | 30% | 20% |

The summary length bound is **two-sided**; the bullet one is not.

### Accept / reject

```
PATCH /api/v1/analyses/suggestions/:suggestionId   { status, rejectionReason? }
  → analysis.service.updateSuggestionStatus
      findSuggestionWithOwner(suggestionId)
        !existing                            → 404
        existing.analysis.userId !== userId  → 403 FORBIDDEN   ← the ONE 403
      → updateSuggestionStatus(...)
```

This is the codebase's only 403. Everywhere else a foreign resource returns 404, so an attacker can't probe for existence. Here the caller already holds a specific suggestion ID handed to them by the API, so 403 is the honest answer.

Frontend does this **optimistically** — [analysis.hooks.ts](frontend/src/features/analysis/analysis.hooks.ts) `useUpdateSuggestionStatus`:

```
onMutate   → cancelQueries, snapshot previous, flip status in cache immediately
onError    → restore snapshot
onSettled  → invalidate the analysis AND the merged-resume query for its resumeId
```

The merged-resume invalidation is what makes the preview update after applying a suggestion — without it the preview shows stale text.

---

## Flow 4 — Merge and export

### getMergedResume — the known-fragile part

```
GET /api/v1/analyses/resumes/:resumeId/merged
  → analysis.service.getMergedResume
      findByIdAndUserId → null → 404
      findAppliedSuggestionsByResumeId(resumeId)
      → applySuggestions(resume.structuredResume, applied)
      → normalizeStructuredResume(result, { resumeId, source: "getMergedResume" })
```

`applySuggestions` is 6 lines and they are the weakest 6 lines in the app:

```ts
let merged = JSON.stringify(base);
for (const suggestion of suggestions) {
  merged = merged.split(suggestion.original).join(suggestion.suggested);
}
return JSON.parse(merged);
```

Serialize the whole resume to a string, blind find-and-replace each accepted suggestion's original text, parse back.

**Merge-on-read, not write-back.** The stored `structuredResume` is never mutated by accepting a suggestion. The merge is recomputed on every read.

Known failure modes, all inherent to string substitution:
- Identical bullet text under two different jobs → both get replaced, only one was intended.
- A short `original` appearing as a substring elsewhere in the JSON → corrupted collateral replacement.
- Suggestion text containing a `"` or `\` → could break the JSON before `JSON.parse` sees it.
- Two accepted suggestions where one's `suggested` contains the other's `original` → order-dependent output.

The real fix is per-bullet IDs, which turns this into a structured merge (`bullets[id] = suggested`) instead of text substitution. **Do not build new features on the assumption that the stored resume reflects accepted suggestions.**

Note the ordering comment in the code: normalization runs **after** the merge, because `applySuggestions` must see the stored text byte-for-byte unchanged to match against it.

### Export

```
POST /api/v1/exports/resumes/:resumeId/export
  requireAuth → export.controller.exportResumePDF
  → analysis.service.exportResume
        getMergedResume(userId, resumeId)     ← ownership check lives here
        markLatestExported(resumeId)          ← the write
        return merged
  → generateResumePDF(merged)
  → Content-Type: application/pdf
    Content-Disposition: attachment; filename="resume.pdf"
    res.send(buffer)
```

`exportResume` is kept separate from `getMergedResume` rather than folded in, so the `markLatestExported` write is an explicit visible step at the export call site instead of a hidden side effect of a read-named method.

`markLatestExported` is what feeds `analysisStatus` on the dashboard (`none` / `unexported` / `exported`), computed in `ResumeService.listResumesByUserId` via **one** query scoped to the whole user — `findLatestExportStatusByUserId` returns a Map, avoiding an N+1 over resumes.

### PDF generation

[pdf-export.service.ts](backend/src/modules/export/pdf-export.service.ts), pdfmake. Two exported functions: `buildResumeDefinition` (pure, testable) and `generateResumePDF` (renders it).

ATS-friendly by construction: single column, built-in Helvetica, no tables, no images, no graphics. Section order — name, contact line, SUMMARY, SKILLS (two columns), EXPERIENCE, PROJECTS, EDUCATION. Every section is guarded by a presence check, so absent data produces no orphan heading.

pdfmake 0.3 does not auto-register the standard AFM fonts server-side, hence the explicit `FONTS` dictionary + `setFonts` at module load. No font files ship — pdfkit resolves those standard PDF font names internally.

Frontend `useExportPDF` receives the blob, `createObjectURL` → synthetic `<a download>` → click → `revokeObjectURL`.

---

## Cross-cutting invariants

Anything added to this codebase has to hold these.

### Layering

```
Route → validateRequest (Zod) → requireAuth → Controller → Service → Repository → DB
```

- **Route** — URL, verb, middleware order. No logic.
- **Controller** — reads `req`/`res`, calls exactly one service method, sends the envelope, `catch(e) { next(e) }`. No DB, no business rules.
- **Service** — business rules, ownership checks, orchestration. Throws `AppError`. No Express types, no raw Prisma.
- **Repository** — Prisma with explicit `select` (omit `passwordHash` and friends). Returns data or `null`, never throws.

### Every AI call, without exception

1. `httpOptions: { timeout: GEMINI_CALL_TIMEOUT_MS }` — 60s, matched to the frontend timeout.
2. `catch → classifyGeminiError(err, context)`.
3. `validateAgentOutput(schema, parsed)` before the value leaves the module.
4. Route mounts `aiRateLimit`, **after** `requireAuth` (needs `req.user.sub` for the key).

`aiRateLimit`: 10 requests / 5 minutes, keyed per authenticated user, not per IP. Falls back to `ipKeyGenerator(req.ip)` — which normalizes IPv6 to a subnet, so different textual forms of one address can't dodge the limit.

Routes carrying it: `POST /resumes`, `POST /analyses`, `POST /analyses/rewrite-suggestions`.

### Validation split

Shape / type / format → Zod schema. Anything needing the DB (email uniqueness) → service.

Express 5 makes `req.query` a read-only re-parsing getter, so `validateQuery` shadows it with `Object.defineProperty` rather than assigning.

### Error envelope

Always one of:

```json
{ "success": true,  "data": ... }
{ "success": false, "error": { "code": "...", "message": "..." } }
```

Use `ERROR_CODES` and `HTTP_STATUS` constants. No raw status literals, no new envelope shapes.

### Data model

```
User ─┬─< Resume ─< Analysis ─< Suggestion
      └─< RefreshToken
```

All `onDelete: Cascade`. Deleting a resume takes its analyses and suggestions with it; `ResumeService.deleteResume` additionally best-effort deletes the Cloudinary object (skipped and logged for pre-`filePath` rows rather than failing the delete over cleanup).

Prisma client generates to `src/generated/client` — import from **there**, never `@prisma/client`.

### ESM

Backend is `"type": "module"` with `moduleResolution: NodeNext`. **Relative imports must carry the `.js` extension**, even from `.ts` files.

---

## Frontend state ownership

| State | Owner |
|---|---|
| Server data + cache | TanStack Query |
| Form state | react-hook-form + Zod `zodResolver` |
| Local UI state | `useState` |

Never mirror query data anywhere else.

Query keys in use:

```
["auth","me"]
["resumes"]                        ["resumes", id]
["analysis", id]                   ["analysis","latest", resumeId]
["analysis","history", resumeId]   ["analysis","merged", resumeId]
```

Errors: [src/api/client.ts](frontend/src/api/client.ts) normalizes every axios failure to a flat `ApiError`. Branch on `isApiError(error)` + `error.code`. Never read `error.response.data.error` directly.

Retry policy is uniform across hooks: never retry a 401 (the interceptor already had its shot), otherwise up to 2 retries.

---

## Dead endpoints

Live backend routes with no frontend caller. Hooks are commented out in place rather than deleted:

| Route | Commented hook |
|---|---|
| `GET /resumes/:resumeId/latest-analysis` | `useLatestAnalysis` |
| `GET /resumes/:resumeId/analyses` | `useAnalysisHistory` |
| `DELETE /analyses/:id` | `useDeleteAnalysis` |

Either wire them into UI or delete both halves — right now they are surface area with no coverage.

---

## Known gaps

Carried forward from the code's own comments, not new claims:

1. **`applySuggestions` string replacement** — the top structural debt. Needs per-bullet IDs.
2. **`GEMINI_API_KEY` is read but absent from `requiredEnvVars`** in [config/env.ts](backend/src/config/env.ts) — the server boots without it and fails at the first AI call instead of at startup.
3. **Three dead endpoints** (above) — reachable, unexercised.
4. **`console.error` in `resume.service.ts`** — the cleanup-failure paths use `console.error` while the rest of the codebase uses the `logger`.
5. **Frontend has no test suite.**
