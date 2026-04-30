# Reyco Marine — SEO Titles & Meta Descriptions: User Review
**File:** `meta-descriptions-2026-04-23.csv`  
**Prepared:** 2026-04-23 by seo agent + content agent  
**Status:** DRAFT — requires your approval before anything is applied to the site  
**Rows:** 250 products  
**Columns:** wc_sku, brand, tag_subcategory, tag_product_name, seo_title, seo_title_chars, meta_description, meta_chars, review_notes

---

## What This File Contains

**`seo_title`** — The title tag and H1 heading each product page will display. Pattern: `{Product Name} | {Brand} | Reyco Marine`. These replace the raw Lightspeed model codes currently showing on the site (e.g. "2021 Mercury ME 2.5MH 4S TMC" → "2.5 HP Outboard | Mercury | Reyco Marine").

**`meta_description`** — The snippet text shown under each result in Google. All are 111–158 characters (Google's display window is ~158). These are generated from subcategory templates and localized to Sault Ste. Marie / Northern Ontario.

---

## ⚠ Two Items Need Your Eyes Before Approving

### 1. Echo CC Displacement Values — UNCONFIRMED

**Affected rows:** 68 Echo products (all with `review_notes` = "Echo CC specs — verify against Echo catalogue before applying to WC")

Echo model numbers encode engine displacement in the title. Examples:
- `EC-CS310-26` → suggested title: **30cc Gas Chainsaw** (CS-310 ≈ 30.5cc per Echo naming convention)
- `EC-SRM225-26` → suggested title: **22cc Gas String Trimmer** (SRM-225 ≈ 21.2cc)

These CC values follow Echo's published naming convention and are likely correct, but **they have not been verified against the Echo product catalogue**. If a CC value turns out to be wrong it will appear in the page title on the live site.

**Your options:**
- **Approve as-is** — accept the naming-convention-derived CC values (probably correct, minor risk)
- **Drop CC values** — titles become "Gas Chainsaw" / "Gas String Trimmer" without displacement — still far better than model codes, zero risk
- **Verify first** — Casey or Echo dealer portal can confirm; then apply exact values

The `review_notes` column flags each of the 68 rows so you can spot them instantly in the CSV.

---

### 2. Toro Duplicate Names — Pending Deck Width from Casey

**Affected rows:** ~15 Toro SKUs (flagged in `review_notes`)

Multiple Toro SKUs share the same product name because they represent different deck widths or engine configurations of the same model line. Examples:
- 8 rows all named **Toro TimeCutter MyRIDE Zero Turn Mower** (2026-TORO-75747 through -7)
- 3 rows all named **Toro Z Master TF2 Commercial Zero Turn Mower** (2026-TORO-77283 through -3)

These will be differentiated once Casey confirms deck widths (e.g. "Toro TimeCutter MyRIDE Zero Turn Mower — 42-inch Deck"). Deck width question is already in the Casey consolidated ask (Slack draft, section 2). Once Casey replies, those 15 rows will be auto-regenerated.

**Your options:**
- **Approve remainder now, hold Toro 15** — apply everything except the flagged Toro duplicates; update Toro titles when Casey answers
- **Hold entire file** — wait until Casey answers and all 250 rows are finalized before importing

---

## How to Approve

Reply with one of:
- **"Approve all"** — apply the full 250-row file once WC write access is cleared
- **"Approve minus Echo CC"** — drop CC values from Echo titles, approve rest
- **"Approve minus Toro dupes"** — apply 235 clean rows now, hold 15 Toro rows for Casey
- **"Hold — wait for Casey"** — wait until Toro deck widths are confirmed before any WC import

Once you approve, this file goes to dev for bulk import via WooCommerce CSV. Nothing touches the live site without your green-light.

---

## Stats at a Glance

| Metric | Value |
|--------|-------|
| Total products | 250 |
| Title changes from raw model codes | 104 |
| Meta descriptions generated | 250 |
| Avg meta description length | 142 chars |
| Max meta description length | 158 chars |
| Over Google 158-char limit | 0 |
| Rows with open caveats | 83 (68 Echo CC + 15 Toro dupes) |
| Rows clean and ready | 167 |

---

*Draft only. No changes have been made to the live site. All edits require your approval.*
