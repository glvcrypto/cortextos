#!/usr/bin/env python3
"""Titan ad creative v2 — text baked in, full-ad mocks. fal.ai NB2 1K, $0.48."""
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
    "2026-04-titan-creative-bundle/rough-mocks-v2"
)

SUBMIT_URL = "https://queue.fal.run/fal-ai/nano-banana"
HEADERS = {"Authorization": f"Key {FAL_KEY}", "Content-Type": "application/json"}

MOCKS = [
    {
        "slug": "angle-1-affordability/01-split-comparison",
        "prompt": (
            "Photorealistic split-screen Meta advertisement, 1:1 square. "
            "LEFT HALF: traditional Ontario suburban brick house, two-story, slightly "
            "desaturated mid-day flat light, with bold white sans-serif text overlay "
            "reading exactly '$700,000' as the largest centered text, with smaller white "
            "text directly below reading exactly 'Average Ontario home, 2026'. "
            "RIGHT HALF: modern dark forest green custom-built tiny home, black metal roof, "
            "large windows, set in northern Ontario pine clearing at golden hour, with bold "
            "white sans-serif text overlay reading exactly 'Starting under $150,000' as the "
            "largest centered text, with smaller white text directly below reading exactly "
            "'Built in Ontario. Built to last.' "
            "Clean magazine-ad typography, sharp legible text. No people, no logos."
        ),
    },
    {
        "slug": "angle-1-affordability/02-interior-detail",
        "prompt": (
            "Photorealistic interior advertising photograph, 1:1 square. A premium custom-"
            "built tiny home kitchen and living area, warm natural light through a large "
            "window, light wood cabinetry, white quartz countertop, butcher block accent, "
            "induction cooktop, exposed timber ceiling, fresh herbs in a bowl, steaming "
            "ceramic mug, an open magazine on the counter. "
            "Bold white sans-serif text overlay across the upper portion reading exactly "
            "'Ontario Building Code. Full certification.' as the largest text, with smaller "
            "white text directly below reading exactly 'Not a shed. Not a trailer. A home.' "
            "Sharp legible typography, premium magazine-ad feel. No people, no logos."
        ),
    },
    {
        "slug": "angle-1-affordability/03-tiny-home-hero",
        "prompt": (
            "Photorealistic hero advertising photograph, 1:1 square. A custom Ontario-built "
            "tiny home exterior, dark forest green vertical wood siding, black standing-seam "
            "metal roof, large rectangular windows, faint woodsmoke from chimney, on a grass "
            "clearing with mature white pines behind, soft golden-evening light. "
            "Bold white sans-serif text overlay reading exactly 'Talk to us. No pressure.' "
            "as the largest centered text, with smaller white text directly below reading "
            "exactly 'Get Pricing →'. "
            "Clean magazine-ad typography, sharp legible text. No people, no logos."
        ),
    },
    {
        "slug": "angle-2-downsizer/04-nature-setting",
        "prompt": (
            "Photorealistic landscape advertising photograph, 1:1 square. A small modern "
            "Canadian tiny home near a still northern Ontario lake at sunrise, tall white "
            "pines and brilliant red maples surrounding, mist rising off the lake, soft "
            "pink-gold sky, single warm-glowing window on the tiny home. Composition leaves "
            "ample negative space in the upper sky for text. "
            "Bold white serif text overlay across the upper sky reading exactly "
            "'Less house. More life.' as a single elegant centered headline. "
            "Clean magazine-ad typography, sharp legible text. No people, no logos."
        ),
    },
    {
        "slug": "angle-2-downsizer/05-lived-in-stilllife",
        "prompt": (
            "Photorealistic still-life advertising photograph, 1:1 square. The interior of "
            "a tiny home: a worn leather armchair near a small black wood stove, a stack of "
            "well-read hardcover books, an open journal, a steaming ceramic coffee mug, a "
            "chunky knit throw blanket. Snowy pines visible through a window. Warm morning "
            "light. "
            "Bold white serif text overlay reading exactly 'Built for the life you actually "
            "want.' as a single elegant centered headline. "
            "Clean magazine-ad typography, sharp legible text. No people, no logos."
        ),
    },
    {
        "slug": "angle-2-downsizer/06-porch-autumn",
        "prompt": (
            "Photorealistic close-detail advertising photograph, 1:1 square. A tiny home "
            "porch in autumn — solid hardwood Adirondack chair on cedar deck planks, hand-"
            "thrown ceramic coffee mug on the wide armrest, folded woolen blanket draped "
            "over, brilliant orange and red maple foliage in soft-focus background, mid-"
            "autumn golden hour. "
            "Bold white serif text overlay reading exactly 'Custom tiny homes. Built in "
            "Ontario.' as the largest text, with smaller white text directly below reading "
            "exactly 'Get Pricing →'. "
            "Clean magazine-ad typography, sharp legible text. No people, no logos."
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

    log = RUN_DIR / "run-v2-log.json"
    log.write_text(json.dumps(results, indent=2))
    ok = sum(1 for r in results if "path" in r)
    err = sum(1 for r in results if "error" in r)
    print(f"\nrun complete; log: {log}")
    print(f"  ok: {ok}/{len(MOCKS)}")
    print(f"  err: {err}")


if __name__ == "__main__":
    main()
