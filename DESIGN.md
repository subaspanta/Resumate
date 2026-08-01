---
name: ResuMate
description: Minimal, precise resume-tailoring tool — one muted forest-green accent over a flat slate-neutral system
colors:
  primary: "#3F6B4F"
  sage-tint: "#E9F2EC"
  sage-border: "#BBD3C5"
  on-primary: "#FFFFFF"
  canvas: "#F8FAFC"
  surface: "#FFFFFF"
  border-base: "#E2E8F0"
  border-input: "#CBD5E1"
  text-primary: "#0F172A"
  text-body: "#475569"
  text-muted: "#94A3B8"
  danger: "#DC2626"
  score-excellent: "#16A34A"
  score-good: "#CA8A04"
  score-needs-work: "#EA580C"
  surface-container-low: "#EFF4F0"
  surface-container: "#E6EDE8"
typography:
  display-lg:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "48px"
    fontWeight: 700
    lineHeight: "56px"
    letterSpacing: "-0.02em"
  display-md:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "36px"
    fontWeight: 600
    lineHeight: "44px"
    letterSpacing: "-0.02em"
  headline-lg:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: "32px"
  headline-sm:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: "24px"
  body-lg:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  body-md:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.25
  mono-label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.25
rounded:
  sm: "4px"
  lg: "8px"
  xl: "12px"
  xxl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.lg}"
    padding: "16px 32px"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "16px 24px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "10px 16px"
---

# Design System: ResuMate

## Overview

**Creative North Star: "The Steady Ledger"**

Minimal and precise. Every surface is flat and quiet — no shadows exist anywhere in this system; depth comes only from a 1px border and a shift to a slightly darker neutral fill, never a blur. One accent color, a muted forest green, is the only thing on screen that means "this is active, this is yours to act on." Everything else — body copy, panels, dividers, icons at rest — lives in restrained slate neutrals. Micro-metadata (timestamps, tiers, table headers, score labels) is set in uppercase uppercase-tracked mono type, a small but deliberate technical accent against the otherwise humanist sans body.

This reads as a tool, not a marketing surface: for an audience of anxious early-career job seekers, the product earns trust by staying out of the way — no flourish competing with the resume content itself.

**Key Characteristics:**
- Exactly one accent hue (muted forest green), applied sparingly to primary actions, active nav state, links, and AI-attributed content
- Zero shadows; flat surfaces distinguished only by border and fill-tone shifts
- Uppercase mono-label type as the system's one "technical" accent (timestamps, tiers, table headers, tags)
- Generous internal padding (24–48px) inside cards and page shells; nothing feels cramped

## Colors

Almost entirely neutral slate, with a single confident green accent and a dedicated pale-green tint reserved for AI-attributed surfaces.

### Primary
- **Muted Forest Green** (`#3F6B4F`): the system's only accent. Primary buttons, active nav item text, links, focus borders, checkbox accent-color, branding wordmark. Reads as calm and grounded rather than "SaaS-generic" bright indigo/purple.

### Neutral
- **Canvas** (`#F8FAFC`): page background (`body`, dashboard shell, table header rows).
- **Surface** (`#FFFFFF`): card, panel, sidebar, topnav, and input backgrounds.
- **Border Base** (`#E2E8F0`): default 1px border on cards, panels, dividers, table rows.
- **Border Input** (`#CBD5E1`): default 1px border on text inputs and search fields (slightly darker than `border-base` so fields read as interactive).
- **Text Primary** (`#0F172A`): headings, labels, primary body copy.
- **Text Body** (`#475569`): secondary/paragraph copy (page subtitles, footer prompts).
- **Text Muted** (`#94A3B8`): placeholders, timestamps, disabled/hint copy.
- **Soft Sage Tint** (`#E9F2EC` bg / `#BBD3C5` border): reserved exclusively for AI-attributed surfaces (rewrite-suggestion banners, the AI pill) and the primary-container role. A light wash of the primary hue, never used for plain neutral panels.
- **Surface Container / Surface Container Low** (`#E6EDE8` / `#EFF4F0`): hover and active-state fills for nav items and icon backgrounds — a faint sage cast one step above pure white, never a separate hue.

### Semantic (score/status, distinct from the brand accent)
- **Danger** (`#DC2626`): validation errors, destructive state, "poor" score.
- **Score Excellent** (`#16A34A`), **Score Good** (`#CA8A04`), **Score Needs Work** (`#EA580C`): resume-score badges only. These are a separate vivid semantic palette — never substitute the brand's muted primary green for a passing score, and never borrow a score color for a UI action.

### Named Rules
**The One Accent Rule.** Muted Forest Green is the only color that means "act here." It never appears as a decorative fill, illustration color, or background wash outside the dedicated sage-tint role.

**The AI Tint Rule.** Any surface presenting AI-generated or AI-attributed content (rewrite suggestions, the dashboard AI pill/banner) gets the Soft Sage Tint background + border + primary-colored text/icon treatment. It is the one visual signal in the system that says "this came from the model, not the user's own data" — don't reuse it for plain informational panels.

## Typography

**Body & Display Font:** Inter (with system-ui, sans-serif fallback)
**Label/Mono Font:** JetBrains Mono (with monospace fallback)

**Character:** Inter carries every conversational and structural role — headings, body, labels — so voice comes from weight and size, not from mixing families. JetBrains Mono is reserved for one job: small uppercase, letter-spaced metadata that needs to read as data rather than prose.

