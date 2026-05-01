#!/usr/bin/env python3
"""
Reyco Marine — Tech-Scan Batch SEO Audit
Parses all *.txt files in the tech-scans directory and produces
a severity-ranked CSV + summary markdown.

Usage:
    python3 tech-scan-audit.py <tech-scans-dir> [--out <output-dir>]
"""

import os
import re
import csv
import sys
from pathlib import Path
from datetime import datetime

# --- Config ---------------------------------------------------------------

TITLE_MAX = 60
TITLE_MIN = 20
DESC_MAX = 155
DESC_MIN = 50

GENERIC_DESC_FRAGMENTS = [
    "boats, motors, lawn and snow",
    "Reyco Marine & Small Engine Ltd.",
    "Reyco Marine &amp; Small Engine Ltd.",
]

GENERIC_TITLE_FRAGMENTS = [
    "Reyco Marine & Small Engine Ltd.",
    "Reyco Marine &amp; Small Engine Ltd.",
]

STAGING_DOMAIN = "reyco.glvmarketing.ca"
PRODUCTION_DOMAIN = "reycomarine.com"

# --- Parser ---------------------------------------------------------------

def parse_tech_scan(filepath: Path) -> dict:
    """Parse a tech-scan .txt file into a structured dict."""
    raw = filepath.read_text(encoding="utf-8", errors="replace")

    def extract(pattern, default=""):
        m = re.search(pattern, raw, re.MULTILINE)
        return m.group(1).strip() if m else default

    # Use non-greedy horizontal-whitespace extract to avoid consuming newlines
    raw = raw

    def extract_int(pattern, default=0):
        m = re.search(pattern, raw, re.MULTILINE)
        return int(m.group(1)) if m else default

    file_path = extract(r"^FILE:\s*(.+)$")
    title = extract(r"^TITLE:\s*(.*)$")
    meta_desc = extract(r"^META_DESC:\s*(.*)$")
    meta_desc_len = extract_int(r"^META_DESC_LEN:\s*(\d+)")
    h1_count = extract_int(r"^H1_COUNT:\s*(\d+)")
    h1_text = extract(r"^H1_TEXT:[ \t]*(.*)$")
    h2_count = extract_int(r"^H2_COUNT:\s*(\d+)")
    schema_blocks = extract_int(r"^SCHEMA_BLOCKS:\s*(\d+)")
    canonical = extract(r"^CANONICAL:\s*(.*)$")
    broken_img = extract_int(r"^BROKEN_IMG:\s*(\d+)")
    alt_empty = extract_int(r"^ALT_EMPTY:\s*(\d+)")
    alt_total = extract_int(r"^ALT_TOTAL:\s*(\d+)")
    ext_links = extract_int(r"^EXT_LINKS:\s*(\d+)")
    int_links = extract_int(r"^INT_LINKS:\s*(\d+)")
    php_err = extract_int(r"^PHP_ERR:\s*(\d+)")
    empty_state = extract_int(r"^EMPTY_STATE_FIRES:\s*(\d+)")

    # Derive slug/URL from filename
    slug = filepath.stem  # e.g. _boats_and_marine_
    url_slug = slug.strip("_").replace("_", "/")

    return {
        "file": filepath.name,
        "slug": slug,
        "url_path": f"/{url_slug}/",
        "title": title,
        "meta_desc": meta_desc,
        "meta_desc_len": meta_desc_len,
        "h1_count": h1_count,
        "h1_text": h1_text,
        "h2_count": h2_count,
        "schema_blocks": schema_blocks,
        "canonical": canonical,
        "broken_img": broken_img,
        "alt_empty": alt_empty,
        "alt_total": alt_total,
        "ext_links": ext_links,
        "int_links": int_links,
        "php_err": php_err,
        "empty_state": empty_state,
    }

# --- Severity checks ------------------------------------------------------

def is_generic(text: str, fragments: list) -> bool:
    return any(f.lower() in text.lower() for f in fragments)


