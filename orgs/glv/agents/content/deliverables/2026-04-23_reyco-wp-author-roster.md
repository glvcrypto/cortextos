# Reyco WP Author Roster

**Status:** AWAITING USER APPROVAL — confirm category mapping before bylines are written
**Prepared:** 2026-04-23
**Source:** WP REST API /wp/v2/users via dev (REST API accessible; WP-CLI not needed)

---

## Seeded Authors (2 active content authors)

### Casey Davieaux — WP ID 2

**slug:** casey
**Role:** Admin (WP roles hidden via public API)
**Bio (live in WP):**
> Casey owns and operates Reyco Marine at 11 White Oak Drive East in Sault Ste. Marie. Reyco carries boats, outboard motors, outdoor power equipment, UTVs, golf carts, docks, and lifts — the full range of what Northern Ontario property owners and anglers need in one place. Casey knows the water up here, the equipment that holds up on it, and the customers who depend on both to have a good season.

**Note:** This is the placeholder bio seeded Apr 22 — marked pending Casey approval.

---

### Tyler — WP ID 3

**slug:** tyler
**Role:** Author/editor (WP roles hidden via public API)
**Bio (live in WP):**
> Tyler runs the service side at Reyco Marine. He handles everything from outboard motor rebuilds and spring commissioning to small-engine repair on lawn tractors, snow blowers, and chainsaws. If a motor comes into the Reyco shop, Tyler has either seen that problem before or will figure it out. He is the person you want diagnosing your equipment before the season starts — not after.

**Note:** This is the placeholder bio seeded Apr 22 — marked pending Casey approval.

---

## Not in WP

- **Aaron** — not seeded. Was in original author bio brief but not in WP user database.
- **info@glvmarketing.ca** (WP ID 1) — seeded as admin account, no bio, no display name. Excluded per hard rule. Do not use.

---

## Proposed Product-to-Author Category Mapping

Based on the two seeded authors and their roles:

| Category | Author | Rationale |
|---|---|---|
| Boats — Princecraft | Casey Davieaux | Owner authority on boats |
| Outboard motors — Mercury | Tyler | Service lead; motors are his domain |
| Marine electronics — Humminbird, Minnkota | Casey Davieaux | Boat/fishing accessories belong with the boat authority |
| Docks and lifts — R&J Machine | Casey Davieaux | Property equipment, owner perspective |
| UTVs — Hisun | Casey Davieaux | Powersport/property equipment |
| Golf carts — EZ-GO | Casey Davieaux | Property equipment |
| Outdoor power equipment — Cub Cadet, Toro, Troy-Bilt | Tyler | Small engine service is Tyler's explicit coverage |
| Handheld power — Echo | Tyler | Chainsaws/handheld = small engine service territory |
| Attachments/accessories — Bercomac | Tyler | Service/maintenance equipment |
| Trailers — Easy Hauler | Casey Davieaux | Boat trailers go with the boat authority |
| Lightspeed catalog items (parts, accessories, misc) | Casey Davieaux | Default to owner for unassigned catalog items |

---

## Email in Byline — Still Blocked

The domain coupling issue from the prior proposal still applies. @reycomarine.com email addresses depend on the Dealer Spike domain transfer (confirmed launch blocker). Recommendation remains Option B:

**Byline format (no email):**
- `Reviewed by Casey Davieaux, Owner, Reyco Marine`
- `Reviewed by Tyler, Service Technician, Reyco Marine` *(confirm "Service Technician" vs "Service Lead" vs just "Service" — whatever Casey uses internally)*

No dead links on launch. Email field can be added via find-and-replace post-domain transfer.

---

## What User Needs to Confirm Before Byline Writing Starts

1. **Category mapping** — does the table above look right, or should any categories shift between Casey and Tyler?
2. **Tyler's title** — "Service Technician" / "Service Lead" / "Service Manager" / just "Tyler, Reyco Marine"? (Boss directive says Casey must confirm staff titles)
3. **Email in byline?** — Confirm Option B (no email, add post-transfer) unless user has another preference
4. **Aaron** — not in WP. Still needed, or proceed with Casey + Tyler only?

Once confirmed: start with zero-turn mowers, batch 20 products at a time.
