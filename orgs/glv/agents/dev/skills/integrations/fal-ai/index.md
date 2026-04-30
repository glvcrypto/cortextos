# fal.ai Integration

> AI media generation API — images, video, and 3D via 600+ models on pay-per-use pricing.

## Overview

fal.ai provides a unified REST API for generative AI models. We use it for ad creative generation: product images, video ads, and marketing visuals. All requests use an async queue-based workflow.

## Authentication

- **API Key:** `FAL_KEY` environment variable
- **Header:** `Authorization: Key $FAL_KEY`
- **Plan:** Pay-per-use (no monthly commitment)
- **Credential location:** `~/.claude/credentials/fal-key.txt`

## API Architecture (Queue-Based)

All generation follows a 3-step async pattern:

### Step 1: Submit Request

```bash
curl -X POST "https://queue.fal.run/{model_id}" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "...", ...params}'
```

**Response:**
```json
{
  "request_id": "80e732af-...",
  "response_url": "https://queue.fal.run/{model_id}/requests/{id}/",
  "status_url": "https://queue.fal.run/{model_id}/requests/{id}/status",
  "cancel_url": "https://queue.fal.run/{model_id}/requests/{id}/cancel"
}
```

### Step 2: Poll Status

```bash
curl -X GET "https://queue.fal.run/{model_id}/requests/{request_id}/status" \
  -H "Authorization: Key $FAL_KEY"
```

**Responses:** `IN_QUEUE` (with `queue_position`) → `IN_PROGRESS` → `COMPLETED`

### Step 3: Get Result

```bash
curl -X GET "https://queue.fal.run/{model_id}/requests/{request_id}" \
  -H "Authorization: Key $FAL_KEY"
```

**Image result:**
```json
{
  "images": [{"url": "https://fal.media/files/...", "width": 1024, "height": 1024}]
}
```

**Video result:**
```json
{
  "video": {"url": "https://fal.media/files/...", "content_type": "video/mp4"}
}
```

### Synchronous Mode (Quick Requests)

For fast models, use the sync endpoint instead of the queue:
```bash
curl -X POST "https://fal.run/{model_id}" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "..."}'
```

---

## Image Generation Models

| Model | Model ID | Price | Best For |
|-------|----------|-------|----------|
| **Nano Banana Pro** | `fal-ai/nano-banana-pro` | $0.15/image | Ad creatives, text-in-image, marketing campaigns |
| **Recraft V4** | `fal-ai/recraft/v4` | ~$0.10/image | Vector/SVG, brand design, professional graphics |
| **FLUX.2 Pro** | `fal-ai/flux-2-pro` | ~$0.08/image | Photorealism, artistic, maximum quality |
| **GPT Image 1** | `fal-ai/gpt-image-1` | ~$0.15/image | Text+image input, high fidelity |

### Nano Banana Pro Parameters

| Parameter | Type | Default | Options |
|-----------|------|---------|---------|
| `prompt` | string | (required) | Text description of image |
| `num_images` | int | 1 | 1-4 |
| `aspect_ratio` | enum | `auto` | `1:1`, `4:5`, `9:16`, `16:9`, `3:2`, `2:3`, `4:3`, `3:4`, `5:4`, `21:9` |
| `resolution` | enum | `1K` | `1K`, `2K`, `4K` (4K costs 2x) |
| `output_format` | enum | `png` | `jpeg`, `png`, `webp` |
| `safety_tolerance` | enum | `4` | 1 (strictest) to 6 |
| `seed` | int | random | For reproducible results |

### Image Generation Example

```bash
FAL_KEY=$(cat ~/.claude/credentials/fal-key.txt)
curl -X POST "https://queue.fal.run/fal-ai/nano-banana-pro" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Professional Facebook ad for a local coffee shop in Northern Ontario, warm lighting, modern interior, text overlay reading FRESH BREWED DAILY, clean marketing design",
    "num_images": 2,
    "aspect_ratio": "1:1",
    "resolution": "1K",
    "output_format": "png"
  }'
```

---

## Video Generation Models

