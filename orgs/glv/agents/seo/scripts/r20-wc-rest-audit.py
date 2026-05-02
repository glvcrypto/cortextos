#!/usr/bin/env python3
"""
R20+ WC REST Audit — bulk product pull for title/alt/meta audit.
Fetches all WC products via REST API (no HTML needed, no WAF).
Output: /tmp/r20_wc_rest_raw.json + /tmp/r20_wc_rest_audit.csv + summary MD
"""
import json, requests, time, csv, re, sys
from pathlib import Path

WC_KEY    = "ck_78ae0171e909350fbc42d9154d8287435ba6128d"
WC_SECRET = "cs_1e6ba14333b956c6d68ab62f3afa27183018e7d0"
BASE      = "https://reyco.glvmarketing.ca/wp-json/wc/v3"

RAW_OUT   = Path("/tmp/r20_wc_rest_raw.json")
CSV_OUT   = Path("/tmp/r20_wc_rest_audit.csv")
MD_OUT    = Path("/tmp/r20_wc_rest_summary.md")

def get_products(page=1, per_page=100):
    r = requests.get(
        f"{BASE}/products",
        params={"per_page": per_page, "page": page, "status": "publish"},
        auth=(WC_KEY, WC_SECRET),
        timeout=30
    )
    r.raise_for_status()
    return r.json(), int(r.headers.get("X-WP-Total", 0)), int(r.headers.get("X-WP-TotalPages", 1))

def get_meta(meta_data, key):
    for m in meta_data:
        if m.get("key") == key:
            return str(m.get("value", "")).strip()
    return ""

def audit_product(p):
    name         = p.get("name", "").strip()
    slug         = p.get("slug", "")
    pid          = p.get("id", 0)
    short_desc   = re.sub(r"<[^>]+>", "", p.get("short_description", "")).strip()
    meta_data    = p.get("meta_data", [])
    images       = p.get("images", [])
    cats         = [c["name"] for c in p.get("categories", [])]
    url          = f"https://reyco.glvmarketing.ca/product/{slug}/"

    rank_math_title = get_meta(meta_data, "rank_math_title")
    rank_math_desc  = get_meta(meta_data, "rank_math_description")
    reyco_meta      = get_meta(meta_data, "_reyco_meta_title")  # Task #12 custom field

    # Effective meta title: rank_math_title > _reyco_meta_title > product name
    effective_title = rank_math_title or reyco_meta or name

    # Image audit
    primary_alt   = images[0].get("alt", "").strip() if images else ""
    primary_src   = images[0].get("src", "") if images else ""
    img_count     = len(images)
    empty_alts    = sum(1 for img in images if not img.get("alt", "").strip())

    # --- Severity scoring ---
    issues = []

    # Title issues
    if not effective_title:
        issues.append("TITLE_MISSING")
    elif effective_title == name and len(name) < 20:
        issues.append("TITLE_TOO_SHORT")
    elif len(effective_title) > 70:
        issues.append("TITLE_TOO_LONG")
    elif effective_title.lower() == name.lower() and not rank_math_title and not reyco_meta:
        issues.append("TITLE_DEFAULT_PRODUCT_NAME")

    # Meta description issues
    if not rank_math_desc:
        issues.append("META_DESC_MISSING")
    elif len(rank_math_desc) < 50:
        issues.append("META_DESC_TOO_SHORT")
    elif len(rank_math_desc) > 160:
        issues.append("META_DESC_TOO_LONG")

    # Alt text issues
    if img_count == 0:
        issues.append("NO_IMAGES")
    elif not primary_alt:
        issues.append("PRIMARY_IMG_ALT_EMPTY")
    if empty_alts > 0:
        issues.append(f"ALT_EMPTY_x{empty_alts}")

    # Short description
    if not short_desc:
        issues.append("NO_SHORT_DESC")
    elif len(short_desc) < 30:
        issues.append("SHORT_DESC_TOO_BRIEF")

    # Category
    if not cats:
        issues.append("UNCATEGORIZED")

    severity = "P1" if any(x in issues for x in ["TITLE_MISSING", "META_DESC_MISSING", "PRIMARY_IMG_ALT_EMPTY"]) else \
               "P2" if issues else "OK"

    return {
        "id": pid,
        "slug": slug,
        "url": url,
        "name": name,
        "effective_title": effective_title,
        "title_len": len(effective_title),
        "rank_math_title": rank_math_title,
        "reyco_meta_title": reyco_meta,
        "rank_math_desc": rank_math_desc,
        "desc_len": len(rank_math_desc) if rank_math_desc else 0,
        "primary_alt": primary_alt,
        "img_count": img_count,
        "empty_alts": empty_alts,
        "short_desc_len": len(short_desc),
        "categories": ", ".join(cats),
        "issues": "; ".join(issues) if issues else "",
        "severity": severity,
    }

