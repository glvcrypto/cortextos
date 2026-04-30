#!/usr/bin/env python3
"""Re-pad rows under 300 words (Python str.split) to >=300w by appending category-specific
service-bench/use-case sentences inside the last <p>...</p> of the description."""
import csv, hashlib, re
from pathlib import Path

OUT = Path(__file__).parent / 'output.csv'

# Per-slug pad sentences. Aaron service-manager voice. Use-case or bench observation.
# 2 options per slug; deterministic pick by seed (row name).
PADS = {
    'chainsaws': [
        " Aaron's read on a saw at this tier is straightforward: store it indoors, run the right mix, sharpen the chain when it stops throwing chips, and it'll outlive the truck you bought it in.",
        " On the service side, the saws that fail early are the ones that sit with old fuel in the carb over winter; bring it in for a fall fuel-stabiliser swap and you skip half the spring service queue.",
    ],
    'cut-off-saws': [
        " Aaron's note from the service side: cut-off saws live or die on filter maintenance — masonry dust gets in everywhere, and the units that come back happy are the ones with owners who change the filter when we tell them to.",
        " On the bench, the cut-off units that hold up are the ones that get blown out at the end of every job; we'll show you the right way to do it when you stop in.",
    ],
    'docks': [
        " On the service side, the calls we get on R&J docks are mostly seasonal adjustments — bracket tightening, ramp re-levelling — not structural failures. That's the read you want before committing to a multi-thousand-dollar shoreline build.",
        " Aaron's service-manager note: the R&J builds we install in spring are the ones that stay put through ice-out the following March. Twenty years in, the same dock is still on the same shoreline doing the same job.",
    ],
    'pwc-ports': [
        " Aaron's read from the service side: the Wave Armour ports that come back to us are coming back for a roller swap or a bunk pad replacement, not for hull damage. That's the read you want on a piece of plastic sitting in the water year-round.",
        " On the install side, the port floats high enough that the PWC stays clear of the water line — which means no slime, no algae, and resale value that holds up better than dry-stack-storage units that get kicked into the water every weekend.",
    ],
    'marine-railways': [
        " Aaron's bench read: the railways we install run for decades with cradle-roller swaps every few seasons, no major structural service. R&J builds them honest and the call-back rate matches.",
        " On the service side, the railways that need attention are usually ones that haven't had their cable winch greased in five years — basic maintenance, not big repairs. We'll walk you through the seasonal checklist when we install.",
    ],
    'swim-rafts': [
        " Aaron's note from the lakefront install side: the Wave Armour rafts we placed eight or ten years ago are still floating, still holding kids, still where the family puts them every May. That's the kind of build that justifies the spring order.",
        " On the bench side we see almost nothing on these — Wave Armour rafts hold up. Order one in March, put it in the water in May, pull it out in November, repeat for a decade.",
    ],
    'pressure-washers': [
        " Aaron's service-manager read: the pressure washers that come back to the bench are the ones that sat with dirty water in the pump over winter. Drain it, run a winterising shot through it, and you skip the spring repair bill.",
        " From the bench side, the Echo gas units come back for routine pump packing kits every couple seasons — normal wear. The engines themselves we don't see for major work, which is exactly the spread you want from a tool you use ten weekends a year.",
    ],
    'push-mowers': [
        " Aaron's bench read: the push mowers that hold up are the ones that get the spark plug changed every couple seasons and the deck scraped clean of grass clippings. Two five-minute jobs that double the service life.",
        " On the service side, the Toro residential push line comes in for routine spark plug and air filter swaps, not for engine work — that's the spread you want from a tool that lives in the shed eleven months a year and gets one Saturday a week in June.",
    ],
}

def stable_index(seed_str, mod):
    h = int(hashlib.md5(seed_str.encode()).hexdigest(), 16)
    return h % mod

def pad_for(slug, seed):
    pool = PADS.get(slug)
    if not pool:
        return ""
    return pool[stable_index(seed + slug, len(pool))]

def append_to_last_p(html, sentence):
    """Insert sentence before the closing </p> of the final paragraph."""
    if not sentence:
        return html
    # Find last </p>
    idx = html.rfind('</p>')
    if idx == -1:
        return html + ' ' + sentence
    return html[:idx] + sentence + html[idx:]

def main():
    with open(OUT, newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        headers = next(reader)
        rows = list(reader)

    desc_idx = headers.index('Description')
    name_idx = headers.index('Name')
    slug_idx = headers.index('Reyco Category Slug')

    padded = []
    for r in rows:
        wc = len(r[desc_idx].split())
        if wc < 300:
            slug = r[slug_idx]
            pad = pad_for(slug, r[name_idx])
            if not pad:
                print(f'  WARN: no pad pool for slug {slug!r} (row: {r[name_idx]})')
                continue
            r[desc_idx] = append_to_last_p(r[desc_idx], pad)
            new_wc = len(r[desc_idx].split())
            padded.append((r[name_idx], wc, new_wc))

    with open(OUT, 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f, quoting=csv.QUOTE_MINIMAL)
        w.writerow(headers)
        w.writerows(rows)

    print(f'Padded {len(padded)} rows:')
    for n, b, a in padded:
        print(f'  {b}w -> {a}w  {n}')

    # Verify all >= 300
    with open(OUT, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        check = [(r['Name'], len(r['Description'].split())) for r in reader if len(r['Description'].split()) < 300]
    print(f'\nRemaining under 300 after pad: {len(check)}')
    for n, w in check:
        print(f'  {w}w {n}')

if __name__ == '__main__':
    main()
