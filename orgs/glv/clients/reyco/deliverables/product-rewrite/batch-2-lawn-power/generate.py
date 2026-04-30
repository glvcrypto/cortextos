#!/usr/bin/env python3
"""Generate rewrites for Batch 2 (lawn-power, 116 products). v2 — direct narrative construction."""
import csv, re, hashlib
from pathlib import Path
from classify import (
    classify_row, normalise_brand, get_codename, get_class,
    parse_deck_size, parse_cub_model, parse_toro_friendly,
    echo_subtype, echo_bar_length, category_slug,
)

INPUT  = Path(__file__).parent / 'input.csv'
OUTPUT = Path(__file__).parent / 'output.csv'

# ---------- rotation pools (per category bucket) ----------

ARCHETYPES_LAWN = [
    "the cottage owner with a one-acre lakefront lot",
    "the rural property holder with the back forty to manage",
    "the weekend mower who wants the job done before noon",
    "the retiree who finally bought the equipment he always wanted",
    "the homeowner with a tight half-acre suburban lot",
    "the seasonal landscaper running multiple properties",
    "the property caretaker juggling four or five lakefront places",
    "the customer who treats the lawn like a project, not a chore",
    "the in-town buyer with a flat lot and a tight Saturday schedule",
    "the cottager prepping a place for renters every weekend",
]
ARCHETYPES_SAW = [
    "the firewood cutter stocking up before October",
    "the part-time arborist working weekend storm cleanup",
    "the rural property holder clearing windfall every spring",
    "the homeowner who burns wood for shoulder-season heat",
    "the contractor who keeps a saw in every truck",
    "the cottage owner clearing the access road every May",
    "the customer who's tired of the box-store saw lasting two seasons",
]
ARCHETYPES_BLOWER = [
    "the homeowner staring down October leaf cleanup",
    "the year-round property caretaker",
    "the retiree who handles his own yard end-to-end",
    "the seasonal landscaper running multiple properties",
    "the cottage owner cleaning up before the long weekend rush",
]
ARCHETYPES_TRIMMER = [
    "the customer with a half-acre lot and tidy hedge instinct",
    "the homeowner running the trimmer for an hour at a stretch",
    "the seasonal landscaper running multiple properties",
    "the contractor who needs gear that holds up to commercial pace",
    "the cottager who does his own edges every Saturday",
]
ARCHETYPES_HEDGE = [
    "the customer with a real cedar hedge along the property line",
    "the homeowner with overgrown shrubs and a Saturday to spend",
    "the landscaper trimming hedges all season",
    "the cottager who lets the hedge go a year and pays for it the next",
]
ARCHETYPES_PRESSURE = [
    "the dock-and-deck spring-clean homeowner",
    "the cottage owner with a season's worth of grime to lift",
    "the contractor running pressure-wash bids on the side",
    "the truck-and-trailer guy who'd rather own than rent",
]
ARCHETYPES_DOCK_LIFT = [
    "the cottage family putting in a new shoreline this spring",
    "the lakefront owner replacing a 20-year-old wood dock",
    "the new cottage buyer learning what aluminum buys you",
    "the retired couple finally building the dock they always wanted",
    "the landlord prepping a rental cottage for the season",
    "the buyer who wants the install handled end-to-end, not just the parts",
]
ARCHETYPES_CORDLESS = [
    "the suburban homeowner whose neighbours appreciate quiet equipment",
    "the customer ready to be done with two-stroke fuel",
    "the buyer building out an Echo 56V kit one tool at a time",
    "the retiree who'd rather not pull-start anything anymore",
]

# Anchors are pre-formatted with the right preposition for narrative use
ANCHORS_LAWN = [
    "Northern Ontario",
    "the Sault",
    "Algoma",
    "the cottage roads east of town",
    "Algoma District",
    "the half-acre lots in town",
    "the lakefront properties",
    "the rural lots north of the city",
    "the mixed cottage-and-rural lawns we get up here",
    "the cottage country lots",
]
ANCHORS_WATER = [
    "Lake Superior",
    "the St. Marys River",
    "the Algoma cottage country",
    "the inland lakes east of the Sault",
    "the Garden River shoreline",
    "the North Channel cottages",
    "the lakefront properties around Algoma",
    "cottage country here in the Sault",
]
ANCHORS_SEASON = [
    "October leaf cleanup",
    "spring tune-up season",
    "the late-May start when everything wakes up at once",
    "fall yard prep before snow flies",
    "the long Northern Ontario season",
    "the salt-and-grit shoulder months",
]

CLOSERS = [
    "Stop by the showroom at 11 White Oak Drive East to see it on the floor, or call 705-253-7828 if you'd rather talk through whether it's the right fit.",
    "Aaron, our Service Manager, is at the showroom most days — drop in or call 705-253-7828 and he'll walk you through it.",
    "Reyco's been on White Oak Drive East for more than 60 years. Stop by, talk to a tech, see the unit on the floor.",
    "Call 705-253-7828 or stop in at 11 White Oak Drive East — Aaron or Damian will walk you through what fits your property.",
    "If you've got questions about fit, call 705-253-7828. If you want to see the unit, we're at 11 White Oak Drive East in Sault Ste. Marie.",
    "Drop in at 11 White Oak Drive East to see it on the floor. Lynn manages the parts counter and Ron can pull most wear items same-day.",
    "Talk to Damian in the service department (small engines, lawn, snow, Echo) — he'll tell you what holds up and what to expect from the platform. 705-253-7828 or stop in.",
    "Call 705-253-7828 to talk it through, or visit the showroom at 11 White Oak Drive East. We'll make sure the unit fits the lot before you leave the lot.",
]
CLOSERS_RJ = [
    "R&J docks and lifts are quote-and-build — call 705-253-7828 or visit 11 White Oak Drive East and we'll start the conversation around your shoreline.",
    "Every R&J piece is site-specific. Call 705-253-7828 or stop in at 11 White Oak Drive East with photos of your shoreline.",
    "Reyco is the authorised R&J Machine dealer locally — Aaron will walk through the install conversation start to finish. Call 705-253-7828 to start.",
    "Visit Reyco at 11 White Oak Drive East to flip through the R&J catalogue, or call 705-253-7828 to talk through what fits your lakefront.",
    "Send us shoreline photos or stop in at 11 White Oak Drive East — Aaron will walk you through the R&J options that fit your specific waterfront.",
]

# ---------- helpers ----------

def stable_index(seed_str, mod):
    h = int(hashlib.md5(seed_str.encode()).hexdigest(), 16)
    return h % mod

def pick(pool, seed, salt=''):
    return pool[stable_index(seed + salt, len(pool))]

def two_distinct(pool, seed, salt=''):
    i = stable_index(seed + salt, len(pool))
    j = (i + 1 + stable_index(seed + salt + 'b', len(pool) - 1)) % len(pool)
    return pool[i], pool[j]

def words_count(s):
    return len(re.findall(r"\b\w+\b", re.sub(r"<[^>]+>", " ", s)))

# ---------- name + label builders ----------

def parse_echo_model(name):
    """Pull friendly Echo model from name (e.g. 'Echo CS-590 Timber Wolf Chainsaw' -> 'CS-590')."""
    m = re.match(r'Echo\s+(\w{1,5}-\w+\w*)', name)
    return m.group(1) if m else (name.split()[1] if len(name.split()) > 1 else name)

def derive_series(brand, model):
    if not model:
        return 'residential'
    if brand == 'Cub Cadet':
        m = re.match(r'^(XT[12]|ZTS?\d?|ZT[12]|NX|CC\d+H?)', model)
        return m.group(1) if m else 'Enduro'
    if brand == 'Toro':
        for f in ('TimeCutter', 'GrandStand', 'Z Master', 'TurfMaster', 'Recycler'):
            if f in model:
                return f
        return 'TimeCutter'
    if brand == 'Echo':
        return 'pro-grade'
    return 'residential'

