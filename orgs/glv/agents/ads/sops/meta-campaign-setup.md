# SOP: Meta Campaign Setup & Optimization

**Owner:** Agent prepares, Aiden executes in Meta Business Suite
**Trigger:** New client campaign or campaign refresh
**Time estimate:** 2-3 hours setup, 30 min/week optimization

---

## Campaign Setup

### 1. Research Phase
- [ ] Run `/competitor:deep <client>` for competitor ad research
- [ ] Identify target audience (demographics, interests, location)
- [ ] Define campaign objective (leads, traffic, awareness)
- [ ] Set budget recommendation:
  - Minimum: $10/day per ad
  - Recommended: $15-25/day per ad
  - Maximum 3-4 ads running simultaneously
  - **Rule: Budget / # of ads >= $10/day. If not, reduce ads.**

### 2. Creative Development
- [ ] Run `/content:ads` for ad copy variants
- [ ] Generate 3-4 creative concepts (not 10+)
- [ ] Run `/ad-creative` for visual assets (if fal.ai configured)
- [ ] Save all creatives to `projects/<client>/deliverables/ads/`

### 3. Campaign Structure
```
Campaign: [Client] - [Objective] - [Month Year]
├── Ad Set 1: [Audience Description]
│   ├── Ad 1: [Creative A + Copy A]
│   └── Ad 2: [Creative B + Copy A]
└── Ad Set 2: [Retargeting / Lookalike]
    ├── Ad 3: [Creative A + Copy B]
    └── Ad 4: [Creative C + Copy B]
```

- Maximum 4 ads at launch
- One campaign objective only
- Location targeting: Sault Ste. Marie + 50km radius (or client-specific)

### 4. Launch
- [ ] Aiden creates campaign in Meta Business Suite
- [ ] Install Meta Pixel on client site (if not already)
- [ ] Verify conversion tracking is working
- [ ] Set daily budget to recommended amount
- [ ] Document in CONTEXT.md

---

## Weekly Optimization

### Check Performance (Every Monday)
- [ ] Pull metrics: spend, impressions, clicks, leads, CPL
- [ ] Compare to targets (CPL target: $30-70 for local services)
- [ ] Identify underperformers (no leads after $50 spend = pause)

### Decision Matrix

| Scenario | Action |
|----------|--------|
| Ad has leads + CPL under target | Increase budget |
| Ad has leads + CPL over target | Optimize audience or creative |
| Ad has $50+ spend + 0 leads | Pause |
| All ads performing well | Test one new creative |
| CPL rising week over week | Refresh creatives |

### Weekly Report
- Save to `projects/<client>/deliverables/reports/meta-weekly-YYYY-MM-DD.md`
- Include: spend, leads, CPL, changes made, recommendations

---

## Lessons Learned (from Fusion Financial)

- 11 ads at $17/day total = not enough budget per ad. Always $10+ per ad minimum.
- 3-4 focused ads at $50/day total outperforms 11 ads at $17/day
- Local "SSM Day" messaging outperformed generic financial messaging
- Tax season (Jan-Apr) is peak. Budget should increase 2x during peak.
