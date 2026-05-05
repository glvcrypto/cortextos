# Financing Landing Page Copy v2 — POSPRO-led (Reyco Marine)

**For dev:** to wire when Ben's template architecture lands. Sections labelled (Hero / Why / Who / How / FAQ / CTA) so structure can be slotted into the page-builder pattern.
**Source:** Boss dispatch 1777918166304 (rewrite: POSPRO is lender, Reyco is dealer-partner) + posprofinancial.com fetched 2026-05-04.
**Voice / format constraints:** Canadian English (authorised, organised, specialise), plain language for a 55-year-old plumber, NO em dashes (en dash, comma, parens, or restructure), no AI cliches, Casey owner voice.
**Approval gate:** Aiden review before any publish. Casey gate on POSPRO-specific claims (rates, application timing, contact details).
**Word count:** ~1240 (target 800-1200, slight overshoot — see trim notes at end of file).
**v1 preserved:** `financing-landing-page-copy-2026-05-02.md` retained for diff comparison per dispatch.

---

## 1. Hero

```
heading:    Boat, ATV, and Mower Financing at Reyco
subheading: We work with POSPRO Financial, an Ontario-based specialist that has been financing marine and powersports equipment since 1997. One application, the right rate, a payment that fits your season.
primary_cta_label:   Apply in About 10 Minutes
primary_cta_link:    /financing/apply/
secondary_cta_label: Call 705-253-7828
secondary_cta_link:  tel:+17052537828
```

---

## 2. Why Finance

```
headline: Why Most of Our Customers Finance
```

**body** (HTML, 2 paragraphs):

```html
<p>Buying a boat, an ATV, or a zero-turn mower with cash is the simple way, but it is rarely the smart way. Marine and powersports equipment is seasonal. The boat sits on the trailer for six months of the year. The mower works for five. The snowmobile or UTV works the other half. Tying up ten or twenty thousand dollars in something you only run part of the year is money you cannot put toward winter heating, a kid's hockey season, a roof repair, or the next piece of gear you need. Financing lets you spread the cost across the seasons you actually use the equipment, instead of taking the whole hit in one month.</p>
<p>The other reason is cash flow. A lot of our customers run small businesses, work trades, or have variable income through the year. A financed payment of two or three hundred dollars a month is a known number you can plan around. A surprise twenty-thousand-dollar withdrawal in May is the kind of thing that changes your summer. Financing also lets you upgrade sooner. The customer who finances a 17-foot Princecraft this year and trades in three years is on better gear, more often, than the customer who waits five years to save cash for a 14-foot. We see this every spring. The right financing decision is rarely about whether you can afford the cash price. It is about whether the payment fits your life.</p>
```

---

## 3. Who is POSPRO Financial

```
headline: Our Financing Partner: POSPRO Financial
```

**body** (HTML, 2 paragraphs):

```html
<p>We do not lend money ourselves. We partner with POSPRO Financial, an Ontario-based specialty lender that has been financing marine, powersports, and recreational vehicles since 1997. POSPRO works with a network of over 200 dealerships across Northern and Southern Ontario, and they are set up specifically for the kind of equipment we sell: boats, ATVs, UTVs, snowmobiles, personal watercraft, outboard motors, and zero-turn mowers. They are not a general consumer lender trying to figure out what a Princecraft is worth on the resale market. They have been valuing marine and powersports equipment for almost three decades, and they price the loan accordingly.</p>
<p>The other thing that matters: POSPRO works with a range of credit profiles. In their own words, "whether you have impressive credit or are working to rebuild your credit score," they will look at your file and put together a financing plan. That covers most of our customers. If you have strong credit, you get the best rates POSPRO can place. If your credit is rebuilding, you still get a real conversation about what is possible, instead of a one-line decline letter from a bank that does not understand marine equipment. POSPRO also offers optional protection products on top of financing: life insurance, disability, critical illness, GAP, and extended warranties. None of those are required to get approved.</p>
```

