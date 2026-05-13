# PASS 1 Preliminary Kill-List — Playwright-Rendered Site-State Check

**Generated:** 2026-05-12 ~20:25Z
**Trigger:** Aiden dispatch via boss (msg 1778616518692 + correction 1778616622445) — "coal" = email content factual accuracy, retool to Playwright with structural fix
**Decision rule:** KILL-ONLY per boss msg 1778616708293; no rewrite on this pass
**Methodology shift:** verify-claims/SKILL.md retooled — curl/WebFetch REMOVED for visual/content checks, Playwright + page.goto + waitForLoadState('networkidle') + 2s render wait HARD-CODED

---

## TL;DR

Of 23 staged drafts, PASS 1 site-state check identifies the following:

| Bucket | Count | Action |
|---|---|---|
| Site loads OK (Playwright-confirmed at render-time) — claim-specific PASS 2 needed | 15 | PASS 2 deep claim verify |
| Site genuinely down (DNS NXDOMAIN — v6 claim holds) | 2 | KEEP for now (PASS 2 still needs to verify *other* claims in the draft) |
| Site-state claim **demonstrably FALSE** at render-time → **KILL** | 2 | KILL (Beebe, Robert's) |
| URL not in manifest — no-website claim needs separate verify | 4 | PASS 2 manual verify |

Plus a critical correction: **first-pass anti-bot detection had 8 false positives** (sites flagged "ANTI_BOT_GATED" because their contact forms used reCAPTCHA — they actually rendered fine). Heuristic refined to title-based detection + low-content threshold; re-sweep confirmed only real challenge pages get flagged.

---

## DEFINITE KILLS (PASS 1 — site-state claim demonstrably FALSE)

### B1-E11 Beebe Mechanical — KILL

**v6 hook:** H5-opportunity — "website not loading"
**v6 draft text:** Claims Beebe's site does not load.
**Playwright observation (2026-05-12 20:21Z):**
- `https://beebemechanical.ca/` → TLS handshake fails (`Connection reset by peer` during ClientHello)
- `http://beebemechanical.ca/` → 301 redirect to `http://www.beebemechanical.ca/`
- `http://www.beebemechanical.ca/` → **HTTP 200**, real content, Microsoft-IIS/10.0, PHP/5.6.31
- Title: `Beebe | Commercial Mechanical Systems | Thunder Bay, ON`
- Body: `HOME SYSTEMS ABOUT US SUPPLIERS CAREERS CONTACT Heating Systems Air Conditioning Systems Refrigeration Kitchen Equipment Control Systems Mechanical Book a service call online...`
- Body chars: 870

**Why the v6 verification missed this:**
- Original check used `curl https://beebemechanical.ca/` which fails at TLS layer → got "Connection reset" → falsely classified as site-down
- Real visitor experience: a human typing `beebemechanical.ca` into Chrome would either land on the HTTP path (via Chrome's HTTPS-first then fallback) or click an indexed search result to `www.beebemechanical.ca/` which loads fine
- This is **exactly** the LLM-style verification failure Aiden flagged

**Verdict:** v6 site-state claim is FALSE. Aiden manual browser check (Apr 30) was right.
**Action:** KILL v6 Beebe draft.
**Fresh-angle observation (flagged not rewritten per boss rule):** Site IS live but has technical debt — broken HTTPS cert on apex, PHP 5.6.31 (EOL), running on Microsoft-IIS. If a fresh outreach angle is wanted, this could be reframed as "HTTPS broken / security warning to visitors" — but defer that to Aiden's next-batch decision.

---

### B1-E17 Robert's Plumbing & Sheet Metal — KILL

**v6 hook:** H2-curiosity — "69yr legacy, blank JS redirect, 0 traffic"
**v6 claim specifics:** "your website is a blank JS redirect"
**Playwright observation (2026-05-12 20:21Z):**
- `https://robertsplumbing.ca/` → TLS cert error (`ERR_CERT_COMMON_NAME_INVALID`)
- `http://robertsplumbing.ca/` via curl → HTTP 200, body is a **CanSpace** domain registrar landing page
- Body: `<title>Domain Registered with CanSpace</title>` ... `This Domain is Registered with CanSpace Solutions. If you are the owner of this domain, take a look at our web hosting packages`
- NOT a "blank JS redirect" — this is a registrar's domain-parking placeholder

**Why the v6 verification missed this:**
- Prior research (cycle-18) called it a "GoDaddy 307 redirect to forsale.godaddy.com" — that observation was correct **at the time** (Apr 24) but the domain has since been transferred to CanSpace registrar
- The hook concept ("no real business presence at this domain") still holds — it's still a parking page, just on a different registrar — but the **specifics** in the v6 wording are inaccurate at send-time

**Verdict:** v6 claim specifics FALSE per Aiden's "factually accurate at send-time" bar.
**Action:** KILL v6 Robert's draft. Per boss rule (no rewrite on this pass), do not patch the wording.
**Fresh-angle observation:** Hook concept holds → if Aiden wants a fresh draft in next batch, recast as "domain shows a CanSpace registrar parking page — no live business content" with current evidence.

---

## CONFIRMED HOLDS (PASS 1 — site-state matches v6 claim)

These v6 site-state claims survive PASS 1 but still need PASS 2 verification of *other* claims in the draft (review counts, traffic, competitor stats, etc.).

| ID | Name | v6 site-state claim | PASS 1 evidence |
|---|---|---|---|
| B1-E07 | Watson's Heating & Cooling | "domain went NXDOMAIN" (C-bucket reverify) | Playwright `ERR_NAME_NOT_RESOLVED` confirms NXDOMAIN |
| B1-E18 | Ben's Plumbing & Heating | "dead domain (NXDOMAIN)" | Playwright `ERR_NAME_NOT_RESOLVED` confirms NXDOMAIN |

Note: Watson's has the **C-bucket flag** from pre-cutover reverify — hook content (0 reviews, conflicting addresses) holds, only email channel is dead. Defers to fresh-contact research queue regardless of PASS 2 outcome.

---

## NEEDS PASS 2 (LOADS_OK — site-state OK but claim-specific re-verify required)

| ID | Name | URL (verified live) | v6 hook | PASS 2 verification needed |
|---|---|---|---|---|
| B1-E01 | Priest Plumbing | https://priestplumbing.ca/ | review gap 52 vs Perrotta 84 | Live Google review count for Priest + Perrotta |
| B1-E02 | J.G. Fitzgerald & Sons | https://fitzgeraldroofing.ca/ | 85yr legacy, 5 reviews, blog dead Jul 2022 | Blog last-post-date on site, current Google review count |
| B1-E03 | Northern Climate Heating and Air | https://northernclimatesudbury.com/ | 166 visits/mo vs 669-Heat 1259 | **SEMrush traffic data — NOT Playwright-verifiable. UNVERIFIABLE → likely KILL** |
| B1-E04 | D. Peppard Mechanical | https://peppardmechanical.com/ | content effort not aimed at buying searches | Blog post count + SEMrush keyword analysis — **SEMrush dep, likely KILL** |
| B1-E05 | Adept Plumbing | https://adeptplumbing.ca/ | no service pages, 1 review vs Villeneuve 30 | Site page count via Playwright sitemap crawl + live review count |
| B1-E09 | Witherell Plumbing & Heating | https://witherellplumbing.com/ | 68yr legacy but 0 organic search visibility | SEMrush dep — likely KILL on unverifiable |
| B1-E12 | Buhler Mechanical | https://buhlermechanical.com/ | 25yr legacy, no service subpages | Site page count via Playwright |
| B1-E14 | Harris Plumbing | https://harrisplumbing.ca/ | HomeStars/Readers Choice vs search visibility gap | Award badges on site + SEMrush traffic — mixed verifiable + SEMrush dep |
| B1-E16 | Elite Plumbing Solutions | https://eliteplumbingsolutions.ca/ | p2 ranking, 0 reviews, invisible in directories | Live Google review count + SERP check (p2 is SEMrush-style claim, may be KILL) |
| B1-E19 | Designed Roofing Inc. | https://designedroofing.com/ | 30-year Sika Elite Contractor, 0 Google reviews | Sika contractor badge on site + live Google review count |
| B1-E20 | Cullen Plumbing | https://cullenplumbing.net/ | 50 reviews vs Cardinal 703, 55yr vs 7yr newcomer | Live Google review count for both + business age check |
| B2-E01 | Forest Ridge Golf | https://forestridgegolf.ca/ | unknown (need to read v6.2 hook) | TBD |
| B2-E02 | Idylwylde Golf | https://idylwylde.com/ | unknown | TBD |
| B2-E03 | Georgian Home Comfort | https://georgianhomecomfort.com/ | unknown | TBD |
| B2-E04 | Exclusive Cooling Ltd | http://www.exclusivecooling.ca/ → redirects to furnacesairconditionerskingston.com | unknown | TBD — note: also a re-branded/redirected domain |

---

## NO_URL — needs PASS 2 separate verification

These 4 prospects had no URL in the manifest. The v6 hook for each was "no website" — but per Aiden's bar, that claim itself needs Playwright re-verification (search Google for "[business] [city]" → check if a site exists today).

| ID | Name | v6 hook |
|---|---|---|
| B1-E08 | Blue Sky Plumbing | 12 reviews vs Perrotta 84, YP→Facebook |
| B1-E10 | B. Gibson Mechanical | 4.0 star gap vs Villeneuve 4.6 |
| B1-E13 | Sunrise Roofing | no website, 3 Facebook reviews |
| B1-E15 | Bedard Plumbing | single-page site limits search ranking — wait, this implies a site DOES exist; manifest entry may be incomplete |

---

## SEMrush-dependent claims — PRELIMINARY KILL CANDIDATES

Per the standing SEMrush MCP phantom-endpoint audit (DRAFT held for pentester curation), SEMrush API is NOT wired in any cortextos `.mcp.json`. Per Aiden's "rock-solid at send-time" bar + KILL-on-unverifiable rule, claims that depend on SEMrush traffic/keyword data have no verification path right now:

| ID | Name | SEMrush-dependent claim | Likely PASS 2 verdict |
|---|---|---|---|
| B1-E03 | Northern Climate | "166 visits/mo vs 669-Heat 1259" | KILL (no SEMrush wire = unverifiable at send-time) |
| B1-E04 | Peppard | "content not aimed at buying searches" — depends on SEMrush keyword intent analysis | KILL |
| B1-E09 | Witherell | "0 organic search visibility" — SEMrush traffic | KILL |
| B1-E14 | Harris | "search visibility gap" — SEMrush traffic | KILL (partial — award visibility claim verifiable on-page) |
| B1-E16 | Elite | "p2 ranking" — SERP position requires SEMrush or manual SERP scrape | KILL (partial — 0-reviews claim verifiable) |
| B1-E20 | Cullen | Competitor review count claim (Cardinal 703) — manual GMB check possible but slow | Likely KEEP, manual verify in PASS 2 |

This is **the** structural issue Aiden's dispatch surfaces: ~5 of 19 active batch-1 drafts may be unverifiable in PASS 2 simply because the SEMrush MCP isn't wired. That's a separate Aiden-decision: (a) acquire SEMrush API now, or (b) accept ~25% kill rate on SEMrush-dependent hooks and pivot to on-page-only hooks going forward (which echoes the FP/FN measurement framework's comparative-vs-on-page tracking).

---

## What's hard-coded in verify-claims/SKILL.md retool (structural fix)

1. `verify-claim.js` — Playwright-based single-claim verifier (URL + optional selector + optional text-substring probe + optional screenshot). Returns JSON verdict with exit codes for downstream automation.
2. `pass1-sweep.js` — batch sweep loops a prospect manifest, captures site-state + body + anti-bot per prospect, outputs JSONL + summary MD.
3. Anti-bot detection refined: title-fragment match (strongest signal) OR low-body + challenge-marker. No more false-positive on real sites with reCAPTCHA contact forms.
4. SKILL.md being updated to wire these into the 9-step structurally (next deliverable in this same window).

---

## What's still required to finish PASS 2 (~2.5h)

1. Live Google review count check for every prospect with a review-count claim (Playwright on Google search → extract count from GBP card)
2. Blog-date check via Playwright on prospect's /blog or /news page
3. Site page count via Playwright sitemap/nav crawl for prospects with page-structure claims
4. NO_URL prospects: Playwright Google search for "[business] [city]" + check if a website link surfaces
5. Final kill-list with per-claim observation + KILL/KEEP verdict

ETA PASS 2 close: 24:00Z (~3.5h from now).

---

*PASS 1 preliminary kill-list — for boss → Aiden + Ben review at 21:30Z mark.*
