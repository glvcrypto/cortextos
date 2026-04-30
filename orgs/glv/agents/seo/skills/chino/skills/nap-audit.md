---
name: nap-audit
description: Verify NAP (Name, Address, Phone) consistency across all known listings, directories, and web mentions. Foundational local SEO — one mismatch hurts everything.
---

# NAP Audit — Local Citation Consistency Checker

> "If we're going to mess up with NAP, that's a big problem. We need to look for any signal from the past — maybe they signed up to something stupid and put his own number instead of the business number." — Ben Pelta

## Usage

`/chino:nap-audit <client> [action]`

Actions:
- `full` — Complete audit across all sources (default)
- `verify` — Quick check of canonical NAP against GBP
- `fix <source>` — Generate correction instructions for a specific source

## Context Detection

Read `projects/<client>/CONTEXT.md` for known business details.
Read `projects/<client>/seo/nap.md` for previously verified NAP (if exists).
Read `projects/<client>/seo/directory-queue.json` for submitted directories.

## Canonical NAP

The single source of truth for NAP. Stored at `projects/<client>/seo/nap.md`:

```
# [Business Name] — Verified NAP

**Last verified:** YYYY-MM-DD
**Verified against:** Google Business Profile

| Field | Value |
|-------|-------|
| Business Name | [Exact legal/trading name] |
| Address Line 1 | [Street address] |
| Address Line 2 | [Suite/unit if applicable] |
| City | [City] |
| Province | [Province code] |
| Postal Code | [X0X 0X0] |
| Country | Canada |
| Phone | [(XXX) XXX-XXXX] |
| Website | [https://example.com] |
| Email | [primary@example.com] |

## Formatting Rules
- Phone: Always (XXX) XXX-XXXX format
- Address: No abbreviations (Street not St., Avenue not Ave.) unless that's how GBP lists it
- Name: Exact match to GBP listing. No "Inc." unless GBP has it.
```

## Workflow

### Step 1: Establish Canonical NAP

If `nap.md` doesn't exist:
1. Ask user for the official business name, address, and phone
2. Cross-reference with Google Business Profile (if accessible)
3. Create `projects/<client>/seo/nap.md`
4. Confirm with user: "Is this the canonical NAP? All listings must match this exactly."

### Step 2: Scan Known Sources

Check NAP against:

**Tier 1 — Critical (check every audit):**
- Google Business Profile
- Website footer / contact page
- Website schema markup (LocalBusiness JSON-LD)
- Facebook Business page

**Tier 2 — Important (check monthly):**
- All completed directory submissions (from `directory-queue.json`)
- Yelp, Yellow Pages, other major directories

**Tier 3 — Discovery (check quarterly):**
- Web search: `"business name" + phone` — look for old/wrong numbers
- Web search: `"business name" + address` — look for old addresses
- Web search: `"business name"` — look for any mentions with wrong info

### Step 3: Report

Output `projects/<client>/seo/audits/nap-audit-YYYY-MM-DD.md`:

```
# NAP Audit — [Business Name]
**Date:** YYYY-MM-DD

## Canonical NAP
[Show verified NAP]

## Results

### ✅ Consistent (X sources)
- Google Business Profile — ✅ exact match
- Website footer — ✅ exact match
...

### ⚠️ Minor Variations (X sources)
- Yelp — ⚠️ Name shows "Ltd." (canonical omits it)
- Yellow Pages — ⚠️ Phone formatted as 705-555-1234 (canonical: (705) 555-1234)
...

### ❌ Mismatches (X sources)
- Old Dealer Spike listing — ❌ Wrong phone: 705-555-9999
- Chamber of Commerce — ❌ Old address: 456 Main St
...

## Priority Fixes
1. [Source] — [What's wrong] — [How to fix]
2. ...

## Score
NAP Consistency: X/Y sources match (Z%)
```

### Step 4: Update State

Update `.state/chino-state.json` with:
```json
{
  "lastNapAudit": "YYYY-MM-DD",
  "napScore": 85,
  "napMismatches": 3
}
```

## Integration

- **directory-drip** blocks submissions if no verified NAP exists
- **launch-checklist** requires NAP audit as prerequisite
- **audit** (weekly) includes NAP score as a metric

## Anti-Patterns

- ❌ Never assume NAP is correct — always verify against GBP
- ❌ Never auto-fix NAP on third-party sites — provide instructions only
- ❌ Don't flag formatting-only differences as critical (e.g., phone format variations)
- ❌ Don't skip old/legacy listings — those are the ones most likely to have wrong info
