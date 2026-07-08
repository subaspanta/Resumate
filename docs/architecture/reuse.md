
## 1) Purpose and Scope

This document captures reusable engineering decisions from an existing Next.js + React codebase and translates them into implementation-ready principles for a new project.
- Focus: architecture and engineering patterns only
- Excludes: product/business feature specifics unless needed to explain architecture
- Primary domains:
- Modal management
- Session/authentication management
- Frontend architecture and API integration patterns
- Error handling, performance, and scalability decisions
## 2) System Architecture Snapshot

## 2.1 Frontend stack (observed)

- Next.js (Pages Router)
- React + TypeScript
- Zustand for lightweight global state
- TanStack Query (React Query) for server state
- Formik + Zod/Yup for form handling and validation
- Notistack for user notifications
- Portal-based modal rendering
## 2.2 Architectural style

- Feature-oriented frontend modules (`components`, `hooks`, `services/apis`, `schema`, `utils`)
- Thin UI components + hook-driven state orchestration
- Query-parameter-driven UI state for route-addressable auth flows
- API hook factories for consistent data access patterns
## Practical takeaway

For new projects, keep this separation explicit:

1. Local UI state in component
2. Global UI orchestration state in lightweight store (Zustand)
3. Server state in React Query
4. Shared concerns in hook/service layers

---

## 3) Core Architectural Patterns

## 3.1 State Management Segmentation

### Pattern

- **Zustand** for global UI coordination and transient app-level state:
- Modal stack/state (`useModal`)
- Login modal viewport/open state (`useUserLogin` internal store)
- **React Query** for API-backed state:
- Query/mutation hooks generated via API hook creators
- **Formik + schema** for form state and validation:
- Login/register/forgot-password forms
### Why it works

- Minimizes overuse of global stores
- Keeps async lifecycle and caching in React Query (not custom logic)
- Keeps forms deterministic and testable
### Risks

- Boundary drift: business data may accidentally move into Zustand
- Inconsistent error models between forms and query hooks
## Practical takeaway

Define explicit ownership matrix in new project docs:
- UI orchestration state → Zustand
- Remote data and cache → React Query
- Form state and constraints → Formik + schema

---

## 3.2 API Layer Modularization

### Pattern

- Hook factories (`HookCreator`) generate `GET/POST/PUT/PATCH/DELETE` hooks from resource definitions
- Shared default query options disable noisy refetches
- Token injection centralized in API hook creator
### Why it works

- Removes repeated boilerplate
- Standardizes API usage and reduces per-feature drift
- Simplifies future global changes (headers, retry, instance selection)
### Risks

- If factory abstraction is too opaque, debugging can slow down
- Missing typed error envelope can cause per-feature error branching
## Practical takeaway

In new systems, keep a thin API factory but enforce:
- strongly typed response envelope
- typed domain errors
- standardized retry/backoff policy by endpoint class (critical vs non-critical)


---

## 3.3 Route-Driven UI State

### Pattern

Auth-related modals are opened/closed via URL query params (`sign_in`, `register`, `forget-password`) with shallow routing.
### Why it works

- Deep-linkable auth state
- Shareable URL behavior
- Browser back/forward works with modal transitions
### Risks

- Query-key inconsistency (`login` and `sign_in` both appear in different flows)
- More URL-state branches increase QA complexity
## Practical takeaway

Use route-driven UI for user-visible state machines, but enforce one canonical naming scheme and typed route helpers.

---

## 4) Modal Management Deep Dive

## 4.1 Modal architecture layers

### Layer A: Rendering primitives

- Desktop modal (`Modal`) and mobile bottom-sheet style (`SlideModal`)
- Both use portal rendering to `#modal-root`
- Shared behaviors:
- body scroll lock
- outside-click dismiss (configurable)
### Layer B: Orchestration strategies (coexisting)

1. **Store-driven modal stack** (Zustand `useModal`)
- `activeModal: string[]` used as stack-like structure
- Used heavily in profile/actions/review workflows

2. **Query-driven modals** (auth)

- URL query opens/closes auth modals

1. **PubSub-driven modal injection**

- Some modal content published/subscribed via event bus
### Layer C: Nested modal behavior policy

- `getDismissOnOutsideClick(modalName, activeModals)` enforces only top modal to dismiss on outside click
- Prevents accidental closure of parent when child modal is active

## 4.2 What is strong in this design