### Hierarchy
- **Display** (600–700 weight, 36–48px, tight `-0.02em` tracking): welcome titles, branding headline on the register page. Used sparingly — one per view.
- **Headline** (600 weight, 18–24px): section titles, card titles, sidebar brand name.
- **Body** (400 weight, 14–16px): paragraph copy, form values, list content.
- **Label** (500 weight, 13px): form field labels, buttons, nav items — the workhorse UI text size.
- **Mono Label** (500 weight, 11px, uppercase, `0.05–0.1em` tracking): timestamps, table headers, score labels, sidebar tier badge, divider text ("OR").

### Named Rules
**The Mono Metadata Rule.** Any uppercase, letter-spaced micro-label (timestamps, table headers, tags, dividers) is set in JetBrains Mono at 11px. Inter never takes this role; mono type is the system's exclusive signal for "this is metadata, not content."

## Layout

Single max-width content column (`1280px`) centered with generous outer padding (32–48px). The dashboard uses a fixed 272px sidebar (collapsing to 80px) plus a fixed 72px top nav; main content offsets around both. The two-column "active" dashboard grid (`1fr 2fr` on desktop, stacked below 1024px) is the one place the layout departs from a single column. Spacing rhythm runs on an 8px-rooted scale (4/8/16/24/32/48); cards and page shells consistently use the two largest steps (24px, 32px) as internal padding, never the smaller steps for anything but tight inline gaps (icon-to-label, checklist items).

## Elevation & Depth

Fully flat. There are no shadows anywhere in the system — not on cards, dropdowns, or hover states. Depth is conveyed entirely by a 1px border plus, on interactive hover/active states, a shift to a faintly tinted neutral fill (`surface` → `canvas` or `surface-container`). The one exception is a focus ring, which is a 1px solid `box-shadow` matching the border color, not a soft glow.

### Named Rules
**The Flat-By-Default Rule.** No `box-shadow` is used for depth, ever. If a surface needs to read as "above" another, use a border and a fill-tone step, not a shadow.

## Shapes

Two structural radius families used consistently by scale: `4px` (`radius-sm`) on dense/small elements — badges, chips, table icon tiles, register-flow inputs and buttons, dropdown items. `8px` (`radius-lg`) on the majority of interactive elements — most inputs, nav items, most buttons, feature cards. `12px` (`radius-xl`) on larger containers — the upload drop zone, the recent-resumes panel. `16px` (`radius-xxl`) is reserved for the single largest surface on screen — the login auth card. Circular (`9999px`) radius is used only for avatars and icon-in-a-circle treatments (upload icon, sidebar avatar).

## Components

### Buttons
- **Shape:** `8px` radius by default (`4px` on the register-flow variant).
- **Primary:** solid Muted Forest Green background, white text, no border. Padding scales with context: `16px 32px` for the prominent login/dashboard CTA, `8px 16px`–`16px 24px` for secondary-weight actions (topnav upgrade, sidebar CTA).
- **Hover / Active:** opacity step down only (90% hover, 80% active) — no color hue shift, no shadow.
- **Secondary / Ghost:** white or transparent background, 1px `border-base`, `text-primary` text; hover fills to `canvas`.
- **Disabled:** 50% opacity, `cursor: not-allowed`, no other visual change.

### Cards / Containers
- **Corner Style:** `8px`–`16px` depending on prominence (see Shapes).
- **Background:** always `surface` (white).
- **Shadow Strategy:** none — see Elevation & Depth. Depth is border-only.
- **Border:** 1px `border-base`, always present on standalone cards/panels.
- **Internal Padding:** `24px`–`32px` (`spacing-lg`/`spacing-xl`).

### Inputs / Fields
- **Style:** 1px `border-input` border, white/`surface` background, `8px` radius (`4px` on register-flow fields), `10px 16px` padding.
- **Focus:** border shifts to Muted Forest Green; background may shift to the Soft Sage Tint (login form fields do this; register form does not).
- **Error:** border shifts to `danger` red; background stays white — error is signaled by border + inline message text, never background wash.
- **Disabled:** 50% opacity, `cursor: not-allowed`.

### Navigation (Sidebar / Top Nav)
- **Style:** white surface, 1px border separating from canvas. Nav items are borderless, transparent at rest; hover fills `surface-container`; the active item fills `surface-container-low` and its text/icon turns Muted Forest Green with 600-weight label.
- **Mobile/collapsed:** sidebar collapses to an 80px icon rail; labels hide, items center.

### AI Surfaces (signature component)
Rewrite-suggestion banners and the dashboard "AI" pill share one distinct treatment: Soft Sage Tint background, sage border, Muted Forest Green icon/text. This is the system's only component that intentionally departs from plain neutral surfaces — it exists specifically to mark AI-attributed content as visually distinct from the user's own data.

## Do's and Don'ts

### Do:
- **Do** keep Muted Forest Green as the only accent hue in the system — one voice, used sparingly.
- **Do** signal AI-attributed content with the Soft Sage Tint treatment (background + border + primary text), and reserve that treatment for AI content only.
- **Do** use JetBrains Mono, uppercase, for metadata micro-labels; keep everything else in Inter.
- **Do** convey depth with a border and a fill-tone step — never a shadow.

### Don't:
- **Don't** add `box-shadow` for elevation anywhere in this system; it has none today.
- **Don't** introduce a second accent hue for "variety" — expressiveness comes from weight, size, and the mono-label device, not more color.
- **Don't** reuse a score-badge color (`score-excellent` green, `score-good` amber, `score-needs-work` orange) as a UI action color, or vice versa — they are a separate semantic palette from the brand accent, even though `score-excellent` is also a green.
- **Don't** use the Soft Sage Tint for plain informational panels that aren't AI-attributed — it would dilute its one job as the "this is AI" signal.
