# Blotato API Smoke-Test Report — 2026-05-17

**Date:** 2026-05-17 (~17:48 EDT)
**Status:** ✅ Smoke-test PASSED — Blotato API end-to-end workflow validated
**Triggered by:** boss heartbeat at 21:30 UTC mentioning "7 platforms authed" → I verified all 9 Blotato account IDs landed in `orgs/glv/secrets.env`

---

## What was tested

1. ✅ Blotato API auth (header format + key extraction)
2. ✅ Media upload endpoint (POST /v2/media)
3. ✅ Posts endpoint format (POST /v2/posts) — documented, not test-fired

---

## Key finding: shell-extraction bug (banked rule worth flagging fleet-wide)

The Blotato API key is base64-encoded and **ends with `=`** (standard base64 padding):

```
BLOTATO_API_KEY=blt_Wtj82rnaJl2kPtsJ2sViqnHw6ZIZsr5Y1feifjEho1Q=
```

When extracting from secrets.env, **`cut -d= -f2` drops the trailing `=`**, producing a corrupted 47-char key that the API rejects with `{"message":"Unauthorized"}`. The correct extraction is **`cut -d= -f2-`** (trailing dash captures all fields after the first `=`).

**Why this matters fleet-wide:** any agent reading base64-encoded keys from `*.env` files using `cut -d= -f2` will hit this. Affects future bus scripts, integration tests, and CI/CD secret extraction. Worth surfacing to analyst / dev / tool-registration.

**Banked fix:** always use `cut -d= -f2-` for `.env` value extraction (or use a dedicated parser like `dotenv`).

---

## Validated workflow (end-to-end)

### Step 1: Extract key correctly
```bash
BLOTATO_API_KEY=$(grep "^BLOTATO_API_KEY=" /home/aiden/cortextos/orgs/glv/secrets.env | cut -d= -f2-)
```

### Step 2: Upload media (JSON, not multipart)

⚠️ **The existing community skill `blotato-posting/SKILL.md` documents multipart/form-data which IS WRONG for v2.** Blotato v2 expects JSON with either a public URL or a base64 data URI.

```bash
# Build JSON payload via python to avoid CLI arg-length limits on big base64
PAYLOAD_FILE=$(mktemp /tmp/blotato-payload-XXXXXX.json)
python3 -c "
import base64, json
with open('$IMAGE_PATH', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('ascii')
print(json.dumps({'url': f'data:image/png;base64,{b64}'}))
" > "$PAYLOAD_FILE"

curl -s -X POST "https://backend.blotato.com/v2/media" \
  -H "blotato-api-key: $BLOTATO_API_KEY" \
  -H "Content-Type: application/json" \
  --data-binary "@$PAYLOAD_FILE"
rm -f "$PAYLOAD_FILE"
```

**Returns:**
```json
{"url":"https://database.blotato.io/storage/v1/object/public/public_media/.../slide-01.png","id":"fb450904-dd61-4699-9c18-4fcf11ed7d7e"}
```

The returned `url` field is the Blotato-hosted public URL — use this when constructing the post payload.

### Step 3: Post payload format (POST /v2/posts)

Per Blotato docs at `help.blotato.com/api.md?ask=POST+/v2/posts`:

```json
{
  "post": {
    "accountId": "BLOTATO_INSTAGRAM_ACCOUNT_ID value",
    "content": {
      "text": "Caption text here",
      "mediaUrls": ["url1", "url2", ...],
      "platform": "instagram"
    },
    "target": {
      "...": "platform-specific routing"
    }
  },
  "scheduledTime": "2026-05-18T13:00:00Z"
}
```

**Critical structure rule (from docs):** Scheduling fields go OUTSIDE the `post` object, not nested. Nested scheduling fields are ignored and the post publishes immediately.

**Platform-specific requirements:**
- Facebook + LinkedIn: require page identifiers (we have `BLOTATO_FACEBOOK_PAGE_ID` and `BLOTATO_LINKEDIN_PAGE_ID`)
- TikTok: requires privacy settings, comment/duet/stitch controls, content classification flags
- YouTube: requires title, privacy status, subscriber notification preference
- IG / Threads / X: standard accountId + content sufficient

