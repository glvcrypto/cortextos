#!/usr/bin/env python3
"""Classify all 116 rows into category buckets for batch scaling."""
import csv, json, re
from collections import Counter, defaultdict
from pathlib import Path

INPUT = Path(__file__).parent / 'input.csv'

def normalise_brand(b):
    return b.replace('&amp;', '&').strip()

def parse_year_from_name(name):
    m = re.match(r'(20\d{2})\b', name)
    return m.group(1) if m else ''

def get_codename(row, headers):
    """Pull CodeName out of Lightspeed raw_json."""
    raw = row[headers.index('Meta: _lightspeed_raw_json')] or ''
    if not raw.strip():
        return ''
    try:
        return json.loads(raw).get('CodeName', '') or ''
    except Exception:
        return ''

def get_class(row, headers):
    """Lightspeed Class: Tractor / ZT / Push / RM."""
    return (row[headers.index('Meta: _lightspeed_class')] or '').strip()

def parse_deck_size(name, codename):
    """Try to extract deck-inch from name + codename."""
    for src in (codename, name):
        m = re.search(r'(\d{2})[\s\-]?in\b', src, re.I)
        if m:
            return m.group(1)
        m = re.search(r'\b(\d{2})\s*INCH', src, re.I)
        if m:
            return m.group(1)
    # Try ST54, LX42, LT46, GX54, LT50, LT42 patterns
    for src in (codename, name):
        m = re.search(r'(?:LT|LX|ST|GX|SLX)\s?(\d{2})\b', src, re.I)
        if m:
            return m.group(1)
        # ZT2 50, ZT2-54, ZTS 46, NX 15 SLX50
        m = re.search(r'(?:ZT[12S]?[\s\-]?|ZTS\s?)(\d{2})\b', src, re.I)
        if m:
            return m.group(1)
    return ''

def parse_cub_model(name, codename):
    """Pull friendly Cub model name from CodeName, fallback to name itself."""
    # Strip trailing descriptors from CodeName
    src = codename or name
    # CodeName like "XT1 LT46 46-in. 547cc" -> "XT1 LT46"
    m = re.match(r'^([A-Z]+\d?\s+[A-Z]+\d{2,3}[A-Z]*)\b', src)
    if m:
        return m.group(1).strip()
    # "ZT2 50 23HP KAWASAKI" -> "ZT2 50"
    m = re.match(r'^(ZT[12S]?[\s\-]?\d{2})\b', src, re.I)
    if m:
        return m.group(1).strip().upper().replace(' ', '')
    # "NX 15 SLX50" -> "NX 15 SLX50"
    m = re.match(r'^(NX\s*\d+\s*SLX\d+)', src, re.I)
    if m:
        return m.group(1).strip()
    # CC30H
    m = re.match(r'^(CC\d+[A-Z]?)', src, re.I)
    if m:
        return m.group(1).upper()
    # If name is like "XT1 LT46 IntelliPOWER", keep first 2-3 tokens
    if not codename:
        toks = name.split()
        return ' '.join(toks[:3]) if len(toks) > 1 else name
    return src.split()[0] if src else ''

def parse_toro_friendly(name, codename):
    """Toro names are bare SKU codes; pull product line from CodeName."""
    if not codename:
        return None
    cn = codename.replace('u00ae', '').replace('&#45;', '-')
    # Detect family
    families = ['TimeCutter', 'GrandStand', 'Z Master', 'TurfMaster', 'Recycler']
    for f in families:
        if f.lower() in cn.lower() or f.replace(' ', '').lower() in cn.lower():
            return f
    return None

ECHO_PREFIX_TYPE = {
    'CS':   'Chainsaw',
    'DCS':  'Cordless Chainsaw',
    'CSG':  'Cut-Off Saw',
    'CWT':  'Walk-Behind Cut-Off Saw',
    'SRM':  'String Trimmer',
    'DSRM': 'Cordless String Trimmer',
    'GT':   'Curved-Shaft Trimmer',
    'PB':   'Blower',           # Backpack OR handheld — refine by model
    'DPB':  'Cordless Blower',
    'HC':   'Hedge Trimmer',
    'DHC':  'Cordless Hedge Trimmer',
    'HCA':  'Articulating Hedge Trimmer',
    'SHC':  'Shafted Hedge Trimmer',
    'PW':   'Pressure Washer',
    'PWE':  'Electric Pressure Washer',
    'PE':   'Walk-Behind Edger',
    'PAS':  'PAS Powerhead',
    'DPAS': 'Cordless PAS Powerhead',
    'DLM':  'Cordless Mower',
    'ES':   'Handheld Shred/Vac',
}