- Responsive modality (desktop + mobile) is first-class
- Modal rendering is decoupled from feature logic
- Supports nested and multi-step flows
- Route-addressable auth modal UX is user-friendly
## 4.3 Scalability pain points

- Three orchestration styles coexist (store, query, pubsub), increasing cognitive overhead
- String-based modal IDs without compile-time guarantees
- Potential desync between URL state and store state in complex transitions

Adopt one unified modal control contract:

- Keep rendering primitives (`Modal`, `SlideModal`)
- Keep **single orchestration source of truth** per modal family:
- Route-state for navigation-significant modals (auth, onboarding)

```ts

// modal.types.ts

export const modalIds = {

} as const

  

export type ModalId = (typeof modalIds)[keyof typeof modalIds]

  

// modal.store.ts

type ModalState = {

stack: ModalId[]

open: (id: ModalId) => void

closeTop: () => void

close: (id: ModalId) => void

}

```


```ts

// nested dismiss policy

export const canDismissOutside = (id: ModalId, stack: ModalId[]) => stack.length > 0 && stack[stack.length - 1] === id

```
## Practical takeaway

Design modal systems as a platform, not per-feature code. Standardize IDs, stack policy, and route-vs-store ownership up front.

---

## 5) Session Management Deep Dive

## 5.1 Authentication flow (observed)

1. User opens login/register/forgot flow via query params and modal hosts
2. Login/register submits via API hooks (`/common/login`, `/user/email-registration`)
3. Access + refresh tokens are saved to cookies
4. Role-based redirect sends users to `/`, `/hq`, or `/biz`
5. App bootstrap (`_app.getInitialProps`) validates token and attempts refresh token exchange
6. If invalid, cookies are cleared and essentials are fetched unauthenticated

## 5.2 Token and persistence strategy

### Strengths

- Access + refresh token model is present
- Refresh path implemented at app bootstrap
- Token lifecycle tied to SSR bootstrap improves initial auth consistency
### Security concerns to address in next project

- Tokens appear to be set from client-visible cookie utilities; this generally means **not HttpOnly** from browser writes
- Cookie flags include `secure` and `sameSite: strict`, which is good, but HttpOnly should be enforced server-side
- Auth ecosystem is mixed:
- Custom token cookies/session handling
- NextAuth `getToken` appears only in middleware for limited routes
- Mixed models increase policy drift risk
## 5.3 Middleware and authorization

- Middleware protects specific paths (`/abc`) and checks token role
- This is useful but currently narrow in scope and not a full policy layer
## 5.4 Reusable session architecture for new project

### Recommended target

- Single auth model (avoid parallel custom + framework session systems)
- Server-set HttpOnly cookies for tokens/session IDs
- Access token short-lived, refresh token rotation with revocation support
- Centralized authorization policy map by route/domain
- Explicit client auth state hydration endpoint (`/me`) instead of cookie parsing in multiple places
### Minimal policy checklist

- HttpOnly + Secure + SameSite cookies
- CSRF protection strategy documented
- Token rotation and logout invalidation semantics defined
- Session expiry UX and silent refresh behavior standardized
## Practical takeaway

Session architecture must be unified and security-first. If you mix auth paradigms, document strict boundaries and migration plan immediately.

---

## 6) Additional High-Value Engineering Insights

## 6.1 Error handling strategy

### Observed

- API-level errors surfaced through `useErrorResponse` and snackbar messaging
- Form errors handled per-field (422) inside form submit handlers
- UI crash containment via `ErrorBoundary`
### Reuse guidance

- Define error taxonomy:
- validation errors (field-level)
- user-action errors (toast)
- system errors (boundary/logging)
- Add telemetry pipeline (Sentry/OpenTelemetry) from `ErrorBoundary` and API interceptor
## 6.2 Folder structure and modularity

### Observed strengths

- Good separation: `components`, `hooks`, `services/apis`, `schema`, `utils`, `types`
- Clear feature groupings under `components`
### Improvement opportunities

- Inconsistent naming and casing (`Layout` + `Layouts`, mixed modal naming styles)
- Duplicate/legacy paths can increase onboarding cost
### Reuse guidance

Adopt explicit conventions document:
- `features/<feature>/{components,hooks,api,types}` for feature modules
- `shared/{ui,hooks,lib,types}` for reusable primitives
- One casing standard, one naming standard, lint-enforced

## 6.3 Performance decisions

### Observed

- React Query defaults tuned to reduce automatic refetch noise
- Lazy loading for devtools in production build path
- Frequent use of memoization (`useMemo`, `useCallback`) around derived values and handlers

