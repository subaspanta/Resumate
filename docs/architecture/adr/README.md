# Architecture Decision Records

This log captures the architectural decisions for ResumeForge's frontend and
backend, derived from applying the reusable engineering standards in
[`docs/architecture/reuse.md`](../reuse.md) to this codebase.

Each ADR follows the same template: Context, Decision, Alternatives
considered, Consequences, Migration notes.

| ADR | Title | Status |
|-----|-------|--------|
| [0001](./0001-state-management-boundaries.md) | State Management Boundaries | Accepted |
| [0002](./0002-modal-orchestration-standard.md) | Modal Orchestration Standard | Proposed |
| [0003](./0003-authentication-session-strategy.md) | Authentication and Session Strategy | Accepted (with deferred work) |
| [0004](./0004-api-client-and-error-envelope.md) | API Client and Error Envelope Contract | Accepted |
| [0005](./0005-folder-structure-and-naming.md) | Folder Structure and Naming Conventions | Accepted |

## Naming note

`docs/planning/resume-and-parsing-epics-plan.md` references an "ADR-001" for
the "no dedicated parsing microservice" decision. That decision has not yet
been recorded here — it does not correspond to
[0001](./0001-state-management-boundaries.md). When the resume/parsing epics
are implemented, record that decision as `0006-parsing-strategy.md` and
update the planning doc's reference accordingly. Flagging here rather than
silently renumbering, since the planning doc may be actively in use.