def echo_subtype(name):
    """Extract Echo subtype from model prefix + refine."""
    m = re.match(r'Echo (\w{1,4})-', name)
    if not m:
        return 'Outdoor Power Equipment'
    pref = m.group(1)
    base = ECHO_PREFIX_TYPE.get(pref, 'Outdoor Power Equipment')
    # PB refinement: look at name for "Backpack" or "Handheld"
    if pref == 'PB':
        if 'Backpack' in name:
            return 'Backpack Blower'
        if 'Handheld' in name:
            return 'Handheld Blower'
        return 'Blower'
    if pref == 'DPB':
        return 'Cordless Handheld Blower'
    if pref == 'DLM':
        if 'Self-Propelled' in name:
            return 'Cordless Self-Propelled Mower'
        return 'Cordless Push Mower'
    return base

def echo_bar_length(specs):
    """Pull bar length from existing _product_specs (e.g., 'Bar Length|20\"' or 'Bar|18-20\"')."""
    if not specs:
        return ''
    m = re.search(r'Bar(?:\s*Length)?\|(\d+)(?:-\d+)?["\s]', specs)
    return m.group(1) if m else ''

def category_slug(brand, subtype):
    """Plural, hyphenated, equipment-type-first."""
    s = subtype.lower()
    plural_map = {
        'chainsaw': 'chainsaws',
        'cordless chainsaw': 'cordless-chainsaws',
        'cut-off saw': 'cut-off-saws',
        'walk-behind cut-off saw': 'cut-off-saws',
        'string trimmer': 'string-trimmers',
        'cordless string trimmer': 'cordless-string-trimmers',
        'curved-shaft trimmer': 'string-trimmers',
        'blower': 'blowers',
        'backpack blower': 'backpack-blowers',
        'handheld blower': 'handheld-blowers',
        'cordless blower': 'cordless-blowers',
        'cordless handheld blower': 'cordless-blowers',
        'hedge trimmer': 'hedge-trimmers',
        'cordless hedge trimmer': 'cordless-hedge-trimmers',
        'articulating hedge trimmer': 'hedge-trimmers',
        'shafted hedge trimmer': 'hedge-trimmers',
        'pressure washer': 'pressure-washers',
        'electric pressure washer': 'pressure-washers',
        'gas pressure washer': 'pressure-washers',
        'walk-behind edger': 'edgers',
        'pas powerhead': 'powerheads',
        'cordless pas powerhead': 'cordless-powerheads',
        'cordless mower': 'cordless-mowers',
        'cordless push mower': 'cordless-mowers',
        'cordless self-propelled mower': 'cordless-mowers',
        'handheld shred/vac': 'shred-vacs',
        'riding mower': 'riding-mowers',
        'zero-turn mower': 'zero-turn-mowers',
        'push mower': 'push-mowers',
        'compact riding mower': 'riding-mowers',
        'rear-engine riding mower': 'riding-mowers',
        'aluminum dock': 'docks',
        'floating dock': 'docks',
        'modular dock': 'docks',
        'step dock': 'docks',
        'boat lift': 'boat-lifts',
        'pwc lift': 'pwc-lifts',
        'marine railway': 'marine-railways',
        'swim raft': 'swim-rafts',
        'pwc port': 'pwc-ports',
        'boat lift roof': 'boat-lift-roofs',
    }
    return plural_map.get(s, 'outdoor-power-equipment')

