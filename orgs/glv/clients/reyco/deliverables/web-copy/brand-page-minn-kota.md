# Brand Page Copy — Minn Kota

**For:** dev — to wire into `boats-marine--minn-kota.php` mirroring `boats-marine--mercury.php` structure
**Source pattern:** Format A, Mercury config exact mirror
**Authorised dealer:** Yes (per Aiden 2026-04-28 banked roster)
**Carousel taxonomy:** `product_category` (custom theme taxonomy, NOT WC `product_cat`)

---

## 1. Hero

```
title:    Minn Kota Trolling Motors
subtitle: Authorised Minn Kota dealer in Sault Ste Marie. Bow-mount and transom-mount trolling motors, Riptide saltwater units, kayak motors, and Precision on-board chargers — rigged, installed, and serviced at Reyco Marine.
image:    hero-boats.jpg
badge:    Authorised Minn Kota Dealer
```

---

## 2. Intro

```
badge:    The Quiet Approach
headline: Minn Kota Trolling Motors: Precision Power for Lake Superior and Beyond
```

**body** (3 paragraphs, internal links inline):

```html
<p>For sixty years, Minn Kota has been the name serious anglers reach for when they need to slip into a fishing spot without spooking the fish. The St. Marys River walleye, the Lake Superior lake trout off Goulais Bay, the smallmouth bass in the back-bay weed beds south of the Sault — none of them tolerate noise. A trolling motor that hums and a hull that drifts on its own current is the difference between a fish on the line and an empty net. That is why Reyco Marine carries the full Minn Kota lineup at our shop on White Oak Drive — and why we rig and install them ourselves on every boat that leaves the floor.</p>
<p>As an authorised Minn Kota dealer in Sault Ste Marie, we stock and service the motors that work on Northern Ontario water. The Terrova bow-mount line — cable-steer or i-Pilot equipped — is the most-rigged trolling motor on the boats we sell, paired with <a href="/boats-and-marine/princecraft/">Princecraft</a> fishing rigs and other multi-species hulls. The Ulterra adds the auto-deploy and auto-stow features that older anglers and any one-person crew appreciates after a long day on the water. The Endura transom-mount line covers smaller boats, kayaks, and back-up applications. And every Precision on-board charger we sell extends the life of the lithium and AGM batteries that power the modern trolling-motor setup. We work with the full Minn Kota Salsify catalogue — if you want a specific Ultrex QUEST CHIRP variant or a Riptide saltwater spec for trailered Great Lakes runs, we can source it directly from Minn Kota.</p>
<p>Buying a Minn Kota from Reyco means buying the install, the wiring, and the long-term service alongside the motor. Lee runs the marine bench here and does the rigging in-house — the bow plate, the breaker and battery wiring, the i-Pilot pairing with your <a href="/boats-and-marine/fish-finders/">fish finder</a>, the on-board charger mount. We do not ship motors out for warranty work; if a foot pedal acts up or a battery cable cooks, the same team that installed it handles the fix. That is the trade-off you make buying local: you pay for proximity and you get it back in the form of nobody between you and the guy fixing your gear.</p>
```

---

## 3. Experts

**Two-expert array** for Minn Kota (Casey for customer-match perspective, Lee for service/rigging perspective):

```
[
  {
    name:        Casey Davieaux,
    credentials: Owner, Reyco Marine & Small Engine Ltd.,
    quote:       I tell every angler who walks in asking about a trolling motor the same first question: what hull are you putting it on, and what kind of fishing are you doing? A Terrova on a 17-foot Princecraft Pro Series for tournament walleye is a different conversation than an Endura on a 12-foot tinny for back-lake bass. Minn Kota gives us the full range to match the hull and the use, and that is why I have stayed loyal to the brand. The motor is only as good as the install — and we make sure the install is right.,
  },
  {
    name:        Lee,
    credentials: Service Tech (Big Engine, Boats, ATV, UTV), Reyco Marine,
    quote:       I rig the trolling motor side of the bench, and Minn Kota is the platform I trust to put on a customer's boat without worrying about it coming back six months later for a bad ground or a fried foot pedal. The wiring discipline matters as much as the motor itself — battery isolation, the right gauge cable, a proper on-board charger sized to the bank you are running. We take the time on the install so the customer is not the one figuring it out at the launch on opening day.,
  },
]
```