### Reuse guidance

- Start with conservative refetch policies
- Add stale-time profiles by data criticality
- Use route-level code splitting and dynamic imports for heavy modal flows
## 6.4 Scalability design choices

### Positive

- Hook-based composability supports team scaling
- API factory supports endpoint growth
- Modal primitives reusable across many workflows

### Risks

- Architectural drift from multiple orchestration styles
- Legacy code paths coexist with newer patterns

### Reuse guidance

Set architecture governance:

- ADRs (Architecture Decision Records) for every major pattern
- “One preferred way” guide for state, modals, auth, API, and errors
- Quarterly architecture debt review
## Practical takeaway

Scalability comes from consistency more than sophistication. Enforce conventions early.

---

## 7) Reusable Principles for a New Project

## 7.1 Principles

1. **Separate state by intent**
- UI orchestration, server data, and forms must not share one state system.

2. **Treat modals as architecture**

- Standardize modal IDs, stack semantics, and route/store ownership.

3. **Use URL state for shareable workflows**

- Auth, onboarding, and wizard steps benefit from route-addressability.

4. **Unify session model**

- One auth paradigm, one source of truth, one security policy.

5. **Centralize API mechanics**

- Common headers, error parsing, retry strategy in one place.

6. **Design for failure paths first**

- Define handling for 401/403/422/5xx before feature expansion.

7. **Codify conventions, then automate enforcement**

- Lint rules, templates, ADRs, and code reviews aligned to architecture.

## 7.2 New project starter checklist

- [ ] Define frontend architecture map (state boundaries + module boundaries)
- [ ] Create modal platform (primitives + orchestration policy + typed IDs)
- [ ] Define auth/session policy (cookies, refresh, middleware, logout)
- [ ] Build typed API client and error envelope
- [ ] Add observability for UI/API errors
- [ ] Publish naming and folder conventions
- [ ] Add ADR template and decision log in repo

---

## 8) Suggested ADRs to Create Immediately in the New Project

1. **ADR-001: State Management Boundaries**
2. **ADR-002: Modal Orchestration Standard**
3. **ADR-003: Authentication and Session Strategy**
4. **ADR-004: API Client and Error Envelope Contract**
5. **ADR-005: Folder Structure and Naming Conventions**

Each ADR should include:
- Context
- Decision
- Alternatives considered
- Consequences (positive/negative)
- Migration notes

---

## 9) Final Implementation Guidance

If you want maximum reuse with minimal debt carryover:
- Reuse the **patterns**, not the incidental inconsistencies.
- Keep the modal primitives and API hook factory concept.
- Rebuild session handling as a unified, security-hardened model.
- Enforce typed route/query contracts to avoid modal/auth URL drift.
- Capture all architectural decisions as ADRs from week one.

This gives you the original project’s strengths (speed, composability, UX flexibility) while improving maintainability and long-term scalability.

  

---

  

## 10) Deep Dive: How Login/Register/Forgot-Password Modals Actually Work

  

This section explains the real execution model in the current codebase and how to reproduce it safely in a new project.

  

## 10.1 Runtime components involved

  

Auth modal behavior is split across these parts:

  

- **Global modal hosts** mounted at app shell level:

- `UserSignIn` (sign-in modal)

- `UserAuthModal` (register + forgot-password + registration-error)

- **Routing trigger layer**:

- Buttons/actions push query params (`sign_in`, `register`, `forget-password`) via shallow routing

- **State layer**:

- `useUserLogin` Zustand store for login modal open state + login viewport

- **UI primitives**:

- `Modal` for desktop

- `SlideModal` for mobile

- **Feature forms**:

- `SignInWithEmail`

- `Register` (wizard)

- `ForgetPassword` (OTP/reset flow)

  

### Practical takeaway

  

Treat auth modals as a composed subsystem with clear layers (trigger, router-state, store-state, host, form).

  

## 10.2 Opening behavior (who opens what)

  

### Sign in

  

- Trigger usually sets `?sign_in=true` in URL.

- `UserSignIn` watches query changes.

- When `sign_in` is present:

- store flag `isLoginModalOpen = true`

- sign-in viewport resets to social/manual default

  

### Register

  

- Trigger usually sets `?register=user` (or business path depending on entry).

- `UserAuthModal` computes `showModal` from query and renders `Register` content.

  

### Forgot password

  

- Trigger usually sets `?forget-password=true`.

- `UserAuthModal` renders `ForgetPassword` content.

  