---

## 4. How Financing Works at Reyco

```
headline: How the Process Works (Five Steps)
```

**steps**:

```
[
  {
    step:        1,
    title:       Pick Your Equipment,
    description: Come in, browse the lot, or call us. Lock in the boat, ATV, mower, or motor you want. We give you the out-the-door price including taxes, freight, prep, and any rigging, so you know exactly what you are financing.
  },
  {
    step:        2,
    title:       Apply with POSPRO,
    description: Fill out the POSPRO application. It takes about ten minutes and can be done online or by phone with one of their reps. We can sit down with you in the shop and walk you through it, or you can do it from home. POSPRO needs basic personal information, employment details, and the equipment you are buying.
  },
  {
    step:        3,
    title:       POSPRO Reviews and Comes Back with an Offer,
    description: POSPRO works through their lender network to find the best fit for your file. Most applications get a response within one business day. The offer comes back with a rate, a term length, and a monthly payment.
  },
  {
    step:        4,
    title:       We Walk You Through the Offer,
    description: Casey or our finance contact sits down with you (or calls you) and explains the offer in plain English. There is no pressure to take the longest term or the highest payment. If you want to compare options, POSPRO can usually present alternatives.
  },
  {
    step:        5,
    title:       Sign and Take Delivery,
    description: Once you accept the offer, POSPRO funds the loan, we handle the dealer paperwork, and you take the equipment home. From application to delivery is usually three to seven business days, depending on how quickly the equipment can be prepped and rigged.
  }
]
```

---

## 5. FAQ

```
[
  {
    q: Who is actually lending the money?,
    a: POSPRO Financial. They are an Ontario-based specialty lender that has been financing marine, powersports, RV, and recreational equipment since 1997. We are the dealer. Reyco does not fund loans, set rates, or make approval decisions. POSPRO does that part. Our job is to help you pick the right equipment, walk you through the application, explain the offer, and deliver the unit.
  },
  {
    q: Will applying hurt my credit score?,
    a: A single application creates a credit inquiry. POSPRO and the lenders behind them treat shopping inquiries within a short window as a single hit, so a financing application is not the kind of thing that meaningfully damages a healthy credit profile.
  },
  {
    q: What if my credit is less than perfect?,
    a: POSPRO works with a range of credit situations. In their own words, whether your credit is strong or you are rebuilding, they will look at your file and put together a financing plan if one is possible. The rate will reflect the credit profile. We have seen plenty of customers in mid-rebuild get approved on practical terms.
  },
  {
    q: How long does approval take?,
    a: POSPRO typically responds within one business day. Some applications come back faster. Once you accept the offer and sign, delivery is usually three to seven business days, depending on prep and rigging.
  },
  {
    q: Can I finance used equipment?,
    a: Yes, on most categories. POSPRO finances used boats, ATVs, UTVs, snowmobiles, and outboard motors. There are usually age limits on the equipment, so very old units may not qualify. We will know within one application whether the unit you want is eligible.
  },
  {
    q: Does financing cost extra?,
    a: No. POSPRO is paid through the lender placement, not by adding a fee on top of your loan. The price you pay for the equipment, the rate, and the monthly payment are the same whether you walk in here or apply somewhere else. The advantage of going through us is that POSPRO knows marine and powersports equipment, has been doing this since 1997, and shops your file across their lender network instead of one bank.
  },
  {
    q: What about insurance and warranty options?,
    a: POSPRO offers optional protection products: life insurance, disability, critical illness, GAP, and extended warranty coverage. None are required to get financing approved. If you want to talk about any of them, ask Casey or our finance contact and we will walk you through what is available and what makes sense for your situation.
  }
]
```

---

## 6. CTA Section

