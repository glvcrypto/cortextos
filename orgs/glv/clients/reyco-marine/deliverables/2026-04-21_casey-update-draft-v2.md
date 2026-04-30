# Casey Update Draft v2 — Apr 21, 2026

**Audience:** Casey Davieaux (Reyco Marine)
**Channel:** Slack DM or WhatsApp (Ben's call on channel — he asked us to keep these direct, not through Jak)
**Status:** DRAFT — awaiting user review before send
**Context:** Per Apr 20 GLV-Ben meeting — Ben directed us to start sending Casey direct progress summaries with completed work + open items. Launch target = Apr 30 (contract was signed Mar 27, end-of-month = cutover). Not Apr 25.

---

Hey Casey — quick state-of-project heading into the Apr 30 launch.

Staging site: **reyco.glvmarketing.ca** — most of what's below is already there, you can click around any time.

## Where the site is at

**Architecture + navigation**
The nav is restructured around three main buckets — **Marine / Powersports / Power Equipment** — with About, Service, Financing, Blog, and Contact after. Each bucket opens a mega-menu so people get to the category they want in one click instead of drilling through layers.

**Products — 184 live across 11 brands**
Seeded from the manufacturer catalogues Jak and your partners gave us:
- **Echo** — full lineup, 54 products (chainsaws, trimmers, blowers, hedge trimmers, power pruners, 56V cordless, pressure washers)
- **Hisun** — all model families (Strike, Stryker, Sector, MP9, HS Series, ATVs, Electric, Cub Cadet UTV)
- **Minn Kota, Cannon, Humminbird** — full Johnson Outdoors electronics catalogue (48 products)
- **R&J Machine** — docks, lifts, PWC ports, marine railways, hardware
- **Princecraft, Mercury, Bercomac** — flagship models
- **Cub Cadet**

Each product gets SEO tagging (13–22 tags each — "Sault Ste Marie Dealer", "Algoma", "Authorized Dealer", use-case tags like "Firewood Chainsaw" and "Cottage UTV"). Those tag pages each become a landing page for long-tail search.

**Homepage**
- 16 custom line-art category icons went live today (no brand markings — pulled those after your earlier flag on Mercury cowlings and Toro decals)
- Authorized-dealer banner with 11 logos in uniform white-on-navy
- "Authorized Dealer" promoted from a grey caption to a full headline
- Google Map + hours + new address (11 White Oak Dr E — old 547 Great Northern Rd is scrubbed sitewide)
- Financing calculator button in every section, plus a floating calculator bottom-right on every page

**Financing**
`/financing/apply/` is a Reyco-branded 4-step application form — progress bar, trade-in conditional, saves progress locally. On submit it emails Parts + Charlene, and the applicant gets a confirmation. Replaces the old DealerTrack redirect — we own the brand experience end to end.

**Blog — 31 posts, UGC voice**
Rewritten in first-person so Casey and Tyler actually sound like real people on the shop floor, not SEO content. Posts run 1,500–1,700 words with TLDRs, category-mapped CTAs to related products/services, and schema markup. Targeting local searches like "Small Engine Repair Near Me" (3,600/mo) and "Boats for Sale in Sault Ste Marie".

**Under the hood**
- GitHub Actions → SiteGround auto-deploy pipeline, every change runs a smoke test before it's live
- Schema markup (LocalBusiness, Article, Product, FAQ) on every page for Google
- UTM tracking on every CTA — quote, phone, financing, calculator — so when leads come in the sales team sees exactly which product and which button they came from
- "Notify Me When Available" lead capture on out-of-stock products — captures name/email/phone, emails Parts instantly

## What's still in motion for Apr 30

- **Domain transfer** — reycomarine.com moving off Dealer Spike. Once it lands, DNS + email + Resend transactional mailing all come online
- **Product images** — Lightspeed catalogue imports don't include product photos. Options: we get dealer-portal access to pull manufacturer images, or we generate clean product imagery ourselves. Faster the former
- **3 long-form product pages in draft** — Princecraft Sport 172, Mercury 115 FourStroke, Toro Power Max HD 1028 — under your byline, ready for your review
- **2 SEO blog drafts** — Hisun in Northern Ontario, R&J dock/lift guide
- **Mercury + Toro catalogue pages** — we have no product-level catalogue from either yet (Jak and I are working it on our end — if you have an easy way to grab either from the dealer portals, that's the fastest path)
- **Staff section on the About page** — placeholder until we get headshots + bios (see ask below)

## What would help us most from you

Grouped so you can knock them out when you get a minute:

1. **Staff headshots + short bios for the About page.** We've got 3 photos on file (you, Corey, one unnamed). Need the other 5–6 — any phone pic works, we'll clean them up. 1–2 sentences per person (years in the trade, what they specialize in, anything you'd want a customer to know).

2. **Brand list confirmation.** Charlene's list included **Easy Hauler** (trailers), **EZ GO** (golf carts), **Troy-Bilt** — none on the site yet. And **STIHL** — still in or out? Want to make sure we're not missing anything or showing anything you don't carry.

3. **Lightspeed DMS read access.** Biggest unblock for getting real stock status + pricing live on every product page. Read-only login or API key — whichever's easier on your end.

4. **Facebook + Instagram logins.** Once we're in we can start cross-posting blog content, fixing hours/phone across the profiles, and coordinating with whoever's already posting over there.

5. **Echo Dealer Portal credentials.** For the co-op campaign proposal and pulling approved creative. Your dealer ID is REY100 and your territory rep is Nick Smirniw — we just need the login.

6. **NAP directory cleanup authorization.** Six priority local listings (Glixee, BBB, Bercomac, others) still point to the old address/site. Charlene sent one authorization email already — if we can get one blanket one that says "GLV Marketing is authorized to manage Reyco's local listings going forward," we handle the rest.

## Cadence going forward

Per our agreement with Ben — Aiden and I will check in daily around 4 PM our time (your 4 PM). Not a meeting, just making sure nothing's stuck. Slack or text whichever you prefer.

If any of the above is easier to talk through on a call, say the word and we'll jump on 10 minutes tomorrow or Thursday.

Appreciate it, Casey — site's coming together well and the Apr 30 target is solid if we can close these last pieces.

— Aiden
