#!/usr/bin/env python3
"""
Task #12 Follow-Up Batch Write — _reyco_meta_title
Fires PUT /products/{id} for any SKU in the ID map not yet written.
Run after: R&J Machine WC import, Trailer X title refresh, or new manual mappings.
"""
import csv, json, requests, time, random

WC_KEY = "ck_78ae0171e909350fbc42d9154d8287435ba6128d"
WC_SECRET = "cs_1e6ba14333b956c6d68ab62f3afa27183018e7d0"
BASE = "https://reyco.glvmarketing.ca/wp-json/wc/v3/products"

ID_MAP_FILE = "/tmp/wc_sku_to_id_final.json"
METAS_FILE = "/home/aiden/cortextos/orgs/glv/clients/reyco/deliverables/seo/metas-2026-04-23-approved.csv"
RESULTS_FILE = "/tmp/task12_batch_results.json"

def load_already_written():
    try:
        with open(RESULTS_FILE) as f:
            r = json.load(f)
        return set(r.get("success", []))
    except FileNotFoundError:
        return set()

def main():
    with open(ID_MAP_FILE) as f:
        id_map = json.load(f)
    with open(METAS_FILE) as f:
        metas = {m["wc_sku"]: m for m in csv.DictReader(f)}
    already_written = load_already_written()

    write_list = [
        {"wc_sku": sku, "wc_id": wc_id, "seo_title": metas[sku]["seo_title"]}
        for sku, wc_id in id_map.items()
        if sku not in already_written and sku in metas
    ]

    if not write_list:
        print("Nothing new to write — all mapped SKUs already written.")
        return

    print(f"Writing {len(write_list)} products...")
    success, errors = [], []

    for i, item in enumerate(write_list):
        try:
            r = requests.put(
                f"{BASE}/{item['wc_id']}",
                auth=(WC_KEY, WC_SECRET),
                json={"meta_data": [{"key": "_reyco_meta_title", "value": item["seo_title"]}]}
            )
            if r.status_code == 200:
                success.append(item["wc_sku"])
            else:
                errors.append({"sku": item["wc_sku"], "id": item["wc_id"], "status": r.status_code})
        except Exception as e:
            errors.append({"sku": item["wc_sku"], "error": str(e)})
        if (i + 1) % 25 == 0:
            print(f"  {i+1}/{len(write_list)} — {len(errors)} errors")
        time.sleep(0.1)

    print(f"\nDone: {len(success)} success, {len(errors)} errors")

    # Spot-check 3 random successes
    if success:
        print("\nSpot-checking 3 random results...")
        for sku in random.sample(success, min(3, len(success))):
            wc_id = id_map[sku]
            r = requests.get(f"{BASE}/{wc_id}", auth=(WC_KEY, WC_SECRET))
            p = r.json()
            got = next((m["value"] for m in p.get("meta_data", []) if m["key"] == "_reyco_meta_title"), None)
            expected = metas[sku]["seo_title"]
            status = "OK" if got == expected else "MISMATCH"
            print(f"  [{status}] {sku} (ID={wc_id})")
            if status != "OK":
                print(f"    Expected: {repr(expected)}")
                print(f"    Got:      {repr(got)}")

    # Update results file
    all_written = already_written | set(success)
    with open(RESULTS_FILE, "w") as f:
        json.dump({"success": list(all_written), "errors": errors}, f, indent=2)

    total = len(all_written)
    print(f"\nGrand total written: {total}/250")
    if errors:
        print("Errors:", errors[:5])

if __name__ == "__main__":
    main()