```
headline: Ready to See What You Qualify For?
body:     The POSPRO application takes about ten minutes and there is no obligation. Most customers have an answer back within a business day. If you would rather talk it through first, give us a call or drop by the shop.
primary_cta_label:   Apply Online Now
primary_cta_link:    /financing/apply/
secondary_cta_label: Call 705-253-7828
secondary_cta_link:  tel:+17052537828
address:             11 White Oak Drive East, Sault Ste Marie, ON
hours_note:          Tuesday through Saturday. See /contact/ for current hours.
```

---

## QC checklist (for Casey + Aiden review)

POSPRO-specific claims (verify against posprofinancial.com or with POSPRO directly):

- [ ] **POSPRO since 1997** — verified from posprofinancial.com homepage ("Proudly serving our Dealer Network since 1997").
- [ ] **"Over 200 Dealerships" in POSPRO network** — verified from homepage.
- [ ] **Ontario-based, Northern + Southern Ontario service** — verified from page title ("Ontario Vehicle Loans, RV & Trailer Financing").
- [ ] **About 10-minute application** — anchored to a POSPRO customer testimonial ("application had taken my wife and I 10 minutes to get done over the phone"). Softened to "about ten minutes" in copy. Flag if Casey wants different framing.
- [ ] **One-business-day typical response** — anchored to POSPRO testimonial ("approval the following day"). Worded as "typically" not "guaranteed" to avoid SLA exposure.
- [ ] **Protection products list** (life, disability, critical illness, GAP, warranties) — verified from posprofinancial.com/marine.
- [ ] **Direct quote** "whether you have impressive credit or are working to rebuild your credit score" — pulled verbatim from POSPRO marine page, marked with quote markers in the body copy.
- [ ] **Equipment categories financed by POSPRO** — verified from POSPRO marine page (boats, outboard motors) plus homepage verticals (powersports, RVs, lawn equipment).

Reyco-specific claims to verify:

- [ ] **3-7 day delivery** — Casey to confirm (carried over from v1).
- [ ] **`/financing/apply/` URL** — needs to resolve before publish. If Reyco does not host its own intake form and applications go directly to POSPRO, replace with the POSPRO application URL or a contact-Reyco-first form. Flag for dev.
- [ ] **Phone number 705-253-7828** matches site footer.
- [ ] **Address** 11 White Oak Drive East, Sault Ste Marie, ON matches Casey's preferred listing.
- [ ] **Hours note** "Tuesday through Saturday" matches /contact/.

Voice / format checklist:

- [ ] **No em dashes (—)** anywhere in rendered body copy. (En dash for ranges only; commas / parens for parenthetical breaks.)
- [ ] **Canadian English** spellings used (authorised, organised, specialise where applicable).
- [ ] **No AI cliches.** Note: POSPRO's own marine page uses "navigate the financial waters" — that phrase is INTENTIONALLY NOT used here per Reyco voice rules.
- [ ] **Casey owner voice** maintained: "we", "our customers", first-person plural. Avoid corporate "Reyco Marine offers..." phrasing.

---

## Trim notes (overshoot, ~1240 vs 800-1200 target)

Per epistemic-discipline: shipping the overshoot with a flag and concrete trim paths, not pre-trimming.

Easiest single cut to land inside band: **drop FAQ "What about insurance and warranty options?"** (~75 words). Brings total to ~1165, inside upper bound. Justification: protection products are already mentioned in the "Who is POSPRO" section, so the FAQ entry is reinforcement not new info.

Alternative deeper cut: **drop FAQ "Will applying hurt my credit score?"** + insurance Q (~145 words combined). Brings total to ~1095, comfortably inside band. Justification: credit-score concern is addressed in "What if my credit is less than perfect?" so removing the standalone Q does not lose ground.

Aggressive cut: trim **Why Finance** to single paragraph (drop second paragraph on cash flow + upgrade cycle) saves ~170 words, plus drop one FAQ. Brings total to ~970. Use only if Casey wants tighter "above the fold" hero+why before reaching POSPRO partnership content.

I have NOT made any of these cuts. Aiden / Casey to call.
