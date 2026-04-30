# Reyco Launch-Day Admin-Trigger Punch List

Status: Ready for Aiden's launch-day fire window (Apr 30 morning).

Each step is a WP admin-context PHP one-shot via the admin-trigger pattern (PR #98/#100/#101/#102/#103 family). All snapshot-on-fail + idempotent guard + nonce + cap-checked. Recovery via snapshot if anything goes sideways.

---

## Step 1: Merge PR #100 (categories restructure + Minn-Kota nameplate)
- **Path**: GitHub → glvcrypto/reyco-marine → PR #100 → Merge
- **Status**: FULL GREEN (CI passed 36h+ ago, holding for your explicit go)
- **Why first**: ships the categories taxonomy + Minn Kota name fix into theme. Required by Step 2.

## Step 2: Dry-run categories (PR #101 admin page)
- **Path**: WP admin → Tools → Reyco Categories Tag Apply → Dry-run
- **What it does**: shows preview of v3-apply-now.csv (192 product → category assignments) without committing
- **Verify**: red INVALID PRODUCT IDs / orange TERM NOT FOUND should be 0
- **Time**: ~30s

## Step 3: Apply categories (same admin page)
- **Path**: WP admin → Tools → Reyco Categories Tag Apply → Apply (after dry-run review)
- **What it does**: commits 192 product → category assignments via wp_set_object_terms (replace mode)
- **Snapshot**: written pre-apply; rollback available if anything goes wrong
- **Time**: ~1-2 min

## Step 4: Minn Kota nameplate fix
- **Confirmation step**: spot-check 3-5 Minn Kota products on staging post-Step-3 to confirm names look right (they should — name fix is in PR #100 theme code, not a separate trigger)
- **Time**: ~1 min

## Step 5: Product Rewrite Import (PR #102 admin page)
- **Path**: WP admin → Tools → Reyco Product Rewrite → Run Import
- **What it does**: bulk-update on 249 existing products from master-ship.csv (Name + Short desc + Description + 8 meta keys including _product_specs / _product_expert_id / _product_expert_review). UPDATE-ONLY (skips any non-existent product IDs).
- **Memory headroom**: PR #102 N5 amendment shipped (set_time_limit(0) + 512M). Should not trip on SG PHP-FPM defaults.
- **Snapshot**: written pre-apply; rollback available
- **Time**: ~3-5 min for 249 rows

## Step 6: SG Dynamic Cache purge (manual)
- **Path**: SiteGround Site Tools → Speed → Caching → Dynamic Cache → Flush
- **Why**: PR #102 N4 cache invalidation gap (medium severity). After bulk meta updates, SG Dynamic Cache holds old HTML. Manual flush makes new copy visible to customers immediately.
- **Time**: ~30s

## Step 7: Manual VIN deletes (3 products)
- **Path**: WP admin → Products → search by ID → trash → permanent delete
- **IDs to delete**: 489 (merged into 453), 537 (merged into 425), 558 (merged into 414)
- **Why**: VIN duplicates from manual-check-csv consolidation. Lower-ID-keeps rule per content-completeness.
- **Time**: ~2 min

## Step 8: Manual-check ruling (2 products — manual review needed)
- **IDs**: 513 + 561 (2023 Mercury 15 HP identical-after-strip pair)
- **Action**: pick one to keep, delete the other (or merge if both have unique product info)
- **File**: deliverables/product-rewrite/manual-check.csv
- **Time**: ~5 min

---

## ADDITION 2026-04-29 (post-AM-brief): WC REST API Key
- **PR**: #103 merged 7c7f419
- **Path**: WP admin → Tools → Reyco WC API Key → Generate API Key button
- **What it does**: one-click WC REST key generation; displays consumer_key + consumer_secret once
- **After click**: copy both values, paste back to boss in format `WC_KEY=ck_... WC_SECRET=cs_...` (boss relays to SEO)
- **Why**: unblocks SEO Task #12 (250-product metas batch-write, blocked >48h)
- **Time**: ~2 min

---

## Sequence + Timing
- Total fire window: ~15-20 min
- All steps idempotent (post-write option flag); safe to retry if interrupted
- Pentester N4 (cache purge) + N5 (memory headroom) addressed; N1-N3, N6, N7 are LOW severity post-launch hardening
- Snapshots in `wp-content/uploads/reyco-snapshots/` (server-side, 0644, NOT public)

## Standing posture
- Web-copy: standby on manual-check ruling (Step 8)
- SEO: standby on WC REST key delivery (Addition)
- Dev: standby for any push-button rollbacks if needed
- Pentester: standing on N4 verification post-Step-6 (cache purge confirms)

---

## POST-LAUNCH SPRINT QUEUE (banked items, not Apr 30 fire-window)

### Dev queue (from scout audit + ecosystem scans)
- N4: PHP syntax lint in deploy.yml
- N5: PR-triggered CI for theme repo
- N6: nonce hardening on remaining admin-trigger pages
- Claude Code UI redesign upgrade-path eval (Apr 29 eco-scan #2 — multi-session, integrated terminal, draggable layout)
- Autoresearch cron update-cron-fire propagation (matches heartbeat patch pattern, scout audit recommendation)

### SEO queue
- 20 post-launch items from pre-launch-seo-polish-pass-2026-04-29.md
- Person schema for E-E-A-T (blocked on Casey/Charlene team bios)
- Internal link gaps + image directives across Marine + Winterization

### Content queue
- Blog 1 + Blog 5 publish (seasonal window: ice-out + walleye May 16)
- Author bios from Casey/Charlene 7-bucket re-ping
- 24-month forward calendar continues post-Reyco-launch

### Analyst cycle-9 sift queue (15 items)
1. Producer-Consumer Confusion industry rename (cycle-8)
2. Karpathy validation + gate-dependent-metric extension (cycle-8)
3. Dispatch-discipline tripwire (cycle-8)
4. Stale-orphan exp cleanup pattern (cycle-8)
5. Self-observable install-verification (scout RTK exchange)
6. Phantom #3 dashboard LOG_TYPES fix dispatch (scout phantom scan)
7. Writer-without-reader Catalog adjudication (scout phantom scan)
8. Anthropic Context Engineering theta-wave Phase 5 input
9. Claude Code Routines architectural-eval
10. Catalog-flow staleness disambiguation
11. Single-author seed-phase signal
12. VoltAgent 1000+ skills post-launch sift
13. Anthropic 24-min prompt workshop fleet audit input
+ Ecosystem-scan dispatch SOP (one send-message per routing tag) — meta-methodology candidate

### Ads queue
- Fusion final report (path A/B/C/D pending Aiden)
- Titan Stage 4 Meta BM + pixel setup
- Conversion-tracking-setup skill port from life-OS (scout audit recommendation)

### Pentester queue
- Tier 2 origin-layer audit (week 1 post-launch)
- N1-N7 from PR #102 hardening (LOW-MED severity)
- 72h post-launch security audit sweep
- Wrapper-script post-launch install (task_1777421886226_281)

### Cross-fleet
- Goals.json refresh ALL 5 specialists (scout audit recommendation)
- >48h cross-agent dependency escalation rule → heartbeat SKILL.md propagation
- Phantom #3 LOG_TYPES analyst Option A
- Slack workspace upgrade decision (May 3 deadline)
- Lift tracker agent build (post-launch, Aiden personal-use)
14. Channel-post-as-route ≠ direct-send-message routing (C-I, FOLD-leaning into #1 Producer-Consumer Confusion as frame-mismatch parent class)
15. Sample-of-N counting discipline (temporal-density ≠ population-strength; cron-driven within-window = correlated observations not independent base-rate) — META-METHODOLOGY cross-cutting lens
