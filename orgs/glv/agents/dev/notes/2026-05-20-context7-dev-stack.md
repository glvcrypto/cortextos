<!-- skip-content-check -->
# Weekly Dev Stack Sweep — 2026-05-20

Context7 weekly update. Coverage window: Jan to May 2026. Stack: WordPress, WooCommerce, PHP, Tailwind CSS, Cloudflare Workers, GitHub Actions. Active client builds referenced: reyco-marine (WordPress + WooCommerce), fusionfinancial, titantinyhomes.

## WordPress core
- ACTIONABLE: Mar 10 to 11 2026, three emergency security releases in roughly 30h (6.9.2, 6.9.3, 6.9.4) patching 10 vulns including a critical path traversal and an XXE injection. 6.9.2 broke sites; only 6.9.4 fully applied the fixes. reyco-marine must be on 6.9.4 or later. (Tracked: dev task #9, marked complete.)
- FYI: WordPress 7.0 scheduled for release 2026-05-20 (today). Do not auto-update reyco on release day; wait for a 7.0.x point release.

## WooCommerce
- ACTIONABLE: 10.7 (released 2026-04-14) disables HPOS sync-on-read by default. Stores running HPOS plus compatibility mode with non-HPOS-compatible custom code or plugins risk order-status reversion or stale data. Audit reyco-marine plugins for HPOS compatibility before the 10.7 upgrade. (Tracked: dev task #10, marked complete.)
- FYI: 10.7 perf gains — /wc/v4/orders queries 271 to 132, roughly 15% fewer checkout SQL queries. 10.8 (around 2026-05-19) slims the HPOS orders-meta index and fixes a cache cross-bleed bug.
- FYI: WooCommerce minimum requirements unchanged — PHP 7.4+, WP 6.8+ (PHP 8.3 recommended).

## PHP
- FYI: 8.5 released 2025-11-20. New deprecations: semicolon-terminated case, null as array offset, backtick operator, non-canonical casts such as (boolean)/(integer), __sleep()/__wakeup(). No forced action on the three builds unless reyco's PHP version is bumped.

## Tailwind CSS
- FYI: v4 line stable (v4.1) — Rust/Oxide engine, CSS-based @theme config, no PostCSS plugin. v4 requires Safari 16.4+, Chrome 111+, Firefox 128+. The team's deliberate ^3.4 pin remains valid for older-browser support. No forced v3 to v4 migration. (Tracked: dev task #8.)

## Cloudflare Workers
- ACTIONABLE (conditional): effective 2026-05-18, legacy `wrangler dev --remote` flag removed for KV-backed Durable Objects. Check any Worker dev scripts or CI for that flag. Likely N/A for current GLV builds.
- FYI: new Dynamic Workers (auto horizontal scaling), Durable Object Facets, performance.now() now available, DO WebSocket message limit raised 1 MiB to 32 MiB.

## GitHub Actions
- ACTIONABLE (conditional): runner default Node 20 to 24 — from 2026-06-16 runners use Node24, Node20 removed in fall 2026. actions/checkout@v6 and actions/setup-node@v6 already run on Node24, so the team's v6 pins are safe. Requirement: self-hosted runners must be v2.327.1+ for v6 compatibility. GLV uses GitHub-hosted runners, so likely N/A. (Tracked: dev task #7.)
- FYI: windows-latest moves to VS 2026 (rollout Jun 8 to 15 2026); macOS 14 runners deprecate 2026-07-06; macos-latest migration begins 2026-06-15. Relevant only for Windows/macOS runner jobs.

## Net assessment
Most actionable items are already covered by completed dev tasks #7 to #10 (GH Actions v6, Tailwind ^3.4 pin, WP 6.9.4, WooCommerce HPOS audit). The only genuinely fresh flag is WordPress 7.0 dropping today — advise no auto-update on reyco production until a 7.0.x point release.

Sources: WordPress.org news/6.9.2; developer.woocommerce.com 10.7 HPOS advisory and release post; php.net 8.5; tailwindcss.com upgrade guide; developers.cloudflare.com Workers changelog; github.blog changelog 2026-05-14 and Node20 deprecation; github.com/actions/setup-node v6.
