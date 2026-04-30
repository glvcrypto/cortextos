---
name: client-wireframe
description: Research-driven website wireframing — reads onboard research pillars, brand package, Director plan, and competitor screenshots to build ONE production-quality interactive website using Ben Pelta's framework, shadcn/ui, Magic UI, and Tailwind v4. Trigger with "/wireframe [client]".
---

# Client Wireframe Skill

> Build ONE production-quality interactive website for a client. Research determines the right architecture. Ben Pelta's framework dictates the page structure. The Marketing Director plan provides all copy direction. No guessing, no options — one decisive build informed by deep research.

## Trigger

- `/wireframe [client]`
- "wireframe for [client]"
- "build wireframe for [client]"
- Any request to create a website wireframe for a client

---

## Pre-requisites

**The following must exist before this skill runs:**

1. **Research (Stage 2)** — All 8 pillar files + synthesis in `projects/<client>/research/`
2. **Marketing Director Plan (Stage 4)** — `projects/<client>/strategy/marketing-director-plan.md`
3. **Brand Identity (Stage 5)** — `projects/<client>/brand/*-brand-identity.md`

If any are missing, run the corresponding `/onboard` stage first. Do NOT proceed without all three.

### Brand Package (Optional but Prioritised)

If `projects/<client>/brand/brand-package/` exists, it **overrides** generated brand recommendations:

| File/Folder | Extract | Overrides |
|-------------|---------|-----------|
| `logos/` | Logo variants (SVG, PNG, mono, dark/light) | Logo placement rules |
| `colours.md` or `colours.json` | Hex codes — primary, secondary, accent | Entire colour palette |
| `fonts/` | Font files or font name specs | Typography choices |
| `style-guide.pdf` or `style-guide.md` | Full brand guidelines | All visual decisions |
| `photography/` | Sample photos, mood boards | fal.ai prompt style direction |
| `assets/` | Icons, patterns, textures | Available design elements |

**Precedence:** Brand package > `/onboard:brand` output > ui-ux-pro-max design system.

If no brand package exists, the `/onboard:brand` output is the source of truth.

---

## Intake

| Input | Required | Source |
|-------|----------|--------|
| **Client** | Yes | Client slug (e.g., `reyco-marine`) |
| **Client project folder** | Yes | `projects/<client-slug>/` |

Everything else comes from research pillars, Director plan, brand identity, and `CONTEXT.md`. Do NOT ask Aiden for inputs the research provides.

---

## Pipeline Overview

```
Pre-requisite: Research + Director plan + Brand identity complete
│
├── Stage 1: Design Fusion (agent-autonomous)
│   ├── Read brand package (if exists)
│   ├── Read ALL research pillars + synthesis + screenshots
│   ├── Read brand identity + Director plan
│   ├── Map research → page-level design decisions
│   ├── Define site architecture, page list, section layouts
│   └── Output: design-spec.md
│
├── Stage 2: Build (agent-support)
│   ├── Scaffold Vite + React + TS + Tailwind v4
│   ├── Install shadcn/ui + Magic UI via Context7 docs
│   ├── Build ALL pages with Director plan copy
│   ├── Placeholder imagery (Unsplash or colour blocks)
│   └── Output: working Vite project
│
├── Stage 3: Review (checkpoint)
│   ├── Verify build runs clean
│   ├── Playwright screenshots for async review
│   └── Present to Aiden for feedback
│
└── Stage 4: Handoff (agent-support)
    └── Output: approved-spec.md for Lovable production build
```

---

## Ben Pelta Framework (MANDATORY)

These rules govern EVERY page of the wireframe. They override generic design instincts and come from structured competitor analysis and conversion psychology.

### 1. Catalog-Style Layout

The website feels like a catalog or billboard — section after section of content. Brands, features, banners, products, promotions, inventory highlights, one after the other.
- Makes the business look comprehensive and authoritative
- Excellent for SEO (more indexable content per page)
- Every visitor segment finds a reason to keep scrolling

### 2. CTAs Up Top for Decided Buyers

The first viewport of EVERY page prioritises clickable actions for users who already know what they want.
- **First viewport:** Clickable categories, product/inventory links, action buttons
- **No text descriptions in the hero** — images, titles, and buttons ONLY
- **Explanatory copy goes at the bottom** — visitors who need education will scroll

### 3. SEO vs. UX Tension Rule

- **SEO text at the BOTTOM** — never breaking visual sections mid-flow
- **Mid-page:** Images, titles, buttons, banners — NO paragraph text between visual cards/grids
- **Bottom:** Detailed descriptions, FAQ blocks, long-form content for search engines
- A section of 5 visual boxes should NEVER be broken into 2+3 by inserting text — destroys UX