def title_severity(title: str) -> tuple[str, str]:
    if not title:
        return "P1", "MISSING — no title tag"
    t = re.sub(r"&amp;", "&", title)
    # For pages, brand suffix is normal ("Page Name – Reyco Marine & Small Engine Ltd.")
    # Generic only when title IS the brand name alone (no page-specific prefix before separator)
    for sep in [" – ", " — ", " | ", " - "]:
        if sep in t:
            prefix = t.split(sep)[0].strip()
            if not prefix or prefix.lower() in {"home", "reyco marine"}:
                return "P1", f"GENERIC — no page-specific prefix: '{t[:70]}'"
            break
    else:
        # No separator — entire title is the page name; check if it's just the brand
        if is_generic(t, GENERIC_TITLE_FRAGMENTS) and len(t) < 50:
            return "P1", f"GENERIC — brand-only title: '{t[:70]}'"
    if len(t) > TITLE_MAX:
        return "P2", f"LONG — {len(t)} chars (>{TITLE_MAX})"
    if len(t) < TITLE_MIN:
        return "P2", f"SHORT — {len(t)} chars (<{TITLE_MIN})"
    return "OK", f"OK — {len(t)} chars"


def desc_severity(desc: str) -> tuple[str, str]:
    if not desc:
        return "P1", "MISSING — no meta description"
    d = re.sub(r"&amp;", "&", desc)
    if is_generic(d, GENERIC_DESC_FRAGMENTS):
        return "P1", "GENERIC — site-wide fallback meta"
    if len(d) > DESC_MAX:
        return "P2", f"LONG — {len(d)} chars (>{DESC_MAX})"
    if len(d) < DESC_MIN:
        return "P2", f"SHORT — {len(d)} chars (<{DESC_MIN})"
    return "OK", f"OK — {len(d)} chars"


def h1_severity(h1_count: int, h1_text: str) -> tuple[str, str]:
    if h1_count == 0:
        return "P1", "MISSING — no H1 tag"
    if h1_count > 1:
        return "P2", f"MULTIPLE — {h1_count} H1s (should be 1)"
    if not h1_text.strip():
        return "P2", "H1_EMPTY_TEXT — H1 present but text blank (JS render issue)"
    return "OK", f"OK — '{h1_text[:60]}'"


def canonical_severity(canonical: str) -> tuple[str, str]:
    if not canonical:
        return "P1", "MISSING — no canonical tag"
    if STAGING_DOMAIN in canonical:
        return "P2", f"STAGING_DOMAIN — canonical points to {STAGING_DOMAIN} (needs reycomarine.com post-launch)"
    if PRODUCTION_DOMAIN in canonical:
        return "OK", "OK — canonical to production domain"
    return "P2", f"UNKNOWN_DOMAIN — canonical: {canonical[:80]}"


def alt_severity(alt_empty: int, alt_total: int) -> tuple[str, str]:
    if alt_total == 0:
        return "OK", "OK — no images"
    if alt_empty == alt_total:
        return "P1", f"ALL_ALT_EMPTY — {alt_empty}/{alt_total} images"
    if alt_empty > 0:
        return "P2", f"PARTIAL_ALT — {alt_empty}/{alt_total} images"
    return "OK", f"OK — {alt_total}/{alt_total} with alt"


def schema_severity(schema_blocks: int) -> tuple[str, str]:
    if schema_blocks == 0:
        return "P2", "NO_SCHEMA — zero JSON-LD blocks"
    return "OK", f"OK — {schema_blocks} schema block(s)"


def php_severity(php_err: int) -> tuple[str, str]:
    if php_err > 0:
        return "P1", f"PHP_ERROR — {php_err} PHP error(s) in page output"
    return "OK", "OK"


def empty_state_severity(empty_state: int) -> tuple[str, str]:
    if empty_state > 3:
        return "P2", f"EMPTY_STATES — {empty_state} empty-state components fired (WC feed gap?)"
    if empty_state > 0:
        return "P2", f"EMPTY_STATES — {empty_state} empty-state(s)"
    return "OK", "OK"


def severity_rank(s: str) -> int:
    return {"P0": 0, "P1": 1, "P2": 2, "OK": 3}.get(s, 4)


def worst_severity(sevs: list) -> str:
    return min(sevs, key=severity_rank)

# --- Main -----------------------------------------------------------------

