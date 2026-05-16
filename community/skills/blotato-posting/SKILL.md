---
name: blotato-posting
description: "You need to publish or schedule a social media carousel post for GLV Marketing. This skill takes rendered frames from the Remotion pipeline and posts them to Instagram, LinkedIn, or other platforms via the Blotato API. Use it after rendering new carousel content, when the content agent has approved copy, or when a scheduled post needs queuing."
triggers: ["post to social", "schedule carousel", "publish instagram", "publish linkedin", "blotato", "post carousel", "schedule post", "social media post", "post renders", "upload to blotato", "queue post", "social scheduling", "instagram carousel", "linkedin carousel", "post social content", "schedule social", "carousel post"]
external_calls: ["backend.blotato.com"]
---

# Blotato Posting — GLV Marketing Socials

Publish rendered Remotion carousel frames to social platforms via Blotato.

---

## Prerequisites

```bash
# Required env vars (set in agent config or .cortextos-env)
BLOTATO_API_KEY=<from Blotato dashboard → Settings → API Keys>
BLOTATO_INSTAGRAM_ACCOUNT_ID=<from Blotato dashboard → Accounts>
BLOTATO_LINKEDIN_ACCOUNT_ID=<from Blotato dashboard → Accounts>

# Remotion pipeline location
REMOTION_DIR="orgs/glv/clients/glv-marketing/socials/remotion"
RENDERS_DIR="orgs/glv/clients/glv-marketing/deliverables/socials/renders"
```

---

## Step 1: Prepare content

Edit `$REMOTION_DIR/src/Root.tsx` to swap in the new carousel copy.
Replace the `sampleSlides` array with your `SlideData[]`:

```typescript
// SlideData shape (src/types.ts):
// { type: "hook"|"content"|"cta", headline, body?, tag?, accent?, bgImage? }

const slides: SlideData[] = [
  { type: "hook",    tag: "GLV Marketing", headline: "...", body: "..." },
  { type: "content", tag: "Tip #1",        headline: "...", body: "..." },
  { type: "content", tag: "Tip #2",        headline: "...", body: "..." },
  { type: "content", tag: "Tip #3",        headline: "...", body: "..." },
  { type: "cta",     tag: "Free Consult",  headline: "...", body: "..." },
];
```

Preview in browser before rendering: `cd $REMOTION_DIR && npm run studio`

---

## Step 2: Render frames

```bash
cd $REMOTION_DIR

# Option A: render all stills (5 slides × 2 variants = 10 PNGs)
node scripts/render-all-stills.js <output-label>
# → $RENDERS_DIR/<output-label>/vertical/slide-01..05.png  (1080×1350, IG/LI)
# → $RENDERS_DIR/<output-label>/square/slide-01..05.png    (1080×1080, IG/Threads/FB)

# Option B: render MP4 (for Reels/TikTok — requires swiftshader)
npm run render:mp4
# → $RENDERS_DIR/test-001/carousel.mp4
```

Choose **vertical** (1080×1350) for Instagram carousels and LinkedIn.
Choose **square** (1080×1080) for Facebook, Threads.

---

## Step 3: Upload media to Blotato

Upload each slide PNG (in order) and collect the returned media IDs.

```bash
BLOTATO_BASE="https://backend.blotato.com"
RENDERS="$RENDERS_DIR/<output-label>/vertical"
MEDIA_IDS=()

for slide in "$RENDERS"/slide-*.png; do
  RESPONSE=$(curl -s -X POST "$BLOTATO_BASE/media" \
    -H "blotato-api-key: $BLOTATO_API_KEY" \
    -F "file=@$slide")
  ID=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
  MEDIA_IDS+=("$ID")
  echo "Uploaded $(basename $slide) → $ID"
done

echo "All media IDs: ${MEDIA_IDS[*]}"
```

---

## Step 4: Create the scheduled post

```bash
# Build JSON payload
SCHEDULED_AT="2026-05-14T14:00:00Z"   # ISO 8601 UTC — pick a weekday 9-11am ET or 6-8pm ET
CAPTION="Your caption here.

Five reasons your business is invisible online 👇

#LocalSEO #DigitalMarketing #SmallBusiness #GEO #AI"

# Format media IDs as JSON array
MEDIA_JSON=$(printf '%s\n' "${MEDIA_IDS[@]}" | python3 -c "import sys,json; print(json.dumps([l.strip() for l in sys.stdin]))")

curl -s -X POST "$BLOTATO_BASE/posts" \
  -H "blotato-api-key: $BLOTATO_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"content\": $(echo "$CAPTION" | python3 -c "import sys,json; print(json.dumps(sys.stdin.read().rstrip()))"),
    \"mediaIds\": $MEDIA_JSON,
    \"platforms\": [
      {\"name\": \"instagram\", \"accountId\": \"$BLOTATO_INSTAGRAM_ACCOUNT_ID\"},
      {\"name\": \"linkedin\",  \"accountId\": \"$BLOTATO_LINKEDIN_ACCOUNT_ID\"}
    ],
    \"scheduledAt\": \"$SCHEDULED_AT\",
    \"postType\": \"carousel\"
  }"
```

Save the returned `id` — you'll need it to check status.

---

## Step 5: Verify post

```bash
POST_ID="<id from step 4>"
curl -s "$BLOTATO_BASE/posts/$POST_ID" \
  -H "blotato-api-key: $BLOTATO_API_KEY" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('status'), d.get('scheduledAt'))"
```

Expected: `scheduled 2026-05-14T14:00:00.000Z` (or `published` if already fired).

---

## Platform caption rules

| Platform | Char limit | Hashtag guidance |
|----------|-----------|-----------------|
| Instagram | 2,200 | 5–15 tags at end; first 125 chars are the preview hook |
| LinkedIn | 3,000 | 3–5 tags inline or at end; no stuffing |
| Twitter/X | 280 | 1–2 tags; thread if longer |
| Facebook | 63,206 | 3–5 tags optional |

**Instagram hook rule:** the first line before the "more" fold is your hook. Put the strongest line there. Body copy after the `\n\n` break.

---

## Posting cadence (GLV Marketing)

| Day | Time (ET) | Format |
|-----|-----------|--------|
| Tue/Thu | 9–10 AM | Educational carousel |
| Wed | 6–8 PM | CTA / offer carousel |
| Fri | 11 AM | Behind-the-scenes / case study |

Avoid Mondays (low engagement) and weekends unless promoted.

---

## n8n automation (Phase 1 — not yet wired)

Planned workflow: `integrations/n8n/glv-socials-blotato.json`

Trigger: file watcher on `$RENDERS_DIR/*/vertical/` → upload → schedule.
Status: design spec ready; implementation blocked on Aiden approval + Blotato key in n8n env.

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `401 Unauthorized` | Check `BLOTATO_API_KEY` — regenerate in Blotato dashboard if stale |
| `422 account not found` | Verify `BLOTATO_INSTAGRAM_ACCOUNT_ID` — re-connect account in Blotato if expired |
| `400 mediaIds required` | Confirm upload step returned valid IDs (not empty array) |
| Media upload timeout | Files >10 MB may need compression: `convert slide.png -quality 90 slide-compressed.png` |
| Carousel only shows 1 image | Blotato carousel requires ≥2 mediaIds; check array length |
