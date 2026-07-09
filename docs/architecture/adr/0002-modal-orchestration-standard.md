# ADR-0002: Modal Orchestration Standard

## Status
Proposed — no modal exists in the codebase yet. This ADR pre-commits to a
standard so the first modal (likely resume upload, delete-confirm, or
analysis detail) doesn't set an ad-hoc precedent.

## Context

[`docs/architecture/reuse.md` §4](../reuse.md#4-modal-management-deep-dive)
and [§11](../reuse.md#11-reusable-architecture-blueprint-for-another-project)
describe a prior codebase where three coexisting orchestration styles
(Zustand stack, URL-query-driven, and PubSub) caused desync and cognitive
overhead, and recommend a two-lane model instead.

ResumeForge currently has: `components/ui/dialog.tsx` and
`components/ui/sheet.tsx` (Radix-based primitives, desktop dialog + mobile
slide-over — analogous to the prior codebase's `Modal`/`SlideModal`), and
`components/ui/alert-dialog.tsx` for confirmations. No orchestration layer
exists above them yet — auth pages are full routes (`/login`, `/register`),
not modals.

## Decision

Adopt the two-lane model from `reuse.md` §11.1 for any future modal work:

- **Lane A — Route Modal Lane**: navigation-significant, shareable dialogs
  (e.g. a deep-linkable "view analysis" or onboarding flow, if ever added).
  Opens/closes only via URL state (Next.js App Router: route intercepting
  `@modal` slots or search params), never local component state.
- **Lane B — Workflow Modal Lane**: CRUD/action dialogs (upload resume,
  confirm delete, edit title). Opens/closes only via a typed Zustand store
  with stack semantics, per ADR-0001's "global UI orchestration" row.

```ts
// workflow-modal.types.ts
export const modalIds = {
  deleteResume: "delete-resume",
  uploadResume: "upload-resume",
} as const;
export type ModalId = (typeof modalIds)[keyof typeof modalIds];

// nested dismiss policy (reuse.md §4.3)
export const canDismissOutside = (id: ModalId, stack: ModalId[]) =>
  stack.length > 0 && stack[stack.length - 1] === id;
```

`Dialog`/`Sheet`/`AlertDialog` from `components/ui/` remain lane-agnostic
rendering primitives — both lanes use them, neither lane re-implements them.

## Alternatives considered

- **Single Zustand stack for everything, including auth-like flows** —
  rejected; loses deep-linking/shareability that `reuse.md` §3.3 identifies
  as a real strength of the route-driven approach.
- **PubSub/event bus for modal injection** — explicitly called out as an
  anti-pattern in `reuse.md` §13; rejected outright.

## Consequences

**Positive:** one canonical answer to "how do I open a modal" per use case,
decided before the first modal is built — avoids retrofitting.

**Negative:** Lane A requires typed route/search-param helpers to avoid the
`login` vs `sign_in` naming drift `reuse.md` §13 warns about; that helper
doesn't exist yet and must be built alongside the first Lane A modal.

## Migration notes

Not applicable yet — no existing modal code to migrate. Revisit this ADR's
status (Proposed → Accepted) once the first modal of each lane ships.
