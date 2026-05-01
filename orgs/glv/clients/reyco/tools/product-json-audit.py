#!/usr/bin/env python3
"""
Reyco Marine — WC Product JSON Audit (Tier 1)
Parses products-export-{timestamp}.json from the admin PHP export.
Outputs severity-ranked CSV + console summary.

Usage:
    python3 product-json-audit.py <path-to-products-export.json>

Output files (written next to input):
    products-audit-{timestamp}.csv   — per-product findings
    products-audit-{timestamp}-summary.md — aggregate report
"""

import json
import csv
import sys
import re
from pathlib import Path
from datetime import datetime

# --- Config ---------------------------------------------------------------

# SEO meta keys to check (in priority order — first match wins)
SEO_TITLE_KEYS = [
    "rank_math_title",
    "_rank_math_title",
    "rank_math_seo_title",
    "_yoast_wpseo_title",
    "_aioseop_title",
    "_seo_title",
    "_meta_title",
    "_reyco_meta_title",
]

SEO_DESC_KEYS = [
    "rank_math_description",
    "_rank_math_description",
    "_yoast_wpseo_metadesc",
    "_aioseop_description",
    "_seo_description",
    "_meta_description",
    "_reyco_meta_description",
]

TITLE_MAX = 60      # chars before SERP truncation
TITLE_MIN = 20      # below this = likely placeholder
DESC_MAX = 155      # chars before SERP truncation
DESC_MIN = 50       # below this = too short

SLUG_MAX = 75       # long slugs = crawl budget waste

# Generic meta desc (same as site-wide fallback found in 80/103 pages)
GENERIC_META_FRAGMENTS = [
    "boats, motors, lawn and snow",
    "Reyco Marine & Small Engine Ltd.",
]

GENERIC_TITLE_FRAGMENTS = [
    "Reyco Marine",
    "Small Engine Ltd",
]

# --- Helpers --------------------------------------------------------------

def get_meta(meta_data: list, keys: list) -> str:
    """Extract first matching meta value from meta_data array."""
    if not meta_data:
        return ""
    meta_map = {item.get("key", ""): item.get("value", "") for item in meta_data}
    for key in keys:
        val = meta_map.get(key, "")
        if val and str(val).strip():
            return str(val).strip()
    return ""


def is_generic(text: str, fragments: list) -> bool:
    return any(frag.lower() in text.lower() for frag in fragments)


def title_severity(title: str, product_name: str) -> tuple[str, str]:
    """Return (severity, finding) for meta title."""
    if not title:
        return "P1", "MISSING — no SEO meta title key found; WC product name will be used as fallback"
    # Generic site-name-only title (SEO plugin template didn't resolve)
    if is_generic(title, GENERIC_TITLE_FRAGMENTS):
        # Check if any meaningful product-specific word appears
        stop = {"the", "and", "for", "of", "in", "a", "an", "to", "at", "on"}
        product_words = {w.lower() for w in re.split(r"\W+", product_name) if len(w) > 2 and w.lower() not in stop}
        title_words = {w.lower() for w in re.split(r"\W+", title)}
        if not product_words.intersection(title_words):
            return "P1", f"GENERIC_TITLE — brand-only title, no product signal: '{title[:60]}'"
    if len(title) > TITLE_MAX:
        return "P2", f"LONG — {len(title)} chars (>{TITLE_MAX}), will truncate in SERPs"
    if len(title) < TITLE_MIN:
        return "P2", f"SHORT — {len(title)} chars (<{TITLE_MIN}), likely placeholder"
    return "OK", f"OK — {len(title)} chars"


def desc_severity(desc: str) -> tuple[str, str]:
    """Return (severity, finding) for meta description."""
    if not desc:
        return "P1", "MISSING — no custom meta description"
    if is_generic(desc, GENERIC_META_FRAGMENTS):
        return "P1", "GENERIC — site-wide fallback meta (same as 80 WP pages)"
    if len(desc) > DESC_MAX:
        return "P2", f"LONG — {len(desc)} chars (>{DESC_MAX}), will truncate in SERPs"
    if len(desc) < DESC_MIN:
        return "P2", f"SHORT — {len(desc)} chars (<{DESC_MIN})"
    return "OK", f"OK — {len(desc)} chars"


