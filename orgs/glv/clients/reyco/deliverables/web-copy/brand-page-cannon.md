# Brand Page Copy — Cannon

**For:** dev — to wire into `boats-marine--cannon.php` mirroring `boats-marine--mercury.php` structure
**Source pattern:** Format A, Mercury config exact mirror
**Authorised dealer:** Yes (per Aiden 2026-04-28 banked roster)
**Carousel taxonomy:** `product_category` (custom theme taxonomy, NOT WC `product_cat`)

---

## 1. Hero

```
title:    Cannon Downriggers
subtitle: Authorised Cannon dealer in Sault Ste Marie. Electric and manual downriggers, weights, and trolling accessories — rigged, installed, and serviced at Reyco Marine for Lake Superior and Great Lakes salmon and trout fishing.
image:    hero-boats.jpg
badge:    Authorised Cannon Dealer
```

---

## 2. Intro

```
badge:    The Trolling Standard
headline: Cannon Downriggers: Precision Depth Control for Lake Superior and the Great Lakes
```

**body** (3 paragraphs, internal links inline):

```html
<p>Lake Superior salmon and lake trout do not come up to meet you. Coho holding at sixty feet over the offshore structure off Gros Cap, lake trout suspended at eighty to a hundred and twenty feet over the deep water off Goulais Bay, chinook running deep on a thermocline that shifts week-to-week through July and August — getting a bait to the right depth at the right speed is the entire game. That is why serious Great Lakes trollers run downriggers, and that is why Reyco Marine carries the full Cannon lineup at our shop on White Oak Drive. Cannon has been building downriggers in the United States since 1968, and they remain the brand most charter captains and serious recreational trollers reach for first.</p>
<p>As an authorised Cannon dealer in Sault Ste Marie, we stock and rig the downriggers that actually get used on our water. The Optimum TS line is the flagship — variable-speed retrieval, integrated GPS positioning, depth-and-speed sync to your <a href="/boats-and-marine/fish-finders/">Humminbird or Lowrance fish finder</a>, and the smartest auto-deploy logic on the market. The Magnum 10 TS and Magnum 10 cover the workhorse electric segment — fast retrieval, dependable motors, the rigger most of our customers actually fish with day-to-day. The Uni-Troll line is the manual choice for trollers who want the precision of a Cannon without the electric overhead. And the Easi-Troll and Mini-Troll fill in the smaller-boat and back-up applications. We work with the full Cannon Salsify catalogue — if you need a specific dual-rigger setup with Uni-Stacker outputs or a particular weight loadout for chinook depths, we source it directly.</p>
<p>Buying a Cannon from Reyco means buying the install and the trolling-rig setup alongside the downrigger. Lee runs the marine bench here and handles the rigging — the gunwale or transom mount, the wiring for the electric units, the fish-finder integration, the rod-holder geometry that keeps your spread from tangling on a turn. Cannon downriggers are an integration product, not a bolt-on accessory: every <a href="/boats-and-marine/princecraft/">Princecraft fishing boat</a> we rig with downriggers gets the layout planned to match how you actually fish. That is the trade-off you make buying local: you pay for the install knowledge and you get it back the first time you set a clean four-rod spread without thinking about it.</p>
```

---

## 3. Experts

**Single expert** for Cannon (Casey for the rigging-and-use angle):

```
[
  {
    name:        Casey Davieaux,
    credentials: Owner, Reyco Marine & Small Engine Ltd.,
    quote:       Downriggers are the gear that separates a guy who catches a salmon every couple of trips from a guy who fills the cooler. The Cannon Optimum line, in particular, has changed what a recreational angler can do on Lake Superior — depth and speed sync to the fish finder, GPS positioning, integrated trolling control. It is closer to what charter captains run than what we used to sell to weekend anglers ten years ago. We rig them, we service them, and we make sure the install matches how you actually fish — gunwale geometry, rod-holder spread, the weight loadout for the species you are chasing.,
  },
]
```

---

## 4. Subcategories

**Single subcategory carousel** — one `downriggers` parent term (per Reyco taxonomy; no electric/manual sub-slugs exist).

```
[
  {
    heading:       Cannon Downriggers — Electric and Manual,
    description:   The full Cannon lineup at Reyco — flagship Optimum TS with integrated GPS and fish-finder sync, Magnum 10 TS and Magnum 10 for the workhorse electric segment, Uni-Troll 10 TS and Uni-Troll 10 for trollers who prefer manual precision, and Easi-Troll plus Mini-Troll for smaller boats and back-up rigs. Cannon weights from 4 lb up to 10 lb cover Lake Superior coho through deep-running chinook. Uni-Stacker accessories for multi-bait spreads on the same cable. Every Cannon we sell is rigged on the boat — gunwale or transom mount, wiring, fish-finder integration — at our marine bench in Sault Ste Marie.,
    taxonomy_term: downriggers,
    taxonomy:      product_category,
  },
]
```

---

## 5. Why Choose

