# Frontend & Backend Conventions

Practical, quick-reference conventions for ResumeForge. The reasoning behind
each rule lives in the corresponding ADR under
[`docs/architecture/adr/`](./adr/README.md) — this doc is the "what",
the ADRs are the "why".

## State ownership matrix

See [ADR-0001](./adr/0001-state-management-boundaries.md) for full rationale.

| State kind | Owner | Do not |
|---|---|---|
| Server data & cache | TanStack Query (`useQuery`/`useMutation`) | Don't mirror query data into Zustand |
| Form state & validation | react-hook-form + Zod (`zodResolver`) | Don't hand-roll validation in submit handlers |
| Local/component UI state | `useState` in the component | Don't lift to global state unless shared across components |
| Global UI orchestration (transient, cross-component) | Zustand | Don't store anything also owned by React Query |

## Module & folder boundaries

See [ADR-0005](./adr/0005-folder-structure-and-naming.md) for full rationale.

```
frontend/
  app/                     Next.js App Router routes only — no business logic
  components/ui/           Shared design-system primitives (shadcn/Radix)
  src/
    api/                   Cross-cutting HTTP client + error envelope
    components/            Shared, non-feature-specific components
    features/<feature>/
      components/          Feature-scoped components
      <feature>.hooks.ts   React Query hooks for this feature
      <feature>.service.ts Typed API calls for this feature
      types.ts             Feature's public types (inputs, response shapes)
      index.ts             Public surface — only this is imported externally
    providers/              App-shell providers (QueryProvider, AuthProvider)
    lib/                     Cross-cutting utilities (logError, cn, etc.)

backend/
  src/
    config/                  env, db, logger
    constants/                error-codes.ts — the ONLY error-code source
    middleware/                requireAuth, validate-request
    modules/<module>/
      <module>.routes.ts
      <module>.controller.ts
      <module>.service.ts
      <module>.repository.ts
      <module>.schema.ts       Zod input schemas
      <module>.types.ts
    types/                     Cross-cutting types (AppError, express.d.ts)
    utils/                      tokens.ts, etc.
```

Rule: other features/modules import a feature's `index.ts` (frontend) or a
module's exported service/controller — never reach into a sibling's
internal files.

## Naming

- Components: PascalCase file + default export (`RegisterForm.tsx`).
- Hooks/services/utils: camelCase with a `.hooks.ts`/`.service.ts` suffix
  (`auth.hooks.ts`).
- Next.js route segments: kebab-case per framework convention
  (`app/forgot-password/page.tsx`).
- One casing standard per category — no `Layout`/`Layouts`-style
  inconsistency (see [ADR-0005](./adr/0005-folder-structure-and-naming.md)
  migration notes for the one known outlier, `Scorebadge.tsx`).

## Error taxonomy

See [ADR-0004](./adr/0004-api-client-and-error-envelope.md) for the wire
contract. Three kinds of errors, three handling strategies:

| Kind | Example | Handling |
|---|---|---|
| Field-level validation | Zod schema rejects an input before submit | `react-hook-form`'s `formState.errors`, rendered inline per field |
| Server-rejected input / user-action errors | `EMAIL_ALREADY_EXISTS`, `INVALID_CREDENTIALS` from the API | Catch in the mutation call site, branch on `isApiError(error)` + `error.code`, `setError(...)` for field-specific cases, `sonner` `toast.error(...)` otherwise |
| System / unexpected errors | A component throws, an unhandled promise rejection | Caught by `app/error.tsx` (route-level) or `app/global-error.tsx` (root-level); both call `src/lib/log-error.ts`'s `logError()` — the single seam to wire up Sentry/OpenTelemetry later |

Never read `error.response.data.error` in a form's catch block — the axios
interceptor (`frontend/src/api/client.ts`) already normalizes every failure
to a flat `ApiError`. Always use `isApiError(error)` from
`frontend/src/api/api-error.ts`.

## Modal orchestration

Two lanes — see [ADR-0002](./adr/0002-modal-orchestration-standard.md):

- **Route lane**: navigation-significant, shareable modals — URL-state
  driven.
- **Workflow lane**: CRUD/action modals — typed Zustand stack.

Never mix lanes for the same modal, and never use a PubSub/event bus for
modal lifecycle.

## Authentication

See [ADR-0003](./adr/0003-authentication-session-strategy.md). Single
paradigm: server-set HttpOnly + Secure + SameSite=strict cookie, JWT access
token, `requireAuth` middleware, `/auth/me` as the only client hydration
path (via `useAuth()`). Refresh-token rotation is a known, deferred gap —
do not paper over it by extending the access-token TTL.