def alt_severity(images: list) -> tuple[str, str, int, int]:
    """Return (severity, finding, empty_count, total_count)."""
    if not images:
        return "P1", "NO_IMAGE — product has no images", 0, 0
    total = len(images)
    empty = sum(1 for img in images if not img.get("alt", "").strip())
    if empty == total:
        return "P1", f"ALL_ALT_EMPTY — {empty}/{total} images have empty alt", empty, total
    if empty > 0:
        return "P2", f"PARTIAL_ALT — {empty}/{total} images have empty alt", empty, total
    return "OK", f"OK — {total}/{total} images have alt text", empty, total


def category_severity(categories: list) -> tuple[str, str]:
    if not categories:
        return "P1", "UNCATEGORISED — no product_cat assigned; carousel routing broken"
    names = [c.get("name", "") for c in categories if c.get("name")]
    return "OK", f"OK — {', '.join(names)}"


def slug_severity(slug: str) -> tuple[str, str]:
    if len(slug) > SLUG_MAX:
        return "P2", f"LONG_SLUG — {len(slug)} chars (>{SLUG_MAX})"
    return "OK", f"OK — {len(slug)} chars"


def short_desc_severity(short_desc: str) -> tuple[str, str]:
    cleaned = re.sub(r"<[^>]+>", "", short_desc or "").strip()
    if not cleaned:
        return "P2", "MISSING_SHORT_DESC — no short description (used in product cards)"
    if len(cleaned) < 20:
        return "P2", f"SHORT_SHORT_DESC — only {len(cleaned)} chars"
    return "OK", f"OK — {len(cleaned)} chars"


def severity_rank(s: str) -> int:
    return {"P0": 0, "P1": 1, "P2": 2, "OK": 3}.get(s, 4)


def worst_severity(severities: list) -> str:
    return min(severities, key=severity_rank)

# --- Main -----------------------------------------------------------------

