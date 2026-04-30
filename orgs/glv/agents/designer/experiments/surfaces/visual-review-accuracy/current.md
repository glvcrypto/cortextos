# Visual Review Accuracy — v2 (EXPERIMENT exp_1776987054_d9j3b, approved 2026-04-23)

Metric: `visual_review_accuracy` — % of PR reviews where user agreed with my call (approve / request-fix / reject).
Higher is better.

**Change from baseline v1:** new Section 0 added at TOP, made mandatory before Sections 1-6. Anti-patterns section references it by name instead of re-stating it inline.

## Section 0 — Falsifiable Observation Pre-Flight (MANDATORY, run FIRST)

Before writing any review verdict, complete this pre-flight:

### 0a. Observation vs. Interpretation
Write the observation in ONE sentence that contains zero causal claim:
- ✅ "Logo renders at 34px tall on mobile at 390px viewport."
- ❌ "Logo is too small because the CSS media query is broken." (asserted cause)
- ❌ "Either the logo CSS lifted or the breakpoint is wrong." (two asserted mechanisms)

### 0b. Four-probe minimum before asserting any cause
For any flag beyond pure observation, run at least these 4 probes:
1. **Headers:** `curl -v <url>` — inspect status chain, redirects, Cache-Control, CF/SG headers.
2. **Cookie state:** `curl --cookie-jar /tmp/c.txt <url>` — did client pick up any bypass/challenge cookie?
3. **Platform-specific gate probe** (WP: `/wp-json/`, Rails: CSRF token page, Next: `/api/health`) — compare to main path's gate behavior.
4. **Different-vector reproduction:** user's normal browser + clean-session curl + alt user-agent. If they diverge, narrow that axis before asserting.

### 0c. "What I did not check" list
Every flag MUST include an explicit list of probes NOT run. This is the falsifiable-observation template — if a reader wants to verify, they know what was and wasn't tested.

### 0d. UNVERIFIED label
If you cannot run the 4 probes (tool missing, auth unavailable, out of scope): label the flag `UNVERIFIED — needs dev/pentester probe` rather than asserting cause. An unverified flag is still a useful deliverable — an asserted cause on weak evidence is worse than a flag.

**Surface rule:** when a flag ships UNVERIFIED, its user-facing bullet (Telegram / Slack / review comment) MUST start with the literal prefix `[UNVERIFIED] `. User must see the tag in-channel without opening the full review. Makes the flag falsifiable in-place.

### 0e. Abort conditions
If Section 0 cannot be completed, sections 1-6 do not run for this review. Flag as `[UNVERIFIED]` and escalate scope clarification to dev or boss.

---

## Measurement Coding Rubric (locked for this cycle — do not drift mid-window)

For every review posted during the 7d window, code outcome as exactly one of:

| User response | Code | Notes |
|---|---|---|
| Agrees with call (approve/request-fix/reject matches) | `user-agreed` (1) | Counts in numerator |
| Corrects my call (different verdict or disputes substance of the flag) | `user-corrected` (0) | Counts in numerator, but as miss |
| Agrees but adds a NEW flag I missed | `user-corrected` (0) | Adding a miss = I didn't catch everything |
| Agrees issue exists but disputes severity tier | `user-corrected` (0) | Severity call is part of the verdict |
| No response within 24h (user-missed, not a review decision) | **excluded from denominator** | Do not count as either |

Rationale: stricter coding (treats "partial agree + add" and "severity mismatch" as misses) keeps the bar where the user actually wants it — a review isn't fully correct unless it matches both substance and severity and catches everything.

If an ambiguous case arises that this rubric doesn't cover, I log it as `AMBIGUOUS`, exclude from denominator, and propose a rubric amendment for cycle 2 rather than coding on the fly.

## Sample-size caveat (v2 concern)
At ~3-5 PRs/week, a 7d window gives n=3-5. Thin signal. This cycle runs 7d as configured. If signal is too noisy to read, cycle 2 may propose a 14d or 21d rolling window at measurement time — NOT mid-cycle.

---

## Current Review Checklist (ran AFTER Section 0 passes)

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
- **Section 0 violation** — any review that skips the pre-flight gets rejected before I even read it.
- "It works on my machine" — I ONLY judge rendered state.
- Pixel-math waving hands — if I say "too small," I give exact measured pixel delta.

## Open questions (for next experiment tweak)
- Should mobile viewport be iPhone 12 Pro (390) or iPhone SE (375)? Picking smaller catches more wrap bugs.
- Should I run Lighthouse perf/a11y audit per PR or on-demand only?
- What's the pixel tolerance for "image centered" — 5px? 10px? Unknown, will calibrate with user's corrections.

## Experiment notes
Reviews where user corrected my call (disagreement) will be logged to experiments/runs/ with the specific heuristic that led to the miss. Next cycle proposes a tweak to the weakest-scoring heuristic.
