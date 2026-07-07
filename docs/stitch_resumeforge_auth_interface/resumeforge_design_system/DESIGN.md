---
name: ResumeForge Design System
colors:
  surface: '#FFFFFF'
  surface-dim: '#dbd8e4'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2fe'
  surface-container: '#efecf8'
  surface-container-high: '#e9e6f3'
  surface-container-highest: '#e4e1ed'
  on-surface: '#1b1b23'
  on-surface-variant: '#464554'
  inverse-surface: '#303038'
  inverse-on-surface: '#f2effb'
  outline: '#767586'
  outline-variant: '#c7c4d7'
  surface-tint: '#494bd6'
  primary: '#4648d4'
  on-primary: '#ffffff'
  primary-container: '#6063ee'
  on-primary-container: '#fffbff'
  inverse-primary: '#c0c1ff'
  secondary: '#5c5f61'
  on-secondary: '#ffffff'
  secondary-container: '#e0e3e5'
  on-secondary-container: '#626567'
  tertiary: '#904900'
  on-tertiary: '#ffffff'
  tertiary-container: '#b55d00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#e0e3e5'
  secondary-fixed-dim: '#c4c7c9'
  on-secondary-fixed: '#191c1e'
  on-secondary-fixed-variant: '#444749'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb783'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#703700'
  background: '#fcf8ff'
  on-background: '#1b1b23'
  surface-variant: '#e4e1ed'
  canvas: '#F8FAFC'
  border-base: '#E2E8F0'
  border-input: '#CBD5E1'
  text-primary: '#0F172A'
  text-body: '#475569'
  text-muted: '#94A3B8'
  danger: '#DC2626'
  ai-bg: '#EEF2FF'
  ai-border: '#C7D2FE'
  score-excellent: '#16A34A'
  score-good: '#CA8A04'
  score-needs-work: '#EA580C'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-md:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-std:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
  mono-label:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  sidebar-width: 272px
  top-nav-height: 72px
  max-content: 1280px
---

# ResumeForge Design System v1.0

## Brand Vision
ResumeForge is a premium AI workspace for creating, improving, and tailoring resumes. The interface should feel calm, professional, trustworthy, and document-first. Users spend most of their time reading resumes and AI feedback, so readability takes priority over visual effects.

### Primary Design Inspirations
- 70% Linear
- 20% Notion
- 10% Cursor

## Core Design Principles
1. Function before decoration.
2. Typography before graphics.
3. Whitespace before containers.
4. Borders before shadows.
5. Reading experience above everything.
6. Every component must serve a user task.
7. Simplicity creates confidence.

## Visual Style
Create clean, premium SaaS interface.
**Absolute Bans (Never Use):**
- Shadows
- Glassmorphism
- Neumorphism
- Glow effects
- Decorative gradients
- Floating cards
- Decorative borders
- Marketing-style illustrations inside authenticated application

*Rule: Use whitespace and subtle borders to create hierarchy.*

## Color System
### Canvas & Surfaces
- **Canvas Background:** `#F8FAFC`
- **Primary Surface:** `#FFFFFF`
- **Secondary Surface:** `#F8FAFC`

### Borders
- **Specification:** `1px solid #E2E8F0`
- *Rule: Borders define hierarchy. Never rely on shadows.*

### Brand Colors
- **Primary Accent:** `#6366F1` (Primary buttons, active navigation, active tabs, links, focus states, selected components)
- **Danger:** `#DC2626` (Destructive actions only)

### AI Components
Use only for AI-generated recommendations. Visual separation required.
- **Background:** `#EEF2FF`
- **Border:** `1px solid #C7D2FE`
- **Text:** `#6366F1`
- **Icon:** `Lucide Sparkles`

### ATS Score Colors
Only score badges should use these colors. Never color entire cards.
- **Excellent (90–100):** `#16A34A`
- **Good (70–89):** `#CA8A04`
- **Needs Work (40–69):** `#EA580C`
- **Poor (0–39):** `#DC2626`

