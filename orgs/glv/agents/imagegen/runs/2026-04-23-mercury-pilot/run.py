#!/usr/bin/env python3
"""5-Mercury NB2 /edit pilot batch."""
import json
import os
import pathlib
import sys
import time
import urllib.request

FAL_KEY = os.environ["FAL_KEY"]
RUN_DIR = pathlib.Path(__file__).parent
OUT_DIR = RUN_DIR / "out"
OUT_DIR.mkdir(parents=True, exist_ok=True)

PROMPT_TEMPLATE = (
    "Professional product photograph of a four-stroke outboard boat motor. "
    "Minimalist luxury showroom aesthetic: soft off-white gradient backdrop "
    "(#FAFAFA at top fading to #EEEEEE at base), subtle implied horizon line "
    "suggesting a spacious showroom floor, warm-neutral ambient lighting. "
    "Three-point studio lighting with soft key light from top-left, gentle fill, "
    "defined rim light catching product edges. Product sharply focused, "
    "three-quarter angle revealing depth. Premium marine-dealership catalog style. "
    "No props, no text, no watermarks, no branding overlays, no human hands. "
    "Render the motor faithful to the reference images — match proportions and "
    "color from the references, maintaining photorealistic product integrity."
)

REF_50HP = "https://reyco.glvmarketing.ca/wp-content/uploads/2026/04/MM_50hp_4S_4-Cyl_RP34_STD-2.jpg"
REF_60HP = "https://reyco.glvmarketing.ca/wp-content/uploads/2026/04/MM_60hp_4S_4-Cyl_RP34_STD-2.jpg"

PILOT = [
    {"id": 731, "title": "2022 Mercury ME 60 ELPT 4S EFI",  "refs": [REF_60HP]},
    {"id": 536, "title": "2026 Mercury 50 ELPT EFI CT",      "refs": [REF_50HP]},
    {"id": 545, "title": "2024 Mercury ME 50 ELPT 4S EFI",   "refs": [REF_50HP]},
    {"id": 497, "title": "2025 Mercury ME 50 ELPT CT 4S EFI","refs": [REF_50HP]},
    {"id": 496, "title": "2025 Mercury ME 60 ELHPT CT 4S",   "refs": [REF_60HP]},
]

MFR_PORT = "https://v3b.fal.media/files/b/0a9778c1/ppmNXm_Hr9IuOZCjHkMHU_mm_40-60hp_4s_4-cyl_port_std.jpg"
MFR_RP34 = "https://v3b.fal.media/files/b/0a9778c1/t9Kz3tiWqFl2SgIaEfv5F_mm_60hp_4s_4-cyl_rp34_std.jpg"
MFR_REAR = "https://v3b.fal.media/files/b/0a9778c1/g7YUvcZI0RWegwQTKfe0e_mm_60hp_4s_4-cyl_rear_60_std.jpg"

SUPPLEMENTAL_REFS: dict[int, list[str]] = {
    731: [MFR_PORT, MFR_REAR],
    536: [MFR_PORT, MFR_RP34],
    545: [MFR_PORT, MFR_REAR],
    497: [MFR_PORT, MFR_RP34],
    496: [MFR_PORT, MFR_REAR],
}

SUBMIT_URL = "https://queue.fal.run/fal-ai/nano-banana-2/edit"
HEADERS = {"Authorization": f"Key {FAL_KEY}", "Content-Type": "application/json"}


def http(method, url, data=None):
    req = urllib.request.Request(url, method=method, headers=HEADERS)
    body = json.dumps(data).encode() if data is not None else None
    try:
        with urllib.request.urlopen(req, data=body, timeout=120) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        # fal.ai returns 422 with a structured refusal body when NB2 soft-refuses
        # (status=COMPLETED on poll, then 422 on result fetch). Parse it as data.
        if e.code == 422:
            try:
                return {"_http_error": 422, **json.loads(e.read())}
            except Exception:
                pass
        raise


def submit(prod):
    refs = list(prod["refs"]) + SUPPLEMENTAL_REFS.get(prod["id"], [])
    payload = {
        "prompt": PROMPT_TEMPLATE,
        "image_urls": refs,
        "num_images": 2,
        "aspect_ratio": "1:1",
        "resolution": "1K",
        "output_format": "png",
        "safety_tolerance": 6,
        "enable_web_search": False,
        "enable_google_search": False,
    }
    resp = http("POST", SUBMIT_URL, payload)
    return resp  # has request_id, status_url, response_url


def poll(status_url, timeout_s=240):
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        s = http("GET", status_url)
        status = s.get("status")
        if status == "COMPLETED":
            return s
        if status in ("FAILED", "ERROR"):
            raise RuntimeError(f"fal job failed: {s}")
        time.sleep(4)
    raise TimeoutError(f"poll timeout for {status_url}")


def fetch_result(response_url):
    return http("GET", response_url)


def download(url, dest):
    with urllib.request.urlopen(url, timeout=120) as resp:
        dest.write_bytes(resp.read())


def main():
    jobs = []
    print("=== SUBMIT PHASE ===", flush=True)
    for prod in PILOT:
        print(f"submit {prod['id']} {prod['title']}", flush=True)
        resp = submit(prod)
        jobs.append({"product": prod, "submit": resp})
        print(f"  request_id={resp.get('request_id')}", flush=True)
        (RUN_DIR / f"submit_{prod['id']}.json").write_text(json.dumps(resp, indent=2))

    print("\n=== POLL + DOWNLOAD PHASE ===", flush=True)
    results = []
    for j in jobs:
        pid = j["product"]["id"]
        status_url = j["submit"]["status_url"]
        response_url = j["submit"]["response_url"]
        print(f"poll {pid} ...", flush=True)
        poll(status_url)
        r = fetch_result(response_url)
        (RUN_DIR / f"result_{pid}.json").write_text(json.dumps(r, indent=2))
        if r.get("_http_error") == 422:
            msg = r.get("detail", [{}])[0].get("msg", "unknown")
            print(f"  REFUSED {pid}: {msg}", flush=True)
            results.append({
                "product_id": pid,
                "title": j["product"]["title"],
                "refused": True,
                "refusal_msg": msg,
            })
            continue
        imgs = r.get("images", [])
        local_paths = []
        for i, im in enumerate(imgs):
            dest = OUT_DIR / f"{pid}_{i+1}.png"
            download(im["url"], dest)
            local_paths.append(str(dest))
            print(f"  dl {dest} ({im.get('width')}x{im.get('height')})", flush=True)
        results.append({
            "product_id": pid,
            "title": j["product"]["title"],
            "ref_urls": list(j["product"]["refs"]) + SUPPLEMENTAL_REFS.get(pid, []),
            "description": r.get("description"),
            "images": [{"url": im["url"], "local": local_paths[k],
                        "width": im.get("width"), "height": im.get("height")}
                       for k, im in enumerate(imgs)],
        })

    (RUN_DIR / "summary.json").write_text(json.dumps(results, indent=2))
    print("\n=== DONE ===", flush=True)
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
