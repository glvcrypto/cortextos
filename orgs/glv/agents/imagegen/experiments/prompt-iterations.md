# Prompt Iteration Notes

## Current baseline prompt (pending user sign-off, 2026-04-23)

```
Professional product photograph of [PRODUCT_NAME]. Minimalist luxury showroom aesthetic: soft off-white gradient backdrop (#FAFAFA at top fading to #EEEEEE at base), subtle implied horizon line suggesting a spacious showroom floor, warm-neutral ambient lighting. Three-point studio lighting with soft key light from top-left, gentle fill, defined rim light catching product edges. Product sharply focused, three-quarter angle revealing depth. Premium marine-dealership catalog style. No props, no text, no watermarks, no branding overlays, no human hands. Match the exact product identity, proportions, and color of the reference images — product must be photorealistic and identical to references, not reinterpreted.
```

## Known hotspots — inspect in test results

- **"subtle implied horizon line"** (flagged by boss 2026-04-23): NB2 may interpret this literally as a dark seam across the image instead of a soft floor-to-wall fade. If ≥ 2/5 test outputs show a visible horizon seam, rewrite to: "subtle floor-to-wall transition, no visible seam line, softly gradated". Log test results here before making the swap.
- **"warm-neutral ambient lighting"**: check whether this skews outputs too yellow/orange. If so, try "cool-neutral" or remove the temperature qualifier entirely.
- **"photorealistic and identical to references, not reinterpreted"**: strong anti-hallucination language. If references themselves are low-quality (blurry mfr shots), this phrasing may pin artifacts into the output. Iteration idea: only apply this language when ref images are known-good.

## Iteration axes (reserve for post-test-1 if results need tuning)

- Warmer vs cooler ambient tone
- Visible floor horizon vs softer invisible fade
- Tighter framing vs more negative space
- Straight-on vs three-quarter angle
- Explicit product-category language ("outboard motor mounted on transom") vs generic ("marine product")

## Ingestion plan

After each test run, ingest:
- Every generated image (KB describes visual content semantically)
- Per-product: approved + rejected pair with the "why" tag so future prompt tuning has data

## NB2 refusal signature (observed 2026-04-23, all 5 pilot jobs)

When NB2 soft-refuses, the queue still reports `status=COMPLETED` with a valid `inference_time` in metrics — refusal is delivered at the **result endpoint as HTTP 422**, not as FAILED status. Body shape:

```
{"detail":[{"loc":["prompt"],"msg":"Could not generate images with the given prompts and images. Please try again with different inputs.","type":"invalid_request", ...}]}
```

`poll()` needs to fetch the result and inspect for this shape — don't trust `COMPLETED` alone. Current run.py treats COMPLETED as success and crashes on fetch_result.

Suspected triggers on the Mercury pilot prompt:
- Brand name "Mercury" in `{product_name}` substitution (trademark + counterfeit safety)
- "identical to references, not reinterpreted" phrasing (reads as copy-exact instruction)
- Conditioning on Mercury Marine mfr imagery combined with the above

Next iteration (pending user sign-off):
- Replace `{product_name}` with generic "outboard motor" (or equivalent product category) — let ref images carry identity
- Soften "identical to references, not reinterpreted" → "faithful to reference proportions and color"
- Bump `safety_tolerance` 4 → 6 (max-permissive)

### Retry result (2026-04-23) — SAME REFUSAL

Fired the retry: prompt neutralized to "four-stroke outboard boat motor", softened language, safety_tolerance=6. All 5 products refused with identical 422 body. The brand-name + copy-exact hypothesis was WRONG.

New strongest hypothesis: **reference images themselves trigger NB2's filter**. All 3 mfr refs show Mercury logos/model stamps on the cowling. NB2 appears to refuse ref-conditioning on trademarked commercial products regardless of prompt wording or safety_tolerance setting.

**Implication for fleet**: When using fal.ai/NB2 /edit with branded commercial product refs, expect refusal. This is a hard constraint, not a prompt-tuning problem. Options:
- Source ref images that don't show brand marks (crop/edit cowling labels out)
- Use a different ref-conditioned model with looser trademark filter (candidates: Flux Kontext, Seedream-4 — untested)
- Generate without refs (violates our rule 4 reference-required protocol — not an option)

### Option A diagnostic (2026-04-23) — ALSO REFUSED, hypothesis CONFIRMED

Tested product 731 with ONLY the Reyco-hosted ref (`reyco.glvmarketing.ca/.../MM_60hp_4S_4-Cyl_RP34_STD-2.jpg`), no mfr imagery. Same 422 refusal. Host doesn't matter, ref count doesn't matter — the Mercury outboard motor image itself triggers NB2's trademark filter.

**Definitive finding for fleet ledger**: `fal-ai/nano-banana-2/edit` refuses ref-conditioning on branded outboard-motor imagery regardless of:
- Host (Reyco-hosted vs mfr-hosted → same result)
- Ref count (1 ref vs 3 refs → same result)
- Prompt wording (brand-named vs generic "four-stroke outboard boat motor" → same result)
- `safety_tolerance` (4 vs 6 max-permissive → same result)

Implication: NB2 is ruled out for the Reyco Mercury catalog (123 products). Likely also unsafe for other trademarked gear catalogs in scope: Minnkota, Humminbird, Cannon, Cub Cadet, Toro, Echo, Princecraft, Bercomac. Model swap needed before full-run.
