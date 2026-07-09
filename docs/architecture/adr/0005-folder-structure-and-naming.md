# ADR-0005: Folder Structure and Naming Conventions

## Status
Accepted

## Context

[`docs/architecture/reuse.md` §6.2](../reuse.md#62-folder-structure-and-modularity)
credits a prior codebase's `components`/`hooks`/`services/apis`/`schema`/
`utils`/`types` separation, but flags inconsistent casing and duplicate/
legacy paths as onboarding friction, recommending
`features/<feature>/{components,hooks,api,types}` plus a `shared/` layer,
one casing standard, lint-enforced.

ResumeForge's actual layout, observed directly:

```
frontend/
  app/                     — Next.js App Router routes only
  components/ui/           — shared, lane-agnostic primitives (shadcn/Radix)
  src/
    api/                   — cross-cutting HTTP client (axiosClient, ApiError)
    components/            — shared, non-feature-specific components
    features/
      auth/                — components/, auth.hooks.ts, auth.service.ts, types.ts
      resume/               — types.ts only so far
      utils/
    providers/              — app-shell providers (QueryProvider, AuthProvider)
    lib/                     — cross-cutting utilities (log-error.ts)
```

This already matches `reuse.md`'s recommended shape closely:
`features/<feature>/{components, hooks, service, types}` (this repo uses
`*.service.ts`/`*.hooks.ts` file suffixes inside the feature folder rather
than `api`/`hooks` subfolders — an equally valid, more concise variant for a
feature with a small number of files) and a `shared` equivalent split across
`components/ui/` (design-system primitives) and `src/components/` (shared
app components).

Two concrete drift issues were found and fixed as part of adopting this
ADR: two divergent `error-codes.ts` files existed in the backend
(`constants/` vs `types/`), and the frontend had a duplicate, untyped
`authApi` (`src/api/auth.api.ts`) alongside the real typed one in
`src/features/auth/auth.service.ts` — exactly the "duplicate/legacy paths"
risk `reuse.md` §6.2 warns about.

## Decision

1. **Feature module shape:** `src/features/<feature>/{components/, *.hooks.ts,
   *.service.ts, types.ts, index.ts}`. `index.ts` re-exports the feature's
   public surface (see `src/features/auth/index.ts`) — other features/pages
   import from the feature root, never reach into a sibling feature's
   internal files directly.
2. **Shared layer:** cross-cutting, non-feature-specific code lives in
   `components/ui/` (design-system primitives), `src/components/` (shared
   composed components), `src/lib/` (utilities like `log-error.ts`), and
   `src/api/` (the HTTP client itself, not feature API calls).
3. **One source of truth per contract.** No duplicate files for the same
   concern (error codes, API clients, type definitions) — if a second file
   for the same concept appears, one must be deleted and its importers
   repointed, not left to diverge. Backend error codes now live only in
   `backend/src/constants/error-codes.ts` (see ADR-0004).
4. **Casing:** PascalCase for component files and their default export
   (`AuthCard.tsx`, `RegisterForm.tsx`); camelCase for hooks/services/utils
   (`auth.hooks.ts`, `auth.service.ts`); `kebab-case` only for Next.js
   App Router route segments (`app/login/page.tsx`), which is a framework
   requirement, not a choice. `frontend/src/components/Scorebadge.tsx` is a
   known casing outlier (should be `ScoreBadge.tsx` per this rule) —
   flagged, not renamed as part of this ADR to avoid an unrelated diff.

## Alternatives considered

- **`api`/`hooks` as subfolders inside each feature** (the literal
  `reuse.md` shape) — considered, but for a feature this size
  (`auth.hooks.ts` + `auth.service.ts` + `types.ts`), flat files inside the
  feature folder are equally clear with less nesting. Revisit per-feature if
  a feature's file count grows past ~6-8 files.
- **Renaming `Scorebadge.tsx` now** — deferred; out of scope for this ADR's
  code changes (see Migration notes).

## Consequences

**Positive:** new contributors have one documented shape to follow; the
duplicate-file class of bug (ADR-0004's drift) has an explicit rule against
it now, not just a one-time fix.

**Negative:** the flat-file-per-concern choice (vs. subfolders) means a
feature that grows significantly will need a restructure at some point —
acceptable per the "revisit per-feature" note above.

## Migration notes

- Rename `frontend/src/components/Scorebadge.tsx` → `ScoreBadge.tsx` (and
  update its one import site) as a follow-up, low-risk cleanup — not bundled
  with this ADR's other changes to keep this diff focused on drift fixes.
- As `resume`/`analysis` features are built (see the planning doc), follow
  the shape in this ADR from the start rather than the `auth` feature's
  organically-grown structure.