---

## 4. Subcategories

**Three subcategory carousels** — Terrova will populate post-tag-pass, Ulterra + Endura intentionally empty (Reyco doesn't currently stock; copy promises the full authorised lineup, hide-on-empty when carousel plugin lands per boss).

```
[
  {
    heading:       Terrova Bow-Mount Trolling Motors,
    description:   The Terrova line is the workhorse of the Minn Kota lineup and the most-rigged trolling motor on the boats Reyco sells. Cable-steer simplicity for anglers who prefer foot-pedal control, or i-Pilot wireless for hands-free Spot-Lock and trolling-pattern automation. Available in 55, 80, and 112 lb thrust with shaft lengths from 45 inches up to 100 inches for taller transom applications. The Ultrex QUEST variants add Dual Spectrum CHIRP sonar built into the motor itself — for tournament-serious anglers running integrated sonar networks. Every Terrova we sell is rigged on the bow plate and wired in-house at Reyco.,
    taxonomy_term: terrova,
    taxonomy:      product_category,
  },
  {
    heading:       Ulterra Auto-Deploy Trolling Motors,
    description:   The Ulterra adds the feature that older anglers and one-person crews appreciate most: power-deploy and power-stow at the touch of a button. No more leaning over the bow to muscle the motor down at the launch or back up at the dock. For a customer running solo on Lake Superior in choppy water, or anyone who wants to fish without working the deployment, the Ulterra is the smart upgrade. Same i-Pilot wireless control and the same Spot-Lock GPS anchoring as the Terrova line. Available on order through our authorised Minn Kota supply chain — call us with the thrust and shaft length you need.,
    taxonomy_term: ulterra,
    taxonomy:      product_category,
  },
  {
    heading:       Endura Transom-Mount Trolling Motors,
    description:   The Endura is Minn Kota's transom-mount line — built for smaller fishing boats, canoes, and kayaks where a bow-mount does not fit or is not needed. 30 to 55 lb thrust, hand-control tiller steering, freshwater-rated. Endura is what we put on the back of a 14-foot tinny for back-lake fishing or as a get-home backup on a larger rig. Reliable, lightweight, and the most affordable way into a Minn Kota motor. Available on order through our authorised Minn Kota supply chain.,
    taxonomy_term: endura,
    taxonomy:      product_category,
  },
]
```

---

## 5. Why Choose

```
headline: Why Buy Minn Kota from Reyco Marine
reasons: [
  {
    icon:        verified,
    title:       Authorised Minn Kota Dealer,
    description: Factory-direct pricing on the full Minn Kota lineup — Terrova, Ulterra, Endura, Riptide saltwater, Kayak Terrova, and Precision on-board chargers. Genuine parts and full manufacturer warranty handled in-house at Reyco.,
  },
  {
    icon:        engineering,
    title:       Hull-Specific Rigging,
    description: We match thrust, shaft length, and steering type to your specific hull. Too short a shaft and the prop ventilates in chop; too long and the motor drags. We get the geometry right before the install.,
  },
  {
    icon:        build,
    title:       In-House Install + Wiring,
    description: Lee on the marine bench rigs every Minn Kota we sell — bow plate, breaker and battery wiring, on-board charger mount, i-Pilot pairing with your fish finder. No shipping the boat out, no separate marine-electrician bill.,
  },
  {
    icon:        inventory,
    title:       Parts and Charger Stock,
    description: We keep common Minn Kota parts in stock — props, foot-pedal cables, breaker assemblies, and the Precision charger lineup for 2-, 3-, and 4-bank installs. For specialty parts and full motor units, we source direct from Minn Kota with typical 1-3 week lead times.,
  },
]
```

---

## 6. Local Context

```
headline: Minn Kota Built for Northern Ontario Fishing
```

**body** (HTML, 2 paragraphs):

```html
<p>Northern Ontario water is hard on trolling motors. Cold spring runs when the lake is barely above freezing, mineral-rich back-bay weed beds that wrap props and stress the lower unit, and the long Lake Superior days when an angler runs the motor for ten hours straight chasing lake trout off the North Shore. Minn Kota's marine engineering — sealed lower units, corrosion-protected wiring, and the quietest motor profile in the market — is built for exactly this kind of use. Our customers are not weekend pond anglers. They are running the St. Marys River for spring walleye, the Goulais Bay area for smallmouth, and the offshore Lake Superior structure for lake trout and salmon. The Minn Kota motors we install handle every one of those scenarios for years on end with proper <a href="/service/winterization/">winterization</a> and battery care.</p>
<p>Whether you are running an Endura 30 lb on the back of a 12-foot tinny on a quiet back lake, or an Ultrex QUEST 115 with full i-Pilot integration on a tournament-rigged Princecraft Pro Series, Reyco Marine at 11 White Oak Drive East in Sault Ste Marie is your authorised Minn Kota dealer and <a href="/service/marine/">service centre</a>. Lee handles the rigging and install; Casey works through the hull-and-use match before you commit. Drop in to see what is on the floor or call 705-253-7828 to talk through your specific boat.</p>
```

---

## 7. FAQ

```
[
  {
    q: What thrust trolling motor do I need for my boat?,
    a: As a rough rule, you want at least 2 lb of thrust per 100 lb of fully-loaded boat weight — including motor, fuel, gear, and passengers. For a 16- to 17-foot fishing boat, that usually means a 55 to 80 lb Terrova. For larger pontoons or fully-rigged tournament boats, an 80 to 112 lb Ulterra or Riptide. Bring us the boat details or describe your setup and we will spec it correctly the first time.,
  },
  {
    q: What shaft length should I order?,
    a: Measure from the top of the bow deck (where the motor mounts) to the waterline at full load, then add about 20 inches to keep the prop fully submerged in chop. For most Princecraft and similar 16-18 foot hulls that puts you at a 45 to 52 inch shaft. Larger hulls and pontoons usually need 60 to 87 inches. We will measure and recommend if you bring the boat by the shop.,
  },
  {
    q: Do I need an on-board charger?,
    a: If you fish more than once a week or want to extend battery life, yes. A Minn Kota Precision charger sized to your battery bank — 2-, 3-, or 4-bank — keeps the batteries topped without overcharging. We install the charger when we rig the motor; the wiring is straightforward and the charger pays for itself in battery longevity within two seasons.,
  },
  {
    q: Can you service a Minn Kota I bought somewhere else?,
    a: Yes. As an authorised Minn Kota dealer, we service all Minn Kota motors regardless of where they were purchased. Bring it in or describe the issue and Lee will work through it on the marine bench.,
  },
  {
    q: Do you carry Minn Kota parts in stock?,
    a: We stock common parts — props, foot-pedal cables, breaker assemblies, and the Precision charger lineup. For less common parts or full replacement motors, we source direct from Minn Kota with typical 1-3 week lead times. Most repairs we can complete same-day or next-day with stock parts.,
  },
  {
    q: Will my Minn Kota work with my fish finder?,
    a: Most modern Minn Kota motors integrate with Humminbird and Lowrance fish-finder networks via i-Pilot Link or compatible. We pair the motor with your finder during install and walk you through the menus before the boat leaves the shop. If you are running a Humminbird, the integration is particularly tight — Minn Kota and Humminbird are sister brands and the network handshake is built in.,
  },
]
```
