# ADR-0001: State Management Boundaries

## Status
Accepted

## Context

[`docs/architecture/reuse.md` §3.1](../reuse.md#31-state-management-segmentation)
observed that a prior codebase mixed three state systems (Zustand, React
Query, Formik) without an explicit ownership boundary, which let business
data drift into the global store and produced inconsistent error models
between forms and query hooks.

ResumeForge already has react-hook-form + Zod, TanStack Query, and Zustand
as dependencies (`frontend/package.json`). Zustand is currently unused —
`frontend/src/providers/auth-provider.tsx` derives auth/route state directly
from `useAuth()` (a React Query hook), not a Zustand store. This is the
right moment to record the intended boundary before a store gets added
under time pressure for the resume-upload or analysis UI.

## Decision

Adopt an explicit ownership matrix, matching `reuse.md`'s "Practical
takeaway" in §2.2 and §3.1:

| State kind | Owner | Example in this repo |
|---|---|---|
| Server data & cache | TanStack Query | `useAuth()` in `frontend/src/features/auth/auth.hooks.ts` (query key `["auth", "me"]`, mutations for login/register/logout) |
| Form state & validation | react-hook-form + Zod | `LoginForm.tsx`, `RegisterForm.tsx` |
| Local/component UI state | `useState`/`useReducer` in the component | e.g. password-visibility toggles |
| Global UI orchestration (transient, cross-component) | Zustand | Not yet needed. Reserved for things like a workflow-modal stack (ADR-0002) or a multi-step upload wizard's step index — **never** for data that also exists in a query cache |

Rule: if a value can be derived from a React Query cache, it must not also
live in Zustand. If it's persisted server-side, it's React Query's job, not
Zustand's.

## Alternatives considered

- **Redux/Context for everything** — rejected; heavier boilerplate than the
  segmentation above for a small team, and `reuse.md` explicitly credits the
  three-way split for keeping forms deterministic and caching out of custom
  logic.
- **No Zustand at all, prop-drill instead** — rejected; workflow modals
  (ADR-0002) and multi-step flows benefit from a light global store once
  they exist, per `reuse.md` §11.

## Consequences

**Positive:** clear rule to point to in code review when a PR proposes
putting fetched data into a new Zustand store. Keeps `useAuth()` as the
single source of truth for auth state.

**Negative:** requires discipline — nothing in the type system enforces
this boundary; it's a convention, not a compile-time guarantee.

## Migration notes

No migration needed today (Zustand is unused). When the first global UI
store is added, name it for its concern (e.g. `useWorkflowModalStore`, not
`useAppStore`) and reference this ADR in its file header comment.