def build_name(c):
    b = c['brand']
    sub = c['subtype']
    yr = c.get('year', '')
    if b == 'Echo':
        model = parse_echo_model(c['name'])
        if 'Chainsaw' in sub and c.get('bar'):
            return f"Echo {model} {c['bar']}-inch {sub}"
        return f"Echo {model} {sub}"
    if b in ('Cub Cadet', 'Toro'):
        model = c.get('model', '') or ''
        deck = c.get('deck', '')
        ttl_sub = sub if sub != 'Mower' else 'Mower'
        # Disambiguate: bare-SKU input rows (13A.../13B.../17A.../numeric Toro SKUs) get the SKU
        # appended in parens. Variant descriptors (IntelliPOWER / FAB / Enduro Series) preserved
        # from original input name when present, so duplicate friendly-name resolutions remain unique.
        original_name = c.get('name', '')
        sku_in_name = bool(re.search(r'(?:13[ABP]|17A|^20\d{2}\s+Toro\s+\d{5,})', original_name))
        suffix = ''
        if sku_in_name and c.get('codename'):
            m = re.search(r'((?:13[ABP]|17A)\w*|\d{5,})', original_name)
            if m:
                suffix = f" ({m.group(1)})"
        else:
            # Preserve trim descriptors from original input name
            for trim in ('IntelliPOWER', 'FAB', 'Enduro Series'):
                if trim in original_name and trim not in model:
                    suffix = f" {trim}" if not suffix else f"{suffix} {trim}"
        if deck and ('Riding' in sub or 'Zero-Turn' in sub or 'Rear-Engine' in sub or 'Push' in sub):
            return f"{yr} {b} {model} {deck}-inch {ttl_sub}{suffix}".replace('  ', ' ').strip()
        return f"{yr} {b} {model} {ttl_sub}{suffix}".replace('  ', ' ').strip()
    if b == 'R&J Machine':
        return c['name'].replace('&amp;', '&')
    if b == 'Wave Armour':
        n = c['name'].replace('&amp;', '&').replace('Wave Armor ', 'Wave Armour ')
        return n
    return c['name']

def build_label(c):
    """Short label used inside descriptions — drops the year prefix to keep prose tighter."""
    n = build_name(c)
    return re.sub(r'^20\d{2}\s+', '', n)

# ---------- short description ----------

def build_short(c):
    """Short description ~30 words. Uses bare label (already brand+model); no double-prefix."""
    b = c['brand']
    sub = c['subtype']
    label = c['label']
    deck = c.get('deck', '')
    deck_phrase = f" The {deck}-inch deck handles" if deck else " Sized for"
    if b == 'Cub Cadet':
        if 'Zero-Turn' in sub:
            return f"{label} —{deck_phrase} a Northern Ontario lawn in half the time. Authorised Cub Cadet dealer service from Aaron and Damian at White Oak Drive."
        if 'Rear-Engine' in sub:
            return f"{label} — compact rear-engine ride for the tight lot or the basement-storage cottage. Authorised Cub Cadet dealer service at Reyco."
        return f"{label} —{deck_phrase} a real Northern Ontario lawn. Authorised Cub Cadet dealer service from Aaron and Damian at White Oak Drive."
    if b == 'Toro':
        if 'Zero-Turn' in sub:
            return f"{label} —{deck_phrase} the lawn in half the time for the half-acre-to-one-acre customer. Authorised Toro dealer service at Reyco."
        if 'Push' in sub:
            return f"{label} — practical push mower for the smaller lot. Authorised Toro dealer at White Oak Drive."
        return f"{label} —{deck_phrase} a half-acre to one-acre lot. Authorised Toro dealer service at Reyco."
    if b == 'Echo':
        if 'Chainsaw' in sub:
            bar = c.get('bar', '')
            bar_phrase = f"{bar}-inch bar — " if bar else ""
            return f"{label} — {bar_phrase}built for the customer who runs the saw, not just owns it. Authorised Echo dealer service from Damian in the service department."
        if 'Cordless' in sub:
            return f"{label} — Echo's 56V platform: one battery, multiple tools. Authorised Echo dealer service at Reyco, no shipping the unit elsewhere."
        if 'Pressure' in sub:
            return f"{label} — sized for spring deck-and-dock cleanup. Authorised Echo dealer service from Damian in the service department."
        if 'Hedge' in sub:
            return f"{label} — built to handle a real cedar hedge, not just decorative shrubs. Authorised Echo dealer at White Oak Drive."
        if 'Blower' in sub or 'Shred' in sub:
            return f"{label} — Echo's answer for October leaf cleanup across a real Northern Ontario lot. Authorised dealer service from Damian at Reyco."
        if 'Trimmer' in sub or 'Powerhead' in sub or 'Edger' in sub:
            return f"{label} — built to last past one season. Authorised Echo dealer service at Reyco, parts stocked at the counter."
        if 'Cut-Off' in sub:
            return f"{label} — concrete and masonry cutting from Echo's pro line. Authorised Echo dealer service at Reyco."
        return f"{label} — authorised Echo dealer service at Reyco, parts via Lynn and Ron at the counter, Damian in the service department."
    if b == 'R&J Machine':
        return f"{label} — quote-and-build through R&J Machine's Lakefield, Ontario network. Reyco coordinates from your shoreline photos to the install."
    if b == 'Wave Armour':
        return f"{label} — Wave Armour shoreline equipment, ordered through Reyco. Built to last more than a season."
    return label

# ---------- description builders ----------
# Each builder returns 4-paragraph HTML, ~310-350 words, narrative-varied per seed.

def auth_line(brand):
    """Authorised-dealer line for a brand. Roster: Aaron (Co-Owner/Service Manager),
    Damian (service dept — small engines, lawn, snow, Echo), Lynn (Parts Manager), Ron (Parts Specialist)."""
    if brand == 'Echo':
        return "Reyco is an authorised Echo dealer — warranty work, chain sharpening, parts, and routine service all run through our shop. Damian in the service department (small engines, lawn, snow, Echo) has been on these tools for years; Ron at the parts counter has the Echo-line consumables sorted before you finish asking."
    if brand == 'Cub Cadet':
        return "Reyco is an authorised Cub Cadet dealer — warranty work happens here in Sault Ste. Marie, no shipping the unit elsewhere. Aaron oversees the service side as Co-Owner and Service Manager; Damian handles the lawn-and-snow bench end to end; Lynn manages the parts counter."
    if brand == 'Toro':
        return "Reyco is an authorised Toro dealer — warranty work and platform-specific service come through our shop. Aaron runs the service side as Service Manager; Lynn manages the parts counter so wear items are usually a same-day pickup."
    if brand == 'R&J Machine':
        return "Reyco is an authorised R&J Machine dealer — every piece is quoted, built, and installed through R&J's network out of Lakefield, Ontario, with Reyco coordinating the conversation from your first phone call. Aaron, as Co-Owner and Service Manager, also handles the after-install side when ice-up or storm damage takes a bite out of a dock or lift."
    return ""

def stocked_line(brand):
    """Non-authorised stocked-brand framing (Wave Armour only in this batch)."""
    if brand == 'Wave Armour':
        return "Reyco stocks Wave Armour as part of our shoreline lineup — pieces are ordered in through R&J Machine's network and delivered ahead of swim season. We don't carry Wave Armour-branded warranty service, but Aaron's seen these on the lakefronts long enough to know how they hold up."
    return ""

