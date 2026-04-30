---
name: ad-creative
description: Generate ad creatives (images, videos, animations) using fal.ai models and Remotion. Trigger on requests for ad images, video ads, Facebook creatives, Instagram Reels, animated ads, or marketing visuals.
---

# Ad Creative Generation

> Research-driven AI creative generation for paid advertising across Facebook, Instagram, YouTube, and TikTok using fal.ai API and Remotion animations.

## Trigger

- "Create ad creative for [client]"
- "Generate Facebook ad images"
- "Make a video ad for [product/service]"
- "Create animated ad"
- "Generate Instagram Reel"
- Any request for marketing visuals, ad images, or video content

---

## Dependency Check

Before running, verify required research exists:

| Required | Path | If Missing |
|----------|------|------------|
| Client research | `projects/[client]/research/` | "No client research found for [client]. Run `/onboard [client]` first." |
| Avatar panel | `projects/[client]/research/test-group-panel.md` | "No avatars found for [client]. Run `/onboard [client]` first." |
| Director plan | `projects/[client]/strategy/marketing-director-plan.md` | "No Director plan found. Run `/onboard [client]` first." |

**STOP if any required dependency is missing.** Tell the user exactly what to run first. Do not proceed with partial or missing data.

---

## Core Principle: Research Before Generation

**NEVER generate blindly.** Every creative starts with research:

