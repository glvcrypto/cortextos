# Series-Copy KILL List — Day-2 Plan B Insurance

**Generated:** 2026-04-29
**Source:** `master-ship.csv` (249 rows, post-import)
**Trigger condition:** Apply ONLY if a series fails to get a populated carousel after tonight's term-create + tag pass.
**Status:** STAGED — no execution unless boss pings.

---

## Strategy

**TITLES are NEVER stripped.** Series-names in the `Name` field (e.g. "2026 Cub Cadet XT1 LT46") are product identifiers, not lineup promises. Stripping them breaks the title format and customer search.

**PROSE lineup/platform/series-promise sentences ARE the kill targets.** These are the sentences that imply "there's a browseable XT1 lineup" — the broken promise vector. Replacement copy keeps the product-context point but drops the lineup framing.

**Apply only the per-series block whose carousel did NOT get coverage.** Each block is self-contained.

---

## SERIES BLOCK 1: Cub Cadet XT1

**Carousel:** `cub-cadet-xt1` | **Status:** MISSING | **Affected products:** 9
**Affected IDs:** 455, 512, 523, 555, 725, plus 4 more (full list via `grep -i 'XT1' master-ship.csv`)

### Find / Replace pairs (apply via PHP `str_replace` or `str_ireplace` loop on `_post.post_content` + `_post.post_excerpt` for the 9 affected IDs):

1. **"The XT1 platform is Cub Cadet's ride-on done right"** (7 occurrences)
   → **"This XT1 tractor is Cub Cadet's ride-on done right"**
   _(Drops "platform" framing; keeps product-specific point.)_

2. **"Cub Cadet's XT1 platform sits in the sweet spot"** (3 occurrences)
   → **"This Cub Cadet XT1 sits in the sweet spot"**

3. **"Cub Cadet's XT1 platform is the one Aaron recommends"** (1 occurrence)
   → **"This XT1 is the one Aaron recommends"**

4. **"Cub Cadet's XT1 platform was built around the property caretaker"** (2 occurrences)
   → **"The XT1 line in general — and this unit specifically — was built around the property caretaker"** _(rephrase to avoid platform-promise but acknowledge product context)_

5. **"The XT1 platform shows up on the bench"** (2 occurrences)
   → **"This XT1 shows up on the bench"**

6. **"Cub Cadet's XT1 platform is built around the customer who wants to finish the lawn"** (1 occurrence)
   → **"This XT1 is built around the customer who wants to finish the lawn"**

### Keep (do NOT strip):
- All `Name` field mentions of "XT1 LT46" / "XT1 LT50" etc.
- `_product_specs` Model field
- Product-level mentions where "XT1" is just modifier of THIS product (not a lineup reference)

---

## SERIES BLOCK 2: Cub Cadet XT2

**Carousel:** `cub-cadet-xt2` | **Status:** MISSING | **Affected products:** 5
**Affected IDs:** 423, 469, 562, 1039, 1041

### Find / Replace pairs:

1. **"The XT2 platform is Cub Cadet's ride-on done right"** (3 occurrences)
   → **"This XT2 tractor is Cub Cadet's ride-on done right"**

2. **"Cub Cadet's XT2 platform is the one Aaron recommends"** (2 occurrences)
   → **"This XT2 is the one Aaron recommends"**

3. **"Cub Cadet's XT2 platform is built around the customer"** (1 occurrence)
   → **"This XT2 is built around the customer"**

4. **"Cub Cadet's XT2 platform sits in the sweet spot"** (1 occurrence)
   → **"This Cub Cadet XT2 sits in the sweet spot"**

### Keep:
- `Name` field mentions of "XT2 GX54" / "XT2 LX42" etc.
- Spec-table model code

---

## SERIES BLOCK 3: Mercury FourStroke

**Carousel:** `fourstroke-outboards` | **Status:** EMPTY (term exists, 0 products tagged)
**Affected products:** 48
**Note:** The fix here is preferentially TAG-PASS (since term exists). Kill list is PURE INSURANCE only if tag-pass fails to populate.

### Find / Replace pairs:

1. **"the FourStroke and Pro XS lines on the parts counter"** (5 occurrences)
   → **"the FourStroke and Pro XS parts on the counter"**
   _(Strips "lines" lineup framing; "parts on the counter" is concrete inventory ref.)_

2. **"The FourStroke designation means it's part of Mercury's modern four-stroke product line"** (4 occurrences)
   → **"The FourStroke designation means it's a modern four-stroke build — quieter than a two-stroke, runs unleaded out of any can, and doesn't smoke up like the old motors did"**