def build_desc_riding(c, seed):
    label = c['label']
    brand = c['brand']
    deck = c.get('deck', '')
    series = derive_series(brand, c.get('model', ''))
    arch_a, arch_b = two_distinct(ARCHETYPES_LAWN, seed, 'a')
    anchor_a, anchor_b = two_distinct(ANCHORS_LAWN, seed, 'b')
    closer = pick(CLOSERS, seed, 'c')
    fall = c.get('fallback')

    # 4 paragraphs; opener varied by hash
    op_choice = stable_index(seed + 'op', 5)
    if op_choice == 0:
        p1 = (f"For {arch_a}, the {label} hits the sweet spot. {brand}'s {series} platform is built around the customer who wants to finish the lawn before the mosquitoes come up — and "
              f"{('the ' + deck + '-inch deck does exactly that') if deck else 'the deck size is right for a real Northern Ontario lawn'}. "
              f"We see this size move off the floor every spring at Reyco. It's the unit Aaron points cottage country buyers toward when they describe their property and ask 'what fits?'")
    elif op_choice == 1:
        p1 = (f"The {label} is the tractor we sell to {arch_a}. Aaron's seen this platform run reliably across {anchor_a} for years — it's the unit that gets pulled out the first warm Saturday in May and run hard through October. "
              f"{brand}'s {series} platform sits in the sweet spot for the in-between lot — too much lawn for a push mower, not enough to justify a zero-turn.")
    elif op_choice == 2:
        p1 = (f"Out across {anchor_a}, the {label} is the size that gets the job done in one Saturday. "
              f"That's the practical reason {arch_a} keeps coming back to {brand}'s {series} platform — three or four passes per side and the lawn is done. "
              f"It's also the reason Aaron sells more of these every spring than almost any other ride-on in the showroom.")
    elif op_choice == 3:
        p1 = (f"Every spring at Reyco we move a stack of {label}s off the floor — usually to {arch_a}. "
              f"{brand}'s {series} platform is the one Aaron recommends when somebody walks in describing a real lawn (not just a city lot) and asks for a unit that'll start every Saturday for the next ten years.")
    else:
        p1 = (f"If your lawn is enough work that a 42-inch deck would have you doing eight passes instead of five, the {label} is the unit. "
              f"{brand}'s {series} platform was built around {arch_a} — the customer with real grass to cut, not just a strip in front of the house.")

    p2 = (f"The {series} platform is {brand}'s ride-on done right: hydrostatic drive (push the pedal, it goes), a comfortable seat for the long pass, and an electric PTO so engaging the deck is one button instead of a pull. "
          f"For the customer mowing a half-acre Sault property up through a full lakefront acre, the geometry works — three or four passes per side and you're done. "
          f"Up here, where the mowing window runs from late May to early October, you want a unit you can trust to start every Saturday — and that's where {brand}'s residential line earns its money. "
          f"Aaron's been managing the service side here long enough to tell you which tier of the lineup actually pays off and which one's just hood badges — drop in and he'll walk you through it.")

    p3 = (f"{auth_line(brand)} "
          f"For {arch_b}, the trade-off pencils out: a unit that'll hold up across a decade of weekend mowing on {anchor_b}, with parts and service running through one shop instead of three. "
          f"That's the part of the buy-here pitch that matters past year three — when the spindle starts to clunk or the deck belt walks, it's a half-hour conversation with Damian, not a six-week parts order.")

    p4_extra = ""
    if fall:
        p4_extra = " Spec details — exact deck size, drive type, engine — are best confirmed on the floor or by phone at 705-253-7828; this listing covers the bare-SKU year-and-make rather than every variant detail."

    p4 = (f"Cub Cadet has been part of Reyco's lawn line since the early days, and we've serviced enough of these to know what holds up.{p4_extra} {closer}"
          if brand == 'Cub Cadet' else
          f"Toro's residential line has been part of our showroom for years, and the {series} platform is dialled in.{p4_extra} {closer}")

    return f"<p>{p1}</p>\n<p>{p2}</p>\n<p>{p3}</p>\n<p>{p4}</p>"

def build_desc_zt(c, seed):
    label = c['label']
    brand = c['brand']
    deck = c.get('deck', '')
    series = derive_series(brand, c.get('model', ''))
    arch_a, arch_b = two_distinct(ARCHETYPES_LAWN, seed, 'a')
    anchor_a, anchor_b = two_distinct(ANCHORS_LAWN, seed, 'b')
    closer = pick(CLOSERS, seed, 'c')

    op_choice = stable_index(seed + 'op', 6)
    if op_choice == 0:
        p1 = (f"Zero-turns aren't for every lawn — but for {arch_a}, the {label} is the one Aaron points to. "
              f"The trade-off versus a tractor is real: lever steering takes a Saturday to learn, and the price is higher up front. The payoff is also real: the same lawn gets cut in half the time, with cleaner trim around the trees and the septic mound.")
    elif op_choice == 1:
        p1 = (f"The {label} earns its keep across {anchor_a} when you've got more grass than time. "
              f"{brand}'s {series} platform was designed for residential customers who want to cut commercial-style — and the geometry works once you get used to it.")
    elif op_choice == 2:
        p1 = (f"If you've got a property where straight rows and tight pivots both matter, the {label} is built for it. "
              f"Zero-turns trade tractor steering for raw productivity — once you're comfortable on one, you'll cut the same lawn in half the time, with cleaner trim around obstacles.")
    elif op_choice == 3:
        p1 = (f"When somebody asks Aaron 'what zero-turn,' the answer depends on the lot — for {arch_a}, this is usually the answer. "
              f"{brand}'s {series} platform sits at the size and tier where most residential customers actually land.")
    elif op_choice == 4:
        p1 = (f"Aaron sees a lot of {brand} {series} units come back for spring tune-ups every year — clean tune-ups, not warranty drama — and the {label} is one of the platforms that earns that read. "
              f"For {arch_a}, this is the unit that pencils out as the upgrade from a residential tractor.")
    else:
        p1 = (f"For the property where you've been adding fifteen minutes to the mow every season as the trees grow in, the {label} is the answer. "
              f"{brand}'s {series} platform makes the obstacle course around the firepit, the playset, and the gardens an actual zero-turn job instead of a tractor-and-back-up dance.")

    p2 = (f"Out across {anchor_a}, where most cottage and rural lots are obstacle courses (trees, septic mounds, gardens, gravel pads), the zero-turn pivot is what saves the time. "
          f"The {label} sits in the sweet spot for a half-acre to a full acre — anything smaller and the deck size is overkill; anything bigger and you'd want a commercial unit. "
          f"{('The ' + deck + '-inch deck pulls cleanly through long grass without bogging') if deck else 'The deck pulls cleanly through long grass without bogging'}, which matters when the rain runs the grass three days past mowing day. "
          f"Aaron points the customers who'd grown up on tractors toward this one when the lot makes the case for it — and most aren't sorry about the switch.")

    p3 = (f"{auth_line(brand)} "
          f"That matters more on a zero-turn than on most platforms — the hydrostatic drive units, the spindle bearings, the deck mounts are all wear items that benefit from being looked at by a tech who knows the line. "
          f"We see {brand} zero-turns come back on schedule for routine deck-belt and spindle service around year four, which is normal. Less drama, more uptime.")

    p4 = (f"For {arch_b}, the {label} is the upgrade that changes the relationship to the lawn — Saturdays back, cleaner cut, less time on the seat. {closer}")

    return f"<p>{p1}</p>\n<p>{p2}</p>\n<p>{p3}</p>\n<p>{p4}</p>"

def build_desc_push(c, seed):
    label = c['label']
    brand = c['brand']
    arch_a, arch_b = two_distinct(ARCHETYPES_LAWN, seed, 'a')
    anchor_a, _ = two_distinct(ANCHORS_LAWN, seed, 'b')
    closer = pick(CLOSERS, seed, 'c')

    p1 = (f"For the smaller lot — the front yard, the boulevard strip, the rental — the {label} is the one we recommend. "
          f"Not every lawn calls for a tractor. {arch_a} is often better off with a push mower that lives in the shed eleven months a year and starts cleanly in May.")

    p2 = (f"A push mower lives or dies on three things: cold-start reliability, handle ergonomics, and how easy it is to service. "
          f"{brand}'s residential push line is built around all three. The {label} is the one Aaron sells most across {anchor_a} — to retirees, to renters, to the in-town buyer with a tight lot. "
          f"It's a unit that doesn't get talked about much because it works — and that's exactly the recommendation you want from a parts-counter shop, not a sales-floor pitch.")

    p3 = (f"{auth_line(brand)} "
          f"On a push mower the biggest service items are the air filter and the spark plug — Lynn keeps those at the parts counter, same-day pickup if you walk in. The blade we'll sharpen on the bench while you wait, if it's not too gnarled.")

    p4 = (f"For {arch_b} who isn't ready for a tractor and doesn't want a cordless, the {label} is the right size and platform. {closer}")

    return f"<p>{p1}</p>\n<p>{p2}</p>\n<p>{p3}</p>\n<p>{p4}</p>"

def build_desc_chainsaw(c, seed):
    label = c['label']
    arch_a, arch_b = two_distinct(ARCHETYPES_SAW, seed, 'a')
    anchor_a, anchor_b = two_distinct(ANCHORS_LAWN, seed, 'b')
    closer = pick(CLOSERS, seed, 'c')
    bar = c.get('bar', '')

    op_choice = stable_index(seed + 'op', 4)
    if op_choice == 0:
        p1 = (f"If you're cutting firewood across {anchor_a}, the {label} is the saw that gets pointed to the most. "
              f"Echo earned that reputation by building saws that {arch_a} can run season after season without surprises.")
    elif op_choice == 1:
        p1 = (f"The {label} is the chainsaw we sell to {arch_a}. "
              f"It's the saw Aaron recommends when somebody walks in tired of replacing a box-store saw every two seasons.")
    elif op_choice == 2:
        p1 = (f"Echo's {label} earns its reputation on the things you don't see on a sticker — the air filter design, the anti-vibration system, the chain tensioner. "
              f"For {arch_a}, those are the parts that matter past the first season.")
    else:
        p1 = (f"For {arch_a}, the {label} is the right blend of bar length and engine. "
              f"{('A ' + bar + '-inch bar handles full-size hardwood without the saw fighting you back') if bar else 'The bar length and engine sit in the sweet spot for hardwood firewood work'}, which is the work most customers across {anchor_a} actually do.")

    p2 = (f"Echo's professional-grade saws are over-built for homeowner use, which is why they end up in the shed for fifteen years instead of three. "
          f"That over-engineering shows up on cold mornings — the {label} starts cleanly when the box-store saws are still being yanked on. "
          f"Northern Ontario winters are hard on small engines, and Echo's tolerance for cold-start abuse is one of the things {arch_b} comes back for. "
          f"Aaron sees these on the bench in October when everybody realises at the same time that wood's getting cut and they need a saw — get yours in before the rush.")

    p3 = (f"{auth_line('Echo')} "
          f"Most chainsaws don't get serviced when they should — bring yours in for a chain sharpening once a season and Damian will look it over while it's on the bench. Air filter, fuel filter, spark plug, bar oil — all wear items, all stocked at the parts counter.")

    p4 = (f"For {arch_b}, the {label} pays for itself across two seasons of cuts versus a cheaper saw that needs replacing. {closer}")

    return f"<p>{p1}</p>\n<p>{p2}</p>\n<p>{p3}</p>\n<p>{p4}</p>"