def main():
    print("Fetching WC products…")
    all_products = []

    page = 1
    _, total, total_pages = get_products(page=1, per_page=1)
    print(f"  Total published products: {total} across {total_pages} pages")

    while True:
        products, _, _ = get_products(page=page, per_page=100)
        if not products:
            break
        all_products.extend(products)
        print(f"  Page {page}: fetched {len(products)} products ({len(all_products)}/{total})")
        if page >= total_pages:
            break
        page += 1
        time.sleep(0.5)

    print(f"\nTotal fetched: {len(all_products)} products")
    RAW_OUT.write_text(json.dumps(all_products, indent=2))
    print(f"Raw JSON saved → {RAW_OUT}")

    # Audit each product
    rows = [audit_product(p) for p in all_products]
    rows.sort(key=lambda r: (0 if r["severity"] == "P1" else 1 if r["severity"] == "P2" else 2, r["slug"]))

    # Write CSV
    fields = ["severity", "id", "slug", "url", "name", "effective_title", "title_len",
              "rank_math_title", "reyco_meta_title", "rank_math_desc", "desc_len",
              "primary_alt", "img_count", "empty_alts", "short_desc_len", "categories", "issues"]
    with open(CSV_OUT, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        w.writeheader()
        w.writerows(rows)
    print(f"Audit CSV saved → {CSV_OUT}")

    # Summary stats
    p1 = [r for r in rows if r["severity"] == "P1"]
    p2 = [r for r in rows if r["severity"] == "P2"]
    ok = [r for r in rows if r["severity"] == "OK"]

    issue_counts = {}
    for r in rows:
        for iss in r["issues"].split("; "):
            if iss:
                issue_counts[iss] = issue_counts.get(iss, 0) + 1

    meta_missing    = issue_counts.get("META_DESC_MISSING", 0)
    alt_missing     = issue_counts.get("PRIMARY_IMG_ALT_EMPTY", 0)
    title_default   = issue_counts.get("TITLE_DEFAULT_PRODUCT_NAME", 0)
    no_images       = issue_counts.get("NO_IMAGES", 0)
    no_short_desc   = issue_counts.get("NO_SHORT_DESC", 0)
    uncategorized   = issue_counts.get("UNCATEGORIZED", 0)

    md = f"""# R20+ WC REST Audit — Product Pages
**Run:** {__import__('datetime').datetime.utcnow().strftime('%Y-%m-%dT%H:%MZ')}
**Source:** WC REST API (`/wp-json/wc/v3/products`) — no HTML required
**Coverage:** {len(rows)} published WC products

---

## Summary

| Severity | Count | % |
|----------|-------|---|
| P1 (critical) | {len(p1)} | {100*len(p1)//max(len(rows),1)}% |
| P2 (warning) | {len(p2)} | {100*len(p2)//max(len(rows),1)}% |
| OK | {len(ok)} | {100*len(ok)//max(len(rows),1)}% |

---

## Issue Breakdown

| Issue | Count | Rate |
|-------|-------|------|
| META_DESC_MISSING | {meta_missing} | {100*meta_missing//max(len(rows),1)}% |
| PRIMARY_IMG_ALT_EMPTY | {alt_missing} | {100*alt_missing//max(len(rows),1)}% |
| TITLE_DEFAULT_PRODUCT_NAME | {title_default} | {100*title_default//max(len(rows),1)}% |
| NO_IMAGES | {no_images} | {100*no_images//max(len(rows),1)}% |
| NO_SHORT_DESC | {no_short_desc} | {100*no_short_desc//max(len(rows),1)}% |
| UNCATEGORIZED | {uncategorized} | {100*uncategorized//max(len(rows),1)}% |

---

## P1 Products (sample — first 20)

| Slug | Issues |
|------|--------|
"""
    for r in p1[:20]:
        md += f"| `{r['slug']}` | {r['issues']} |\n"

    if len(p1) > 20:
        md += f"\n_…{len(p1) - 20} more P1 products in CSV_\n"

    md += f"""
---

## Data Fields Available

- `effective_title` — RankMath title > `_reyco_meta_title` (Task #12) > product name
- `rank_math_desc` — RankMath meta description (blank = missing)
- `primary_alt` — First product image alt text
- `empty_alts` — Count of images with empty alt across all product images
- `categories` — Assigned WC categories
- `short_desc_len` — Character count of short description

_Full data: {CSV_OUT}_
"""

    MD_OUT.write_text(md)
    print(f"Summary MD saved → {MD_OUT}")
    print(f"\nP1: {len(p1)}  P2: {len(p2)}  OK: {len(ok)}")
    print(f"Top issues: {sorted(issue_counts.items(), key=lambda x: -x[1])[:6]}")

if __name__ == "__main__":
    main()