### Practical takeaway

  

Use URL query as canonical open/close trigger for auth modals; this gives deep-linking and browser history support.

  

## 10.3 Closing behavior (how modal dismiss works)

  

Auth modal dismissal uses query cleanup:

  

- On close action, modal host removes auth-related query keys.

- Shallow route is used to avoid full page refresh.

  

Observed behavior pattern:

  

1. User taps close/outside/back

2. Host removes `sign_in`/`register`/`forget-password` from URL

3. Modal disappears because render condition is query-driven

  

### Practical takeaway

  

Close actions should mutate URL state first, then let rendering conditions naturally unmount modal content.

  

## 10.4 State transitions inside auth forms

  

### Sign-in path

  

1. User enters modal (`sign_in` query)

2. Optional transition social → manual login viewport (`useUserLogin.signInViewPort`)

3. Submit manual login (`/common/login`)

4. Store tokens in cookies

5. Redirect by role (`/`, `/hq`, `/biz`)

  

### Register path

  

1. Open via `register` query

2. `Register` component drives wizard state (option -> user/business flow)

3. Submit registration endpoint

4. Show success state and optional path back to sign-in

  

### Forgot-password path

  

1. Open via `forget-password` query

2. Submit email -> `/common/forget-password`

3. Enter OTP -> `/common/check-otp`

4. Reset password -> `/common/reset-password`

5. Return to sign-in flow

  

### Practical takeaway

  

Auth modal content should be a mini state machine per flow, independent from modal shell mechanics.

  

## 10.5 How modal behavior differs from non-auth modals

  

Auth modals and feature modals follow different orchestration models:

  

- **Auth modals**: URL query-driven rendering + limited local store state

- **Feature modals**: Zustand stack (`activeModal`) + modal ID push/pop + nested dismiss policy

  

This dual model is workable but can drift without conventions.

  

### Practical takeaway

  

In a new project, document: “auth = route-driven”, “feature workflows = store-driven”. Avoid mixing for the same modal family.

  

---

  

## 11) Reusable Architecture Blueprint for Another Project

  

## 11.1 Recommended target design

  

Use a two-lane modal architecture:

  

- **Lane A (Route Modal Lane)**: authentication/onboarding/legal dialogs

- **Lane B (Workflow Modal Lane)**: CRUD/action dialogs, nested entity flows

  

Rules:

  

1. Route lane modals open/close only via URL state helpers.

2. Workflow lane modals open/close only via typed modal store.

3. Shared UI primitives (`Modal`, `SlideModal`) are lane-agnostic.

  

### Practical takeaway

  

This pattern preserves current strengths while removing orchestration ambiguity.

  

## 11.2 Reusable typed contracts

  

```ts

// auth-modal.query.ts

export type AuthModalQuery = {

sign_in?: 'true'

register?: 'user' | 'business'

'forget-password'?: 'true'

}

```

  

```ts

// auth-modal.state.ts

export type AuthScreen = 'sign-in' | 'register' | 'forgot-password'

  

export type AuthModalState = {

isOpen: boolean

screen: AuthScreen

}

```

  

```ts

// workflow-modal.types.ts

export const modalIds = {

editProfile: 'edit-profile',

billingList: 'billing-list',

billingAction: 'billing-action',

} as const

  

export type ModalId = (typeof modalIds)[keyof typeof modalIds]

```

  

### Practical takeaway

  

Type route state and modal IDs to prevent silent breakage from string mismatches.

  

## 11.3 Reusable modal controller APIs

  

Create explicit controller hooks:

  

- `useAuthModalController()`

- `openSignIn()`

- `openRegister(mode)`

- `openForgotPassword()`

- `closeAuthModal()`

- `useWorkflowModalController()`

- `open(id)`

- `close(id)`

- `closeTop()`

- `canDismissOutside(id)`

  

### Practical takeaway

  

Use controller hooks as architecture boundaries; UI components should call intent APIs, not manipulate query/store directly.

  

---

  

## 12) Migration Guide: Porting This Pattern to a New Codebase

  

## 12.1 Step-by-step migration

  

1. Build `Modal` and `SlideModal` primitives first.

2. Add app-shell modal hosts (`AuthModalHost`, `WorkflowModalHost`).

3. Implement typed route helpers for auth query keys.

4. Implement typed workflow modal store with stack semantics.

5. Move existing login/register/forgot forms into `AuthModalHost` content switch.

6. Add close policy tests (query cleanup + stack top dismiss).

