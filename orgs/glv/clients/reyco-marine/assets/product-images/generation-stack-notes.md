# Reyco Image Generation Stack — fal.ai Integration Notes

> Research date: 2026-04-21
> Status: DOCUMENTED — awaiting user approval of 94-image queue before ANY generation fires
> Hard gate: User Telegram YES required. Do not start generation.

---

## Model 1: Nano Banana 2 (Image Editing / img2img)

**fal.ai slug:** `fal-ai/nano-banana-2/edit`
**Endpoint:** `https://api.fal.ai/v1/fal-ai/nano-banana-2/edit`
**Type:** Prompt-guided image editing (Google Gemini 2.5 Flash backend)

### Key input fields

| Field | Type | Notes |
|-------|------|-------|
| `prompt` | string | Edit instruction — e.g. "Add a Northern Ontario lake dock background" |
| `image_urls` | array[string] | Seed images — up to 14 per request |
| `num_images` | int (1–4) | Images generated per request; default 1 |
| `resolution` | enum | 0.5K / 1K / 2K / 4K → 512 / 1024 / 2048 / 4096 px |
| `aspect_ratio` | enum | auto, 16:9, 1:1, 4:3, 3:4, etc. |
| `output_format` | enum | png / jpeg / webp; default png |
| `safety_tolerance` | int (1–6) | 1=strictest; 4=default |
| `seed` | int | For reproducibility across batch |

### IMPORTANT: Not traditional img2img
Nano Banana 2 does NOT have a `strength` slider. It is a prompt-editor — you supply seed image(s) via `image_urls` and describe the desired output in `prompt`. The model uses the seed(s) as visual reference, not as a blending target. For our use case: provide the hero product photo as seed, prompt describes the missing angles/shots ("same product from rear three-quarter angle, studio white background").

### Output
```json
{
  "images": [{"url": "...", "content_type": "image/png", "width": null, "height": null}],
  "description": "..."
}
```
All outputs carry SynthID watermark (not visible, embedded metadata).

### Pricing

| Resolution | Cost/image |
|------------|------------|
| 0.5K (512px) | $0.06 |
| 1K (1024px) | $0.08 |
| 2K (2048px) | $0.12 |
| 4K (4096px) | $0.16 |

Add-ons: web search +$0.015/req; high thinking +$0.002/req

### Queue cost estimate (1K resolution, no add-ons)
- Confirmed queue: 94 images × $0.08 = **$7.52**
- Conditional CC queue: 40 images × $0.08 = **$3.20**
- Total worst case: **$10.72**

### Rate limits (Tier 1 / standard account)
- 10 requests/min, 1,000 requests/day, ~10 images/min
- At 10 img/min: 94 images ≈ ~10 minutes wall time
- Max 4 images per request → batch in groups of 4

---

## Model 2: Seedance 2.0 (Image-to-Video)

**fal.ai slug:** `bytedance/seedance-2.0/image-to-video`
**Endpoint:** `https://api.fal.ai/v1/bytedance/seedance-2.0/image-to-video`
**Type:** Async queue-based video generation (ByteDance backend)

### Key input fields

| Field | Type | Notes |
|-------|------|-------|
| `prompt` | string | Motion description — "motor running at idle, water rippling behind boat" |
| `image_url` | string | Starting frame; JPEG/PNG/WebP; max 30 MB |
| `end_image_url` | string | Optional end frame for transition |
| `resolution` | enum | 480p or 720p only (no 1080p) |
| `duration` | int or "auto" | 4–15 seconds; "auto" = model infers from prompt |
| `aspect_ratio` | enum | auto, 16:9, 1:1, 9:16, etc. |
| `generate_audio` | bool | Include ambient/sfx audio; default true; no cost difference |
| `seed` | int | For reproducibility |

### Output
```json
{
  "video": {"url": "...", "content_type": "video/mp4", "file_size": 12345678},
  "seed": 42
}
```
MP4 (H.264), 480p or 720p. Async — use queue endpoint, poll for completion.

### Pricing (720p)

| Mode | Standard | Fast |
|------|----------|------|
| Image-to-video | $0.3024/sec | $0.2419/sec |
| Text-to-video | $0.3034/sec | $0.2419/sec |

Example costs at Standard 720p:
- 5 sec video: $1.51
- 10 sec video: $3.02
- 15 sec video: $4.54

Audio generation: included at no extra cost.

### Video constraints
- Duration: 4–15 seconds
- Output: MP4 only
- Resolution: 480p or 720p (no 4K)
- Input image: JPEG/PNG/WebP, max 30 MB
- Aspect ratio: 6 presets + auto

### Seedance scope for Reyco
Seedance is HIGH COST relative to stills. Proposed use: hero products only (e.g. flagship Princecraft boat on water, flagship Mercury outboard running). NOT for bulk product gallery fills. Decide per-product at generation time. Budget estimate: 5 hero videos × 8 sec × $0.3024 = **~$12.10**.

---

## Integration Architecture (not yet implemented)

```
nano-banana-queue.csv
  → filter fill_type != "from-scratch-pending-portal"
  → for each row:
      POST fal-ai/nano-banana-2/edit
        image_urls: [seed_hero_url]
        prompt: nb_prompt_draft (per row)
        num_images: images_to_generate (1–4)
        resolution: "1K"
        aspect_ratio: "auto"
      → save returned image URLs
      → write to step3-generated-images.csv

seedance (hero products only — separate approval):
  → select SKUs manually designated for video
  → POST bytedance/seedance-2.0/image-to-video
        image_url: best generated still
        prompt: motion description
        duration: 8
        resolution: "720p"
        generate_audio: true
```

### fal.ai API key
Stored as `FAL_KEY` env var. Check `.env` for content agent or user credentials store.

---

## Hard Gate Checklist (DO NOT skip)

- [ ] User approves 94-image queue via Telegram
- [ ] fal.ai API key verified and credited
- [ ] Dry-run 1 image (1 SKU) before full batch
- [ ] User sees dry-run output before batch proceed
- [ ] Cub Cadet 40-image conditional: only after Casey v3 dealer portal confirmed failed