def build_desc_blower(c, seed):
    label = c['label']
    sub = c['subtype']
    arch_a, arch_b = two_distinct(ARCHETYPES_BLOWER, seed, 'a')
    anchor_a, _ = two_distinct(ANCHORS_LAWN, seed, 'b')
    closer = pick(CLOSERS, seed, 'c')

    is_backpack = 'Backpack' in sub
    blower_kind = 'Backpack blowers' if is_backpack else 'Handheld blowers'
    backpack_punch = "Once you wear one for an hour, you don't go back to a handheld" if is_backpack else "For the smaller lot or close-quarters work, a handheld is what you actually need"
    wear_punch = "wear, not just hold" if is_backpack else "pick up cold and run all afternoon"
    op_choice = stable_index(seed + 'op', 3)
    if op_choice == 0:
        p1 = (f"{blower_kind} earn their keep in fall — the {label} is the one Aaron grabs when {arch_a} asks 'which one.' "
              f"{backpack_punch}.")
    elif op_choice == 1:
        p1 = (f"For the property covered in maple leaves by mid-October, the {label} is the right size. "
              f"Echo built this one for {arch_a} — the customer who's running it for an hour or more at a stretch, not just five minutes on a driveway.")
    else:
        p1 = (f"Echo's {label} is a tool you {wear_punch} — and {arch_a} feels the difference after the first hour. "
              f"It's also one of the more reliable cold-start blowers in the line, which matters across {anchor_a}.")

    p2 = (f"{('Backpack ergonomics matter more than spec sheets' if is_backpack else 'Handheld balance matters more than peak air speed numbers')}. The {label} is built so you can run it for the full leaf job without feeling it the next day. "
          f"Echo's blowers run on a 50:1 mix and tolerate the cold-start abuse that Northern Ontario mornings throw at them. "
          f"Air volume (CFM) does the work; air speed (MPH) gets the leaves moving — the {label} is balanced for both, which is why it shows up on so many landscaping trucks across {anchor_a}.")

    p3 = (f"{auth_line('Echo')} "
          f"Routine service on a blower is mostly air filter, spark plug, and an annual carb tune — Lynn and Ron keep the wear parts at the counter, Damian handles the carb work in-shop. We see these come back on schedule, not on warranty calls. Bring it in at the end of October once leaf season's wrapped and we'll get it set for spring.")

    p4 = (f"For {arch_b}, the {label} is the blower size that fits the property without overshooting. Echo's blower line is one of the few where the spec sheet matches the real-world performance — and Aaron will steer you to the right size for your lot rather than the bigger unit. {closer}")

    return f"<p>{p1}</p>\n<p>{p2}</p>\n<p>{p3}</p>\n<p>{p4}</p>"

def build_desc_trimmer(c, seed):
    label = c['label']
    arch_a, arch_b = two_distinct(ARCHETYPES_TRIMMER, seed, 'a')
    anchor_a, _ = two_distinct(ANCHORS_LAWN, seed, 'b')
    closer = pick(CLOSERS, seed, 'c')

    op_choice = stable_index(seed + 'op', 3)
    if op_choice == 0:
        p1 = (f"The {label} is Echo's answer to the trimmer that lasts past one summer. "
              f"For {arch_a}, the upgrade from a box-store trimmer is immediate — easier starts, more consistent power, and a head that doesn't bind every twenty minutes.")
    elif op_choice == 1:
        p1 = (f"Aaron sells the {label} to {arch_a} who needs an edge that won't quit halfway through the property. "
              f"Echo's trimmer line has been the go-to recommendation for residential and prosumer customers across {anchor_a} for years.")
    else:
        p1 = (f"Echo's {label} is the trimmer that survives a long {anchor_a} mowing season. "
              f"For straight-shaft work along a property line, the {label} is the right call for {arch_a}.")

    p2 = ("Straight-shaft trimmers reach further and last longer than curved-shaft. The bump-feed head Echo ships with this one is the head 90% of customers actually use — no upselling on attachments you don't need. "
          "For the customer running a trimmer for an hour or more at a stretch, the balance matters more than the spec sheet. "
          "The handle position is dialled in for cutting along fences and gardens without the tip wandering.")

    p3 = (f"{auth_line('Echo')} "
          "Trimmer wear parts — line, head, fuel filter, spark plug — all live at the parts counter, same-day pickup if you walk in. We'll re-spool the line for you while you wait if you don't want to fight the head. Damian also tunes the carb if the trimmer's been sitting all winter and won't take an idle.")

    p4 = (f"For {arch_b}, the {label} earns its keep across the season. The price difference between this and a discount-store trimmer pays for itself by the second August — and Aaron's seen enough of the discount stuff come back broken to know which side of that math is real. {closer}")

    return f"<p>{p1}</p>\n<p>{p2}</p>\n<p>{p3}</p>\n<p>{p4}</p>"

def build_desc_hedge(c, seed):
    label = c['label']
    arch_a, arch_b = two_distinct(ARCHETYPES_HEDGE, seed, 'a')
    anchor_a, _ = two_distinct(ANCHORS_LAWN, seed, 'b')
    closer = pick(CLOSERS, seed, 'c')

    op_choice = stable_index(seed + 'op', 4)
    if op_choice == 0:
        p1 = (f"Hedge trimming is one of those jobs where the wrong tool turns a 30-minute task into a 2-hour fight. The {label} is the right tool. "
              f"Aaron points {arch_a} toward this one when they walk in tired of three-day cedar trims with an underpowered electric hedge cutter.")
    elif op_choice == 1:
        p1 = (f"The {label} is built for {arch_a} — somebody who's actually trimming hedges, not just buying a tool that looks the part. "
              f"Echo's hedge line earned its reputation across {anchor_a} on cedar, juniper, and the kind of overgrowth that the discount-store trimmer pretends doesn't exist.")
    elif op_choice == 2:
        p1 = (f"Across {anchor_a}, where cedar hedges are everywhere and they grow fast, the {label} is the one Aaron sees come back to the bench for routine sharpening — not warranty work. "
              f"That's the spread you want from a hedge trimmer that needs to last past one season.")
    else:
        p1 = (f"For {arch_a} with overgrowth that's gotten ahead of them, the {label} is the catch-up tool. "
              f"Echo built this one with the blade length and engine match that real hedge work demands — and Aaron will tell you straight whether it's the right size for your hedge or whether you'd want the longer-blade unit.")

    p2 = (f"Hedge trimmer geometry is everything — blade length, weight balance, where the engine sits. The {label} is dialled in for the customer who's actually trimming hedges, not just buying a tool. "
          f"Cedar hedges are common across {anchor_a}, and they grow fast — the right blade length and engine match for that work matters. "
          f"Double-sided blades, where Echo runs them, cut on both passes — half the time, half the back strain.")

    p3 = (f"{auth_line('Echo')} "
          "We keep blades and consumables at the counter, and Damian sharpens hedge trimmer blades in-shop on the bench — drop the unit off and we'll turn it around quick. Most homeowners don't sharpen hedge trimmer blades and lose half their cutting capacity for it; once a season is the right cadence to bring it in.")

    p4 = (f"For {arch_b} with cedar or boxwood hedges to keep tidy, the {label} is the right tool — sized right for a real-world hedge, not a decorative shrub. {closer}")

    return f"<p>{p1}</p>\n<p>{p2}</p>\n<p>{p3}</p>\n<p>{p4}</p>"