| Model | Model ID | Price | Duration | Resolution | Best For |
|-------|----------|-------|----------|------------|----------|
| **Kling 3.0 Pro** | `fal-ai/kling-video/v3/pro/text-to-video` | ~$0.10/sec | 3-15s | 1080p | Multi-shot cinematic, product showcase |
| **Kling 2.6 Pro (I2V)** | `fal-ai/kling-video/v2.6/pro/image-to-video` | $0.07-0.14/sec | 5-10s | 1080p | Image-to-video, native audio |
| **Veo 3** | `fal-ai/veo3` | $0.40/sec | up to 10s | 4K | Highest quality, with sound |
| **Veo 2 (I2V)** | `fal-ai/veo2/image-to-video` | ~$0.20/sec | up to 10s | 4K | Image-to-video, realistic motion |
| **Wan 2.6** | `fal-ai/wan-25-preview/text-to-video` | $0.05/sec | up to 10s | 1080p | Budget-friendly, fast |
| **Minimax Video 01** | `fal-ai/minimax/video-01-live` | ~$0.08/sec | up to 10s | 1080p | Text-to-video, transformations |
| **LTX 2.0** | `fal-ai/ltx-video` | ~$0.04/sec | up to 10s | 4K | Open-source, cheapest |
| **Hunyuan Video 1.5** | `fal-ai/hunyuan-video` | ~$0.06/sec | up to 10s | 4K | Motion diversity, open |
| **Pixverse V4.5** | `fal-ai/pixverse/v4.5/image-to-video` | varies | varies | 1080p | Stylised, image-to-video |

### Model Selection Guide

| Use Case | Recommended Model | Why |
|----------|-------------------|-----|
| Facebook/Instagram Reels | Kling 3.0 Pro | Multi-shot, audio, cinematic |
| Product showcase (from photo) | Kling 2.6 Pro I2V or Veo 2 I2V | Animate a still product image |
| Budget video drafts | Wan 2.6 | $0.05/sec, fast iteration |
| Premium brand video | Veo 3 | 4K, sound, highest quality |
| Quick social clips | Minimax Video 01 | Good quality, fast |

### Video Generation Example (Kling 3.0)

```bash
FAL_KEY=$(cat ~/.claude/credentials/fal-key.txt)
curl -X POST "https://queue.fal.run/fal-ai/kling-video/v3/pro/text-to-video" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A drone shot slowly approaching a modern tiny home in a Northern Ontario forest, golden hour lighting, cinematic, 4K quality",
    "duration": 5,
    "aspect_ratio": "16:9"
  }'
```

### Image-to-Video Example (Kling 2.6)

```bash
FAL_KEY=$(cat ~/.claude/credentials/fal-key.txt)
curl -X POST "https://queue.fal.run/fal-ai/kling-video/v2.6/pro/image-to-video" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Camera slowly zooms in, subtle product rotation, professional lighting",
    "image_url": "https://example.com/product-photo.jpg",
    "duration": 5,
    "aspect_ratio": "9:16"
  }'
```

---

## Cost Optimisation Tips

1. **Draft at low cost first** — Use Wan 2.6 ($0.05/sec) or LTX ($0.04/sec) for concept testing, then Kling/Veo for finals
2. **Skip native audio** — Audio doubles video pricing. Add music/voiceover in post-production
3. **Image generation: 1K first** — Generate at 1K, select best, regenerate winner at 2K/4K
4. **Use image-to-video** — Start from a strong AI-generated image for more predictable results
5. **Batch strategically** — Generate 2-4 variations per concept, pick the best

---

## Related

- **Ad Creative Skill:** `.claude/skills/ad-creative/SKILL.md`
- **Paid Advertising Skill:** `.claude/skills/paid-advertising/SKILL.md`
- **Meta Ads Integration:** `.claude/skills/integrations/meta-ads/`
- **fal.ai Docs:** https://docs.fal.ai/model-apis
- **fal.ai Pricing:** https://fal.ai/pricing
- **fal.ai Models:** https://fal.ai/explore/models