## Typography
### Font Families
- **Primary:** `Inter`
- **Secondary:** `JetBrains Mono` (Resume score, ATS score, metadata, file names, technical badges, timestamps only)

### Typography Scale
- **Display Large:** 48px | Weight: 700 | Line Height: 56px | Tracking: -0.02em
- **Display Medium:** 36px | Weight: 600 | Line Height: 44px | Tracking: -0.02em
- **Headline Large:** 24px | Weight: 600 | Line Height: 32px
- **Headline Small:** 18px | Weight: 600 | Line Height: 24px
- **Body Large:** 16px | Weight: 400 | Line Height: 24px
- **Body Medium:** 14px | Weight: 400 | Line Height: 20px
- **Label:** 13px | Weight: 500
- **Mono Label:** 11px | Weight: 500 | Font: `JetBrains Mono`

### Text Colors
- **Primary Heading:** `#0F172A`
- **Body:** `#475569`
- **Muted:** `#94A3B8`
- **Disabled:** `#CBD5E1`

## Grid & Layout
- **Desktop Width:** 1440px
- **Maximum Content Width:** 1280px
- **Columns:** 12
- **Gutters:** 24px
- **Sidebar Width:** 272px
- **Top Navigation Height:** 72px
- *Rule: Keep generous whitespace on both sides of content.*

## Spacing
Strict 8px spacing system.
**Allowed Values:** `4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `40px`, `48px`, `64px`, `96px`
- *Rule: Major sections must be separated by 32–48px.*

## Corner Radius
- **Inputs:** 8px
- **Buttons:** 8px
- **Dropdowns:** 12px
- **Cards:** 12px
- **Dialogs:** 16px

## Border Philosophy
- Use borders instead of shadows.
- Avoid nested bordered containers.
- Prefer whitespace over unnecessary cards.
- Every major panel must be clearly separated using subtle borders.

## Components
### Buttons
- **Primary:** Solid Indigo background (`#6366F1`), White text.
- **Secondary:** White background, `1px solid #E2E8F0` border. Text `#475569`.
- **Ghost:** Text only. No background, no border. Text `#475569`.
- **Danger:** Solid Red background (`#DC2626`), White text.
- *Rule: Only one primary button on each screen.*

### Forms
- **Default Input:** White background, Border `1px solid #CBD5E1`
- **Focused Input:** Background `#EEF2FF`, Border `#6366F1`
- *Rule: Never keep inactive inputs highlighted.*

### Icons
- **Library:** `Lucide React`
- **Inline Size:** 16px
- **Standard Size:** 18px
- **Navigation Size:** 20px
- *Rule: Icons remain minimal and functional.*

## Motion & Transitions
- **Easing:** `ease-out`
- **Hover States:** 150ms
- **Tabs:** 150ms
- **Sidebar:** 200ms
- **Page Transition:** 250ms
- *Rule: Animations communicate interaction, never decoration.*

## Interaction States
- **Hover:** Background `#F8FAFC`
- **Selected:** Background `#EEF2FF`
- **Focused:** Border `#6366F1`
- **Disabled:** 40% opacity

## Responsive Rules
- **Desktop:** 1440px layout structure.
- **Laptop:** 1280px container constraint.
- **Tablet:** Collapsed sidebar workflow.
- **Mobile:** Single-column layout with bottom navigation bar.

## Empty States
- Keep simple.
- Large whitespace block.
- Maximum one illustration asset.
- One clear call-to-action button.
- Avoid decorative statistics widgets.

## Non-Negotiable Rules
1. No shadows.
2. No glow effects.
3. No glassmorphism.
4. No neumorphism.
5. No decorative gradients.
6. No floating cards.
7. No decorative KPI dashboards.
8. No oversized hero sections after authentication.
9. Maximum one primary CTA per screen.
10. Prefer whitespace over containers.
11. Prefer typography over decoration.
12. Every component must serve clear user task.