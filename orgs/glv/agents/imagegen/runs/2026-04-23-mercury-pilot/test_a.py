#!/usr/bin/env python3
"""Option A diagnostic — 1 product, Reyco ref only, no mfr imagery. $0.16."""
import json
import os
import pathlib
import time
import urllib.error
import urllib.request

FAL_KEY = os.environ["FAL_KEY"]
RUN_DIR = pathlib.Path(__file__).parent
OUT = RUN_DIR / "test_a_out"
OUT.mkdir(parents=True, exist_ok=True)

PROMPT = (
    "Professional product photograph of a four-stroke outboard boat motor. "
    "Minimalist luxury showroom aesthetic: soft off-white gradient backdrop "
    "(#FAFAFA at top fading to #EEEEEE at base), subtle implied horizon line "
    "suggesting a spacious showroom floor, warm-neutral ambient lighting. "
    "Three-point studio lighting with soft key light from top-left, gentle fill, "
    "defined rim light catching product edges. Product sharply focused, "
    "three-quarter angle revealing depth. Premium marine-dealership catalog style. "
    "No props, no text, no watermarks, no branding overlays, no human hands. "
    "Render the motor faithful to the reference image — match proportions and "
    "color from the reference, maintaining photorealistic product integrity."
)

REF = "https://reyco.glvmarketing.ca/wp-content/uploads/2026/04/MM_60hp_4S_4-Cyl_RP34_STD-2.jpg"
SUBMIT_URL = "https://queue.fal.run/fal-ai/nano-banana-2/edit"
HEADERS = {"Authorization": f"Key {FAL_KEY}", "Content-Type": "application/json"}


def http(method, url, data=None):
    req = urllib.request.Request(url, method=method, headers=HEADERS)
    body = json.dumps(data).encode() if data is not None else None
    try:
        with urllib.request.urlopen(req, data=body, timeout=120) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        if e.code == 422:
            try:
                return {"_http_error": 422, **json.loads(e.read())}
            except Exception:
                pass
        raise


payload = {
    "prompt": PROMPT,
    "image_urls": [REF],
    "num_images": 2,
    "aspect_ratio": "1:1",
    "resolution": "1K",
    "output_format": "png",
    "safety_tolerance": 6,
    "enable_web_search": False,
    "enable_google_search": False,
}

print("SUBMIT", flush=True)
sub = http("POST", SUBMIT_URL, payload)
print(json.dumps(sub, indent=2))
(RUN_DIR / "test_a_submit.json").write_text(json.dumps(sub, indent=2))
status_url = sub["status_url"]
response_url = sub["response_url"]

print("POLL", flush=True)
deadline = time.time() + 240
while time.time() < deadline:
    s = http("GET", status_url)
    print(f"  status={s.get('status')}", flush=True)
    if s.get("status") == "COMPLETED":
        break
    if s.get("status") in ("FAILED", "ERROR"):
        raise RuntimeError(f"failed: {s}")
    time.sleep(4)

r = http("GET", response_url)
(RUN_DIR / "test_a_result.json").write_text(json.dumps(r, indent=2))

if r.get("_http_error") == 422:
    msg = r.get("detail", [{}])[0].get("msg", "unknown")
    print(f"REFUSED: {msg}")
else:
    imgs = r.get("images", [])
    print(f"SUCCESS: {len(imgs)} images")
    for i, im in enumerate(imgs):
        dest = OUT / f"731_a_{i+1}.png"
        with urllib.request.urlopen(im["url"], timeout=120) as resp:
            dest.write_bytes(resp.read())
        print(f"  dl {dest} ({im.get('width')}x{im.get('height')})")
    print("description:", r.get("description"))
