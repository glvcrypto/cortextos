# Visual Review Accuracy — Baseline v1 (ARCHIVED 2026-04-23)

**Status:** Archived rollback reference. Restore as current.md if exp_1776987054_d9j3b is discarded at measurement.
**Reason archived:** framework repo .gitignore excludes `orgs/` path, so run-experiment could not produce a clean-revert commit. Manual archive preserves rollback path.

---

# Visual Review Accuracy — Baseline Heuristics

Metric: `visual_review_accuracy` — % of PR reviews where user agreed with my call (approve / request-fix / reject).
Higher is better.

## Current Review Checklist (Baseline v1 — 2026-04-23)

Apply to every rendered screenshot in this order. Any fail = request-fix, not auto-approve.

### 1. Layout Integrity
- Viewport: 1440×900 desktop + 390×844 mobile (iPhone 12 Pro width).
- No horizontal scroll at either viewport.
- No overlapping elements, no clipped text, no text below the fold that should be visible.
- Nav renders without wrap at desktop; hamburger collapses cleanly at mobile.

### 2. Brand Consistency
- Primary logo visible and uncropped.
- Logo/wordmark size matches spec (Reyco brand column logos: user-defined pixel ratio — confirm per-site in MEMORY.md).
- Brand colors match: no off-hue primaries, no rogue fallback CSS (gray = red flag).
- Font stack loaded (not Times New Roman fallback): check for FOUT/FOIT.

### 3. Image Quality
- Product photos: white background stays white (not cream, not gray).
- Aspect ratio: product centered with consistent padding; no crop of the product itself.
- No JPEG artifacts at display size.
- Alt text present on non-decorative imagery (accessibility + SEO signal).

### 4. Interaction Surfaces
- Buttons rendered at >= 44×44 px tap target (mobile).
- Form fields have visible labels.
- Links underlined or color-differentiated enough from body text.
- Hover/focus states defined (keyboard accessibility).

### 5. Content Integrity
- No lorem ipsum, no [PLACEHOLDER], no "edit me".
- No broken image icons (404 assets).
- Dynamic CPT content (WP brand-catalogue / inventory) renders actual data, not empty state unless intentional.

### 6. Cross-Browser Sanity
- Default pass: Chromium headless.
- Escalate to Firefox/WebKit if dev notes rely on browser-specific CSS (flex gap in old Safari, etc.).

## Anti-patterns I will flag (bias toward request-fix)
- Visual judgment based on CSS code alone — always screenshot, never "looks fine in the source".
- "It works on my machine" — I ONLY judge rendered state.
- Pixel-math waving hands — if I say "too small," I give exact measured pixel delta.

## Open questions (for next experiment tweak)
- Should mobile viewport be iPhone 12 Pro (390) or iPhone SE (375)? Picking smaller catches more wrap bugs.
- Should I run Lighthouse perf/a11y audit per PR or on-demand only?
- What's the pixel tolerance for "image centered" — 5px? 10px? Unknown, will calibrate with user's corrections.

## Experiment notes
Reviews where user corrected my call (disagreement) will be logged to experiments/runs/ with the specific heuristic that led to the miss. Next cycle proposes a tweak to the weakest-scoring heuristic.