def build_desc_pressure(c, seed):
    label = c['label']
    arch_a, arch_b = two_distinct(ARCHETYPES_PRESSURE, seed, 'a')
    anchor_a, _ = two_distinct(ANCHORS_WATER, seed, 'b')
    closer = pick(CLOSERS, seed, 'c')

    op_choice = stable_index(seed + 'op', 4)
    if op_choice == 0:
        p1 = (f"Pressure washers spend most of the year in the shed and earn their keep in two weekends a season. The {label} is built for that pace. "
              f"Aaron points {arch_a} toward this one when they're done with the rental queue every spring.")
    elif op_choice == 1:
        p1 = (f"For {arch_a}, the {label} is the spring tool — dock and deck wash-down before the season really starts. "
              f"Echo's pressure washer line is built for the customer who wants real PSI without the maintenance overhead of a contractor unit.")
    elif op_choice == 2:
        p1 = (f"The {label} is the size we recommend most for {arch_a} on a typical {anchor_a} property. "
              f"It's enough power to lift a season's worth of grime off the deck and the dock, and not so much that you'll blow paint off the siding when you turn around.")
    else:
        p1 = (f"Around {anchor_a}, where dock-and-deck spring cleanup is the standard May routine, the {label} is the unit Aaron points customers toward. "
              f"It hits the right tier — pro-grade build, homeowner-priced, sized for a couple of weekends a year.")

    p2 = (f"PSI matters less than you'd think — what matters is consistent flow, a hose that doesn't kink, and a pump that holds pressure when the trigger's open for a sustained run. "
          f"Echo's {label} ships honest on all three. For dock-and-deck spring cleaning around {anchor_a}, the {label} hits the right tier — enough power to lift the season's grime, not so much that you blow paint off the siding. "
          f"Aaron talks customers down from over-buying on PSI more often than up.")

    p3 = (f"{auth_line('Echo')} "
          "When the pump needs service, we do it in-shop on the small-engine bench instead of shipping it out to a service centre — Damian handles pressure washer pump service end to end. Most pumps fail from sitting full of dirty water over winter, not from use — we'll show you how to winterise it properly.")

    p4 = (f"For {arch_b} with a dock, a deck, or a vinyl exterior to keep clean, the {label} is the right tier and the right service line. {closer}")

    return f"<p>{p1}</p>\n<p>{p2}</p>\n<p>{p3}</p>\n<p>{p4}</p>"

def build_desc_cordless(c, seed):
    label = c['label']
    arch_a, arch_b = two_distinct(ARCHETYPES_CORDLESS, seed, 'a')
    anchor_a, _ = two_distinct(ANCHORS_LAWN, seed, 'b')
    closer = pick(CLOSERS, seed, 'c')

    p1 = (f"If you're tired of the pull cord and the gas can, the {label} is Echo's 56V answer. "
          f"It runs on the same battery platform as the rest of Echo's cordless line — chainsaw, trimmer, blower, mower — so once you've bought one battery, the next tool is just the bare unit.")

    p2 = (f"Cordless equipment trades range for quiet. For the suburban lot across {anchor_a} where the neighbours appreciate not hearing a two-stroke at 8 a.m., that's a feature. "
          f"The 56V platform is one of the few cordless ecosystems where the runtime actually matches the marketing — Aaron's run these long enough to know which platforms hold up and which don't. "
          f"Echo's batteries hold charge through winter storage better than most competitors, which matters in a Northern Ontario garage.")

    p3 = (f"{auth_line('Echo')} "
          "That includes the 56V cordless line — battery service, warranty, and platform support all come through Reyco. We're not just selling boxes; we're standing behind the platform years past the sale. From the service side, the cordless tools come back for tool service, not battery warranty drama, which is the read you want before committing to a battery platform.")

    p4 = (f"For {arch_b}, the {label} is the upgrade path away from gas. Once you've got one Echo 56V battery, the next tool in the kit is just the bare unit — and that's where the platform pays off. {closer}")

    return f"<p>{p1}</p>\n<p>{p2}</p>\n<p>{p3}</p>\n<p>{p4}</p>"

def build_desc_dock(c, seed):
    label = c['label']
    arch_a, arch_b = two_distinct(ARCHETYPES_DOCK_LIFT, seed, 'a')
    anchor_a, anchor_b = two_distinct(ANCHORS_WATER, seed, 'b')
    closer = pick(CLOSERS_RJ, seed, 'c')

    op_choice = stable_index(seed + 'op', 4)
    if op_choice == 0:
        p1 = (f"R&J Machine has been making aluminum docks in Lakefield, Ontario for half a century. The {label} is one of their staples — and Reyco is an authorised R&J Machine dealer, which means we coordinate the whole install through R&J's network and stand behind it on the after-sales side too.")
    elif op_choice == 1:
        p1 = (f"Reyco is an authorised R&J Machine dealer, and the {label} is one of the most-asked-about pieces in the catalogue. "
              f"For {arch_a}, the conversation usually starts with shoreline photos and ends with a quote that lines up with the actual lakefront.")
    elif op_choice == 2:
        p1 = (f"For shorelines around {anchor_a}, the {label} is what gets installed most often. "
              f"R&J has been building this kind of dock since the 1970s — the design is proven, the install is repeatable, and the aluminum holds up against ice push year after year. Reyco's been the authorised R&J dealer locally for long enough to know how the install conversation should go.")
    else:
        p1 = (f"When somebody calls about putting in a new dock or replacing an old one, the {label} is often where the conversation lands. "
              f"R&J Machine builds in 6061T6 marine-grade aluminum, custom-sized — every dock is site-specific.")

    p2 = (f"R&J Machine builds in 6061T6 marine-grade aluminum, custom-sized to your shoreline. Every install is site-specific — bottom type, water depth, exposure all factor in. "
          f"After 50 years building docks for Ontario lakefront, R&J knows what holds up against ice push and what doesn't. The {label} is one of their proven designs for {anchor_b}. "
          f"The aluminum doesn't rot, doesn't splinter, doesn't soak up water and double in weight halfway through July.")

    p3 = (f"{auth_line('R&J Machine')} "
          f"Aluminum docks beat treated wood on every metric that matters at a cottage — rot, splinters, weight, service life. The {label} is no exception. "
          f"For the buyer who's done with rebuilding the dock every five years, the math works out before you even count the labour.")

    p4 = (f"For {arch_b} ready to put in a new dock or replace an aging one, the {label} is the conversation we have most often. {closer}")

    return f"<p>{p1}</p>\n<p>{p2}</p>\n<p>{p3}</p>\n<p>{p4}</p>"

def build_desc_lift(c, seed):
    label = c['label']
    arch_a, arch_b = two_distinct(ARCHETYPES_DOCK_LIFT, seed, 'a')
    anchor_a, anchor_b = two_distinct(ANCHORS_WATER, seed, 'b')
    closer = pick(CLOSERS_RJ, seed, 'c')

    op_choice = stable_index(seed + 'op', 3)
    if op_choice == 0:
        p1 = (f"The {label} is the R&J Machine boat lift we get the most calls about. "
              f"For {arch_a}, the upgrade from manually winching the boat in and out every season pays for itself in time and back strain inside two summers.")
    elif op_choice == 1:
        p1 = (f"If your lakefront has a real boat — not just a tin runabout — the {label} is built for it. "
              f"R&J's lift line is sized for everything from a 14-foot tin to a heavy pontoon, and the {label} sits in the sweet spot for most cottage boats around {anchor_a}.")
    else:
        p1 = (f"Aaron sees the {label} go out for cottages around {anchor_a} every spring. "
              f"R&J Machine has been building lifts for Ontario lakefronts for 50 years — they know what the freeze-thaw and ice push do to a lift over a decade of service.")

    p2 = (f"Boat lifts spend their lives in the water — the build matters more here than almost anywhere else in the catalogue. "
          f"The {label} is built to handle ice-up, spring launch, and the steady wear cycle that comes with sitting at the dock through July and August. "
          f"R&J's lift line ships with weight ratings that mean what they say — no marketing inflation. "
          f"After half a century of installs, R&J's after-sales service is one of the things that makes the line easy to recommend, especially up here where ice-out and storm damage are realities, not edge cases.")

    p3 = (f"{auth_line('R&J Machine')} "
          f"For {arch_b}, the lift is built and quoted around your specific boat weight, mounting style, and water depth — not picked off a shelf. We walk through the install conversation start to finish from the first phone call to the cradle going in.")

    p4 = (f"Stop in or call with your boat specs and shoreline photos and we'll start the conversation. The lead time on a custom build varies with the season — earlier in the year usually means earlier install. {closer}")

    return f"<p>{p1}</p>\n<p>{p2}</p>\n<p>{p3}</p>\n<p>{p4}</p>"