---

## What's still untested

- ❌ Per-platform POST /v2/posts call (not test-fired — would create a real scheduled post; requires Aiden go-no-go before fire)
- ❌ Carousel upload pattern (multiple media URLs per post — likely just an array in `mediaUrls`)
- ❌ Per-platform mandatory fields (TikTok privacy/duet/stitch, YouTube title/privacy)
- ❌ Schedule cancellation if we need to abort after queue

---

## Per-platform readiness for intro-1 launch

| Platform | Blotato account ID present | Caption ready | Media ready | Platform-specific reqs known |
|----------|----------------------------|---------------|-------------|------------------------------|
| Instagram | ✅ INSTAGRAM_ACCOUNT_ID | ✅ v3 IG caption | ✅ 8 slides | None mandatory |
| LinkedIn | ✅ LINKEDIN_ACCOUNT_ID + LINKEDIN_PAGE_ID | ✅ v3 LinkedIn caption | ⚠️ need PDF combine | None blocking |
| Facebook | ✅ FACEBOOK_ACCOUNT_ID + FACEBOOK_PAGE_ID | ✅ v3 FB caption | ✅ 8 slides | None blocking |
| Threads | ✅ THREADS_ACCOUNT_ID | ✅ v3 Threads caption | ✅ 1 cover slide | None blocking |
| X | ✅ X_ACCOUNT_ID | ✅ v3 X caption (single tweet OR full thread) | ✅ 1 image OR none | Thread mode TBD |
| TikTok | ✅ TIKTOK_ACCOUNT_ID | N/A for carousel | N/A — reel-only platform | reel-watcher handles |
| YouTube | ✅ YOUTUBE_ACCOUNT_ID | N/A for carousel | N/A — reel-only platform | reel-watcher handles |

**Material blockers for intro-1 launch:** None on the API side. The PDF-combine step for LinkedIn is a manual workflow item (can use `magick` or `img2pdf` to merge 8 PNGs).

---

## Decision needed from Aiden (via boss): FIRE TIMING

intro-1 was greenlit at 10:25 EDT today for "Day 1 today". My cadence proposal scheduled Day 1 IG at 9:00 AM EDT — but it's now 17:48 EDT, well past the morning B2B engagement window.

**Three options:**

(a) **Fire tonight** — schedule for the next 1-2 hours, evening engagement window (less optimal but still gets Day 1 ship today)

(b) **Fire Monday AM 9:00 EDT** — push Day 1 to tomorrow, hit the optimal weekday morning window. Day 7 shifts to next Sunday or skip-weekend pattern.

(c) **Fire Tuesday AM 9:00 EDT** — skip Monday entirely. Original cadence proposal had Tue/Thu/Fri pattern. This restores that pattern (Day 1 Tue, Day 2 Wed, etc.).

**My recommendation:** (b) — push to Monday 9 AM. Day-1 evening posts to ~0 followers on IG/Threads (the brand-new accounts) won't earn much algorithm signal; morning post catches the LinkedIn weekday peak; the 7-day cadence still flows. Cost: 14-16 hour delay from the greenlight, but tighter day-1 performance.

---

## Next steps once Aiden picks fire timing

1. Build per-platform POST /v2/posts payload for intro-1 (5 channels)
2. Combine 8 PNG slides → single PDF for LinkedIn document carousel (~30 sec)
3. Schedule via Blotato API (NOT immediate publish — use `scheduledTime` field)
4. Confirm `scheduled` status via GET /v2/posts/{id}
5. Aiden touches up audio + geotag in IG composer if Blotato doesn't expose those fields (manual step, 2 min)
6. Final go/no-go from boss before scheduled fire time
7. Ping boss with live URL when intro-1 fires publicly

---

## Updated
2026-05-17T21:50:00Z (social agent)