def audit(json_path: Path) -> None:
    print(f"Loading: {json_path}")
    with open(json_path) as f:
        products = json.load(f)

    if not isinstance(products, list):
        # Some exports wrap in {"products": [...]}
        products = products.get("products", [])

    print(f"Products loaded: {len(products)}")

    timestamp = datetime.now().strftime("%Y%m%d-%H%M")
    out_csv = json_path.parent / f"products-audit-{timestamp}.csv"
    out_md = json_path.parent / f"products-audit-{timestamp}-summary.md"

    fieldnames = [
        "id", "slug", "name",
        "title_severity", "title_finding", "seo_title",
        "desc_severity", "desc_finding",
        "alt_severity", "alt_finding", "alt_empty", "alt_total",
        "category_severity", "category_finding",
        "slug_severity", "slug_finding",
        "short_desc_severity", "short_desc_finding",
        "overall_severity",
    ]

    rows = []
    counts = {"P0": 0, "P1": 0, "P2": 0, "OK": 0}

    for p in products:
        pid = p.get("id", "")
        slug = p.get("slug", "")
        name = p.get("name", p.get("post_title", ""))
        meta_data = p.get("meta_data", [])
        images = p.get("images", [])
        categories = p.get("categories", [])
        short_desc = p.get("short_description", "")

        seo_title = get_meta(meta_data, SEO_TITLE_KEYS)
        seo_desc = get_meta(meta_data, SEO_DESC_KEYS)

        t_sev, t_find = title_severity(seo_title, name)
        d_sev, d_find = desc_severity(seo_desc)
        a_sev, a_find, a_empty, a_total = alt_severity(images)
        c_sev, c_find = category_severity(categories)
        sl_sev, sl_find = slug_severity(slug)
        sd_sev, sd_find = short_desc_severity(short_desc)

        overall = worst_severity([t_sev, d_sev, a_sev, c_sev, sl_sev, sd_sev])
        counts[overall] = counts.get(overall, 0) + 1

        rows.append({
            "id": pid,
            "slug": slug,
            "name": name,
            "title_severity": t_sev,
            "title_finding": t_find,
            "seo_title": seo_title[:80] if seo_title else "",
            "desc_severity": d_sev,
            "desc_finding": d_find,
            "alt_severity": a_sev,
            "alt_finding": a_find,
            "alt_empty": a_empty,
            "alt_total": a_total,
            "category_severity": c_sev,
            "category_finding": c_find,
            "slug_severity": sl_sev,
            "slug_finding": sl_find,
            "short_desc_severity": sd_sev,
            "short_desc_finding": sd_find,
            "overall_severity": overall,
        })

    # Sort by overall severity (P1 first, then P2, then OK)
    rows.sort(key=lambda r: (severity_rank(r["overall_severity"]), r["slug"]))

    with open(out_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"CSV written: {out_csv}")

    # --- Summary report ---
    total = len(products)
    p1_rows = [r for r in rows if r["overall_severity"] == "P1"]
    p2_rows = [r for r in rows if r["overall_severity"] == "P2"]
    ok_rows = [r for r in rows if r["overall_severity"] == "OK"]

    # Per-check counts
    title_missing = sum(1 for r in rows if r["title_severity"] == "P1")
    title_issues = sum(1 for r in rows if r["title_severity"] in ("P1", "P2"))
    desc_missing = sum(1 for r in rows if r["desc_severity"] == "P1")
    desc_issues = sum(1 for r in rows if r["desc_severity"] in ("P1", "P2"))
    alt_issues = sum(1 for r in rows if r["alt_severity"] in ("P1", "P2"))
    no_image = sum(1 for r in rows if r["alt_finding"].startswith("NO_IMAGE"))
    uncategorised = sum(1 for r in rows if r["category_severity"] == "P1")
    no_short_desc = sum(1 for r in rows if r["short_desc_severity"] == "P2")

    with open(out_md, "w", encoding="utf-8") as f:
        f.write(f"# Reyco Marine — WC Product SEO Audit (Tier 1 JSON)\n")
        f.write(f"**Run:** {datetime.now().strftime('%Y-%m-%d %H:%M UTC')}  \n")
        f.write(f"**Source:** {json_path.name}  \n")
        f.write(f"**Products audited:** {total}  \n\n")
        f.write(f"---\n\n")
        f.write(f"## Severity Summary\n\n")
        f.write(f"| Severity | Count | % |\n|----------|-------|---|\n")
        f.write(f"| P1 — Fix immediately | {counts.get('P1',0)} | {counts.get('P1',0)/total*100:.0f}% |\n")
        f.write(f"| P2 — Fix this sprint | {counts.get('P2',0)} | {counts.get('P2',0)/total*100:.0f}% |\n")
        f.write(f"| OK — No action | {counts.get('OK',0)} | {counts.get('OK',0)/total*100:.0f}% |\n\n")
        f.write(f"## Per-Check Breakdown\n\n")
        f.write(f"| Check | Issues | Notes |\n|-------|--------|-------|\n")
        f.write(f"| Meta title missing | {title_missing} | No SEO title key in meta_data |\n")
        f.write(f"| Meta title any issue | {title_issues} | Missing + long + short |\n")
        f.write(f"| Meta description missing | {desc_missing} | No custom meta desc |\n")
        f.write(f"| Meta description any issue | {desc_issues} | Missing + generic + long |\n")
        f.write(f"| Alt text issues | {alt_issues} | Empty alt or no image |\n")
        f.write(f"| No product image | {no_image} | Product has zero images |\n")
        f.write(f"| Uncategorised products | {uncategorised} | No product_cat — carousel routing broken |\n")
        f.write(f"| Missing short description | {no_short_desc} | Empty short desc — product card gap |\n\n")
        f.write(f"## Top P1 Products (first 20)\n\n")
        f.write(f"| ID | Slug | Title finding | Desc finding | Alt finding |\n")
        f.write(f"|----|------|--------------|-------------|-------------|\n")
        for r in p1_rows[:20]:
            f.write(f"| {r['id']} | {r['slug'][:50]} | {r['title_finding'][:50]} | {r['desc_finding'][:50]} | {r['alt_finding'][:40]} |\n")
        if len(p1_rows) > 20:
            f.write(f"\n*...and {len(p1_rows)-20} more P1 products — see CSV.*\n")
        f.write(f"\n---\n\n*Full results: {out_csv.name}*\n")
        f.write(f"*No external actions taken. Audit only.*\n")

    print(f"Summary written: {out_md}")
    print(f"\n--- QUICK STATS ---")
    print(f"Total: {total} | P1: {counts.get('P1',0)} | P2: {counts.get('P2',0)} | OK: {counts.get('OK',0)}")
    print(f"Meta title issues: {title_issues}/{total} | Meta desc issues: {desc_issues}/{total}")
    print(f"Alt text issues: {alt_issues}/{total} | Uncategorised: {uncategorised}/{total}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(f"Usage: python3 {sys.argv[0]} <products-export.json>")
        sys.exit(1)
    audit(Path(sys.argv[1]))