def build_desc_railway(c, seed):
    label = c['label']
    arch_a, arch_b = two_distinct(ARCHETYPES_DOCK_LIFT, seed, 'a')
    anchor_a, _ = two_distinct(ANCHORS_WATER, seed, 'b')
    closer = pick(CLOSERS_RJ, seed, 'c')

    p1 = (f"Marine railways aren't a small purchase — they're an installation, and the {label} is R&J Machine's answer for sloped shorelines around {anchor_a}. "
          f"When the shoreline drops too sharp for a dock or a lift, a railway is what makes the lakefront usable.")

    p2 = (f"The {label} runs on a winch system — manual or electric — that pulls the boat clean out of the water and up onto cradle rollers. No more lifting, no more dragging, no more dock damage when the boat misses the slip. "
          f"R&J's been building these for sloped Ontario lakefronts for decades — the design is proven, the install is bespoke per shoreline. "
          f"For lakefronts where the depth changes fast and the bottom is rock, this is often the only option that works.")

    p3 = (f"{auth_line('R&J Machine')} "
          f"Marine railways are site-specific — slope, water depth, soil type, ice exposure all factor in. We walk customers through the install conversation from the first phone call. "
          f"Aaron will tell you straight whether a railway makes sense for your geometry or whether a lift would be the better call.")

    p4 = (f"For {arch_b} with a sloped or rocky shoreline that won't take a conventional dock or lift, the {label} is the right answer. {closer}")

    return f"<p>{p1}</p>\n<p>{p2}</p>\n<p>{p3}</p>\n<p>{p4}</p>"

def build_desc_raft(c, seed):
    label = c['label']
    arch_a, arch_b = two_distinct(ARCHETYPES_DOCK_LIFT, seed, 'a')
    anchor_a, _ = two_distinct(ANCHORS_WATER, seed, 'b')
    closer = pick(CLOSERS_RJ, seed, 'c')

    p1 = (f"The {label} is the swim raft we hear customers ask about every spring. "
          f"Wave Armour's foam-injected polyethylene build doesn't waterlog over a summer of cannonballs — and the rafts Aaron sold ten years ago are still floating.")

    p2 = (f"For families with kids, a swim raft is the centerpiece of the cottage — and the {label} is built to last more than a season. "
          f"The construction is the differentiator: the foam-and-poly shell is the same kind of build the commercial dock manufacturers use on floating platforms. "
          f"No internal cavity to fill with water, no wood to rot underneath, no carpet to mildew.")

    p3 = (f"{stocked_line('Wave Armour')} "
          f"For cottages around {anchor_a}, the {label} sizes right to a typical swim area — big enough for the kids and the cooler, not so big you can't move it for winter. Most cottage families pull theirs in November and put it back in May without major effort.")

    p4 = (f"For {arch_b} prepping the cottage for swim season, the {label} is the centerpiece you order in March before the lead time stretches. Lead times tend to climb fast as the season warms up — once the cottagers all decide at once, the queue gets long. {closer}")

    return f"<p>{p1}</p>\n<p>{p2}</p>\n<p>{p3}</p>\n<p>{p4}</p>"

def build_desc_pwc_port(c, seed):
    label = c['label']
    arch_a, arch_b = two_distinct(ARCHETYPES_DOCK_LIFT, seed, 'a')
    anchor_a, _ = two_distinct(ANCHORS_WATER, seed, 'b')
    closer = pick(CLOSERS_RJ, seed, 'c')

    p1 = (f"Reyco stocks Wave Armour PWC ports — drive on, walk off, no straps. "
          f"The {label} is the one most cottages around {anchor_a} run, and it's the upgrade that takes the daily PWC routine from ten minutes to thirty seconds.")

    p2 = ("Wave Armour PWC ports use a roller-and-bunk design that lets you drive the PWC up and out of the water under its own power. "
          "No straps, no hoist, no ramp. The polyethylene construction holds up against UV, ice, and the weight cycle that comes with daily PWC use. "
          "The port floats high enough that the PWC sits clear of the water, which kills the algae and grime cycle on the hull. "
          "It's also the kind of feature that pays off the resale value of the PWC — clean hull, dry storage, no sun-bleached gel coat.")

    p3 = (f"{stocked_line('Wave Armour')} "
          f"Installs are coordinated through R&J Machine's network — Reyco handles the conversation from your first phone call to delivery and install. PWC port deliveries usually run on the same lead time as the spring dock orders.")

    p4 = (f"For {arch_b}, the {label} is one of the easier upgrades to a cottage waterfront. The hassle savings on the daily PWC routine pay back the install cost inside a season for most users. {closer}")

    return f"<p>{p1}</p>\n<p>{p2}</p>\n<p>{p3}</p>\n<p>{p4}</p>"

# ---------- expert review (Aaron voice) ----------