### 4. Used vs. New Separation

For inventory/product businesses:
- **Big visual separator** between used/pre-owned and new inventory
- Distinct visual treatment per category (colour-coding, layout shifts)
- Never mixed together

### 5. Blog on Homepage

Every homepage includes a blog/content section:
- 3-4 recent articles with thumbnail, title, excerpt
- After main product/service sections, before footer
- Links to full blog listing

### 6. Price on Everything

- No "call for price" — ever
- Every product shows price + monthly payment estimate
- "In Stock" badges and freshness indicators ("Added 3 days ago")

### 7. Phone Always Visible

- Phone number in the nav on every page, every breakpoint
- Tap-to-call on mobile
- For avatars who prefer calling (seniors, emergency buyers)

### 8. No Hero Sliders

- Static hero image or video background — never a carousel/slider
- Every local competitor uses hero sliders = instant differentiation by NOT using one

### 9. Copy Structure, Differentiate Design

- Analyse best-in-class competitor/benchmark site structures from screenshots
- Adapt what works STRUCTURALLY (information architecture, content flow, nav depth)
- Completely change the UX/UI design and messaging

---

## Stage 1: Design Fusion (agent-autonomous)

**Goal:** Read all inputs, make design decisions, produce a comprehensive spec for one website.

### Step 0: Read Brand Package

Check `projects/<client>/brand/brand-package/`. If present, read all contents and document in the design spec. These assets are mandatory — the build must use them.

If absent, proceed with `/onboard:brand` output.

### Step 1: Read All Research

Read every file in `projects/<client>/research/`:

1. `avatars/*.md` + `test-group-panel.md` — Buyer personas, pre-trigger psychology, buyer types
2. `pillar-b-direct-competitors.md` — Competitor sites, messaging pins, screenshots
3. `pillar-c-indirect-competitors.md` — Same-niche wider geography benchmarks
4. `pillar-h-cross-niche-inspiration.md` — Cross-industry emotional messaging
5. `pillar-d-global-niche-intelligence.md` — Best-in-class sites worldwide
6. `pillar-e-local-market-context.md` — Demographics, regulations, seasonal patterns
7. `pillar-f-supplier-brand-dynamics.md` — Brand assets, co-op requirements
8. `pillar-g-local-media-community.md` — Community events, local trust signals
9. `synthesis-opportunities-and-threats.md` — Ranked cross-pillar opportunities

### Step 2: Read Brand Identity + Director Plan

```
Read: projects/<client>/brand/*-brand-identity.md
Read: projects/<client>/strategy/marketing-director-plan.md
```

From brand identity extract: colour palette (hex codes), typography, UI component specs, photography direction, iconography, whitespace philosophy.

From Director plan extract: grand messages (TOFU/MOFU/BOFU), small messages (per avatar × funnel stage), channel roles, campaign themes. **The Director plan provides ALL headline and body copy direction.** Do not invent messaging — derive it from the plan.

### Step 3: Read All Screenshots

Browse screenshot directories:
- `research/screenshots/local/` — Local competitor screenshots (section by section)
- `research/screenshots/global/` — Global best-in-class screenshots

Note: layout patterns, content flow, nav depth, what works structurally vs. what to avoid visually.

### Step 4: Map Research to Design Decisions

Build a decision table:

| Research Source | Design Decision |
|----------------|----------------|
| **A (Avatars)** | Navigation paths per buyer type (Comparer vs. Decided), CTA placement, content hierarchy, accessibility needs (% seniors) |
| **B (Competitors)** | What NOT to do visually. Gaps to exploit. Messaging differentiation |
| **C (Indirect)** | UX patterns from larger players worth adapting locally |
| **D (Global)** | Best-in-class features the local market hasn't seen |
| **E (Market)** | Content density, regulatory disclaimers, seasonal switching needs |
| **F (Suppliers)** | Brand logo placement, product display requirements, co-op landing pages |
| **G (Community)** | Social proof, event calendars, local trust signals |
| **H (Cross-Niche)** | Emotional messaging patterns to adapt |
| **Screenshots** | Structural patterns to borrow, visual patterns to avoid |
| **Director Plan** | Grand messages → hero copy. Small messages → section copy. Funnel flow → page order |
| **Brand Identity** | Colours, fonts, component specs, photography style |

### Step 5: Define the Architecture

Research determines ONE architecture — not multiple options. The synthesis tells you which positioning opportunity is strongest. The avatars tell you how users navigate. The competitors tell you what structure works. Make a decision.