def audit(scans_dir: Path, out_dir: Path) -> None:
    files = sorted(scans_dir.glob("*.txt"))
    print(f"Tech-scan files found: {len(files)}")

    timestamp = datetime.now().strftime("%Y%m%d-%H%M")
    out_csv = out_dir / f"tech-scan-audit-{timestamp}.csv"
    out_md = out_dir / f"tech-scan-audit-{timestamp}-summary.md"

    fieldnames = [
        "file", "url_path",
        "title_sev", "title_finding", "title",
        "desc_sev", "desc_finding",
        "h1_sev", "h1_finding",
        "canonical_sev", "canonical_finding",
        "alt_sev", "alt_finding",
        "schema_sev", "schema_finding",
        "php_sev", "php_finding",
        "empty_state_sev", "empty_state_finding",
        "overall_sev",
    ]

    rows = []
    counts = {"P1": 0, "P2": 0, "OK": 0}

    for f in files:
        p = parse_tech_scan(f)

        t_sev, t_find = title_severity(p["title"])
        d_sev, d_find = desc_severity(p["meta_desc"])
        h_sev, h_find = h1_severity(p["h1_count"], p["h1_text"])
        c_sev, c_find = canonical_severity(p["canonical"])
        a_sev, a_find = alt_severity(p["alt_empty"], p["alt_total"])
        s_sev, s_find = schema_severity(p["schema_blocks"])
        php_sev, php_find = php_severity(p["php_err"])
        es_sev, es_find = empty_state_severity(p["empty_state"])

        overall = worst_severity([t_sev, d_sev, h_sev, c_sev, a_sev, s_sev, php_sev, es_sev])
        counts[overall] = counts.get(overall, 0) + 1

        rows.append({
            "file": p["file"],
            "url_path": p["url_path"],
            "title_sev": t_sev, "title_finding": t_find, "title": p["title"][:80],
            "desc_sev": d_sev, "desc_finding": d_find,
            "h1_sev": h_sev, "h1_finding": h_find,
            "canonical_sev": c_sev, "canonical_finding": c_find,
            "alt_sev": a_sev, "alt_finding": a_find,
            "schema_sev": s_sev, "schema_finding": s_find,
            "php_sev": php_sev, "php_finding": php_find,
            "empty_state_sev": es_sev, "empty_state_finding": es_find,
            "overall_sev": overall,
        })

    rows.sort(key=lambda r: (severity_rank(r["overall_sev"]), r["url_path"]))

    import csv as csv_mod
    with open(out_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv_mod.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    print(f"CSV written: {out_csv}")

    # --- Systemic findings ---
    total = len(rows)
    p1_rows = [r for r in rows if r["overall_sev"] == "P1"]
    p2_rows = [r for r in rows if r["overall_sev"] == "P2"]
    ok_rows = [r for r in rows if r["overall_sev"] == "OK"]

    generic_desc = sum(1 for r in rows if "GENERIC" in r["desc_finding"])
    missing_desc = sum(1 for r in rows if "MISSING" in r["desc_finding"])
    generic_title = sum(1 for r in rows if "GENERIC" in r["title_finding"])
    missing_h1 = sum(1 for r in rows if r["h1_sev"] == "P1" and "MISSING" in r["h1_finding"])
    empty_h1 = sum(1 for r in rows if "H1_EMPTY_TEXT" in r["h1_finding"])
    staging_canonical = sum(1 for r in rows if "STAGING_DOMAIN" in r["canonical_finding"])
    missing_canonical = sum(1 for r in rows if "MISSING" in r["canonical_finding"])
    alt_issues = sum(1 for r in rows if r["alt_sev"] in ("P1", "P2"))
    no_schema = sum(1 for r in rows if r["schema_sev"] == "P2")
    php_errors = sum(1 for r in rows if r["php_sev"] == "P1")
    empty_states = sum(1 for r in rows if r["empty_state_sev"] == "P2")

    with open(out_md, "w", encoding="utf-8") as f:
        f.write(f"# Reyco Marine — Tech-Scan Batch SEO Audit\n")
        f.write(f"**Run:** {datetime.now().strftime('%Y-%m-%d %H:%M UTC')}  \n")
        f.write(f"**Pages audited:** {total} (from tech-scans HTML dumps)  \n\n---\n\n")

        f.write(f"## Severity Summary\n\n")
        f.write(f"| Severity | Count | % |\n|----------|-------|---|\n")
        f.write(f"| P1 — Fix immediately | {counts.get('P1',0)} | {counts.get('P1',0)/total*100:.0f}% |\n")
        f.write(f"| P2 — Fix this sprint | {counts.get('P2',0)} | {counts.get('P2',0)/total*100:.0f}% |\n")
        f.write(f"| OK — No action | {counts.get('OK',0)} | {counts.get('OK',0)/total*100:.0f}% |\n\n")

        f.write(f"## Systemic Findings (>50% hit = dev ticket candidate)\n\n")
        f.write(f"| Check | Count | % | Ticket? |\n|-------|-------|---|---------|\n")
        f.write(f"| Generic meta description | {generic_desc} | {generic_desc/total*100:.0f}% | {'YES — P1 systemic' if generic_desc/total > 0.5 else 'No'} |\n")
        f.write(f"| Missing meta description | {missing_desc} | {missing_desc/total*100:.0f}% | {'YES' if missing_desc/total > 0.5 else 'No'} |\n")
        f.write(f"| Generic title | {generic_title} | {generic_title/total*100:.0f}% | {'YES — P1 systemic' if generic_title/total > 0.5 else 'No'} |\n")
        f.write(f"| Missing H1 | {missing_h1} | {missing_h1/total*100:.0f}% | {'YES' if missing_h1/total > 0.5 else 'No'} |\n")
        f.write(f"| H1 empty text (JS render) | {empty_h1} | {empty_h1/total*100:.0f}% | {'YES — systemic JS render issue' if empty_h1/total > 0.5 else 'No'} |\n")
        f.write(f"| Staging-domain canonical | {staging_canonical} | {staging_canonical/total*100:.0f}% | {'YES — post-launch fix' if staging_canonical/total > 0.5 else 'No'} |\n")
        f.write(f"| Missing canonical | {missing_canonical} | {missing_canonical/total*100:.0f}% | {'YES' if missing_canonical/total > 0.5 else 'No'} |\n")
        f.write(f"| Alt text issues | {alt_issues} | {alt_issues/total*100:.0f}% | {'YES' if alt_issues/total > 0.5 else 'No'} |\n")
        f.write(f"| No schema blocks | {no_schema} | {no_schema/total*100:.0f}% | {'YES' if no_schema/total > 0.5 else 'No'} |\n")
        f.write(f"| PHP errors | {php_errors} | {php_errors/total*100:.0f}% | {'YES — critical' if php_errors > 0 else 'No'} |\n")
        f.write(f"| Empty-state fires | {empty_states} | {empty_states/total*100:.0f}% | {'YES — WC category feed gap' if empty_states/total > 0.5 else 'No'} |\n\n")

        f.write(f"## Top P1 Pages (first 30)\n\n")
        f.write(f"| URL | Title finding | Desc finding | H1 finding |\n")
        f.write(f"|-----|--------------|-------------|------------|\n")
        for r in p1_rows[:30]:
            f.write(f"| {r['url_path'][:50]} | {r['title_finding'][:45]} | {r['desc_finding'][:45]} | {r['h1_finding'][:35]} |\n")
        if len(p1_rows) > 30:
            f.write(f"\n*...and {len(p1_rows)-30} more P1 pages — see CSV.*\n")

        f.write(f"\n## All P2 Pages ({len(p2_rows)} total)\n\n")
        f.write(f"| URL | Worst finding |\n|-----|---------------|\n")
        for r in p2_rows[:50]:
            worst_find = next((r[k] for k in ["php_finding","alt_finding","h1_finding","desc_finding","title_finding","canonical_finding","schema_finding","empty_state_finding"] if r.get(k.replace("_finding","_sev"),"OK") not in ("OK","")), "")
            f.write(f"| {r['url_path'][:55]} | {worst_find[:60]} |\n")

        f.write(f"\n---\n\n*Full results: {out_csv.name}*\n")
        f.write(f"*No external actions taken. Audit only.*\n")

    print(f"Summary written: {out_md}")
    print(f"\n--- QUICK STATS ---")
    print(f"Total: {total} | P1: {counts.get('P1',0)} | P2: {counts.get('P2',0)} | OK: {counts.get('OK',0)}")
    print(f"Generic desc: {generic_desc} | Generic title: {generic_title} | Staging canonical: {staging_canonical}")
    print(f"Missing H1: {missing_h1} | Empty H1: {empty_h1} | No schema: {no_schema} | PHP errors: {php_errors}")
    return counts, generic_desc, generic_title, staging_canonical, missing_h1, empty_h1, no_schema, php_errors, empty_states, total


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("scans_dir", type=Path)
    parser.add_argument("--out", type=Path, default=None)
    args = parser.parse_args()

    out = args.out or args.scans_dir.parent.parent
    out.mkdir(parents=True, exist_ok=True)
    audit(args.scans_dir, out)
