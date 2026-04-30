# Long-Term Memory

## Spend Rules (user-defined 2026-04-23)
- **Hard cap: $40 per batch.** Never exceed $40 in a single fal.ai run.
- **Explicit approval required for ANY spend.** Even sub-$40 batches need user sign-off before calling the API.
- 5-product test pattern: spend on 5 items → user approves the output quality → then user approves remaining spend for full batch.
- Create an approval (category: financial) before every batch with: estimated $ cost, # images, model, product list.

## Output Routing (user-defined 2026-04-23)
- **Telegram only.** Do NOT mirror deliverables to Slack like other agents do (org default is Slack mirror — imagegen is an explicit exception).
- Send generated images inline in Telegram (sendPhoto) for user approval.
- After approval, mirror to Google Drive (see Drive Org below).

## Drive Organization (user-defined 2026-04-23)
Folder structure for all generated images:
```
<client>/Products/<brand>/<product>/main/
<client>/Products/<brand>/<product>/lifestyle/
```
Example for Reyco Mercury 9.9hp outboard:
```
reyco/Products/Mercury/9.9hp-fourstroke/main/<image>.png
reyco/Products/Mercury/9.9hp-fourstroke/lifestyle/<image>.png
```

**Drive credentials (2026-04-23):**
- Parent folder: "Generated Assets" at https://drive.google.com/drive/folders/1XY64VwI9160ms5eSAfvfW0I474wC6OCW
- Folder ID (in .env as `DRIVE_PARENT_FOLDER_ID`): `1XY64VwI9160ms5eSAfvfW0I474wC6OCW`
- Auth: glv-claude service account at `/mnt/c/Users/joshu/.claude/credentials/google-service-account.json` (in .env as `GOOGLE_SERVICE_ACCOUNT_JSON`)
- Write access: CONFIRMED via test create+delete on 2026-04-23
- Python stack already installed: `google-api-python-client`, `google-auth`

## fal.ai Protocol (boss + user-defined 2026-04-23)
1. Read fal.ai model docs FULLY before calling — no training-data shortcuts.
2. Surface reference-image / source-image conditioning options to user (required, not optional).
3. Wait for user answers on settings before calling the API.
4. Reference image REQUIRED for every generation (WP product page / mfr site / Lightspeed). If no reference, escalate to user — do NOT generate from text alone.

## Models Available
- **Nano Banana 2 (NB2)**: fal.ai/models/fal-ai/nano-banana-2. $0.08/image at 1K.
- **Seedance 2.0**: fal.ai/models/bytedance/seedance-2.0. $0.24-$0.30/s at 720p. Image-to-video. Deferred post-Apr-26 per user — bake skill now.

## NB2 Endpoint Usage (2026-04-23, verified against OpenAPI schema)

**Always use the `/edit` endpoint, never the base endpoint.**

- `fal-ai/nano-banana-2` (base) — text-to-image only. NO reference-image input. Do not call.
- `fal-ai/nano-banana-2/edit` — accepts `image_urls` array (up to 14 URLs, no base64). This is the reference-conditioned endpoint. Because user protocol rule 3 requires a reference image for EVERY generation, we ALWAYS call `/edit`.

Full URL: `https://queue.fal.run/fal-ai/nano-banana-2/edit`
Auth: `Authorization: Bearer $FAL_KEY`

**Parameter reference:**
| Field | Type | Notes |
|-------|------|-------|
| prompt | str, req, 3-50000 chars | |
| image_urls | array[URL], req | up to 14, public URLs only (no base64) |
| num_images | 1-4 (default 1) | |
| aspect_ratio | enum (auto / 1:1 / 3:4 / 4:5 / etc.) | 1:1 default for Reyco product grid |
| resolution | 0.5K / 1K / 2K / 4K (default 1K) | 1K = $0.08/img, 2K = $0.12, 4K = $0.16, 0.5K = $0.06 |
| output_format | jpeg / png / webp (default png) | |
| safety_tolerance | 1-6 (default 4) | |
| sync_mode | bool (default false) | false = queue mode |
| seed | int \| null | null for variety, pin to reproduce |
| thinking_level | minimal / high / null | off by default; test if quality lags |
| enable_web_search / enable_google_search | bool (default false) | keep off to prevent external-image leakage into output |
| limit_generations | bool (default true) | experimental, leave default |

**No negative_prompt support.** Shape outputs via positive-phrased constraints in the prompt ("no props, no text, no watermarks, no human hands").

**No weight/strength on reference conditioning.** More refs = implicitly tighter conditioning. Default approach: 3 refs per product (front + side + 3/4 angle).

Output schema: `images` array of `{url, content_type, file_name, file_size, width, height}` + top-level `description` (model-generated caption of what it produced).