7. Add E2E tests for URL-deep-link auth modals.

  

## 12.2 Minimum test matrix

  

- `?sign_in=true` opens sign-in on refresh/direct URL

- Closing sign-in removes query key and keeps page state

- Register -> sign-in switch updates query without full reload

- Forgot-password OTP step survives modal re-renders

- Nested workflow modal only closes topmost on outside click

  

### Practical takeaway

  

Without route + modal integration tests, this architecture regresses quickly.

  

---

  

## 13) Anti-patterns to Avoid in Reuse

  

- Mixing `login` and `sign_in` query names for same intent

- Letting feature components mutate router query manually everywhere

- Using untyped modal IDs (`string`) across large codebases

- Mixing PubSub with store/query for the same modal lifecycle

- Closing modals by local state only when URL state is the source of truth

  

### Practical takeaway

  

Enforce one canonical query schema + one controller layer per modal lane.

  

---

  

## 14) `useWebEssentials` Deep Dive: What It Fetches and Should You Reuse It?

  

`useWebEssentials` is the app-level bootstrap data access pattern. It is not a fetcher itself; it is a selector hook over a globally hydrated store.

  

## 14.1 What data is actually fetched

  

At app bootstrap, `_app.getInitialProps` fetches:

  

1. `public/web-essentials`

2. `public/location`

  

The `public/web-essentials` payload is then written into the Zustand store and exposed via `useWebEssentials()`.

  

Core fields exposed from store:

  

- `user`

- `categories`

- `trendingEntity`

- `settings`

- `systemSetting`

- `notification`

- plus helper selectors like `getParticularSetting()`

  

Important nuance:

  

- Approximate geo location is fetched during bootstrap but kept in a separate location store via `useSetApproximateLocation`, not primarily consumed through `useWebEssentials`.

  

### Practical takeaway

  

Think of `web-essentials` as **global app context data** (identity + navigation + config + common feed metadata), not feature-local data.

  

## 14.2 How the lifecycle works

  

Lifecycle in current architecture:

  

1. Server/app bootstrap fetches essentials once.

2. `useSetWebEssentials()` hydrates Zustand store.

3. Components call `useWebEssentials()` to read memoized slices.

4. A `web_essentials` cookie flag is used to reduce repetitive bootstrap behavior.

  

This gives fast first render and consistent cross-page access to common global data.

  

### Practical takeaway

  

For data needed by most routes, bootstrap hydration + global selector hooks is a strong pattern.

  

## 14.3 Should you copy this principle in your next project?

  

Short answer: **Yes, copy the principle; refine the implementation.**

  

### What to copy

  

- One bootstrap endpoint (or composed backend response) for app-shell data

- Hydrate once at app entry

- Expose with a stable selector hook (`useAppEssentials` style)

- Keep derived helper selectors centralized

  

### What to improve

  

- Keep the essentials contract minimal and versioned

- Separate location from essentials unless universally required

- Prefer explicit freshness strategy (TTL/revalidate) over cookie flag side-effects

- Add strict typing and runtime validation (e.g., Zod schema on payload)

- Do not mix too many unrelated domains into essentials (avoid becoming a “mega payload”)

  

### Practical takeaway

  

Reuse this as a **Bootstrapped Global Context Pattern**:

  

- great for user identity, permissions, nav categories, settings, notifications summary

- not ideal for heavy, rapidly changing, or page-specific datasets

  

## 14.4 Reusable implementation blueprint

  

```ts

// app-essentials.types.ts

export type AppEssentials = {

user: { id: string; role: string } | null

categories: Array<{ id: string; name: string }>

settings: Array<{ slug: string; value: unknown }>

notificationSummary: { unreadCount: number }

}

```

  

```ts

// useAppEssentialsStore.ts (Zustand)

type AppEssentialsState = {

data: AppEssentials

error: number | null

hydrated: boolean

setData: (data: AppEssentials) => void

setError: (code: number | null) => void

}

```

  

```ts

// useAppEssentials.ts

export function useAppEssentials() {

// return memoized slices + typed selectors

// e.g. getSetting(slug), canAccess(feature)

}

```

  

## 14.5 Decision rule for your new project

  

Use bootstrapped global essentials if ALL are true:

  

- needed by >50% of routes

- relatively small payload

- low/medium mutation frequency

- required for shell rendering or guard logic

  

If not, fetch per-feature with React Query at route/component level.

  

### Practical takeaway

  

Adopt the principle, but keep essentials lean, typed, and deliberately scoped.