def build_review(c, seed):
    sub = c['subtype']
    label = c['label']
    brand = c['brand']
    series = derive_series(brand, c.get('model', ''))

    # Aaron = Co-Owner / Service Manager. Voice = bench POV (what comes back, what holds up),
    # NOT salesperson voice. Avoid "I tell my customers" / "I've sold". Use "I see" / "I service" /
    # "When somebody walks in, I steer them to" / "Running the service department here…"
    if 'Riding Mower' in sub or 'Rear-Engine' in sub or sub == 'Mower':
        arch = pick(ARCHETYPES_LAWN, seed, 'rev_a')
        anchor = pick(ANCHORS_LAWN, seed, 'rev_b')
        opts = [
            f"Running the service department here, the {label} is one of the units I see come back for routine spring tune-ups, not warranty drama. That's the difference that matters past year three. For {arch} on a real Northern Ontario lawn, this size and platform is what I'd put on my own property — and that's the recommendation I give when somebody walks into the showroom asking. Drop in and I'll walk you through what to expect across a decade of weekend mowing. — Aaron, Service Manager",
            f"I service enough of these every season to know which ones I'd put on my own property — the {label} is on that list. The {series} platform shows up on the bench for the things that should wear (deck belts, spindles around year four) and not for the things that shouldn't (engines, transmissions). When somebody asks me which {brand} ride-on to buy, this is the size I steer most {anchor} customers toward. Stop in and we'll look at your lot together. — Aaron, Service Manager",
            f"When a customer comes in asking which {brand} ride-on to buy, I tell them the one I see least often back on the bench — and the {label} is on that short list. I'm not trying to upsell you; I'm telling you what holds up after the third spring. For {arch}, this is the right size and tier. Drop in and we'll go through it. — Aaron, Co-Owner & Service Manager",
            f"As the Service Manager here, I get the honest read on which platforms hold up across {anchor} — the {label} is one of them. The customers who buy this size and use it properly come back for spark plugs and tune-ups, not warranty drama. For {arch}, the trade-off pencils out: a unit that'll still be running in year ten with parts and service all coming through one shop. — Aaron, Service Manager",
        ]
    elif 'Zero-Turn' in sub:
        arch = pick(ARCHETYPES_LAWN, seed, 'rev_a')
        anchor = pick(ANCHORS_LAWN, seed, 'rev_b')
        opts = [
            f"Running the service side here, I see what comes back through the bench — and {brand}'s residential zero-turn line, including the {label}, comes back for routine service, not warranty fights. The lever steering takes a weekend to learn; after that, the time savings versus a tractor are real. When somebody walks into the showroom asking, I steer most {arch} toward this size. — Aaron, Service Manager",
            f"As Service Manager, my honest read on the {label} is this: the wear items (hydrostatic units, spindle bearings, deck belts) come back on schedule around year four, which is normal. The engine and the frame don't come back. That's the read I'd want from a service department before spending zero-turn money. Drop in and I'll be honest about whether it fits your lot. — Aaron, Service Manager",
            f"The {label} is the zero-turn I'd recommend if you've got a property where straight rows and tight pivots both matter. I see these on the bench for routine service across {anchor} — not warranty drama. For {arch}, this is the upgrade that changes how Saturdays go. Drop in and try one. — Aaron, Co-Owner & Service Manager",
        ]
    elif 'Push' in sub and 'Cordless' not in sub:
        arch = pick(ARCHETYPES_LAWN, seed, 'rev_a')
        opts = [
            f"Push mowers don't get enough respect. As Service Manager I see the {label} come in for spark plugs and air filters, not engines or transmissions — that's the read you want before you buy. For {arch} with a small lot, this is more practical than a tractor that sits in the shed eleven months a year. Drop in and pick one up off the floor. — Aaron, Service Manager",
            f"The {label} is the push mower I'd point {arch} toward. {brand}'s been making this kind of mower for decades and from the service side, I see them come back for routine wear, not warranty work. — Aaron, Co-Owner & Service Manager",
        ]
    elif 'Chainsaw' in sub or 'Cut-Off Saw' in sub:
        arch = pick(ARCHETYPES_SAW, seed, 'rev_a')
        anchor = pick(ANCHORS_LAWN, seed, 'rev_b')
        opts = [
            f"As Service Manager, my honest read on the {label} is this: I see them on the bench in October for chain sharpenings and routine tune-ups, not for engine work. That's the spread you want from a saw you're putting through real firewood. For {arch} across {anchor}, this saw is the recommendation I give when somebody walks into the showroom asking. — Aaron, Service Manager",
            f"Echo's pro-grade line earned its reputation in the Sault by being the saws that come back for sharpenings, not warranty work. The {label} sits squarely in that group. I service enough of these to know which ones hold up — this one does. For {arch}, the price difference versus a box-store saw pays for itself across two seasons of cuts. — Aaron, Co-Owner & Service Manager",
            f"The {label} is the saw I see in the back of every serious firewood guy's truck around the Sault — and from the service side, that's because I'm sharpening chains for them, not pulling apart engines. Echo doesn't market hard and that's fine; the saws sell themselves and I've never had to apologise for the recommendation. — Aaron, Service Manager",
            f"Running the service department, I get the honest read on which Echo saws hold up across {anchor} — the {label} is one of them. For {arch}, this saw starts cold, holds tune, and doesn't burn through chains. Drop in and we'll show it to you on the floor. — Aaron, Service Manager",
        ]
    elif 'Blower' in sub or 'Shred' in sub:
        arch = pick(ARCHETYPES_BLOWER, seed, 'rev_a')
        anchor = pick(ANCHORS_LAWN, seed, 'rev_b')
        opts = [
            f"As Service Manager, the read I give on Echo blowers is straightforward: the {label} comes back to the bench for routine air filter work, not engine drama. That's the spread you want before October. For {arch}, this is the size I'd recommend — anything smaller and you'll regret it, anything bigger and you're carrying weight for no reason. — Aaron, Service Manager",
            f"I see what comes back through the service department, and the {label} comes back on schedule for tune-ups, not warranty work. Echo blowers start cold on October mornings — which sounds basic until you've owned one that doesn't. For {arch} across {anchor}, this is the platform I'd point you to. — Aaron, Co-Owner & Service Manager",
            f"Of all the blowers we sell, the {label} is one I'd run on my own property — and from the service side, that's the honest read. The fall is hard on small engines and Echo handles it better than most. Drop in and try the harness on if it's a backpack. — Aaron, Service Manager",
        ]
    elif 'Hedge' in sub:
        arch = pick(ARCHETYPES_HEDGE, seed, 'rev_a')
        anchor = pick(ANCHORS_LAWN, seed, 'rev_b')
        opts = [
            f"Running the service side here, my read on Echo hedge trimmers is good — the {label} comes back for routine blade sharpening, not warranty work. For {arch} across {anchor}, this is the right tool. Drop in and Damian or I will show you the difference between this and the underpowered electric you've been fighting. — Aaron, Service Manager",
            f"The {label} is what I'd recommend for anybody with a real cedar hedge. As Service Manager, I see them on the bench for routine sharpening — not engine work. That's the read you want before buying a hedge trimmer that needs to last. — Aaron, Co-Owner & Service Manager",
            f"I service a lot of hedge trimmers, and the {label} is one I'd buy myself. The blade length and weight balance are dialled in for {arch}. — Aaron, Service Manager",
        ]
    elif 'Trimmer' in sub or 'Powerhead' in sub or 'Edger' in sub:
        arch = pick(ARCHETYPES_TRIMMER, seed, 'rev_a')
        anchor = pick(ANCHORS_LAWN, seed, 'rev_b')
        opts = [
            f"As Service Manager I get a clear read on which trimmers hold up — the {label} is one of them. The conversation is always the same: straight shaft or curved, gas or cordless. For {arch} who's tired of cheap trimmers that quit halfway through the season, this is the upgrade I'd recommend. Drop in and feel the balance — it matters over an hour of trimming. — Aaron, Service Manager",
            f"Echo's {label} comes back to the service department for line replacements and routine tune-ups, not warranty drama. I service enough of these across {anchor} to know the spread. For {arch}, this is the trimmer that earns its money across the season. — Aaron, Co-Owner & Service Manager",
            f"The {label} is the trimmer I'd put in {arch}'s hand. Echo's pro line is over-engineered for homeowner use, which is exactly what you want from a tool you're running an hour at a stretch. — Aaron, Service Manager",
        ]
    elif 'Pressure' in sub:
        arch = pick(ARCHETYPES_PRESSURE, seed, 'rev_a')
        opts = [
            f"As Service Manager, my honest read on the {label} is this: it comes back to the bench for routine pump service every couple seasons, which is normal wear — not warranty drama. For {arch}, this hits the right tier. Most homeowners over-buy on PSI; we'll talk you down to the right size. Drop in. — Aaron, Service Manager",
            f"The {label} is the pressure washer I recommend for {arch}. From the service side, Echo's gas units start reliably cold and hold pressure consistently. We see them on the bench for routine pump maintenance, not for the engines. — Aaron, Co-Owner & Service Manager",
        ]
    elif 'Cordless' in sub:
        arch = pick(ARCHETYPES_CORDLESS, seed, 'rev_a')
        opts = [
            f"Running the service department, I get the read on which cordless platforms hold up — Echo's 56V is one of the few I'd actually recommend. The {label} runs on the same battery as the rest of the cordless line, and from the bench side, the batteries hold their charge through winter storage better than most competitors. For {arch}, this is the upgrade path away from the gas can. — Aaron, Service Manager",
            f"As Service Manager I see what comes back, and the Echo 56V cordless line — including the {label} — comes back for tool service, not battery warranty drama. That's the read you want before buying into a cordless ecosystem. For {arch}, this is the platform I'd commit to. — Aaron, Co-Owner & Service Manager",
        ]
    elif 'Dock' in sub:
        arch = pick(ARCHETYPES_DOCK_LIFT, seed, 'rev_a')
        anchor = pick(ANCHORS_WATER, seed, 'rev_b')
        opts = [
            f"I get called out for service on docks all over Algoma — the R&J builds are the ones I see hold up through ice-out year after year. The {label} is one of those. For {arch} around {anchor}, the aluminum is the right call — no rot, no splinters, no warping. Send shoreline photos to 705-253-7828 and we'll start the conversation. — Aaron, Co-Owner & Service Manager",
            f"As Service Manager I see the after-install side of docks across {anchor} — the {label} is one of R&J's designs that consistently comes through ice-up without major repair. For {arch}, this is the dock I'd recommend. Stop in with shoreline photos. — Aaron, Service Manager",
            f"From the service side, the {label} is one of R&J's strongest builds — the install is repeatable and the after-season repair calls are minimal. As the authorised R&J dealer locally, Reyco handles the whole conversation start to finish. — Aaron, Co-Owner & Service Manager",
        ]
    elif 'Lift' in sub or 'Roof' in sub:
        arch = pick(ARCHETYPES_DOCK_LIFT, seed, 'rev_a')
        anchor = pick(ANCHORS_WATER, seed, 'rev_b')
        opts = [
            f"Boat lifts are where build quality matters most — the lift sits in the water year-round taking ice push and spring launch. From the service side, R&J's lifts around {anchor} hold up year after year. The {label} is one I'd recommend for {arch}. Stop in with your boat weight and shoreline depth and we'll size it. — Aaron, Co-Owner & Service Manager",
            f"As Service Manager, the read I give on R&J's lift line is honest: the weight ratings mean what they say. I've serviced enough of these around {anchor} to know the call-back rate is near zero. For {arch}, the {label} is the right size and build. — Aaron, Service Manager",
            f"From the service side I see what fails and what doesn't — and the R&J lift line is one I trust. The {label} sits in the sweet spot for the typical cottage boat. Drop in with your specs. — Aaron, Co-Owner & Service Manager",
        ]
    elif 'Railway' in sub:
        arch = pick(ARCHETYPES_DOCK_LIFT, seed, 'rev_a')
        anchor = pick(ANCHORS_WATER, seed, 'rev_b')
        opts = [
            f"Marine railways are a serious install — sloped shoreline, winch system, cradle rollers — and from the service side, R&J's around {anchor} are the ones I see hold up across decades. The {label} is the unit I recommend when a dock or a lift won't work for the geometry. As authorised R&J dealer locally, Reyco handles the conversation start to finish. Call 705-253-7828 with shoreline photos. — Aaron, Co-Owner & Service Manager",
        ]
    elif 'Raft' in sub:
        arch = pick(ARCHETYPES_DOCK_LIFT, seed, 'rev_a')
        opts = [
            f"From the service side, Wave Armour rafts hold up — the {label} is one of those pieces where the rafts we placed ten years ago are still floating. For families with kids, this is the cottage centerpiece. Reyco stocks Wave Armour through R&J Machine's network. Drop in or call to order before swim season. — Aaron, Co-Owner & Service Manager",
            f"I've seen a lot of swim rafts come and go over the years — Wave Armour is the one that holds up. Built to last, no waterlogging, easy to install. — Aaron, Service Manager",
        ]
    elif 'PWC' in sub:
        arch = pick(ARCHETYPES_DOCK_LIFT, seed, 'rev_a')
        anchor = pick(ANCHORS_WATER, seed, 'rev_b')
        opts = [
            f"PWC ports save the launch routine — drive on, walk off, no straps. As Service Manager I've seen these around {anchor} hold up against UV and ice. The {label} is the Wave Armour piece I'd recommend for {arch}. Stop in with your PWC specs. — Aaron, Co-Owner & Service Manager",
        ]
    else:
        opts = [f"From the service side, the {label} is one Reyco's stocked for years. The customers who buy this come back for routine service, not warranty drama. Drop in at White Oak Drive to see it on the floor. — Aaron, Service Manager"]

    return pick(opts, seed, 'rev_pick')

