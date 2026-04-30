#!/usr/bin/env python3
"""Titan ad creative rough mocks — 6 no-people compositions, fal.ai NB2 1K, $0.48."""
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
    "2026-04-titan-creative-bundle/rough-mocks"
)

SUBMIT_URL = "https://queue.fal.run/fal-ai/nano-banana"  # text-to-image (not /edit, no refs)
HEADERS = {"Authorization": f"Key {FAL_KEY}", "Content-Type": "application/json"}

MOCKS = [
    {
        "slug": "angle-1-affordability/01-split-comparison",
        "prompt": (
            "Photorealistic split-screen advertising photograph. Left half: traditional "
            "Ontario suburban house, two-story brick exterior, neat lawn, slightly mundane, "
            "mid-day flat light, slightly desaturated. Right half: modern custom-built "
            "tiny home, dark forest green vertical wood siding, pitched black metal roof, "
            "large windows, set against subtle northern Ontario pine treeline, golden hour "
            "warm light, premium craftsmanship feel. Clean magazine-advertisement composition. "
            "No text, no overlays, no people, no logos."
        ),
    },
    {
        "slug": "angle-1-affordability/02-interior-detail",
        "prompt": (
            "Photorealistic interior photograph of a premium custom-built tiny home kitchen "
            "and living area. Warm natural light streaming through a large window. Light "
            "wood cabinetry, white quartz countertop, butcher block accent, induction cooktop, "
            "exposed timber ceiling. A small bowl of fresh herbs, an open magazine on the "
            "counter, a steaming ceramic mug. Cozy, lived-in but immaculate. Premium "
            "craftsmanship visible — tight joinery, finish-grade trim. Canadian-context "
            "details. No people, no text, no logos."
        ),
    },
    {
        "slug": "angle-1-affordability/03-tiny-home-hero",
        "prompt": (
            "Photorealistic product-hero photograph of a custom Ontario-built tiny home "
            "exterior. Dark forest green vertical wood siding, black standing-seam metal "
            "roof, large rectangular windows, small covered front porch with cedar steps. "
            "Set on a gentle grass clearing with mature white pines behind. Soft early-"
            "evening golden light, faint wisp of woodsmoke from a chimney. Conveys premium "
            "craftsmanship and Canadian wilderness context. No people, no text, no logos."
        ),
    },
    {
        "slug": "angle-2-downsizer/04-nature-setting",
        "prompt": (
            "Photorealistic wide-angle landscape photograph of a small modern Canadian "
            "tiny home situated near a still northern Ontario lake at sunrise. Tall white "
            "pines and red maples surround the home, mist rising off the lake, warm golden "
            "light catching the upper canopy, soft pink-gold sky. The tiny home has dark "
            "green wood siding and a single warm-glowing window. Tranquil, aspirational, "
            "'less house more life' feeling. No people, no text, no logos."
        ),
    },
    {
        "slug": "angle-2-downsizer/05-lived-in-stilllife",
        "prompt": (
            "Photorealistic still-life interior photograph showing the morning ritual in a "
            "small tiny home. A worn leather armchair near a small black wood stove, a "
            "stack of well-read hardcover books, an open journal on a side table, a steaming "
            "ceramic coffee mug, a chunky knit throw blanket. Warm morning light enters from "
            "the side. Window in the background shows out to a northern Ontario forest. "
            "Cozy, slow, intentional, 'chosen simpler life'. No people, no text, no logos."
        ),
    },
    {
        "slug": "angle-2-downsizer/06-porch-autumn",
        "prompt": (
            "Photorealistic close-detail photograph of a tiny home front porch in autumn. "
            "A solid hardwood Adirondack chair on cedar deck planks, a hand-thrown ceramic "
            "coffee mug on the wide armrest, a folded woolen blanket draped over the back, "
            "small ceramic pot with a maple sapling. Mid-autumn golden-hour light, brilliant "
            "orange and red maple foliage in the soft-focus background, faint dew on the "
            "porch railing. Warm, inviting, 'morning to yourself'. No people, no text, no logos."
        ),
    },
]


def http(method: str, url: str, data=None):
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

    log = RUN_DIR / "run-log.json"
    log.write_text(json.dumps(results, indent=2))
    print(f"\nrun complete; log: {log}")
    ok = sum(1 for r in results if "path" in r)
    err = sum(1 for r in results if "error" in r)
    print(f"  ok: {ok}/{len(MOCKS)}")
    print(f"  err: {err}")


if __name__ == "__main__":
    main()