1. **Understand the brief** — client, product, audience, platform, objective
2. **Load brand package** — check `projects/<client>/brand/brand-package/` first (see Brand Package Reference below), then fall back to `H:\Shared drives\Clients\<ClientName>\` for logos, colours, fonts, existing creative
3. **Read brand identity** — if `/onboard:brand` output exists at `projects/<client>/brand/*-brand-identity.md`, read it for tone spectrum, colour palette, typography, messaging pillars, and photography direction
4. **Check competitor creative** — use the `competitor:deep` skill or manual research
5. **Define the concept** — write the creative brief before touching fal.ai
6. **Generate variations** — always produce 2-4 options
7. **Present for approval** — send via Telegram for client/Aiden review

---

## Brand Package Reference

A brand package is a folder of client-provided brand assets that grounds all creative generation. **Always check for it before generating.**

### Location

```
projects/<client>/brand/brand-package/
```

### Expected Contents (any or all)

| File/Folder | What It Contains | How It's Used |
|-------------|-----------------|---------------|
| `logos/` | Logo files (SVG, PNG, AI, EPS) — primary, secondary, icon/favicon, mono versions | Logo placement in ads, watermarks, end frames |
| `colours.md` or `colours.json` | Primary, secondary, accent hex codes + usage rules | Colour grounding for all generated imagery, text overlays, Remotion templates |
| `fonts/` | Font files (OTF, TTF, WOFF2) or font names + weights | Typography in text overlays and Remotion compositions |
| `style-guide.pdf` or `style-guide.md` | Full brand guidelines document | Master reference — overrides any `/onboard:brand` recommendations where they conflict |
| `photography/` | Sample approved photos, mood boards, or reference images | Style grounding for fal.ai prompts — describe the aesthetic of these images in your prompt |
| `templates/` | Existing ad templates, Canva files, InDesign files | Format and layout reference for consistency with existing campaigns |
| `assets/` | Icons, patterns, textures, watermarks, tagline lockups | Elements to composite into generated creatives |

### How to Use the Brand Package

1. **Before writing ANY prompt**, read the brand package contents
2. **Colours:** Include brand hex codes in the prompt when specifying text overlays, backgrounds, or colour grading (e.g., "Bold text in #1B4D89 blue")
3. **Logo:** Reference logo placement rules from the style guide. For Remotion compositions, import the SVG/PNG directly
4. **Fonts:** When generating text-heavy images, specify the font style intent to match brand fonts (e.g., if brand uses Montserrat Bold, prompt "bold geometric sans-serif"). For Remotion, import the actual font files
5. **Photography style:** Describe the aesthetic of sample photos in your fal.ai prompts (lighting, colour temperature, mood, composition style)
6. **If no brand package exists:** Proceed with `/onboard:brand` output, or fall back to crawling the client's website for visual cues (as before)
7. **Conflict resolution:** Client-provided brand package > `/onboard:brand` output > crawled website elements

---

## Platform Specifications

### Facebook / Instagram

| Placement | Aspect Ratio | Resolution | Duration | Format |
|-----------|-------------|------------|----------|--------|
| Feed (image) | 1:1 or 4:5 | 1080x1080 or 1080x1350 | — | JPG/PNG |
| Stories / Reels | 9:16 | 1080x1920 | 5-15s | MP4 |
| In-stream video | 16:9 | 1920x1080 | 5-15s | MP4 |
| Carousel | 1:1 | 1080x1080 | — | JPG/PNG |

### YouTube

| Placement | Aspect Ratio | Resolution | Duration | Format |
|-----------|-------------|------------|----------|--------|
| Pre-roll | 16:9 | 1920x1080 | 6-15s | MP4 |
| Bumper | 16:9 | 1920x1080 | 6s max | MP4 |
| Discovery | 16:9 thumbnail | 1280x720 | — | JPG |

### TikTok

| Placement | Aspect Ratio | Resolution | Duration | Format |
|-----------|-------------|------------|----------|--------|
| In-feed | 9:16 | 1080x1920 | 5-60s | MP4 |
| TopView | 9:16 | 1080x1920 | 5-60s | MP4 |

---

## Workflow: Image Ad Creative

### Step 1: Creative Brief

Before any API call, define:
- **Client:** Who is this for?
- **Objective:** Awareness / Consideration / Conversion
- **Platform:** Facebook Feed / Stories / etc.
- **Key message:** What must the viewer understand?
- **CTA:** What action do we want?
- **Brand elements:** Colours (hex codes from brand package), logo placement (per style guide rules), typography (font family + weight), tone
- **Brand package loaded:** Yes/No — list which assets were found and referenced
- **Reference:** Any competitor or inspiration ads

### Step 2: Scene Realism Protocol (MANDATORY)

Before writing ANY prompt, walk through this checklist. Every scene must look like a real photograph. If any check fails, rewrite the prompt before generating.

**Camera position:**
- Where is the photographer physically standing to take this shot?
- If the answer is "inside a wall," "floating in mid-air," "in oncoming traffic," or any impossible position — rewrite
- Describe the camera position in plain English before prompting (e.g., "shot from the passenger seat looking at the driver")

**Spatial consistency:**
- Do all objects, people, and vehicles face directions that make sense together?
- In traffic scenes: cars face the same direction, viewed from the same flow of traffic
- In group scenes: people's eyelines, body positions, and interactions are physically coherent
- In split-screen/comparison ads: each half must be an independently believable photograph

**Physics:**
- Lighting matches time of day (golden hour = long shadows, midday = short shadows, overcast = diffuse)
- Shadows all fall in the same direction within a scene
- Reflections on water, glass, and metal are consistent with the light source
- Gravity applies — hair, clothing, and objects hang or move naturally

**People:**
- Natural poses that a real person would hold (not contorted or stiff)
- Clothing fits the context (work clothes at work, casual on a boat, winter gear in snow)
- Hands, fingers, and faces look anatomically correct
- Age, build, and appearance match the avatar or target demographic described

**Service/Staff Ad Rule — No Corporate Attire (standing rule, effective 2026-03-19):**
- When generating ads featuring tradespeople, mechanics, service staff, or any on-the-job personnel:
  - Wardrobe MUST reflect actual trade work: shop coveralls, worn work shirts, safety vests where appropriate
  - NO branded corporate polos, button-ups, or anything that looks like a manager's uniform
  - Hands should show signs of work (calluses, grease, tools) — not clean and posed
  - Face should be visible and confident — not obscured or stock-photo generic
  - Background must reflect actual work environment: shop, service bay, outdoor property
- This rule was validated by unanimous rejection of a branded polo in the Reyco "Chris Knows Your Engine" v2 test (March 19, 2026). Every avatar, every mindset, every gender flagged it independently. It is now a standing rule for all Reyco service ads and any future client in a trades/service category.

**Environment matches the claim:**
- If the ad claims a specific location, the landscape must be accurate (Northern Ontario = Canadian Shield rock, boreal pine/birch, not palm trees or desert)
- Season-appropriate vegetation (no green leaves in a winter scene, no snow in July)
- Local details correct (Canadian licence plates, left-hand-drive vehicles, metric signage)
- Weather consistent within the scene (if it's raining, everything is wet)

**Text layer:**
- Text should look like a professional designer overlaid it — not painted on surfaces, etched into objects, or floating in the sky
- Text placement avoids covering key visual elements (faces, products, focal points)
- Text has sufficient contrast against its background to be legible

**Final gut check:**
- Look at the prompt and imagine the final image. Could this exact photograph exist in the real world?
- If anything feels "AI-generated" or surreal — identify the specific element and fix it in the prompt
- When in doubt, simplify. A believable simple scene beats an impressive impossible one.

### Step 3: Prompt Engineering (NB2-Specific)

NB2 is a **reasoning model** (Gemini 3.1 Flash), NOT a diffusion model. It reads your prompt like a brief and plans the composition before rendering. This changes how you write prompts.

#### How NB2 Reads Prompts

**DO — Write conversational, complete sentences:**
```
A tired man in his early 40s sitting in the driver seat of a sedan, viewed through
the passenger window. Bumper-to-bumper traffic ahead of him, rain on the windshield,
grey overcast sky. Shot with an 85mm lens, shallow depth of field.
```

**DON'T — Write comma-separated tag lists (actively hurts NB2):**
```
man, car, traffic, rain, sad, 4k, masterpiece, best quality, trending on artstation
```

Quality boosters like "masterpiece," "best quality," "trending on ArtStation" do nothing on NB2 and can degrade output. The model already optimises for quality.

#### Prompt Structure (follow this order)

```
1. Camera position — where is the photographer physically standing?
2. Subject — who/what is in the frame?
3. Action/pose — what are they doing?
4. Environment/location — where is this scene?
5. Lighting/mood — what time of day, what feeling?
6. Style reference — photographic terminology or aesthetic period
7. Text overlays — exact text in quotes with placement and style
8. Brand elements — logo, colours, format context
```

**Example (applying the full structure):**
```
Shot from the passenger seat of a sedan. A Canadian man in his early 40s sits in the
driver seat, head resting on one hand, staring at bumper-to-bumper traffic stretching
ahead through a rain-streaked windshield. Red tail lights glow in the grey overcast
light. The mood is exhausted and trapped. Shot with an 85mm portrait lens, shallow
depth of field on his face. Modern editorial photography style. Bold white sans-serif
text in the upper third reading "Same Budget." and in the lower third "Different Life."
Small "Reyco Marine" text bottom right corner. Facebook ad, square 1:1 format.
```

#### Photographic Terminology (NB2 responds well to these)

Use real photography language to control the output:
- **Lens:** "85mm portrait lens," "35mm wide-angle," "50mm standard"
- **Depth of field:** "shallow depth of field" (blurred background), "deep focus" (everything sharp)
- **Lighting:** "golden hour side light," "overcast diffuse," "studio rim light," "window light"
- **Film/aesthetic:** "Kodak Portra 400 colour palette," "1960s aesthetic" (auto-triggers grain + period details), "editorial photography"
- **Composition:** "rule of thirds," "centred subject," "negative space left side"

#### Text Rendering Rules

NB2's strongest feature — character-by-character validated typography. But follow these rules:

1. **Wrap ALL text in double quotation marks** with explicit style and position:
   - Good: `Bold white sans-serif text in the upper third reading "HEADLINE"`
   - Bad: `text saying HEADLINE`
2. **Max 3-5 text elements per image** (headline + subheadline + CTA + brand name)
3. **Short phrases only** (2-5 words per text element) — full sentences garble
4. **Specify font style intent:** "bold sans-serif," "italic script," "condensed uppercase"
5. **Specify exact placement:** "upper third," "centred below subject," "bottom right corner"
6. **Larger text renders better** — small text at 1K gets blurry. When in doubt, go bigger.
7. **Use PNG output for text-heavy images** — JPEG compression can blur text edges
8. **For mission-critical text** (legal, product labels): generate the scene without text, then overlay programmatically

#### NB2-Specific Features

**Aspect ratio `auto`:** NB2 analyses your prompt and picks the best ratio. Use this for exploration, specify exact ratios for production.

**Output formats:**
- `png` — text-heavy images, transparency needs (larger files)
- `jpeg` — photorealistic scenes without text (smaller files, faster)
- `webp` — web-optimised (smallest files)

**Web search grounding** (optional, +$0.015/img): Adds `"enable_web_search": true` to the request. NB2 queries Google before generating — useful for real-world subjects (landmarks, specific products, buildings). Skip for fictional/creative scenes.

**Image editing endpoint** (`fal-ai/nano-banana-2/edit`): Accepts up to 14 reference images with plain-language instructions. No masks needed. Useful for:
- Background replacement: "Place subject in a modern showroom. Keep pose and clothing identical."
- Object swap: "Replace the red car with a blue pickup truck."
- Style transfer: "Make this photo look like a 1970s film photograph."

#### Three Generation Tiers

| Tier | Resolution | Cost | Speed | Use When |
|------|-----------|------|-------|----------|
| **Sketch** | 512px | $0.06/img | Fastest | Ultra-fast concept validation, throwaway tests |
| **Creative** | 1K | $0.08/img | Fast | Concept testing, client-facing drafts, iteration |
| **Finalize** | 4K | $0.16/img | 2-3x slower | Production-ready ads, final deliverables, native 4K |

All tiers use the same endpoint (`fal-ai/nano-banana-2`) — only `resolution` changes. All generate natively (not upscaled).

**Workflow:** Sketch to find the concept → Creative to refine → Finalize the winner at 4K.

### Step 4: Generate via fal.ai

**Sketch Mode (concept test — $0.06/img):**
```bash
FAL_KEY=$(cat ~/.claude/credentials/fal-key.txt)

curl -X POST "https://queue.fal.run/fal-ai/nano-banana-2" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "[YOUR PROMPT]",
    "num_images": 2,
    "aspect_ratio": "auto",
    "resolution": "0.5K",
    "output_format": "jpeg"
  }'
```

**Creative Mode (draft — $0.08/img):**
```bash
FAL_KEY=$(cat ~/.claude/credentials/fal-key.txt)

curl -X POST "https://queue.fal.run/fal-ai/nano-banana-2" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "[YOUR PROMPT]",
    "num_images": 2,
    "aspect_ratio": "1:1",
    "resolution": "1K",
    "output_format": "png"
  }'
```

**Finalize Mode (production — $0.16/img):**
```bash
FAL_KEY=$(cat ~/.claude/credentials/fal-key.txt)

curl -X POST "https://queue.fal.run/fal-ai/nano-banana-2" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "[YOUR PROMPT]",
    "num_images": 1,
    "aspect_ratio": "1:1",
    "resolution": "4K",
    "output_format": "png"
  }'
```

Then poll for completion and retrieve results (see fal-ai integration docs).

### Step 4: Review & Iterate

- Present all variations to Aiden with URLs and descriptions
- Note which elements work and which don't
- Iterate on prompt based on feedback (stay in Creative mode)
- **Only switch to Finalize mode after explicit approval** — "finalize this one"

### Model Selection for Images

| Scenario | Model | Why |
|----------|-------|-----|
| Ad creative — concept testing | Nano Banana 2 @ 1K (Creative mode) | Fast, $0.08, excellent text rendering |
| Ad creative — production ready | Nano Banana 2 @ 4K (Finalize mode) | Native 4K, $0.16, same quality |
| Brand design / vector needed | Recraft V4 | Vector/SVG output, brand styling |
| Photorealistic product shot | FLUX.2 Pro | Maximum photorealism |
| Complex concept from description + reference image | GPT Image 1 | Multi-modal input |

---

## Workflow: Video Ad Creative

### Step 1: Video Brief (Extended)

All fields from Image Brief, plus:
- **Duration:** 5s / 10s / 15s
- **Audio:** Music only / voiceover / native AI audio / silent
- **Movement:** Camera motion, subject motion, transitions
- **Shots:** Single shot vs. multi-shot sequence
- **End frame:** Logo placement, CTA card

### Step 2: Storyboard

For video, always write a shot-by-shot plan BEFORE generating:

```markdown
## Storyboard: [Client] [Campaign]

**Shot 1 (0-3s):** Wide establishing shot of [location/product].
  Camera: Slow dolly forward. Mood: Warm, inviting.

**Shot 2 (3-7s):** Close-up of [product/detail].
  Camera: Subtle push-in. Text overlay: "[HEADLINE]"

**Shot 3 (7-10s):** CTA frame with logo.
  Camera: Static. Text: "[CTA]" + logo.
```

### Step 3: Model Selection for Video

| Scenario | Model | Cost | Notes |
|----------|-------|------|-------|
| **Draft / concept testing** | Wan 2.6 | $0.05/sec | Cheapest, iterate fast |
| **Final single-shot ad** | Kling 3.0 Pro | $0.10/sec | Cinematic, multi-shot, audio |
| **Animate a product photo** | Kling 2.6 Pro I2V | $0.07/sec | Image-to-video, reliable |
| **Premium brand film** | Veo 3 | $0.40/sec | 4K, integrated sound, highest quality |
| **Quick social clip** | Minimax Video 01 | $0.08/sec | Good quality, fast |
| **Budget batch generation** | LTX 2.0 | $0.04/sec | Open-source, cheapest |

### Step 4: Generate

**Cost-efficient workflow:**
1. Generate 2-3 drafts with Wan 2.6 ($0.05/sec) to test concepts
2. Select the best concept
3. Regenerate with Kling 3.0 Pro or Veo 3 for final quality
4. Skip native audio to halve costs — add music/VO in post

**Text-to-Video example:**
```bash
FAL_KEY=$(cat ~/.claude/credentials/fal-key.txt)
curl -X POST "https://queue.fal.run/fal-ai/wan-25-preview/text-to-video" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Drone shot approaching a modern storefront at golden hour, warm lighting, Northern Ontario small town, cinematic, professional",
    "duration": 5,
    "aspect_ratio": "9:16"
  }'
```

**Image-to-Video (animate a still):**
```bash
FAL_KEY=$(cat ~/.claude/credentials/fal-key.txt)
curl -X POST "https://queue.fal.run/fal-ai/kling-video/v2.6/pro/image-to-video" \
  -H "Authorization: Key $FAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Camera slowly pushes in, subtle ambient motion, professional lighting, cinematic feel",
    "image_url": "https://fal.media/files/[generated-image-url]",
    "duration": 5,
    "aspect_ratio": "9:16"
  }'
```

### Step 5: Poll & Retrieve

```bash
# Check status (repeat until COMPLETED)
curl -X GET "https://queue.fal.run/{model_id}/requests/{request_id}/status" \
  -H "Authorization: Key $FAL_KEY"

# Get result
curl -X GET "https://queue.fal.run/{model_id}/requests/{request_id}" \
  -H "Authorization: Key $FAL_KEY"
```

Video results return:
```json
{
  "video": {
    "url": "https://fal.media/files/...",
    "content_type": "video/mp4"
  }
}
```

---

## Workflow: Remotion Animated Ads

### What Remotion Does

Remotion renders React components into video frames — perfect for:
- **Text animation** sequences (headline reveals, typing effects)
- **Data-driven ads** (stats, pricing, feature lists with motion)
- **Template-based batch generation** (same animation, different copy per client)
- **Lower thirds / overlays** on top of AI-generated video
- **Logo animations** and brand intros/outros
- **Carousel-style videos** with transitions between product features

### Setup (One-Time)

```bash
# Install Remotion in the workspace
npx create-video@latest ad-templates
cd ad-templates
npm install
```

**Key packages:**
- `remotion` — Core framework
- `@remotion/cli` — CLI for preview and rendering
- `@remotion/renderer` — Programmatic rendering from Node.js
- `@remotion/player` — Preview in browser
- `@remotion/motion-blur` — Motion blur effects
- `@remotion/transitions` — Slide, fade, wipe transitions

**Remotion docs:** https://remotion.dev/docs
**GitHub:** https://github.com/remotion-dev/remotion

### Remotion Licensing

Remotion requires a company licence for commercial use. Check https://remotion.dev/license before deploying client work. Free for individuals and evaluation.

### When to Use Remotion vs. fal.ai Video

| Scenario | Use | Why |
|----------|-----|-----|
| Realistic product/scene footage | fal.ai video | AI generates the visuals |
| Text animations, data reveals | Remotion | Precise control over text timing |
| Animated infographics | Remotion | Data-driven, templatable |
| Product photo + motion overlay | fal.ai I2V + Remotion | Combine AI video with text overlay |
| Batch variations (same template, different copy) | Remotion | Programmatic, one template → many outputs |
| Logo intro/outro | Remotion | Brand-consistent, reusable |

### Combined Workflow: fal.ai + Remotion

The most powerful approach combines both:

1. **Generate background visuals** with fal.ai (image or video)
2. **Build Remotion composition** with text overlays, CTA, logo
3. **Render final ad** via Remotion CLI

```jsx
// Example: Ad template with AI background + text overlay
import { AbsoluteFill, Img, useCurrentFrame, interpolate, spring } from 'remotion';

export const AdCreative = ({ backgroundUrl, headline, cta, logoUrl }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  const slideUp = spring({ frame, fps: 30, from: 50, to: 0 });

  return (
    <AbsoluteFill>
      <Img src={backgroundUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{
        position: 'absolute', bottom: 100, left: 40, right: 40,
        opacity, transform: `translateY(${slideUp}px)`
      }}>
        <h1 style={{ color: 'white', fontSize: 48, textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
          {headline}
        </h1>
        <button style={{ background: '#FF6B35', color: 'white', padding: '16px 32px', fontSize: 24 }}>
          {cta}
        </button>
      </div>
      <Img src={logoUrl} style={{ position: 'absolute', top: 20, right: 20, width: 80 }} />
    </AbsoluteFill>
  );
};
```

**Render:**
```bash
npx remotion render src/index.tsx AdCreative out/ad-facebook-feed.mp4 \
  --props='{"backgroundUrl":"https://fal.media/...","headline":"Fresh Brewed Daily","cta":"Order Now","logoUrl":"./logo.png"}'
```

---

## Cost Management

### Budget Per Creative

| Mode | Image Model | Image Cost | Video Cost (5s) | Best For |
|------|------------|-----------|-----------------|----------|
| **Sketch** | NB2 @ 0.5K | $0.06 | — | Ultra-fast concept validation |
| **Creative** | NB2 @ 1K | $0.08 | $0.25 (Wan) | Draft iteration, client-facing concepts |
| **Finalize** | NB2 @ 4K | $0.16 | $0.50-0.70 (Kling 2.6) | Production-ready ads |
| Premium Video | — | — | $2.00 (Veo 3) | Hero video content |

### Cost Control Rules

1. **Always draft cheap first** — Wan 2.6 for video, 1K for images
2. **Skip audio on drafts** — Add in post to halve video costs
3. **Cap variations at 4** per concept per round
4. **Track spend** — Log costs in the daily memory file
5. **Client approval before premium** — Don't use Veo 3 without sign-off

---

## Approval Flow

### During Aiden's Active Hours

1. Generate variations
2. Present in terminal with URLs and descriptions
3. Wait for verbal/text approval
4. Iterate or finalize

### While Aiden Is Away

1. Generate draft variations (cheap tier only)
2. Send Telegram notification via @glvclaude_bot with:
   - Image/video URLs
   - Brief description of each variation
   - Cost incurred
   - "Reply to approve, or suggest changes"
3. Wait for response before generating final/premium versions
4. **NEVER spend on premium tier without approval**

---

## Quality Checklist

Before presenting any creative:

- [ ] Correct aspect ratio for target platform
- [ ] Text is legible (if applicable)
- [ ] Brand colours/logo present (if applicable)
- [ ] No AI artefacts (extra fingers, warped text, etc.)
- [ ] CTA is clear and visible
- [ ] Compliant with platform ad policies (no misleading claims)
- [ ] Canadian English in all copy
- [ ] Local context appropriate (Northern Ontario where relevant)

---

## Anti-Patterns

| Don't | Do Instead |
|-------|-----------|
| Generate without a brief | Write the creative brief first |
| Use Veo 3 for drafts | Start with Wan 2.6, upgrade for finals |
| Generate 10+ variations | Cap at 4 per round, iterate |
| Skip the storyboard for video | Always plan shots before generating |
| Hard-code prompts | Adapt prompts per client/brand context |
| Forget platform specs | Check the specs table every time |
| Send raw AI output to clients | Always review for artefacts first |

---

## File Organisation

Generated creatives go in the client's paid-advertising folder within the project:
```
projects/<client>/paid-advertising/creatives/
  YYYY-MM-DD-<campaign-slug>/
    sketch/          (512px concept tests — throwaway)
    creative/        (1K drafts — review with Aiden)
    finalize/        (4K production-ready — final deliverables)
    video/
      drafts/        (Wan 2.6 concept videos)
      finals/        (Kling/Veo final renders)
    remotion/
      src/           (Remotion project source)
      out/           (rendered outputs)
    brief.md         (creative brief)
    storyboard.md    (video storyboard)
    creative-log.md  (generation log with prompts, costs, URLs)
```

**Naming convention:** `<campaign-slug>-<platform>-<aspect>-v<version>.png`
Example: `same-budget-fb-feed-1x1-v2.png`

All creatives stay in the project folder within `life-os`. No Shared Drive copy needed.

---

## Autonomy Boundaries

| Action | Level |
|--------|-------|
| Write creative brief | agent-autonomous |
| Generate draft images (1K, Nano Banana Pro) | agent-autonomous |
| Generate draft video (Wan 2.6) | agent-autonomous |
| Generate premium video (Kling 3.0, Veo 3) | agent-support (need approval) |
| Generate at 4K resolution | agent-support (need approval, 2x cost) |
| Send creative to client | user (Aiden sends) |
| Publish/upload to ad platform | user (Aiden does) |

---

## Related Skills

- **campaign-workflow** — Full 4-stage pipeline that orchestrates this skill at Stage 3
- **paid-advertising** — Campaign strategy, targeting, bidding
- **copywriting** — Ad copy, headlines, CTAs
- **brand-voice** — Tone and messaging consistency
- **content:ads** — Ad content creation workflow
- **competitor:deep** — Competitor creative analysis

## Related Integrations

- **fal-ai** — `.claude/skills/integrations/fal-ai/` (API docs, model catalogue)
- **meta-ads** — `.claude/skills/integrations/meta-ads/` (campaign management)
- **canva** — Design creation and export (alternative to fal.ai for templated design)

---

## Dependencies

- `FAL_KEY` environment variable set (stored in `~/.claude/credentials/fal-key.txt`)
- `curl` available in shell
- Node.js installed (for Remotion)
- Remotion project initialised (one-time setup) for animated ads