3. **"The FourStroke line — when applicable — is Mercury's modern four-stroke architecture"** (3 occurrences)
   → **"The FourStroke build is Mercury's modern four-stroke architecture"**

4. **"Mercury's FourStroke line has been refined long enough"** (1+ occurrences)
   → **"Mercury's FourStroke architecture has been refined long enough"**

### Keep:
- `Name` field "FourStroke" (it's the product designation/series label, treated as a model identifier)
- "Mercury 50 FourStroke" / "Mercury 2.5 FourStroke" etc — product-name context
- Expert-review mentions where FourStroke is named for THIS product, not a separate lineup

### Caveat:
With 48 products and 20 distinct phrasings, this is a substantial kill-pass. **Strongly prefer the tag-pass fix** — much smaller surface area.

---

## SERIES BLOCK 4: Mercury ProXS

**Carousel:** `proxs-outboards` | **Status:** MISSING | **Affected products:** 15

### Find / Replace pairs:

1. **"the FourStroke and Pro XS lines on the parts counter"** (5 occurrences — same sentence as Block 3)
   → **"the FourStroke and Pro XS parts on the counter"** _(single replacement covers Block 3 + Block 4)_

2. **"the Pro XS engineering"** / **"FourStroke / Pro XS engineering"** (variable occurrences)
   → keep for product-specific reference; flag if a sentence specifically promises "the Pro XS line of motors" — none found in current scan, so likely no further action.

### Keep:
- "Pro XS" in `Name` field
- Spec-table `Model` mentions

### Note:
ProXS has only 2 distinct promise phrases — much smaller kill surface than FourStroke. Tag-pass + term-create still preferred.

---

## SERIES BLOCK 5: Toro TimeCutter

**Carousel:** `toro-timecutter` | **Status:** MISSING | **Affected products:** 6

### Find / Replace pairs:

1. **"Toro's TimeCutter platform makes the obstacle course around the firepit"** (1 occurrence)
   → **"This TimeCutter makes the obstacle course around the firepit"**

2. **"Toro's TimeCutter platform was designed for residential customers"** (1 occurrence)
   → **"The TimeCutter was designed for residential customers"**

3. **"Toro's residential zero-turn line, including the Toro TimeCutter 54-inch Zero-Turn Mower (77503)"** (1 occurrence)
   → **"Toro's residential zero-turn build, including the Toro TimeCutter 54-inch Zero-Turn Mower (77503)"**

4. **"Toro's TimeCutter platform sits at the size and tier where most residential customers actually land"** (1 occurrence)
   → **"This TimeCutter sits at the size and tier where most residential customers actually land"**

### Keep:
- `Name` field "TimeCutter" mentions
- Spec-table

---

## SERIES BLOCK 6: Echo 56V cordless

**Carousel:** `cordless-56v` | **Status:** MISSING (on Echo page) + entire 56V series page MISSING
**Affected products:** 12 (highest-density promise pattern — ~3 promise sentences per product = ~36 occurrences total)

### Find / Replace pairs:

1. **"The 56V platform is one of the few cordless ecosystems where the runtime actually matches the marketing"** (12 occurrences — once per product)
   → **"Echo's 56V cordless build matches the marketing on runtime — Aaron's run these long enough to know which cordless tools hold up and which don't"**
   _(Strips "platform" + "ecosystem" lineup-promise; keeps the durability point.)_

2. **"That includes the 56V cordless line — battery service, warranty, and platform support all come through Reyco"** (12 occurrences)
   → **"Battery service, warranty, and tool support all come through Reyco"**
   _(Drops "56V cordless line" entirely; keeps the service-promise context.)_

3. **"Once you've got one Echo 56V battery, the next tool in the kit is just the bare unit — and that's where the platform pays off"** (12 occurrences)
   → **"Once you've got one Echo 56V battery, the next tool in the kit is just the bare unit — and that's where buying into the cordless side pays off"**
   _(Drops "platform" → "cordless side" — vaguer, no carousel-promise.)_

4. **"Echo's 56V platform: one battery, multiple tools"** (3 occurrences in Short descriptions)
   → **"Echo 56V cordless: one battery, multiple tools"**

### Keep:
- `Name` field "56V" / "Cordless" mentions
- Product-spec mentions of 56V battery as a SPEC, not a platform

### Note:
Echo 56V is the **highest-priority kill block** if the carousel doesn't populate — most repetitive promise pattern, three sentences per product, all 12 products affected.

---

## SERIES BLOCK 7: Echo PAS (Pro Attachment Series)

**Carousel:** `pas-225` / `pas-2620` | **Status:** MISSING | **Affected products:** 4

### Find / Replace pairs:

1. **"Echo DPAS-2100 Cordless PAS Powerhead — Echo's 56V platform: one battery, multiple tools"** (1 occurrence)
2. **"Echo DPAS-2600 Cordless PAS Powerhead — Echo's 56V platform: one battery, multiple tools"** (1 occurrence)
   → Both: **"Echo DPAS-2100 / DPAS-2600 Cordless PAS Powerhead — Echo 56V cordless: one battery, multiple tools"** _(folds into Block 6 fix)_

3. **"Echo's Echo DPAS-2100 Cordless PAS Powerhead comes back to the service department for line replacements"** (1 occurrence)
   → no change needed; "line replacements" refers to trimmer-line, not lineup-promise.

### Keep:
- `Name` field "PAS-225" / "PAS-2620" / "PAS Powerhead"
- Product-spec PAS designation

---

## SERIES BLOCK 8: Toro GrandStand + Z Master orphans

**Carousel:** none defined in matrix | **Status:** ORPHANED | **Affected products:** 3 (IDs 420, 421, 422)
**Note:** Per boss, lower-priority commercial-tier mowers; can defer post-launch but kill-list block included for completeness.

### Find / Replace pairs:

1. **"Toro's GrandStand platform sits at the size and tier where most residential customers actually land"** (1 occurrence)
   → **"This Toro GrandStand sits at the size and tier where most residential customers actually land"**

2. **"Toro's Z Master platform sits at the size and tier where most residential customers actually land"** (1 occurrence)
   → **"This Toro Z Master sits at the size and tier where most residential customers actually land"**

### Keep:
- `Name` field "GrandStand" / "Z Master" mentions
- Spec-table

### Long-term:
Either add `toro-grandstand` and `toro-z-master` carousels (preferred — these ARE valid product distinctions), OR strip-only via this block. Boss to decide.

---

## SERIES BLOCK 9: Minn Kota Terrova — NO ACTION

**Carousel:** `terrova` | **Status:** EMPTY (term exists)
**Affected products:** 8
**Note:** Scan found NO lineup/platform/series-promise phrases. All Terrova mentions are product-name context (e.g. "the Terrova is the one I keep coming back to"). No copy fix needed — only tag-pass to populate the carousel.

---

## Execution mechanics (for boss / dev when triggered)

1. **Scope per block:** apply each block's find/replace ONLY if that series' carousel didn't get coverage.
2. **Mechanism:** PHP loop matching the same admin-trigger pattern as the import (PR #102). Take affected IDs per block, load each `wc_get_product($id)`, run `str_ireplace` on `get_description()` + `get_short_description()` + `_product_expert_review` meta, save.
3. **Idempotent option-flag:** `reyco_series_kill_list_v1_done_<series_slug>` per block — allows partial application.
4. **Sidecar on run:** `kill-list-applied-<timestamp>.csv` with `block, ID, replacements_count, before_excerpt, after_excerpt` for audit.
5. **Reversibility:** keep a one-time backup of original `post_content` in `_product_expert_pre_kill_backup` meta keys before strip. Allows revert if a series carousel comes online later.

---

## Volume summary

| Block | Series | Carousel status | Products | Promise sentences | Priority if fired |
|---|---|---|---|---|---|
| 6 | Echo 56V | MISSING | 12 | 36 | HIGHEST |
| 3 | Mercury FourStroke | EMPTY (tag-pass preferred) | 48 | 20 | HIGH (volume) |
| 1 | Cub Cadet XT1 | MISSING | 9 | 17 | MEDIUM-HIGH |
| 2 | Cub Cadet XT2 | MISSING | 5 | 11 | MEDIUM |
| 5 | Toro TimeCutter | MISSING | 6 | 4 | MEDIUM |
| 4 | Mercury ProXS | MISSING | 15 | 2 | LOW (small surface) |
| 7 | Echo PAS | MISSING | 4 | 3 | LOW |
| 8 | GrandStand + Z Master | ORPHAN | 3 | 2 | LOWEST (defer post-launch) |
| 9 | Minn Kota Terrova | EMPTY | 8 | 0 | NO ACTION |

**Total potential surface:** ~110 products, ~95 promise-sentence occurrences. Echo 56V + Cub Cadet XT1/XT2 + Toro TimeCutter (= 32 products / 68 promise sentences) is the realistic high-priority chunk if MISSING terms don't get created tonight.
