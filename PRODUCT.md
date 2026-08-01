# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary audience: early-career job seekers — final-year students, fresh
graduates, 0–3 yrs experience, career switchers and mainly HR's and senior developers.
Projects carry as much weight as work experience for this audience, so project descriptions
are a first-class rewritable content shape, not an afterthought.

Job: upload a resume, paste a target job description, get grounded rewrite
suggestions for experience bullets / project descriptions / summary, review
each as a diff and apply or skip individually, export the tailored resume
as a PDF — end to end in under 5 minutes.

## Product Purpose

AI-assisted resume tailoring. A user uploads their resume, pastes a job
description, and receives grounded rewrite suggestions for experience
bullets, project descriptions, and the summary paragraph, which they apply
or skip one at a time. Skills are highlighted against the job's
requirements without any rewriting. The tailored resume exports as a PDF.
The user stays in control of every change — nothing is auto-edited.

Success means: upload → tailor → export completes in under 5 minutes; 80%
of uploaded resumes parse successfully; 60% of users apply at least one
suggestion; user satisfaction > 4/5.

## Positioning

Every AI call is grounded in a document the user actually provided (their
resume PDF, the pasted JD) — never an open-ended "recall from training
data" call. Each content shape (bullet, project description, summary
paragraph) gets its own validator tuned to how that shape fails, rather
than one generic rewrite/hallucination guard reused everywhere. Skills are
matched against the JD, never rewritten, so the model never invents a
skill the user doesn't have. Combined with strict apply/skip control (no
auto-edit), the product's claim is trustworthy, document-grounded tailoring
— not generic AI resume writing.

## Operating Context

Three-entity domain: `User (1) → Resume (many) → Analysis (many)`.

- A Resume stores only the **latest** uploaded PDF (no version history in
  MVP) plus its parsed structured form (name, contact, summary,
  experience[], projects[], education[], skills[]).
- A Job Description is not a standalone entity — it lives inside an
  Analysis.
- An Analysis is an immutable snapshot: parsed JD, rewrite suggestions
  (bullets/projects/summary), and the resume state at that point. Later
  resume edits don't alter historical analyses.
- Skills matching is computed on read (resume.skills ∩ parsedJob), not
  stored as a suggestion — it's matching, not a rewrite.

User journey: Landing → Register → Login → Dashboard → Upload Resume →
Structured Preview (skills shown, match/gap once a JD exists) → Paste JD →
JD Parsed → Rewrite Suggestions (bullets, projects, summary) → Apply/Skip
each → Export PDF. Returning users: Dashboard → pick existing Resume → see
latest Analysis or history → new Analysis against a new JD, or re-open PDF
export.

## Capabilities and Constraints

**The 5 core MVP features — all shipped as of 2026-07-31** (canonical spec:
`docs/ResuMate-PRD.md`; note that file's own DONE/PARTIAL/NOT STARTED
annotations are stale relative to code — trust this record and the code
over that file's status markers):

1. Structured Resume Preview — parses name/contact/summary/experience/
   projects/education/skills; preview UI renders all sections
   (`frontend/src/components/workspace/ResumePreview.tsx`).
2. Job Description Paste → Parse.
3. Grounded Rewrite Suggestions — bullets, project descriptions, and
   summary paragraphs, each with its own validator (summary has a
   two-sided length bound and a lower overlap floor than bullets/projects).
4. Apply/Skip Diff — per-suggestion apply/skip; only applied changes touch
   the working resume. Ownership-check IDOR (PATCH
   /analyses/suggestions/:id) has been fixed.
5. Export Modified Resume as PDF — includes the projects section.

Supporting operations in scope: resume delete (cascades to analyses,
best-effort file cleanup), analysis delete, latest-analysis lookup,
analysis history list.

**Known gap still open:** the backend fully supports `section:
"project"|"summary"` on rewrite-suggestion requests, but no frontend
component calls it for anything but bullets yet — the UI to request a
project/summary rewrite doesn't exist.

**Constraints:**

- Runs on free-tier Gemini quota — this is a real, expected constraint
  (429s surface as a distinct `GEMINI_RATE_LIMITED` code), not an edge
  case to design around casually.
- No soft-delete/undo anywhere in the MVP; resume delete is user-initiated
  and permanent.

**Explicitly out of scope** (do not suggest reintroducing before the 5
features are all felt complete): Market Intel (job title → market data —
cut, not deferred, because it had no source document to ground it), skills
rewriting/rephrasing (matching only), About-Me/free-text context, interview
questions, 30-day action plan, Agent Activity Dashboard (SSE), LinkedIn
export, cover-letter generation, section-wise Resume Editor, standalone
ATS/Resume Health scoring, resume version history, comparison/missing-
keyword engine, pgvector semantic matching, RAG coach.

## Brand Commitments

Confirmed product name: **ResuMate** (the repo/folder name "OfferForge" and
frontend `package.json` name "frontend" are not the product name). No
other voice, tagline, or visual identity commitments are confirmed yet.

## Evidence on Hand

Canonical product spec: `docs/ResuMate-PRD.md`. Supporting docs:
`docs/requirements/` (api-spec, business-rules, domain-model, use-cases,
product-requirements), `docs/architecture/ARCHITECTURE.md`,
`docs/database/DATA-MODEL.md`, `docs/glossary.md`,
`docs/planning/resume-and-parsing-epics-plan.md`.

No logo, testimonials, case studies, press, or other brand assets exist yet
(frontend/public has only the default Next.js window.svg) — future work
must not fabricate any of these.

## Product Principles

- Keep the user in control — apply/skip, never auto-edit.
- Ground every suggestion in a real, user-provided document (resume PDF,
  pasted JD) — no open-ended "recall from training data" AI calls.
- Match the validator to the content shape — a paragraph and a bullet fail
  differently, so they don't share a hallucination guard.
- Free-tier AI quota is a real constraint — every new AI call path needs to
  fail honestly under rate limiting, not silently as a generic error.
- Prefer quality feedback over quantity of features; ship the 5 core
  features before anything else.

## Accessibility & Inclusion

Target: WCAG 2.1 AA as the baseline standard.
