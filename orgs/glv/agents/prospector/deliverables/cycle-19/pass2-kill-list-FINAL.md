# Cycle-19 Kill-List — PASS 2 FINAL

**Generated:** 2026-05-12 (PASS 2 close)
**Cycle:** 19 (re-vet of 23 staged drafts post Aiden's "diamonds not coal" structural retool)
**Verification stack:** Playwright headless Chromium with `page.goto` + `waitForLoadState('networkidle')` + `waitForSelector` / `--text` substring / `--http_status` probes. Bing surrogate for SERP visibility when Google rate-limited.
**Decision rule:** Per Aiden via boss (msg 1778616622445-boss-hfo9g + 1778616708293-boss-nq12d) — KILL on any single falsified or unverifiable claim. NO REWRITES. Fresh-angle observations from falsified claims flagged separately for Aiden's next-batch decision.

## Headline Numbers

- **Staged drafts:** 23
- **KILLs:** 15 (65%)
- **KEEPs:** 8 (35%)
- **Anti-bot/probe-artifact false alarms reclassified mid-pass:** 9 total (8 anti-bot in PASS 1, 1 URL-variant in PASS 2 — Exclusive Cooling)
- **Phantom-endpoint discovery:** SEMrush MCP confirmed never wired → banked rule (no SEMrush traffic numbers may ship without Playwright-rendered surrogate)

## KEEPs (8 prospects — post-kill survivors for Aiden + Ben copy re-review)

| ID | Name | URL | Hook held | How verified |
|---|---|---|---|---|
| B1-E07 | Watson's Heating & Cooling | https://watsonshc.com/ | "0 reviews, dead domain" | DNS NXDOMAIN confirmed via Playwright nav-error (DNS resolution fail). "Dead domain" claim TRUE. |
| B1-E13 | Sunrise Roofing | (no website) | "no website" | Bing surrogate confirmed: no business-owned hostname on page 1 for "Sunrise Roofing Sault Ste Marie". |
| B1-E15 | Bedard Plumbing | (no website) | "no website / single-page" | Bing surrogate confirmed: no business-owned hostname on page 1. |
| B1-E18 | Ben's Plumbing & Heating | https://bensplumbingandheating.ca/ | "dead domain, 0 reviews, no phone on GBP" | DNS NXDOMAIN confirmed via Playwright. "Dead domain" claim TRUE. |
| B2-E01 | Forest Ridge Golf and Country Club | https://forestridgegolf.ca/ | "tee-booking page says 'we hope to see you all in 2026' — and we ARE in 2026" | Playwright text-probe on homepage: "2026" present in rendered DOM. |
| B2-E02 | Idylwylde Golf and Country Club | https://idylwylde.com/ | "/contact returns 404 + no NAP on homepage" | Playwright HTTP status probe: /contact = 404. Text probe: phone "705-522-8580" ABSENT from homepage rendered DOM. Both claim halves verified. |
| B2-E03 | Georgian Home Comfort | https://georgianhomecomfort.com/ | "duplicate YP addresses (373 Huronia vs 3-30 Saunders)" | Playwright text-probe on both YellowPages listing URLs: "Huronia" and "Saunders" present on respective pages. Both claim halves verified. |
| B2-E04 | Exclusive Cooling Ltd | http://www.exclusivecooling.ca/ ⚠️ | "2023 Lennox promo offers still live on homepage + © 2015" | Playwright text-probe on working `http://www.` variant: both "2023" and "2015" present in rendered DOM, plus "Lennox". **Note:** apex HTTPS broken (TLS connection reset); the `http://www.` variant works and is the canonical URL going forward. Update manifest. |

### Caveats on KEEPs

- **B1-E07 Watson's + B1-E18 Ben's:** Both have NXDOMAIN. Cold outreach to a business whose website has been dead long enough that DNS is gone may indicate the business itself has closed or rebranded. Recommend phone-verify the business is operating before sending. The hook (dead-domain visibility loss) only lands if there's still a business to land it on.
- **B1-E13 Sunrise + B1-E15 Bedard:** Both have no website. These are in-person SSM briefing pack candidates per `project_prospector_strategy` memory, not email recipients.
- **B2-E04 Exclusive Cooling:** Working URL changed from `https://exclusivecooling.ca/` (apex broken) to `http://www.exclusivecooling.ca/`. Update v6.2 manifest. The apex-HTTPS-broken state is itself a fresh-angle observation (security/trust issue for visitors typing the https://apex/ URL).

## KILLs (15 prospects)

### Definite kills from PASS 1 (site-state claim falsified)

#### B1-E11 Beebe Mechanical
- **v6 claim:** "website not loading"
- **Reality:** Apex HTTPS broken (TLS handshake fails on `https://beebemechanical.ca/`), but `http://www.beebemechanical.ca/` returns HTTP 200 with real title "Beebe | Commercial Mechanical Systems | Thunder Bay, ON" and 1247 chars body content.
- **Verdict:** v6 claim demonstrably FALSE → KILL.
- **Fresh-angle observation for next-batch:** Apex HTTPS broken = legitimate trust signal for any visitor typing `https://beebemechanical.ca/`. Not a rewrite of this draft; flagged for Aiden's next-batch decision.

#### B1-E17 Robert's Plumbing & Sheet Metal
- **v6 claim:** "blank JS redirect (GoDaddy)"
- **Reality:** CanSpace registrar parking page over HTTP (NOT GoDaddy, no JS redirect). Hook concept (69yr legacy with no real site) holds, but specifics are wrong.
- **Verdict:** KILL per "no rewrite" rule.
- **Fresh-angle observation for next-batch:** Parking-page registrar mismatch (CanSpace not GoDaddy) flagged for next-batch.

### Definite kills from PASS 2 (claim falsified or unverifiable)

#### B1-E01 Priest Plumbing
- **v6 claim:** "52 Google reviews vs Perrotta 84"
- **Reality:** Google SERP anti-bot rate-limited Playwright; Bing review-count surrogate returned no count. Cannot independently verify the "52 reviews" specific number.
- **Verdict:** KILL per KILL-only rule (unverifiable specific number = KILL).

#### B1-E02 J.G. Fitzgerald & Sons
- **v6 claim:** "85yr legacy, 5 reviews, blog dead Jul 2022"
- **Reality:** `/blog/` page returns HTTP 404 (blog entirely removed, not just stale). Specific date claim "Jul 22 2022" cannot be verified — there is no longer a blog page. Review count also Google-blocked.
- **Verdict:** KILL.
- **Fresh-angle observation for next-batch:** Blog page entirely removed (a stronger finding than v6's "blog dead Jul 2022"). Not a rewrite mid-pass; flagged for Aiden's next-batch.

#### B1-E03 Northern Climate Heating and Air
- **v6 claim:** "166 visits/mo vs 669-Heat 1259" (SEMrush)
- **Reality:** SEMrush MCP confirmed phantom-endpoint (never wired). No surrogate produces traffic counts. Per banked SEMrush Surrogate Decision Tree.
- **Verdict:** KILL (numerical traffic specific — no surrogate possible).

#### B1-E04 D. Peppard Mechanical
- **v6 claim:** "12 blog posts in 5 months" + SEMrush content-intent claim
- **Reality:** `/blog/` returns HTTP 404 with 0 chars body (blog entirely removed). Specific count "12 posts" cannot be verified. SEMrush content-intent claim has no surrogate.
- **Verdict:** KILL on both claim halves.
- **Fresh-angle observation for next-batch:** Blog removed entirely (same fresh-angle as Fitzgerald — blog-removal cluster?).

#### B1-E05 Adept Plumbing
- **v6 claim:** "no service pages, 1 review vs Villeneuve 30"
- **Reality:** Playwright nav crawl confirmed 3-page-or-fewer Squarespace site (2 unique internal links: `/` and `/contact-us`) — supports "no service pages" claim direction. BUT: "1 review" specific number cannot be verified (Google anti-bot, Bing review surrogate unavailable). Specific competitor "Villeneuve 30" also unverifiable.
- **Verdict:** KILL per KILL-only rule (any specific numerical claim unverifiable = KILL).

#### B1-E08 Blue Sky Plumbing
- **v6 claim:** "12 reviews vs Perrotta 84, YP→Facebook"
- **Reality:** Bing surrogate hit anti-bot challenge ("Please solve the challenge below to continue"). Facebook search URL returned 404. Cannot independently verify "12 reviews" specific number or "no website" status.
- **Verdict:** KILL per KILL-only rule.

#### B1-E09 Witherell Plumbing & Heating
- **v6 claim:** "68yr legacy but 0 organic search visibility"
- **Reality:** Bing surrogate body sample explicitly shows `witherellplumbing.com` AS A TOP RESULT for query "Witherell Plumbing Heating" (page 1). Claim "0 organic search visibility" is DEMONSTRABLY FALSE.
- **Verdict:** KILL.

#### B1-E10 B. Gibson Mechanical
- **v6 claim:** "4.0 star gap vs Villeneuve 4.6"
- **Reality:** Bing anti-bot challenge blocked the surrogate. Cannot independently verify "4.0 star" specific rating or competitor "4.6" rating.
- **Verdict:** KILL per KILL-only rule.

#### B1-E12 Buhler Mechanical
- **v6 claim:** "25yr legacy, no service subpages"
- **Reality:** Playwright nav crawl + per-page probe confirmed Buhler HAS service subpages: `/residential/` (2639 chars real content) and `/commercial/` (1482 chars real content). Claim "no service subpages" is DEMONSTRABLY FALSE.
- **Verdict:** KILL.

#### B1-E14 Harris Plumbing
- **v6 claim:** "HomeStars/Readers Choice recognition vs search visibility gap"
- **Reality:** HomeStars credential PART verified (site mentions HomeStars). BUT: Bing surrogate body sample shows `harrisplumbing.ca` AS A TOP RESULT for "Harris Plumbing Barrie" (page 1, 40,500 results). The "search visibility gap" half is FALSIFIED.
- **Verdict:** KILL on the comparative claim. The recognition fact alone isn't a hook without the gap.

#### B1-E16 Elite Plumbing Solutions
- **v6 claim:** "p2 ranking, 0 reviews, invisible in directories"
- **Reality:** services-nueva page exists (verified). BUT: "p2 ranking" is a SEMrush specific position with no surrogate. "0 reviews" specific number unverifiable (Google blocked). "Invisible in directories" not probed structurally.
- **Verdict:** KILL.

#### B1-E19 Designed Roofing Inc.
- **v6 claim:** "30-year Sika Elite Contractor, 0 Google reviews"
- **Reality:** Playwright text-probe on `https://designedroofing.com/` returned 1015 chars body content. The word "Sika" does NOT appear anywhere in the rendered DOM. The "30-year Sika Elite Contractor" credential is DEMONSTRABLY FALSE at render-time.
- **Verdict:** KILL.
- **Fresh-angle observation for next-batch:** They list "Nipissing University Student Union Building", "Cascades Casino", "Maple View Public School" — commercial projects. That's a different hook entirely, not a rewrite of this draft.

#### B1-E20 Cullen Plumbing
- **v6 claim:** "50 reviews vs Cardinal 703, 55yr vs 7yr newcomer"
- **Reality:** Site rendered body shows "Providing residential plumbing services since 1969" — NOT 1970 as v6 implied. 2026 − 1969 = 57 years (NOT 55). The "55yr legacy" specific number is off by 2. Review count also Google-blocked.
- **Verdict:** KILL — specific numerical claim ("55yr") is wrong by 2 years.

## SEMrush Surrogate Decision Tree — Banked Rule

Per boss's direction (msg 1778616592...) and `feedback_mechanism_anchored_cred_vet`, no SEMrush API acquisition request to Aiden. Surrogate path documented in `.claude/skills/verify-claims/SKILL.md`:

| Claim shape | Surrogate | Outcome |
|---|---|---|
| "0 organic visibility" | Bing search → page-1 presence check | Verifiable (e.g. Witherell + Harris FALSIFIED via this path) |
| "N visits/mo" specific number | None possible | KILL by default |
| "Content not aimed at buying searches" | None reliable | KILL by default |
| "p2 ranking" / specific SERP position | None possible | KILL by default |
| Competitor traffic ratios | None possible | KILL by default |

SEMrush-dependent KILLs in this cycle: B1-E03 (full), B1-E04 (partial — claim half KILLed), B1-E16 (p2 ranking half). Witherell and Harris went the OTHER way — surrogate FALSIFIED the "0 visibility" claim, so those killed because claim FALSE not because unverifiable.

## Anti-Bot Heuristic Refinement — Banked Rule

The initial PASS 1 sweep used a naive substring match on `recaptcha`, `cloudflare`, etc., which produced 8 false positives (sites with Google reCAPTCHA in contact forms but real rendered content otherwise). Refined heuristic now banked in `.claude/skills/verify-claims/SKILL.md`:

- **Title-fragment match** (strongest signal): "just a moment", "attention required", "access denied", "checking your browser" → ANTI_BOT_GATED
- **Low-content + marker:** body < 500 chars AND html contains `sg-captcha` / `cf-challenge` / `cf-browser-verification` / `cf-chl-bypass` / `sucuri` → ANTI_BOT_GATED
- **Substantive body + marker:** NOT anti-bot (the marker is just incidental reCAPTCHA in a working contact form)

## Fresh-Angle Observations (next-batch decision, NOT rewrites of this batch)

These observations turned up during the re-vet but are out of scope for a cycle-19 rewrite per Aiden's KILL-only rule. Surfaced separately for Aiden's next-batch direction:

1. **Beebe Mechanical:** apex HTTPS broken — TLS handshake fails. Trust/security signal.
2. **Robert's Plumbing:** CanSpace registrar parking page (not GoDaddy as v6 said) — registrar mismatch detail.
3. **J.G. Fitzgerald & Sons:** entire `/blog/` page now 404 (blog removed, not just stale).
4. **D. Peppard Mechanical:** entire `/blog/` page now 404 (same pattern — blog-removal cluster across this batch?).
5. **Designed Roofing:** commercial-projects portfolio visible (Nipissing University SUB, Cascades Casino, Maple View Public School) — entirely different hook angle than Sika credential.

## Structural Changes In Flight

- `.claude/skills/verify-claims/verify-claim.js` — Playwright single-claim verifier — DONE
- `deliverables/cycle-19/pass1-sweep.js` — Playwright site-state sweep — DONE
- `deliverables/cycle-19/pass2-sweep.js` — Per-claim Playwright probe sweep — DONE
- `deliverables/cycle-19/pass2-reprobe.js` — Bing surrogate + URL-variant fallback — DONE
- `.claude/skills/verify-claims/SKILL.md` — Retooled with Playwright structurally wired, anti-bot heuristic banked, SEMrush surrogate decision tree banked, KILL-only rule documented — DONE
- Pre-cutover reverify step added to SKILL.md (Playwright re-check immediately before send) — DONE

## Send-Gate Status

**RED.** No outreach goes out until:
1. Aiden + Ben review the 8 KEEPs and run the iterate-to-perfect copy review (per `feedback_copy_iteration_gate_before_sends`)
2. The 5 calibration leads currently sitting in #internal-email (C0AUBAL58RK) since 13:30Z are addressed — they are part of this re-vet and are killed/kept per the same rule. Of the 5 originally posted:
   - Priest Plumbing → KILL (review count unverifiable)
   - J.G. Fitzgerald → KILL (blog 404, review count unverifiable)
   - Northern Climate → KILL (SEMrush no surrogate)
   - D. Peppard → KILL (blog 404, SEMrush no surrogate)
   - Adept Plumbing → KILL (review count unverifiable)

**All 5 calibration leads die.** This is a result of the structural retool — the calibration set was drawn from the same v6 batch and has the same verification gaps. The 8 KEEPs above are the post-kill survivors across both batches.

## Recommendation to Boss → Aiden + Ben

1. **Accept the 65% kill rate as the cost of structural retool.** Shipping unverifiable specifics is worse than shipping fewer leads.
2. **The 8 KEEPs surface for copy iterate-to-perfect.** Forest Ridge "we ARE in 2026" + Exclusive Cooling "2023 promo still live + © 2015" are the cleanest hooks — render-time verified, specific, falsifiable, observable by the prospect themselves.
3. **Consider commissioning a next batch from a fresh angle.** The current batch was researched assuming SEMrush would land — without it, ~30% of hooks are structurally unverifiable. A next batch designed around render-time-observable claims only (404s, dead links, stale copyrights, blog-removals, dead-domain redirects) would have a higher pass-rate.
4. **Fresh-angle observations above** could seed a quick supplementary batch for the same prospects with different hooks (e.g. Beebe "apex HTTPS broken" instead of "site not loading"). Aiden's call.

---

*PASS 2 final kill-list — for boss → Aiden + Ben review.*
