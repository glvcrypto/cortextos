#!/usr/bin/env python3
"""Titan v3 — retry mocks #1 split + #2 interior with tighter prompts. fal.ai NB2 1K, $0.16."""
import json
import os
import pathlib
import time
import urllib.error
import urllib.request

FAL_KEY = os.environ["FAL_KEY"]
RUN_DIR = pathlib.Path(__file__).parent
OUT_BASE = pathlib.Path(
    "/home/aiden/cortextos/orgs/glv/clients/titan/deliverables/campaigns/"
    "2026-04-titan-creative-bundle/rough-mocks-v3"
)

SUBMIT_URL = "https://queue.fal.run/fal-ai/nano-banana"
HEADERS = {"Authorization": f"Key {FAL_KEY}", "Content-Type": "application/json"}

MOCKS = [
    {
        "slug": "angle-1-affordability/01-split-comparison",
        "prompt": (
            "A single 1:1 square Meta advertisement, full-bleed photo composition "
            "(NO white margins, NO infographic card layout, NO border). The image is one "
            "photograph divided vertically down the middle into two equal halves: "
            "LEFT HALF (full-bleed photo): a traditional Ontario suburban brick house, "
            "two-story, slightly desaturated mid-day flat light. Overlaid directly on this "
            "photo near the top, large bold white sans-serif text with a soft black drop "
            "shadow for legibility, reading exactly '$700,000' as the largest text, with "
            "smaller white text directly below reading exactly 'Average Ontario home, 2026'. "
            "RIGHT HALF (full-bleed photo): a modern dark forest green custom-built tiny "
            "home with black metal roof and large windows, set in a northern Ontario pine "
            "clearing at golden hour. Overlaid directly on this photo near the top, large "
            "bold white sans-serif text with a soft black drop shadow for legibility, "
            "reading exactly '$150,000' as the largest text (the dollar sign MUST be "
            "rendered before the number), with smaller white text directly below reading "
            "exactly 'Built in Ontario. Built to last.' "
            "Both halves photo edges meet at the centerline. No people, no logos, no "
            "infographic layout, no white background — text sits ON the photo."
        ),
    },
    {
        "slug": "angle-1-affordability/02-interior-detail",
        "prompt": (
            "Photorealistic interior advertising photograph, 1:1 square, full-bleed (no "
            "borders or margins). A premium custom-built tiny home kitchen and living area, "
            "warm natural light through a large window, light wood cabinetry, white quartz "
            "countertop, butcher block accent, induction cooktop, exposed timber ceiling, "
            "fresh herbs in a bowl, steaming ceramic mug, an open magazine on the counter. "
            "Across the upper portion of the image, overlaid on a subtle dark gradient band "
            "that ensures legibility, large bold white sans-serif text reading exactly "
            "'Ontario Building Code. Full certification.' as the headline. Directly below, "
            "in solid opaque white sans-serif text (NOT semi-transparent, NOT faded, with a "
            "soft black drop shadow) reading exactly 'Not a shed. Not a trailer. A home.' "
            "Both lines must be sharp, fully legible, high contrast. Premium magazine-ad "
            "feel. No people, no logos."
        ),
    },
]


def http(method, url, data=None):
    req = urllib.request.Request(url, method=method, headers=HEADERS)
    body = json.dumps(data).encode() if data is not None else None
    try:
        with urllib.request.urlopen(req, data=body, timeout=180) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        try:
            return {"_http_error": e.code, **json.loads(e.read())}
        except Exception:
            return {"_http_error": e.code, "raw": str(e)}


def fire(mock):
    payload = {
        "prompt": mock["prompt"],
        "num_images": 1,
        "aspect_ratio": "1:1",
        "resolution": "1K",
        "output_format": "jpeg",
        "safety_tolerance": 4,
        "enable_web_search": False,
        "enable_google_search": False,
    }
    print(f"\n[{mock['slug']}] SUBMIT", flush=True)
    sub = http("POST", SUBMIT_URL, payload)
    if "_http_error" in sub:
        return {"slug": mock["slug"], "error": sub}
    status_url = sub["status_url"]
    response_url = sub["response_url"]

    deadline = time.time() + 240
    while time.time() < deadline:
        s = http("GET", status_url)
        if s.get("status") == "COMPLETED":
            break
        if s.get("status") in ("FAILED", "ERROR"):
            return {"slug": mock["slug"], "error": s}
        time.sleep(3)

    r = http("GET", response_url)
    if r.get("_http_error"):
        return {"slug": mock["slug"], "error": r}
    imgs = r.get("images", [])
    if not imgs:
        return {"slug": mock["slug"], "error": "no images returned", "raw": r}

    dest = OUT_BASE / f"{mock['slug']}.jpg"
    dest.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(imgs[0]["url"], timeout=120) as resp:
        dest.write_bytes(resp.read())
    print(f"[{mock['slug']}] saved {dest} ({dest.stat().st_size} bytes)", flush=True)
    return {"slug": mock["slug"], "path": str(dest), "size": dest.stat().st_size}


def main():
    results = []
    for m in MOCKS:
        results.append(fire(m))

    log = RUN_DIR / "run-v3-log.json"
    log.write_text(json.dumps(results, indent=2))
    ok = sum(1 for r in results if "path" in r)
    err = sum(1 for r in results if "error" in r)
    print(f"\nrun complete; log: {log}")
    print(f"  ok: {ok}/{len(MOCKS)}")
    print(f"  err: {err}")


if __name__ == "__main__":
    main()