```
headline: Why Buy Cannon from Reyco Marine
reasons: [
  {
    icon:        verified,
    title:       Authorised Cannon Dealer,
    description: Factory-direct pricing on the full Cannon lineup — Optimum TS, Magnum 10 TS, Magnum 10, Uni-Troll 10 TS, Uni-Troll 10, Easi-Troll, Lake-Troll, Mini-Troll, weights, and Uni-Stacker accessories. Genuine Cannon parts and full manufacturer warranty handled in-house at Reyco.,
  },
  {
    icon:        engineering,
    title:       Hull-Specific Rigging,
    description: We plan the gunwale or transom geometry, the rod-holder spread, and the wiring run before we mount anything. A four-rod spread on a 17-foot Princecraft fishes differently than a two-rod spread on a smaller open hull, and the install needs to match. We get it right the first time.,
  },
  {
    icon:        build,
    title:       In-House Install + Fish-Finder Integration,
    description: Lee on the marine bench rigs every Cannon downrigger we sell — gunwale or transom mount, breaker and wiring for electric units, and the integration handshake with your Humminbird or Lowrance for depth and speed sync on the Optimum and Magnum TS lines.,
  },
  {
    icon:        inventory,
    title:       Weights and Accessories in Stock,
    description: We keep Cannon weights in 4, 6, 8, and 10 lb in stock alongside common replacement cables, rod holders, and Uni-Stacker hardware. For specialty parts and full downrigger units, we source direct from Cannon with typical 1-3 week lead times.,
  },
]
```

---

## 6. Local Context

```
headline: Cannon Downriggers Built for Lake Superior Trolling
```

**body** (HTML, 2 paragraphs):

```html
<p>Lake Superior is one of the most demanding trolling environments in North America. Cold water that holds salmon and lake trout deep through the entire summer, sudden weather that builds three-to-five-foot chop in the afternoon, and the kind of long-distance runs from launch to fishing grounds that put real wear on every piece of gear on the boat. Cannon's marine engineering — sealed motor housings on the electric units, corrosion-protected cable spools, and the mechanical reliability of the manual Uni-Troll line — is built for exactly this kind of use. Our customers are running coho off Gros Cap in June, lake trout over the deep water off the North Shore in July, and chinook on the offshore thermocline through August. The Cannon downriggers we install handle every one of those scenarios for years on end with proper <a href="/service/winterization/">winterization</a> and seasonal cable inspection.</p>
<p>Whether you are running a Mini-Troll on a 14-foot back-lake boat for spring lakers, or a pair of Optimum TS units with full Humminbird integration on a tournament-rigged Princecraft for offshore Lake Superior salmon, Reyco Marine at 11 White Oak Drive East in Sault Ste Marie is your authorised Cannon dealer and <a href="/service/marine/">service centre</a>. Lee handles the rigging and install; Casey works through the model-and-loadout match before you commit. Drop in to see what is on the floor or call 705-253-7828 to talk through your specific boat and trolling target.</p>
```

---

## 7. FAQ

```
[
  {
    q: Electric or manual downrigger — which is right for me?,
    a: If you fish multiple times a week, target deep species like chinook or summer lake trout regularly, or run more than two rods, electric is worth the investment. The Magnum 10 line covers most recreational trolling needs, and the Optimum TS adds the fish-finder integration that serious trollers want. Manual Uni-Troll units are the right call for occasional trollers, smaller boats, or anyone who prefers the simplicity. Bring us your trolling pattern and we will spec the right unit.,
  },
  {
    q: How many downriggers do I need on my boat?,
    a: Two is the standard recreational setup — one off each gunwale, allowing a clean four-rod spread when you stack with a Cannon Uni-Stacker accessory. Single-rigger setups work for smaller boats or trollers focused on one species. Tournament-serious anglers sometimes run four. We will plan the rod-holder geometry based on your hull and how you fish.,
  },
  {
    q: What weight should I run on Lake Superior?,
    a: For most Lake Superior trolling — coho and lake trout in 40 to 100 feet — an 8 lb Cannon weight is the workhorse. For deep-running chinook on a heavy thermocline or for running fast against current, step up to 10 lb. The 4 and 6 lb weights are right for shallower trolling, smaller boats, or anglers who are easier on their backs. We stock all four sizes.,
  },
  {
    q: Will my Cannon Optimum integrate with my fish finder?,
    a: Yes — the Optimum TS and Magnum TS units sync depth and speed with both Humminbird and Lowrance networks. We pair the downrigger to your finder during install and walk you through the menus before the boat leaves the shop. The integration unlocks Cannon's smartest features — auto-deploy at a marked depth, speed compensation against current, and integrated trolling-pattern control.,
  },
  {
    q: Do you service Cannon downriggers I bought somewhere else?,
    a: Yes. As an authorised Cannon dealer, we service all Cannon downriggers regardless of where they were purchased. Bring it in or describe the issue and Lee will work through it on the marine bench. Common service items — cable replacement, motor service on electric units, clutch adjustment on manual Uni-Trolls — are all handled in-house.,
  },
  {
    q: Do you carry Cannon weights and accessories in stock?,
    a: We keep Cannon weights in 4, 6, 8, and 10 lb in stock year-round, along with common replacement cables, rod holders, and Uni-Stacker hardware for multi-bait spreads. For full downrigger units or specialty parts, we source direct from Cannon with typical 1-3 week lead times.,
  },
]
```
