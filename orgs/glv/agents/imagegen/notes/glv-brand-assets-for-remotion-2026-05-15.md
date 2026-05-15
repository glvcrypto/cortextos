# GLV Brand Assets — Remotion Composition Reference

**Created**: 2026-05-15 for dev's Remotion skill build (task_1778821247578_61004963)
**Canonical source**: `/home/aiden/cortextos/orgs/glv/agents/content/projects/glv-marketing/BRAND.md`
**Status**: ready for dev to import as Remotion composition design tokens

---

## Design Tokens (canonical)

### Color Palette

| Token | Hex | Role | Usage Ratio |
|-------|-----|------|-------------|
| `--brand-bg` | `#FFFFFF` | Primary background | ~70% |
| `--brand-fg` | `#000000` | Primary text, logo | ~25% |
| `--brand-accent` | `#B22222` (deep red) | Accent: lines, badges, underlines, CTAs | ~5% |

**Rules from BRAND.md**:
- Black + white are the foundation. Every design must work in pure monochrome first.
- Deep red is the accent, NOT the base. Use sparingly for visual punch.
- Never use red for body text or large background fills.
- Red comes from the logo set (variants 10-15) and ties the full brand together.

### Typography

- **Headings**: Clean sans-serif (match website). Inter is acceptable substitute pending exact website-font confirmation. Heavy/bold weights for hero text.
- **Body**: System sans-serif or matching web font.
- **Logo wordmark**: heavy/bold sans-serif for "GLV", light-weight spaced caps for "MARKETING".
- **Spelling**: Canadian English throughout slide copy.

### Logo Assets

Canonical logo files referenced by BRAND.md live at `projects/glv-marketing/Logos/` (path not yet resolved in repo — may be in life-OS or pending sync). One usable PNG asset confirmed on disk:

- **`/home/aiden/cortextos/orgs/glv/clients/glv-marketing/deliverables/2026-05-12-emergency-assets/glv-logo.png`** — for use until canonical Logos/ dir is located.

BRAND.md naming convention (per `Logos/`):

| Variant | File pattern | Use Case |
|---------|-------------|----------|
| Primary (full, light bg) | 2.png / 2-transparent | Website header, social banners, primary footer |
| Icon/mark (light bg) | 1.png / 1-transparent.png | Favicon, GBP, social avatars |
| Primary (dark bg) | 8.png / 8-transparent.png | Dark backgrounds, dark mode |
| Icon (dark bg) | 7.png / 7-transparent.png | Dark background icons |

**SVG status**: Per BRAND.md asset checklist, SVG vector versions are NOT yet built. Remotion can scale from the PNG logo; flag to user if vector is needed for higher fidelity.

### Logo Usage Rules

- **GLV Marketing** = full brand name (use primary logo / wordmark variant)
- **GLV** = icon/mark only (square contexts, e.g. avatar slot in slide footer)
- Never use "Digital Marketing Services" inside the logo (descriptive copy only)
- Clear space around logo = height of the "L" in the wordmark
- Minimum digital size: 24px height

---

## Slide Composition Spec (Instagram 1080x1080)

Recommended composition pattern for @glvbuilds carousel slides:

| Region | Layout |
|--------|--------|
| Top edge | 4px deep-red accent rule (64px wide, left-aligned within content padding) |
| Number badge | Small `SLIDE 03` style label in deep-red, all-caps, tracked-out — when slide is numbered |
| Headline | Heavy-weight black, tight letter-spacing, 56-76px depending on cover vs interior |
| Body | Regular-weight black at 30-34px, line-height ~1.45 |
| CTA line | Deep-red, semibold, 28px (final slide only) |
| Footer left | `@glv.marketing` handle, 22px, semibold black |
| Footer right | Slide indicator `03 / 07`, 22px, muted gray |

**Padding**: 92px top / 96px horizontal / 76px bottom — preserves Instagram safe area for app UI overlay.

**LinkedIn variant**: 1200x1200, same layout scaled proportionally.

---

## ⚠️ CORRECTION FROM PRIOR SCAFFOLD

The HTML/CSS scaffold I built at `orgs/glv/social/glvbuilds/mockups/_render/template.html` used **off-canonical tokens**:

| Token | My scaffold (WRONG) | Canonical (CORRECT) |
|-------|---------------------|---------------------|
| Background | `#FAF6EE` cream | `#FFFFFF` white |
| Primary text | `#1A1614` warm-near-black | `#000000` true black |
| Accent | `#C8501E` warm orange | `#B22222` deep red |

**Why this happened**: I improvised a "warm/local marketing" palette without reading BRAND.md first. Violates banked epistemic_discipline_order (T1-T3 source-of-truth ordering — BRAND.md is T2/T3 source-and-artifact evidence I should have consumed before token-selection).

**Implication for dev**: Use this file (canonical tokens from BRAND.md), NOT the scaffold's tokens, when wiring the Remotion composition. The scaffold's layout/structure is correct; only the colors are wrong.

**Self-flag note**: Treating this as a near-miss banked-rule instance — "improvised brand tokens without reading BRAND.md" sits adjacent to feedback_check_memory_before_summary_claims and epistemic_discipline_order. Banking observation, will surface to analyst if pattern recurs.

---

## Voice + Content Constraints (cross-reference for slide copy)

- 0 em-dashes — banked feedback_no_emdashes
- No AI tells (banned: tricolons, vague verbs, hedging openers) — banked feedback_no_emdashes broader rule
- No jargon — plain English a 55-year-old plumber would understand — banked feedback_outreach_jargon
- @glvbuilds positioning: "just landed first client, just started winning" vibe — banked project_glvbuilds_positioning
- Canadian English in body copy; brand proper nouns + US-dominant category terms keep US spelling — banked feedback_brand_keyword_us_spelling

Verify slide copy against above rules BEFORE rendering. Pre-render grep gate suggested: `grep -E "—|\bdelve\b|\bunlock\b|\bcrucial\b|\bgame-changer\b"` returns 0 hits on slide copy text.
