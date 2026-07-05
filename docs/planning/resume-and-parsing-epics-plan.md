# Resume Management & Parsing Epics — Implementation Plan

Covers GitHub issues:

- **Resume Management Epic**: #10 Resume upload API, #11 Resume storage service, #12 Upload resume page, #13 Resume listing, #14 Resume details, #15 Replace resume, #16 Delete resume, #17 File validation, #18 Resume repository
- **Parsing Epic**: #19 Integrate MarkItDown, #20 Resume Parser, #21 Resume JSON schema, #22 Persist Resume JSON, #23 Parsing error handling

This is a planning document only — nothing here has been implemented yet. Work through it phase by phase (see [Build Order](#build-order)), not all at once.

Sources consulted: `docs/architecture/system-architecture.md`, `docs/architecture/component-architecture.md`, `docs/requirements/api-spec.md`, `docs/architecture/api-design.md`, `docs/requirements/business-rules.md`, `docs/requirements/domain-model.md`, `backend/prisma/schema.prisma`, and the existing `auth` module/feature as the reference implementation pattern.

---

## 1. Confirmed architecture decisions

Two decisions were open-ended in the docs and were confirmed with the product owner before writing this plan:

1. **File storage: local disk now, abstracted for a future cloud swap.** Files are stored under a local `uploads/` directory on the backend server. All access goes through a `StorageService` interface (`store`, `retrieve`, `delete`) so a later move to S3/Supabase Storage/Cloudinary only requires a new implementation of that interface — no changes to Resume Module business logic. This matches the architecture doc's "Future Scalability" principle and the "Storage Module has no business logic" rule.
2. **MarkItDown interop: shell out via `child_process`.** The backend spawns the `markitdown` CLI (installed via `pip`) as a subprocess per parse request, capturing stdout as Markdown text. This keeps parsing inside the backend as a single module per **ADR-001** (no dedicated parsing microservice) while still using the real MarkItDown library as issue #19 requires. Deployment implication: the server needs Python 3 + `pip install markitdown` alongside the Node runtime — flag this in deploy/CI setup when we get there.

---

## 2. Data model — no new migration needed

`backend/prisma/schema.prisma` already has `Resume` and `Analysis` models from the initial migration (`20260626063644_init`). Relevant fields on `Resume`:

```prisma
model Resume {
  id               String   @id @default(uuid()) @db.Uuid
  userId           String   @db.Uuid
  title            String   @db.VarChar(255)
  originalFileName String   @db.Text
  mimeType         String   @db.VarChar(100)
  fileSize         Int
  pdfUrl           String   @db.Text
  rawText          String   @db.Text
  structuredResume Json     @db.JsonB
  createdAt/updatedAt ...
}
```

**Important consequence:** `rawText` and `structuredResume` are both **required, non-nullable** columns, and there is no `parsingStatus` field. This means the schema already encodes a design decision:

> **A `Resume` row must never exist without successfully parsed text and structured JSON.** Upload/Replace is an all-or-nothing operation: extract text → parse → persist file → persist row, or roll everything back (delete the stored file, return `PARSING_FAILED`, create nothing in the DB).

This plan builds to that contract. If we ever want a "parsing failed, retry later" resume state, that requires a schema migration (`parsingStatus` enum, nullable `rawText`/`structuredResume`) — out of scope unless you decide otherwise.

---

## 3. Doc inconsistencies to resolve along the way (flagging, not blocking)

The requirements docs disagree with each other and with the existing frontend on a few concrete numbers. Pick one canonical value when you touch the relevant issue:

| Topic | Conflicting values found | Recommendation |
|---|---|---|
| Max upload size | `api-design.md` upload section says **2 MB**; same file's Business Rules section says **5 MB**; frontend `UploadDropZone` copy says **10 MB** | Pick **5 MB** (matches the documented error code `FILE_TOO_LARGE` description and business rules section) and update `UploadDropZone` copy + backend multer limit + docs to match. |
| Accepted file types | `api-design.md` says **"PDF only"**; `component-architecture.md` lists "Extract DOCX text" as a Parsing Module responsibility; frontend `UploadDropZone` already accepts `.pdf,.docx` | MVP ships **PDF only** for issue #17/#10 (matches the explicit upload validation rule). Since MarkItDown supports DOCX out of the box, flip this on later with a one-line validator change — no parser rework needed. Update `UploadDropZone`'s accept list to `.pdf` only until then, or leave it and reject DOCX server-side with a clear `UNSUPPORTED_FILE_TYPE` error. |
| Backend error code names | `backend/src/constants/error-codes.ts` uses `USER_ALREADY_EXISTS`/`NOT_FOUND`; `backend/src/types/error-codes.ts` has a different set; frontend `api-error.ts` expects `EMAIL_ALREADY_EXISTS`/`RESOURCE_NOT_FOUND`; `docs/architecture/api-design.md` is the authoritative list | Consolidate to **one** error-codes file using the exact names from `api-design.md`'s table: `INVALID_CREDENTIALS`, `EMAIL_ALREADY_EXISTS`, `UNAUTHORIZED`, `FORBIDDEN`, `RESOURCE_NOT_FOUND`, `FILE_TOO_LARGE`, `UNSUPPORTED_FILE_TYPE`, `PARSING_FAILED`, `VALIDATION_FAILED`, `INTERNAL_SERVER_ERROR`. This is pre-existing tech debt, not new to this epic, but touching auth error codes is a natural warm-up task before resume error codes are added on top. |

---

## 4. Resume JSON schema (issue #21) — define this first, everyone depends on it

Per `component-architecture.md`, this is the canonical, AI/parser/analysis-agnostic shape every module consumes ("Resume JSON is single source of truth... Parsing Module must never depend on Resume Module... Resume Analysis Engine must never call AI Module" — but everything reads Resume JSON):

```ts
interface ResumeJson {
  contact: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    bullets: string[];
  }>;
  education: Array<{
    institution: string;
    degree?: string;
    field?: string;
    startDate?: string;
    endDate?: string;
  }>;
  skills: string[];
  projects: Array<{
    name: string;
    description?: string;
    bullets?: string[];
    link?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer?: string;
    date?: string;
  }>;
}
```

- Define as a **Zod schema** in `backend/src/modules/resume/resume.schema.ts` (or a new `parsing/resume-json.schema.ts`), following the auth module's `z.object(...)` + `z.infer` convention. This becomes the contract the Parser (#20) must produce and the shape validated before persisting (#22).
- Every field beyond top-level section keys should be **optional/best-effort** — MarkItDown + heuristic section detection will not always find a phone number or end date, and a strict schema would turn "resume parsed with minor gaps" into a hard `PARSING_FAILED`, which is too aggressive.
- Mirror the type by hand into `frontend/src/features/resume/types.ts` (no shared package between FE/BE today — same duplication pattern already used for `SafeUser`).

---

## 5. Parsing Epic — module design

Per `component-architecture.md`, the Parsing Module has **no dependencies** and must never depend on the Resume Module — it's a pure function: `(file buffer/path) -> ResumeJson`. Keep it that way: `backend/src/modules/parsing/` should not import Prisma or anything user/resume-specific.

### #19 — Integrate MarkItDown
- Add a `ParsingProvider` (e.g. `backend/src/modules/parsing/markitdown.provider.ts`) that:
  - Writes the uploaded file buffer to a temp path (`os.tmpdir()`), spawns `markitdown <path>` via `child_process.execFile` (not `exec`, to avoid shell-injection on the filename), captures stdout as Markdown text, cleans up the temp file in a `finally`.
  - Wraps subprocess failures (non-zero exit, spawn `ENOENT` if `markitdown`/Python isn't installed, timeout) into a single typed error the Parser layer can catch.
  - Add a startup/health check (e.g. in `backend/src/config/env.ts` or a dedicated check) that verifies `markitdown --version` succeeds, so a missing Python/markitdown install fails fast at boot instead of on the first user upload.
- New backend dependency: Python 3 + `markitdown` pip package must be documented in a `README`/deploy note (not an npm dependency — flag this clearly since it's an unusual deploy requirement for a Node app).

### #20 — Resume Parser
- `backend/src/modules/parsing/resume-parser.service.ts`: takes the Markdown string from MarkItDown and produces a `ResumeJson` (from #21).
- Two reasonable strategies — decide when you get here, don't need to decide now:
  1. **Heuristic section detection**: split Markdown on headings (`## Experience`, `## Education`, etc. — MarkItDown tends to preserve heading structure from the source PDF/DOCX reasonably well), then regex/heuristic-parse bullets, dates, contact info per section.
  2. **LLM-assisted structuring**: pass the Markdown to the AI Module with a "extract into this JSON schema" prompt. Faster to build, more robust to varied resume formats, but couples Parsing Module to AI Module — which `component-architecture.md`'s dependency rules don't explicitly forbid for Parsing (only Resume Analysis Engine → AI Module is forbidden), so this is architecturally allowed if you want to avoid hand-rolled heuristics for MVP.
  - Given "Minimal AI dependency" is a stated architecture goal and the AI Module isn't built yet in this epic, **default recommendation: start with heuristics (#20a)**, and treat "structure via AI" as a fallback/future enhancement once the AI Module exists (later epic).
- Output must satisfy the Zod schema from #21 before returning — if required top-level keys can't be produced at all (e.g. MarkItDown returned empty/garbage text), throw a parsing error for #23 to handle, don't persist an empty shell.

### #22 — Persist Resume JSON
- This isn't a separate persistence path — it's just the `structuredResume` field write inside the Resume repository's `create`/`update` call (#18), done in the same request as upload/replace, per the atomic design in §2. No separate "parse now, save later" endpoint or job queue for MVP (matches BR-007: "generated immediately after upload").

### #23 — Parsing error handling
- Central `PARSING_FAILED` error code (already anticipated in both frontend `api-error.ts` and `backend/src/constants/error-codes.ts`).
- On any failure in the MarkItDown subprocess or the Resume Parser step during upload/replace:
  1. Delete the file that was just written to storage (via `StorageService.delete`, #11) — no orphaned files.
  2. Do not create/update the `Resume` row.
  3. Return `422 PARSING_FAILED` with a user-facing message ("We couldn't read this resume. Try re-exporting it as a standard PDF.") — avoid leaking subprocess stderr to the client; log it server-side instead.
- This is the piece that makes upload (#10) and replace (#15) transactional across three side effects (file storage, subprocess call, DB write) — worth a small integration test that simulates a MarkItDown failure and asserts no file/row is left behind.

---

## 6. Resume Management Epic — module design

Follow the `auth` module's exact file shape under `backend/src/modules/resume/`: `resume.routes.ts`, `resume.controller.ts`, `resume.service.ts`, `resume.repository.ts`, `resume.schema.ts`, `resume.types.ts`.

### #18 — Resume repository
- `ResumeRepository` class, thin Prisma wrapper: `create`, `findManyByUserId`, `findByIdAndUserId` (must scope by `userId` — BR-004/"users can only access their own resumes"), `update` (for replace), `delete`.
- All queries filter on `userId` from `req.user!.sub` — never trust a bare `resumeId` from the URL without an ownership check, or one user could read/delete another's resume by guessing a UUID... actually UUIDs aren't guessable, but still enforce ownership as defense-in-depth and to return a clean `404`/`RESOURCE_NOT_FOUND` instead of leaking existence via a `403`.

### #11 — Resume storage service
- `backend/src/modules/storage/storage.service.ts` (own tiny module, not nested under `resume/`, matching the architecture doc's "Storage Module" as a peer, not a child, of Resume Module).
- Interface: `store(buffer, filename): Promise<string /* pdfUrl */>`, `retrieve(pdfUrl): Promise<Buffer>`, `delete(pdfUrl): Promise<void>`.
- Local-disk implementation: files under a configurable `UPLOAD_DIR` (new env var, add to `backend/src/config/env.ts`'s required-vars list + `.env`), named by UUID to avoid collisions/path traversal from user-supplied filenames (never use `originalFileName` directly as the disk path).
- `pdfUrl` stored on the `Resume` row should be an **internal reference** (e.g. `/uploads/<uuid>.pdf` or just the UUID), not a publicly browsable static path — actual file retrieval should go through an authenticated backend route (`GET /resumes/:resumeId/file` or similar) that checks ownership before streaming the file, consistent with "Backend-First Architecture" (frontend never talks to storage directly).

### #17 — File validation
- `multer` (already a dependency, unused so far) configured with `memoryStorage` (simplest — file lives in memory as a `Buffer` until `StorageService.store` writes it; fine at 5 MB limit) or `diskStorage` directly into `UPLOAD_DIR` (avoids buffering in memory, slightly more code). Recommend `memoryStorage` for MVP simplicity given the small size cap.
- `limits: { fileSize: 5 * 1024 * 1024 }` (see §3 for the 5 MB decision) + `fileFilter` rejecting non-`application/pdf` mimetypes → maps to `FILE_TOO_LARGE`/`UNSUPPORTED_FILE_TYPE` via a multer error-handling wrapper (multer throws its own `MulterError`, translate `LIMIT_FILE_SIZE` → `AppError(413, FILE_TOO_LARGE, ...)` in a small adapter, since `validateRequest` doesn't cover multipart).
- Also validate `title` (body field, still runs through Zod via `validateRequest` for the non-file fields).

### #10 — Resume upload API
`POST /resumes`, multipart (`title` + `file`), `requireAuth`. Controller flow: multer middleware → `resumeService.upload(userId, title, file)` which orchestrates, in order: file validation (already done by multer) → `parsingProvider`/`resumeParser` (#19/#20) → on parse success, `storageService.store` (#11) → `resumeRepository.create` (#18) with `rawText`+`structuredResume` from the parser. On parse failure: return `PARSING_FAILED`, nothing persisted (#23).

Note the ordering: **parse before storing/persisting**, not after — so a parse failure never leaves an orphaned stored file. (Storing first and rolling back on parse failure also works but has a needless extra disk write; parse-then-store avoids that.)

### #13 — Resume listing
`GET /resumes`, `requireAuth` → `resumeRepository.findManyByUserId`, returns lightweight list (id, title, originalFileName, createdAt, updatedAt — **not** `rawText`/`structuredResume`, per `api-design.md`'s List Resumes response shape). Frontend: wire `RecentResumeSection`/`ResumeListItem` (already scaffolded in `frontend/src/components/`) to a new `useResumes()` query hook in `frontend/src/features/resume/resume.hooks.ts`, replacing whatever mock data `ResumeSummary` currently backs on `app/page.tsx`.

### #14 — Resume details
`GET /resumes/:resumeId`, `requireAuth`, ownership-scoped → full `Resume` row including `structuredResume`. Frontend: a detail page (`app/resumes/[resumeId]/page.tsx`, flat routing convention matching `app/login`/`app/register`) with a `useResume(resumeId)` hook. (This is the natural precursor to the "Resume Editor" endpoints in `api-spec.md`, which are a separate future epic — this issue is just the read view.)

### #15 — Replace resume
`PUT /resumes/:resumeId`, same multipart validation as upload, same parse-then-store-then-persist flow as #10 but calling `resumeRepository.update` and `storageService.delete` on the **old** `pdfUrl` after the new file is successfully stored (BR-005: only the latest PDF is kept — don't leave the old file orphaned on disk). Does not touch existing `Analysis` rows (BR: "Replacing a resume does not modify previous analyses").

### #16 — Delete resume
`DELETE /resumes/:resumeId`, `requireAuth`, ownership-scoped → `storageService.delete(resume.pdfUrl)` then `resumeRepository.delete`. Prisma's `onDelete: Cascade` on `Analysis.resume` relation already handles cascading analysis deletion at the DB level (BR-003) — no need to manually delete analyses in application code, just confirm the migration's cascade is actually in place (it is, per the schema read above).

### #12 — Upload resume page
Frontend. `UploadDropZone` (`frontend/src/components/UploadDropZone.tsx`) already exists with drag-and-drop + file input, currently has a `TODO: wire to useUploadResume() mutation` per `app/page.tsx`. Build `useUploadResume()` in `resume.hooks.ts` (TanStack `useMutation`, posts `FormData` — remember to **not** set `Content-Type: application/json` on this call, let axios set the multipart boundary automatically, see `frontend/src/api/client.ts`'s default header). On success: invalidate/update the resumes list query, redirect to the new resume's detail page (#14) or back to the dashboard list. On `PARSING_FAILED`/`FILE_TOO_LARGE`/`UNSUPPORTED_FILE_TYPE`: surface via toast, matching the pattern already used in `login`/`register` pages for `INVALID_CREDENTIALS`/`USER_ALREADY_EXISTS`.

---

## 7. Build order

Both epics are interleaved in practice — the upload endpoint (#10) can't be meaningfully finished without the parser (#20) and schema (#21) existing first. Suggested sequencing, in four phases:

**Phase 0 — foundations (no user-visible behavior yet)**
1. #21 Resume JSON schema (Zod + types, backend + mirrored frontend type)
2. #18 Resume repository
3. #11 Resume storage service (local-disk impl behind the `StorageService` interface)
4. Error-code consolidation (§3) — small, but unblocks clean error handling in every later step

**Phase 1 — parsing pipeline (backend-only, testable in isolation via a script/test, no route needed yet)**
5. #19 Integrate MarkItDown (subprocess wrapper + boot-time health check)
6. #20 Resume Parser (Markdown → `ResumeJson`, heuristic-based per §5)
7. #23 Parsing error handling (typed errors from #19/#20, no persistence side effects yet since there's no caller)

**Phase 2 — resume CRUD API (wires everything together)**
8. #17 File validation (multer config + error mapping)
9. #10 Resume upload API (orchestrates #17 → #20 → #11 → #18; #22 "persist Resume JSON" falls out of this naturally, not a separate step)
10. #13 Resume listing
11. #14 Resume details
12. #15 Replace resume
13. #16 Delete resume

**Phase 3 — frontend**
14. #12 Upload resume page (wire `UploadDropZone` to real mutation)
15. Wire `RecentResumeSection`/`ResumeListItem` to #13's real data (part of #13's frontend half)
16. Resume detail page for #14's frontend half

Verify with the `/verify` skill (drive an actual upload → list → detail → replace → delete cycle against a running backend + Postgres) after Phase 2 and again after Phase 3, rather than only unit-testing each layer in isolation — the interesting bugs here are in the cross-cutting orchestration (temp file cleanup, orphaned disk files on replace/delete, atomic rollback on parse failure), not any single function.

---

## 8. Open items to revisit later (not blocking, just noted)

- No background job queue for MVP (matches ADR/architecture doc's "Future" list) — parsing happens synchronously in the request. Large/slow files will hold the HTTP connection open; acceptable at 5 MB PDFs, revisit if that changes.
- `frontend/src/api/auth.api.ts` (legacy duplicate of `auth.service.ts`) is unrelated dead code noticed during prior research — unrelated to this epic, worth a separate small cleanup PR.
- The `api-spec.md` "Resume Editor" and `/ai/*` endpoints are a distinct future epic (resume editing + AI suggestions) — not covered by issues #10–23, don't build them now even though they're in the same doc.
