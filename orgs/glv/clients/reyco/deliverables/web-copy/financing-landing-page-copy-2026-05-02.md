# Financing Landing Page Copy (Reyco Marine)

**For dev:** to wire when Ben's template architecture lands. Sections labelled (Hero / Why / How / What / FAQ / CTA) so structure can be slotted into the page-builder pattern.
**Source:** Ben transcript 2026-05-02 11:37 EDT, Aiden greenlight same day.
**Voice / format constraints:** Canadian English (authorised, organised, specialise), plain language for a 55-year-old plumber, NO em dashes (en dash, comma, parentheses, or restructure), no AI cliches, Casey owner voice.
**Approval gate:** Aiden review before any publish.
**Word count:** ~830 (target 600-1000).

---

## 1. Hero

```
heading:    Financing Your Boat, ATV, or Mower at Reyco
subheading: We work with several Canadian lenders to find you the right rate, the right term, and a payment that fits your season. No extra cost to apply.
primary_cta_label:   Apply Online in 5 Minutes
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

## 3. How Financing Works at Reyco

```
headline: How the Process Works (Five Steps)
```

**steps**:

```
[
  {
    step:        1,
    title:       Apply,
    description: Fill out our online form (about five minutes) or come into the shop and we will walk you through it. We need basic information: your name, contact details, employment, and the piece of equipment you are looking at.
  },
  {
    step:        2,
    title:       We Send Your Application to Our Lender Network,
    description: We do not lend the money ourselves. We work with several Canadian lenders that specialise in marine and powersports financing. We send your application to the lenders most likely to give you the best rate based on your situation.
  },
  {
    step:        3,
    title:       Lenders Respond with Terms,
    description: Most responses come back within one business day, sometimes within a few hours. Each lender presents their best offer: interest rate, term length, and monthly payment.
  },
  {
    step:        4,
    title:       We Walk You Through the Options,
    description: Casey or our finance contact sits down with you (or calls you) and explains every offer in plain English. We tell you which one we would pick and why. There is no pressure to take the highest-payment offer or the longest term.
  },
  {
    step:        5,
    title:       Sign and Take Delivery,
    description: Once you pick a lender, we handle the paperwork. You sign, the lender pays us, and you take the equipment home. From application to delivery is usually three to seven business days.
  }
]
```

---

## 4. What Reyco Actually Does (Broker, Not Lender)

```
headline: We Are a Broker, Not a Lender
```

**body** (HTML, 2 paragraphs):

```html
<p>This part matters, and a lot of customers get it wrong on the first visit. Reyco does not lend you the money. We are a financing broker, which means we have relationships with several Canadian lenders who actually fund the loan. Our job is to take your application, send it to the lenders most likely to approve you at the best rate, and then walk you through the offers when they come back. The lender pays us a small fee for placing the loan with them. That fee is built into the lender's pricing and does not come out of your pocket. Your interest rate, your monthly payment, and your total cost are exactly the same whether you apply through Reyco or directly with the lender.</p>
<p>The reason that is worth knowing is this: when you apply at one bank, you get one bank's offer. When you apply through Reyco, we shop the deal across our network and bring you the best one. For most customers that means a lower rate, a shorter term, or both. We have been doing this long enough to know which lenders are competitive on which kinds of equipment, which lenders work with which credit profiles, and which lenders to avoid for a given customer. That experience is what you get when you finance through us instead of going direct.</p>
```

---

## 5. FAQ

```
[
  {
    q: Will applying hurt my credit score?,
    a: A single credit application creates a soft inquiry that has minimal impact. We do not run hard credit pulls until you have selected a lender and are ready to commit. If you are shopping around, the credit bureaus treat multiple applications for the same type of equipment within a few weeks as a single inquiry, so comparison shopping does not stack up against you.
  },
  {
    q: What information do I need to apply?,
    a: Basic personal information (name, address, date of birth), employment details (employer, income, time at job), and the equipment you are looking at. Self-employed or business applicants may also need recent tax returns or bank statements. We will tell you exactly what is needed once we see your situation.
  },
  {
    q: How long does approval take?,
    a: Most lenders respond within one business day. Some come back within a few hours. Once you pick an offer and sign, delivery usually happens within 3 to 7 business days, depending on how quickly the equipment can be prepped and rigged.
  },
  {
    q: Can I finance used equipment?,
    a: Yes, on most categories. Used boats, used ATVs, and used UTVs are commonly financed. Some lenders cap the age of the equipment (typically 10 to 15 years), so very old units may be cash-only. We will know within one application whether the unit you want qualifies.
  },
  {
    q: What rates can I expect?,
    a: Rates depend on your credit profile, the equipment, the term length, and the current lending market. As of 2026, qualified buyers see rates in the high single digits to low double digits for new marine and powersports equipment. We will tell you the exact rate offered before you sign anything.
  },
  {
    q: What if my credit is less than perfect?,
    a: We work with lenders who specialise in subprime and rebuild-credit applications. The rate will be higher and the term may be shorter, but approval is often possible. If you are rebuilding credit, financing equipment and making payments on time is one of the faster ways to improve your score.
  },
  {
    q: Does financing cost extra?,
    a: No. The lender pays us a placement fee out of the loan, which is already priced into their offer. The price you pay for the equipment, the rate, and the monthly payment are the same whether you finance through us or directly with the lender. The difference is that we shop the rate across multiple lenders, so you get a better one.
  }
]
```

---

## 6. CTA Section

```
headline: Ready to See What You Qualify For?
body:     Filling out the application takes about five minutes and there is no obligation. Most customers have an answer back within a business day. If you would rather talk it through first, give us a call or drop by the shop.
primary_cta_label:   Apply Online Now
primary_cta_link:    /financing/apply/
secondary_cta_label: Call 705-253-7828
secondary_cta_link:  tel:+17052537828
address:             11 White Oak Drive East, Sault Ste Marie, ON
hours_note:          Tuesday through Saturday. See /contact/ for current hours.
```

---

## QC checklist (for the on-page review)

- [ ] No em dashes (—) anywhere in the rendered page. En dash (–) for ranges only; commas / parentheses for parenthetical breaks.
- [ ] Canadian English: "authorised", "organised", "specialise" (NOT "authorized" etc.). One exception window: brand proper nouns.
- [ ] No AI cliches in the rendered copy: "navigate the world of", "unleash", "in today's digital landscape", "realm of", "tapestry", "delve into".
- [ ] Casey owner voice maintained: "we", "our customers", first-person plural. Avoid corporate "Reyco Marine offers..." phrasing.
- [ ] All claims defensible: 5-min application, 1-business-day response, 3-7 day delivery, "high single digits to low double digits" 2026 rate band. Flag with Casey before publish if any of these need a number tweak.
- [ ] Internal link `/financing/apply/` resolves before publish (or replace with current path if Reyco's actual application form lives elsewhere; flag for dev).
- [ ] Phone number 705-253-7828 matches site footer.