Define:
- **Architecture type** — Multi-page with mega-nav, hub-and-spoke, editorial, etc.
- **Page list** — Every page the site needs, with priority order
- **Homepage section-by-section layout** — What each section contains and why (cite research)
- **Navigation structure** — Desktop and mobile patterns
- **Product/inventory display** — Browse, preview, and detail patterns
- **Animation approach** — Subtle and confident, or bold and energetic (match brand personality)

### Step 6: Write Section-Level Copy Direction

For each homepage section and key page, specify:
- **Which Director plan message** drives the copy (grand or small, which avatar, which funnel stage)
- **Headline direction** — Not the final headline, but the message it must convey
- **Supporting copy direction** — What proof points, what tone
- **CTA text and destination**

### Deliverable — Design Spec

```markdown
# Design Spec — [Client]

## Brand Source
[Brand package / onboard:brand / ui-ux-pro-max — what was used, what overrides what]

## Research Decision Table
[Filled decision table from Step 4]

## Architecture
- **Type:** [Selected architecture]
- **Rationale:** [Why this, citing synthesis opportunity]
- **Navigation:** [Desktop + mobile patterns]

## Design Tokens
[Full colour palette, typography, component specs from brand identity]

## Page List (Priority Order)
1. Homepage
2. [...]

## Homepage — Section-by-Section
[For each section: content, copy direction (citing Director plan message), layout, animation]

## Key Pages
[For each page: purpose, layout, copy direction, how it differs from competitors]

## Product/Inventory Display
- Browse pattern, preview pattern, detail pattern

## Mock Data Requirements
[What data files are needed — inventory, services, testimonials, team, blog, events]

## Animation Approach
[Overall philosophy + specific animations per section type]

## Accessibility Requirements
[WCAG level, specific accommodations based on avatar demographics]
```

**Save to:** `projects/<client>/wireframes-v2/design-spec.md`

---

## Stage 2: Build (agent-support)

**Goal:** Build the complete interactive website as a Vite project.

### Tech Stack

| Tool | Purpose |
|------|---------|
| **Vite** | Dev server and build |
| **React 18+** | Component framework |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Styling |
| **React Router v7+** | Page routing |
| **shadcn/ui** | Structural components (buttons, forms, dialogs, cards, nav, tables) |
| **Magic UI** | Animated components (marquees, text animations, blur fades, number tickers, particles) |
| **Unsplash/placeholder** | Contextual placeholder imagery (replaced with real photos in production) |

**shadcn/ui** — Components copied via `npx shadcn@latest add [component]`. Full ownership and customisation.

**Magic UI** — Animated components via `npx magicui-cli@latest add [component]`. Hero sections, testimonial carousels, stats counters.

**Context7 MCP** — Use `resolve-library-id` then `query-docs` to verify latest API patterns for Tailwind v4, React Router v7, shadcn/ui, and Magic UI before writing code.

### Project Structure

```
projects/<client>/wireframes-v2/
  index.html
  package.json
  tsconfig.json
  vite.config.ts
  tailwind.config.ts
  src/
    main.tsx
    App.tsx
    index.css
    lib/
      utils.ts               # shadcn/ui utilities
    components/
      ui/                     # shadcn/ui base components
      Nav.tsx
      MobileNav.tsx
      Hero.tsx
      Footer.tsx
      ProductCard.tsx
      BlogCard.tsx
      TestimonialCard.tsx
      [niche-specific components]
    pages/
      Home.tsx
      Inventory.tsx
      ProductDetail.tsx
      Services.tsx
      About.tsx
      Contact.tsx
      Blog.tsx
      BlogPost.tsx
      [niche-specific pages]
    data/
      inventory.ts
      services.ts
      blog.ts
      team.ts
      testimonials.ts
      events.ts
    assets/
      brand/                  # Logo files (from brand package or placeholder)
```

### Build Sequence

#### 2a: Scaffold

1. Initialize Vite + React + TS project
2. Install Tailwind CSS v4 — **use Context7 MCP** to get latest install instructions
3. Install dependencies: `react-router-dom`
4. Initialize shadcn/ui: `npx shadcn@latest init`
5. Add shadcn components: `npx shadcn@latest add button card dialog navigation-menu sheet form input select separator badge tabs`
6. Add Magic UI components: `npx magicui-cli@latest add marquee blur-fade text-animate number-ticker`
7. Configure Vite SPA fallback for client-side routing
8. Set up CSS variables for design tokens from brand identity
9. Verify dev server runs: `npx vite`