def classify_row(row, headers):
    name = row[headers.index('Name')]
    brand = normalise_brand(row[headers.index('Brands')])
    cls = get_class(row, headers)
    cn = get_codename(row, headers)
    specs = row[headers.index('Meta: _product_specs')] or ''
    year = row[headers.index('Meta: _product_year')] or parse_year_from_name(name)

    if brand == 'Echo':
        sub = echo_subtype(name)
        bar = echo_bar_length(specs) if 'Chainsaw' in sub else ''
        return {'brand': brand, 'subtype': sub, 'bar': bar, 'year': year, 'name': name}

    if brand in ('Cub Cadet', 'Toro'):
        deck = parse_deck_size(name, cn)
        # Class detection — ZT check BEFORE Riding (since "TimeCutter Zero Turn Riding Mower" contains "Riding")
        if cls == 'ZT' or 'Zero Turn' in cn or 'TimeCutter' in cn or 'Z Master' in cn or 'GrandStand' in cn or 'ZTS' in cn or re.search(r'\bZT[12]?\b', cn) or 'TC FAB' in cn.upper():
            mtype = 'Zero-Turn Mower'
        elif cls == 'RM' or 'CC30H' in cn:
            mtype = 'Rear-Engine Riding Mower'
        elif cls == 'Tractor' or 'Tractor' in cn or 'Riding' in cn:
            mtype = 'Riding Mower'
        elif cls == 'Push' or 'Push' in cn or 'TurfMaster' in cn or 'Recycler' in cn:
            mtype = 'Push Mower'
        else:
            mtype = 'Mower'  # generic fallback when CodeName + class both empty
        if brand == 'Cub Cadet':
            model = parse_cub_model(name, cn)
        else:
            model = parse_toro_friendly(name, cn) or row[headers.index('Meta: _product_sku')] or ''
        return {'brand': brand, 'subtype': mtype, 'deck': deck, 'model': model, 'year': year, 'codename': cn, 'name': name}

    if brand in ('R&J Machine', 'R&amp;J Machine'):
        # Detect dock vs lift vs railway vs raft
        n = name.lower().replace('&amp;', '&')
        if 'wave armor' in n or 'wave armour' in n:
            actual_brand = 'Wave Armour'
        else:
            actual_brand = 'R&J Machine'
        if 'dock' in n:
            sub = 'Floating Dock' if 'floating' in n or 'lux' in n or 'wavex' in n else 'Aluminum Dock'
            if 'step' in n:
                sub = 'Step Dock'
            if 'modular' in n:
                sub = 'Modular Dock'
            if 'truss' in n and 'pipe' in n:
                sub = 'Aluminum Dock'
        elif 'pwc' in n and 'port' in n:
            sub = 'PWC Port'
        elif 'pwc lift' in n or ('pwc' in n and 'lift' in n):
            sub = 'PWC Lift'
        elif 'lift' in n and 'roof' in n:
            sub = 'Boat Lift Roof'
        elif 'lift' in n:
            sub = 'Boat Lift'
        elif 'railway' in n:
            sub = 'Marine Railway'
        elif 'raft' in n:
            sub = 'Swim Raft'
        else:
            sub = 'Marine Equipment'
        return {'brand': actual_brand, 'subtype': sub, 'name': name, 'year': year}

    return {'brand': brand, 'subtype': 'Unknown', 'name': name}

if __name__ == '__main__':
    with open(INPUT, newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        headers = next(reader)
        rows = list(reader)

    bucket_counts = Counter()
    by_bucket = defaultdict(list)
    for r in rows:
        c = classify_row(r, headers)
        key = f"{c['brand']} :: {c['subtype']}"
        bucket_counts[key] += 1
        by_bucket[key].append(c['name'])

    print(f'Total rows: {len(rows)}\n')
    print('=== BUCKETS ===')
    for k, n in sorted(bucket_counts.items(), key=lambda x: (-x[1], x[0])):
        print(f'  {n:>3}  {k}')
    print()
    print('=== EMPTY-CODENAME / FALLBACK ROWS ===')
    for r in rows:
        cn = get_codename(r, headers)
        b = normalise_brand(r[headers.index('Brands')])
        if b in ('Cub Cadet', 'Toro') and not cn:
            print(f'  [{b}] {r[headers.index("Name")]}  (sku={r[headers.index("Meta: _product_sku")]})')