# ---------- specs sanitiser ----------

def sanitise_specs(c, raw_specs, headers, row):
    fields = {'Make': '', 'Model': '', 'Year': '', 'Type': '', 'Class': ''}
    if raw_specs:
        for line in raw_specs.split('\n'):
            if '|' in line:
                k, v = line.split('|', 1)
                if k.strip() in fields:
                    fields[k.strip()] = v.strip()
    if not fields['Make']:
        fields['Make'] = c['brand']
    # Override Model with our parsed friendly model where applicable
    if c['brand'] == 'Echo':
        fields['Model'] = parse_echo_model(c['name'])
    elif c['brand'] in ('Cub Cadet', 'Toro') and c.get('model'):
        fields['Model'] = c['model']
    elif not fields['Model']:
        fields['Model'] = row[headers.index('Meta: _product_sku')] or ''
    if not fields['Year']:
        fields['Year'] = c.get('year', '') or ''
    if not fields['Type']:
        fields['Type'] = c['subtype']
    if not fields['Class']:
        fields['Class'] = get_class(row, headers) or c['subtype']
    parts = [f"{k}|{fields[k]}" for k in ('Make', 'Model', 'Year', 'Type', 'Class') if fields[k]]
    return '\n'.join(parts)

# ---------- main row processor ----------

DESC_BUILDERS = {
    'Riding Mower': build_desc_riding,
    'Rear-Engine Riding Mower': build_desc_riding,
    'Mower': build_desc_riding,
    'Zero-Turn Mower': build_desc_zt,
    'Push Mower': build_desc_push,
    'Chainsaw': build_desc_chainsaw,
    'Cordless Chainsaw': build_desc_cordless,
    'Cut-Off Saw': build_desc_chainsaw,
    'Walk-Behind Cut-Off Saw': build_desc_chainsaw,
    'Backpack Blower': build_desc_blower,
    'Handheld Blower': build_desc_blower,
    'Cordless Handheld Blower': build_desc_cordless,
    'Cordless Blower': build_desc_cordless,
    'Handheld Shred/Vac': build_desc_blower,
    'String Trimmer': build_desc_trimmer,
    'Cordless String Trimmer': build_desc_cordless,
    'Curved-Shaft Trimmer': build_desc_trimmer,
    'Cordless PAS Powerhead': build_desc_cordless,
    'PAS Powerhead': build_desc_trimmer,
    'Walk-Behind Edger': build_desc_trimmer,
    'Hedge Trimmer': build_desc_hedge,
    'Cordless Hedge Trimmer': build_desc_cordless,
    'Articulating Hedge Trimmer': build_desc_hedge,
    'Shafted Hedge Trimmer': build_desc_hedge,
    'Pressure Washer': build_desc_pressure,
    'Electric Pressure Washer': build_desc_pressure,
    'Cordless Push Mower': build_desc_cordless,
    'Cordless Self-Propelled Mower': build_desc_cordless,
    'Cordless Mower': build_desc_cordless,
    'Aluminum Dock': build_desc_dock,
    'Floating Dock': build_desc_dock,
    'Step Dock': build_desc_dock,
    'Modular Dock': build_desc_dock,
    'Boat Lift': build_desc_lift,
    'PWC Lift': build_desc_lift,
    'Boat Lift Roof': build_desc_lift,
    'Marine Railway': build_desc_railway,
    'Swim Raft': build_desc_raft,
    'PWC Port': build_desc_pwc_port,
}

def process_row(row, headers):
    c = classify_row(row, headers)
    sub = c['subtype']
    fallback = (c['brand'] in ('Cub Cadet', 'Toro') and not c.get('codename'))
    # On fallback (no Lightspeed CodeName), extract model from the original input name
    # (pattern: "YYYY {Brand} {ModelNumber}") so we get the actual Toro/Cub Cadet model code,
    # not the WP SKU which can be a different identifier.
    if fallback:
        m = re.search(r'^20\d{2}\s+(?:Cub\s+Cadet|Toro)\s+(\S+)', c.get('name', ''))
        if m:
            c['model'] = m.group(1)
        else:
            c['model'] = row[headers.index('Meta: _product_sku')] or row[headers.index('Meta: _lightspeed_unit_id')] or 'unit'
    elif c['brand'] in ('Cub Cadet', 'Toro') and not c.get('model'):
        c['model'] = row[headers.index('Meta: _product_sku')] or 'unit'
    c['fallback'] = fallback
    c['label'] = build_label(c)
    seed = row[headers.index('ID')] + '|' + row[headers.index('Meta: _product_sku')]
    builder = DESC_BUILDERS.get(sub, build_desc_riding)
    return {
        'name': build_name(c),
        'short': build_short(c),
        'description': builder(c, seed),
        'expert_id': '4',
        'expert_review': build_review(c, seed),
        'specs': sanitise_specs(c, row[headers.index('Meta: _product_specs')], headers, row),
        'slug': category_slug(c['brand'], c['subtype']),
        'classified': c,
    }

def write_output(rows_in, headers_in, out_path):
    """Write the full output CSV: original 60 cols (with rewrites) + 1 new column."""
    new_headers = list(headers_in) + ['Reyco Category Slug']
    # Column indices we replace
    idx_name   = headers_in.index('Name')
    idx_short  = headers_in.index('Short description')
    idx_desc   = headers_in.index('Description')
    idx_specs  = headers_in.index('Meta: _product_specs')
    idx_xid    = headers_in.index('Meta: _product_expert_id')
    idx_xrev   = headers_in.index('Meta: _product_expert_review')
    with open(out_path, 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f, quoting=csv.QUOTE_MINIMAL)
        w.writerow(new_headers)
        for r in rows_in:
            out = process_row(r, headers_in)
            new_row = list(r)
            new_row[idx_name]  = out['name']
            new_row[idx_short] = out['short']
            new_row[idx_desc]  = out['description']
            new_row[idx_specs] = out['specs']
            new_row[idx_xid]   = out['expert_id']
            new_row[idx_xrev]  = out['expert_review']
            new_row.append(out['slug'])
            w.writerow(new_row)
    return len(rows_in)

if __name__ == '__main__':
    import sys
    mode = sys.argv[1] if len(sys.argv) > 1 else 'sample'
    with open(INPUT, newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        headers = next(reader)
        rows = list(reader)

    if mode == 'write':
        n = write_output(rows, headers, OUTPUT)
        print(f'Wrote {n} rows to {OUTPUT}')
        sys.exit(0)

    samples = []
    seen = set()
    for r in rows:
        b = normalise_brand(r[40])
        if b not in seen:
            samples.append(r); seen.add(b)
    print(f"=== SAMPLE OUTPUT ({len(samples)} rows, one per brand) ===\n")
    for r in samples:
        out = process_row(r, headers)
        print(f"--- ID {r[0]} | brand={out['classified']['brand']} | sub={out['classified']['subtype']} ---")
        print(f"NAME: {out['name']}")
        print(f"SHORT ({words_count(out['short'])}w): {out['short']}")
        print(f"DESC ({words_count(out['description'])} words):")
        print(out['description'])
        print(f"REVIEW ({words_count(out['expert_review'])}w): {out['expert_review']}")
        print(f"SPECS:\n{out['specs']}")
        print(f"SLUG: {out['slug']}")
        print()