#### 2b: Build Mock Data

Create data files in `src/data/` with realistic content informed by research:
- **inventory.ts** — Real product names, brands, prices, specs, "in stock" booleans, "days since added"
- **services.ts** — Real service types with price ranges and turnaround estimates
- **testimonials.ts** — Plausible testimonials matched to avatars from Pillar A
- **team.ts** — Real staff names and roles from CONTEXT.md
- **blog.ts** — Article topics from the content plan or community hub ideas
- **events.ts** — Real community events from Pillar G

**Never use Lorem ipsum.** All copy uses the client's real services, brands, location, and language.

#### 2c: Build Pages

Build every page listed in the design spec. For each page:

1. **Follow Ben Pelta framework** — CTAs up top, visual mid-section, SEO text at bottom
2. **Use Director plan copy** — Headlines and body text derive from grand/small messages
3. **Use brand identity tokens** — Colours, fonts, spacing from design tokens
4. **Use shadcn/ui** for structural components (nav, forms, cards, tables)
5. **Use Magic UI** for animated components (hero text animation, number tickers, marquees)
6. **Use placeholder images** — Unsplash URLs or solid-colour blocks with descriptive alt text. Real photography replaces these in production
7. **Responsive** — Mobile layout must not break. Use Tailwind responsive prefixes throughout.

#### 2d: Navigation + Routing

- Set up React Router with all pages
- Desktop nav: sticky header with brand colours, logo left, phone number visible, primary nav items
- Mobile nav: hamburger or bottom tab bar, tap-to-call always visible
- Active states, hover states on all interactive elements
- Skip-to-content link for accessibility

### Build Verification

After the build, verify:
- [ ] `npx vite` starts without errors
- [ ] Homepage loads with all sections rendering
- [ ] Every nav link works and routes to the correct page
- [ ] Product/inventory cards show prices and "In Stock" badges
- [ ] Blog section renders on homepage
- [ ] Phone number visible on every page (desktop + mobile)
- [ ] No hero sliders anywhere
- [ ] No TypeScript errors
- [ ] All mock data renders correctly
- [ ] Responsive layout at mobile (375px), tablet (768px), desktop (1280px)
- [ ] Colours match brand identity hex codes
- [ ] CTAs above the fold on every page
- [ ] SEO text sections at bottom of pages, not mid-flow

---

## Stage 3: Review (checkpoint)

**Goal:** Verify the build and present to Aiden.

### Verification Steps

1. Start dev server: `cd projects/<client>/wireframes-v2 && npx vite`
2. Use **Playwright MCP** to screenshot every page (full-page captures)
3. Present screenshots and live URL to Aiden

### Presentation

```markdown
## Wireframe Ready — [Client]

**Architecture:** [Type]
**Pages:** [Count]
**Interactive:** `cd projects/<client>/wireframes-v2 && npx vite` → http://localhost:5173

### Key Design Decisions
- [Decision 1 — citing research pillar]
- [Decision 2 — citing Director plan]
- [Decision 3 — citing competitor gap]

### Copy Direction
- Hero: [Grand TOFU message from Director plan]
- Sections: [How small messages are distributed]

### What to Review
1. Does the homepage flow feel right?
2. Is the navigation intuitive for all avatar types?
3. Does the copy tone match the brand identity?
4. Any sections that feel too sparse or too dense?
5. Animation level — too much, too little?

Feedback welcome. Changes are fast — this is a wireframe, not production.
```

**STOP HERE. Wait for Aiden's feedback before Stage 4.**

---

## Stage 4: Handoff (agent-support)

**Goal:** Incorporate feedback and produce the production build spec.

### Process

1. Apply Aiden's feedback (iterate on the wireframe if needed)
2. Create the approved spec:

```markdown
# Approved Build Spec — [Client]

## Architecture
- **Type:** [Architecture]
- **Feedback incorporated:** [What changed from review]

## Page List (Priority Order)
1. Homepage
2. [...]

## Design Tokens
- Primary: [Hex]
- Secondary: [Hex]
- Accent: [Hex]
- Background: [Hex]
- Heading font: [Font]
- Body font: [Font]
- Border radius: [Value]

## Component Inventory
[Every unique component with file reference]

## Content Requirements
[What real content is needed — photos, copy, product data, video]

## Generated Imagery Plan
[Which fal.ai images to keep vs. replace with real photography]

## Technical Requirements
- [ ] Mobile-first responsive
- [ ] SEO: meta tags, schema markup, sitemap
- [ ] Performance: image optimization, lazy loading
- [ ] Accessibility: ARIA, keyboard nav, contrast ratios
- [ ] Analytics: GA4 + GSC + GTM
- [ ] Forms: contact, service booking, newsletter
- [ ] CRM: lead capture → Supabase → Mission Control

## Build Platform
- **Lovable** for rapid build, OR
- **Manual** (client-site-template + Supabase) for complex functionality

## CRM Integration
- Uses GLV client-site-template (github.com/glvcrypto/client-site-template)
- Lead capture → Supabase → Mission Control pipeline
```

