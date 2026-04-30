#!/usr/bin/env python3
"""Build product-image-audit-2026-04-23.csv per boss dispatch 1776992800688-boss-bx121.

Source: 2026-04-23_product-image-qc.csv (361 rows, 250 distinct SKUs; 125 with images).
Output: product-image-audit-2026-04-23.csv per boss schema + threshold doc header.

Thresholds applied (boss-suggested, observed distribution from 125 with-image rows:
  <5%: 48, 5-20%: 14, >20%: 63 — good spread, no adjustment needed):
- Aspect deviation <5%  → aspect_1to1_pass=pass, action_needed=none
- Aspect deviation 5-20% → aspect_1to1_pass=fail, action_needed=designer_qc_edge_case
- Aspect deviation >20% → aspect_1to1_pass=fail, action_needed=re-crop_to_square
- No image → aspect_1to1_pass=n/a, action_needed=request_from_dealer
"""
import csv
import re
from pathlib import Path
from urllib.parse import urlparse

SRC = Path("/home/aiden/cortextos/orgs/glv/clients/reyco/deliverables/qc/2026-04-23_product-image-qc.csv")
DST = Path("/home/aiden/cortextos/orgs/glv/clients/reyco/audit/product-image-audit-2026-04-23.csv")

# dealer filename-prefix heuristic (all images are hosted on reyco.glvmarketing.ca so
# domain alone can't verify; filename prefix identifies OEM-sourced originals)
DEALER_PATTERNS = [
    (re.compile(r"^MM_", re.I), "Mercury Marine"),
    (re.compile(r"^HS[-_]", re.I), "Hisun"),
    (re.compile(r"^EC[-_]", re.I), "Echo"),
    (re.compile(r"^CN[-_]", re.I), "Cannon"),
    (re.compile(r"^HB[-_]", re.I), "Humminbird"),
    (re.compile(r"^MK[-_]", re.I), "Minnkota"),
    (re.compile(r"^CC[-_]", re.I), "Cub Cadet"),
    (re.compile(r"^TORO[-_]", re.I), "Toro"),
    (re.compile(r"^PC[-_]", re.I), "Princecraft"),
    (re.compile(r"^BC[-_]", re.I), "Bercomac"),
]


def verify_dealer(url: str) -> str:
    """yes | unknown — based on filename prefix matching known OEM codes."""
    if not url:
        return "n/a"
    fn = urlparse(url).path.rsplit("/", 1)[-1]
    for pat, _name in DEALER_PATTERNS:
        if pat.search(fn):
            return "yes"
    return "unknown"


def aspect_ratio_label(w: int, h: int) -> str:
    if not w or not h:
        return "n/a"
    if w == h:
        return "1:1"
    if w > h:
        return f"{round(w/h, 2)}:1 landscape"
    return f"1:{round(h/w, 2)} portrait"


def classify(w: int, h: int, has_image: bool):
    """Returns (aspect_1to1_pass, action_needed)."""
    if not has_image:
        return "n/a", "request_from_dealer"
    if not w or not h:
        return "unknown", "designer_qc_edge_case"
    dev_pct = abs(w - h) / max(w, h) * 100
    if dev_pct < 5:
        return "pass", "none"
    if dev_pct <= 20:
        return "fail", "designer_qc_edge_case"
    return "fail", "re-crop_to_square"


def main():
    with SRC.open() as f:
        rows = list(csv.DictReader(f))

    # Dedupe to one row per SKU — prefer row with image, then largest dims, then lowest severity
    sev_rank = {"OK": 0, "MINOR": 1, "MODERATE": 2, "SEVERE": 3}
    by_sku: dict[str, dict] = {}
    for r in rows:
        sku = r["sku"]
        if not sku:
            continue
        w = int(r.get("image_w") or 0)
        h = int(r.get("image_h") or 0)
        has_img = bool(r.get("current_image_url"))
        score = (has_img, w * h, -sev_rank.get(r.get("severity", "SEVERE"), 3))
        prev = by_sku.get(sku)
        if not prev or score > prev["_score"]:
            by_sku[sku] = {**r, "_score": score}

    header_lines = [
        "# product-image-audit-2026-04-23.csv",
        "# Generated per boss dispatch 1776992800688-boss-bx121 (2026-04-23).",
        "# Source: 2026-04-23_product-image-qc.csv (aggregated by SKU).",
        "# Thresholds applied:",
        "#   aspect deviation <5%  -> aspect_1to1_pass=pass, action_needed=none",
        "#   aspect deviation 5-20% -> aspect_1to1_pass=fail, action_needed=designer_qc_edge_case",
        "#   aspect deviation >20% -> aspect_1to1_pass=fail, action_needed=re-crop_to_square",
        "#   no image             -> action_needed=request_from_dealer",
        "# Dealer-verification heuristic: filename prefix match against known OEM codes",
        "#   (MM/HS/EC/CN/HB/MK/CC/TORO/PC/BC). All images are WP-hosted on",
        "#   reyco.glvmarketing.ca; domain alone does not verify dealer source.",
        "# explicit_permission_on_file: default 'no' for all rows (forward-tracking only,",
        "#   no retroactive backfill per boss rule).",
    ]

    cols = [
        "sku", "current_image_in_WC", "current_image_url_or_path", "aspect_ratio",
        "aspect_1to1_pass", "source_verified_dealer", "explicit_permission_on_file",
        "action_needed", "image_w", "image_h", "brand", "product_name", "notes",
    ]

    out_rows = []
    tally = {"total": 0, "pass_clean": 0, "re_crop": 0, "request_dealer": 0, "designer_qc": 0}
    for sku in sorted(by_sku.keys()):
        r = by_sku[sku]
        w = int(r.get("image_w") or 0)
        h = int(r.get("image_h") or 0)
        url = r.get("current_image_url") or ""
        has_img = bool(url)
        aspect_pass, action = classify(w, h, has_img)
        out_rows.append({
            "sku": sku,
            "current_image_in_WC": "yes" if has_img else "no",
            "current_image_url_or_path": url,
            "aspect_ratio": aspect_ratio_label(w, h),
            "aspect_1to1_pass": aspect_pass,
            "source_verified_dealer": verify_dealer(url),
            "explicit_permission_on_file": "no",
            "action_needed": action,
            "image_w": w,
            "image_h": h,
            "brand": (r.get("brand") or "").replace("&amp;", "&"),
            "product_name": r.get("product_name") or "",
            "notes": r.get("notes") or r.get("current_image_issue") or "",
        })
        tally["total"] += 1
        if action == "none":
            tally["pass_clean"] += 1
        elif action == "re-crop_to_square":
            tally["re_crop"] += 1
        elif action == "request_from_dealer":
            tally["request_dealer"] += 1
        elif action == "designer_qc_edge_case":
            tally["designer_qc"] += 1

    DST.parent.mkdir(parents=True, exist_ok=True)
    with DST.open("w", newline="") as f:
        for line in header_lines:
            f.write(line + "\n")
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for row in out_rows:
            w.writerow(row)

    print(f"wrote {DST} — {tally['total']} SKU rows")
    print(f"  pass_clean:       {tally['pass_clean']}")
    print(f"  re_crop_needed:   {tally['re_crop']}")
    print(f"  request_dealer:   {tally['request_dealer']}")
    print(f"  designer_qc:      {tally['designer_qc']}")


if __name__ == "__main__":
    main()