**Save to:** `projects/<client>/wireframes-v2/approved-spec.md`

---

## State Tracking

Write progress to `.state/wireframe-<client-slug>.json`:

```json
{
  "client": "[Client Name]",
  "client_slug": "[client-slug]",
  "version": 2,
  "stage": 1,
  "status": "in_progress",
  "started": "[ISO_TIMESTAMP]",
  "architecture": "[selected type]",
  "brand_source": "brand-package | onboard-brand | ui-ux-pro-max",
  "pages_built": [],
  "research_pillars_read": [],
  "director_plan_read": false,
  "brand_identity_read": false,
  "brand_package_found": false,
  "deliverables": {
    "design_spec": null,
    "wireframe_project": null,
    "approved_spec": null
  }
}
```

---

## Autonomy Boundaries

| Action | Level |
|--------|-------|
| Stage 1: Design Fusion | agent-autonomous |
| Stage 2: Build | agent-support |
| Stage 3: Review | agent-support (checkpoint) |
| Stage 4: Handoff | agent-support |
| Sending wireframe to client | user (Aiden sends) |
| Production build | user (Aiden executes in Lovable) |

---

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Build multiple approaches | Build ONE decisive website — research tells you the right answer |
| Re-do niche research | Read the existing research pillars |
| Invent messaging | Use Director plan grand/small messages for all copy |
| Use hero sliders | Static hero image with text overlay |
| Hide prices | Show price + monthly payment on every product |
| Put SEO text mid-page | SEO text at bottom, visual content in the middle |
| Use Lorem ipsum | Write real copy from Director plan + brand voice |
| Mix used and new inventory | Big visual separator, distinct treatment |
| Skip the blog section | 3-4 articles on every homepage |
| Hide the phone number | Phone in nav on every page, every breakpoint |
| Use placeholder.com grey boxes | Use Unsplash photos or brand-colour blocks with descriptive alt text |
| Skip Context7 docs check | Verify latest API patterns before writing code |
| Guess at component APIs | Use Context7 MCP for shadcn/ui and Magic UI docs |

---

## Integration Points

- **Research Pipeline** — All 8 pillars + synthesis + screenshots from `projects/<client>/research/`
- **Director Plan** — Grand/small messages from `projects/<client>/strategy/marketing-director-plan.md`
- **Brand Identity** — Colours, typography, components from `projects/<client>/brand/`
- **Context7 MCP** — `resolve-library-id` + `query-docs` for Tailwind v4, React Router, shadcn/ui, Magic UI
- **Unsplash** — Contextual placeholder imagery for wireframe (replaced with real photos in production)
- **Playwright MCP** — Screenshot wireframe pages for review
- **Client-site-template** — Production builds use `github.com/glvcrypto/client-site-template`

---

## Related Skills

- **onboard** — Research + Director plan pipeline that feeds this skill
- **onboard:brand** — Brand identity that provides design tokens
- **coding** — Frontend development patterns
- **brand-voice** — Copy tone validation
- **page-cro** — CRO principles inform layout decisions
- **ad-creative** — Shares brand package reference system
- **3d-web-experience** — Conditional: ONLY when 3D serves conversion (configurators, virtual showrooms). Never for aesthetics
- **proposal** — Approved wireframe anchors the build proposal

---

## Dependencies

- Research complete (`projects/<client>/research/` populated)
- Director plan exists (`projects/<client>/strategy/marketing-director-plan.md`)
- Brand identity exists (`projects/<client>/brand/*-brand-identity.md`)
- Context7 MCP server active
- Node.js + npm available
- Client project folder exists with CONTEXT.md

---

## Niche Adaptation

This skill is niche-agnostic. Research pillars provide all niche context. Ben Pelta's framework applies universally — catalog layout, CTAs up top, SEO at bottom, pricing visible, phone accessible. The specific pages, sections, and copy adapt based on what the research reveals.

The process: read research → read Director plan → make ONE set of design decisions → build ONE website → review → hand off.

---

*One decisive build beats three half-built options. The research already knows the answer — this skill executes it.*
