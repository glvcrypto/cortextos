#!/bin/bash
# Reyco Homepage Icons v2 — NB2 Generation Script
# jbcycle.com style: 3/4 side-profile, clean light-gradient bg, diffused studio lighting

set -e

FAL_KEY=$(cat /mnt/c/Users/joshu/.claude/credentials/fal-key.txt)
BOT_TOKEN="8667999119:AAFsnx3ODW4mdf2L634z5V6DsJMJUH0i3is"
CHAT_ID="1582763943"
OUTPUT_DIR="/home/aiden/cortextos/orgs/glv/clients/reyco-marine/assets/homepage-icons/v2"
REVIEW_FILE="${OUTPUT_DIR}/REVIEW.md"
TOTAL=16
COST_PER=0.08

generate_icon() {
  local IDX=$1
  local SLUG=$2
  local TAB=$3
  local LABEL=$4
  local PROMPT=$5

  echo "=== Generating ${IDX}/${TOTAL}: ${LABEL} (${TAB}) ==="

  # Submit to NB2 queue
  RESPONSE=$(curl -s -X POST "https://queue.fal.run/fal-ai/nano-banana-2" \
    -H "Authorization: Key ${FAL_KEY}" \
    -H "Content-Type: application/json" \
    -d "{
      \"prompt\": $(echo "$PROMPT" | python3 -c 'import sys,json; print(json.dumps(sys.stdin.read()))'),
      \"num_images\": 1,
      \"aspect_ratio\": \"1:1\",
      \"resolution\": \"1K\",
      \"output_format\": \"png\"
    }")

  REQUEST_ID=$(echo "$RESPONSE" | python3 -c 'import sys,json; d=json.load(sys.stdin); print(d.get("request_id",""))' 2>/dev/null)

  if [ -z "$REQUEST_ID" ]; then
    echo "ERROR: No request_id for ${SLUG}. Response: $RESPONSE"
    return 1
  fi

  echo "  request_id: ${REQUEST_ID} — polling..."

  # Poll until COMPLETED
  for i in $(seq 1 60); do
    sleep 5
    STATUS=$(curl -s "https://queue.fal.run/fal-ai/nano-banana-2/requests/${REQUEST_ID}/status" \
      -H "Authorization: Key ${FAL_KEY}" | python3 -c 'import sys,json; d=json.load(sys.stdin); print(d.get("status",""))' 2>/dev/null)
    echo "  poll ${i}: ${STATUS}"
    if [ "$STATUS" = "COMPLETED" ]; then
      break
    fi
  done

  if [ "$STATUS" != "COMPLETED" ]; then
    echo "ERROR: Timed out waiting for ${SLUG}"
    return 1
  fi

  # Get result
  RESULT=$(curl -s "https://queue.fal.run/fal-ai/nano-banana-2/requests/${REQUEST_ID}" \
    -H "Authorization: Key ${FAL_KEY}")
  IMAGE_URL=$(echo "$RESULT" | python3 -c 'import sys,json; d=json.load(sys.stdin); print(d["images"][0]["url"])' 2>/dev/null)

  if [ -z "$IMAGE_URL" ]; then
    echo "ERROR: No image URL for ${SLUG}. Result: $RESULT"
    return 1
  fi

  echo "  image URL: ${IMAGE_URL}"

  # Download PNG
  OUTFILE="${OUTPUT_DIR}/${SLUG}.png"
  curl -s -o "$OUTFILE" "$IMAGE_URL"
  echo "  saved: ${OUTFILE}"

  # Send to Telegram
  curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto" \
    -F "chat_id=${CHAT_ID}" \
    -F "photo=@${OUTFILE}" \
    -F "caption=Icon ${IDX}/${TOTAL}: ${LABEL} (${TAB} tab)" \
    > /dev/null
  echo "  sent to Telegram"

  # Log to review file
  echo "| ${SLUG}.png | ${TAB} | ${LABEL} | ${IMAGE_URL} |" >> "${REVIEW_FILE}.tmp"
}

# Init review file
cat > "${REVIEW_FILE}.tmp" << 'HEADER'
| File | Tab | Label | Fal.ai URL |
|------|-----|-------|------------|
HEADER

# --- GENERATE ALL 16 ---

generate_icon 1 "fishing-boat" "Water" "Fishing Boats" \
"Product photography of a 17-foot aluminium fishing boat with a centre console and bow casting deck, viewed from a 3/4 angle slightly to the front-left side with the bow facing right. Centered in frame against a clean background that fades from pure white at the centre to soft light grey at the edges. Even diffused studio lighting from overhead and both sides, no harsh shadows, all hull and cockpit details clearly visible. Isolated product, no water, no environment. Commercial product catalog photography, square composition."

generate_icon 2 "pontoon" "Water" "Pontoons" \
"Product photography of a 21-foot pontoon boat with dual aluminium pontoons, a Bimini top, and rear lounge seating, viewed from a 3/4 angle slightly to the front-left side with the bow facing right. Centered in frame against a clean background fading from pure white at the centre to soft light grey at the edges. Even diffused studio lighting from overhead and both sides, pontoon tubes and deck layout clearly visible. Isolated product, no water, no environment. Commercial product catalog photography, square composition."

generate_icon 3 "outboard-motor" "Water" "Outboard Motors" \
"Product photography of a 115-horsepower four-stroke outboard motor in operating position, viewed from a 3/4 angle showing the front and port side, cowling facing forward. Centered in frame against a clean background fading from pure white at the centre to soft light grey at the edges. Even diffused studio lighting from overhead and both sides, all cowling contours, motor casing, and lower unit with propeller clearly visible. Isolated product on neutral surface. Commercial product catalog photography, square composition."

generate_icon 4 "fish-finder" "Water" "Electronics" \
"Product photography of a 7-inch marine fish finder and GPS chartplotter on a gimbal bracket mount, screen facing the viewer at a slight 3/4 angle. Centered in frame against a clean background fading from pure white at the centre to soft light grey at the edges. Even diffused studio lighting, the screen bezel, power button, and gimbal bracket details clearly visible. Isolated product. Commercial product catalog photography, square composition."

generate_icon 5 "riding-mower" "Lawn & Garden" "Riding Mowers" \
"Product photography of a residential riding lawn mower with a 42-inch cutting deck and a high-back seat, viewed from a 3/4 angle slightly to the front-right side with the front end facing left. Centered in frame against a clean background fading from pure white at the centre to soft light grey at the edges. Even diffused studio lighting from overhead and both sides, all machine details clearly visible. Isolated product on neutral surface. Commercial product catalog photography, square composition."

generate_icon 6 "zero-turn" "Lawn & Garden" "Zero-Turn" \
"Product photography of a zero-turn riding lawn mower with dual lap-bar steering controls, a fabricated 42-inch deck, and padded armrest seat, viewed from a 3/4 angle slightly to the front-left side with the front facing right. Centered in frame against a clean background fading from pure white at the centre to soft light grey at the edges. Even diffused studio lighting, all controls and deck details visible. Isolated product. Commercial product catalog photography, square composition."

generate_icon 7 "push-mower" "Lawn & Garden" "Push Mowers" \
"Product photography of a self-propelled walk-behind push lawn mower with a 21-inch single-blade deck and a folding handle with grass bag attached, viewed from a 3/4 angle slightly to the front-left side. Centered in frame against a clean background fading from pure white at the centre to soft light grey at the edges. Even diffused studio lighting, deck, handle, and wheels clearly visible. Isolated product. Commercial product catalog photography, square composition."

generate_icon 8 "chainsaw" "Lawn & Garden" "Chainsaws" \
"Product photography of a professional chainsaw with a 20-inch guide bar and chain, viewed from a 3/4 angle from above showing the top, rear handle, and guide bar extending to the right. Centered in frame against a clean background fading from pure white at the centre to soft light grey at the edges. Even diffused studio lighting, bar, chain, throttle trigger, and anti-vibration handles clearly visible. Isolated product. Commercial product catalog photography, square composition."

generate_icon 9 "two-stage" "Snow" "Two-Stage" \
"Product photography of a heavy-duty two-stage snowblower with a 28-inch clearing width, viewed from a 3/4 angle slightly to the front-right side showing the auger housing, discharge chute, and drive handles. Centered in frame against a clean background fading from pure white at the centre to soft light grey at the edges. Even diffused studio lighting, all machine details clearly visible. Isolated product. Commercial product catalog photography, square composition."

generate_icon 10 "three-stage" "Snow" "Three-Stage" \
"Product photography of a professional three-stage snowblower with a 30-inch clearing width and a wide accelerator-stage intake, viewed from a 3/4 angle slightly to the front-right side showing the intake housing, discharge chute, and power drive handles. Centered in frame against a clean background fading from pure white at the centre to soft light grey at the edges. Even diffused studio lighting, all three stages clearly visible. Isolated product. Commercial product catalog photography, square composition."

generate_icon 11 "single-stage" "Snow" "Single-Stage" \
"Product photography of a compact single-stage snowblower with a 21-inch clearing width and a single rubber auger, viewed from a 3/4 angle slightly to the front side showing the auger housing and discharge chute. Centered in frame against a clean background fading from pure white at the centre to soft light grey at the edges. Even diffused studio lighting. Isolated product. Commercial product catalog photography, square composition."

generate_icon 12 "snow-plow" "Snow" "Snow Plows" \
"Product photography of a residential front-mounted snow plow blade approximately 60 inches wide with a curved mouldboard face and steel mounting frame, viewed from a 3/4 angle showing the blade face and mounting hardware. Centered in frame against a clean background fading from pure white at the centre to soft light grey at the edges. Even diffused studio lighting, blade contour and mounting frame details clearly visible. Isolated product on neutral surface. Commercial product catalog photography, square composition."

generate_icon 13 "engine-repair" "Service & Parts" "Engine Repair" \
"Product photography of a marine outboard motor mounted upright on a portable service stand, with a neatly arranged set of mechanic tools laid beside it, viewed from a 3/4 angle. The motor cowling is removed exposing the powerhead. Centered in frame against a clean background fading from pure white at the centre to soft light grey at the edges. Even diffused studio lighting, all components clearly visible. Isolated product setup. Commercial product catalog photography, square composition."

generate_icon 14 "winterization" "Service & Parts" "Winterization" \
"Product photography of a 17-foot aluminium fishing boat fully encased in white shrink-wrap plastic and supported on a boat trailer with wooden support stands, viewed from a 3/4 angle showing the port side and bow. The boat form is cleanly visible beneath the taut white wrap. Centered in frame against a clean background fading from pure white at the centre to soft light grey at the edges. Even diffused studio lighting. Isolated product. Commercial product catalog photography, square composition."

generate_icon 15 "spring-commissioning" "Service & Parts" "Spring Commissioning" \
"Product photography of an aluminium fishing boat being launched from a boat trailer into calm clear water, the trailer tilted at the dock ramp edge with the hull resting on the water surface, viewed from a 3/4 angle. Bright, clean, evenly lit scene with a soft neutral light background. All details of the hull and trailer clearly visible. Commercial product catalog photography style. Square composition."

generate_icon 16 "parts" "Service & Parts" "Order Parts" \
"Product photography of a neat flat-lay arrangement of OEM marine and small engine parts including an impeller, fuel filter, spark plugs, a gear lube bottle, and a drive belt, arranged on a clean white surface and viewed from slightly above at a 3/4 angle. Clean white background with a soft light grey radial gradient toward the edges. Even diffused studio lighting from above, all parts clearly visible and identified. Commercial product catalog photography, square composition."

# Write final REVIEW.md
TOTAL_COST=$(echo "scale=2; $TOTAL * $COST_PER" | bc)
cat > "$REVIEW_FILE" << EOF
# Reyco Homepage Icons v2 — User Review

**Status:** STAGED — awaiting user approval before dev swaps SVG placeholders
**Generated:** 2026-04-21 via Fal.ai NB2 (Nano Banana 2, 1K creative mode)
**Style:** jbcycle.com aesthetic — 3/4 side-profile, clean light-gradient background, even diffused studio lighting
**Cost:** ~\$${COST_PER}/image × ${TOTAL} = ~\$${TOTAL_COST} total
**Format:** PNG, 1:1 square, 1K resolution

---

## Icon Set

$(cat "${REVIEW_FILE}.tmp")

---

## Approval Options Per Icon

For each icon, user can:
- **Approve** — dev uses as-is to replace SVG placeholder
- **Regenerate** — describe what's wrong and content agent re-generates (1 credit each)
- **Hold** — keep SVG placeholder for now

## Dev Notes (after approval)

- Files are 1K PNG, white/gradient background
- SVG slots: replace \`assets/images/categories/<slug>.svg\` with corresponding PNG (update PHP to use \`<img>\` instead of inline SVG if needed)
- Naming matches SVG filename convention from front-page.php
- Do NOT push to WordPress until user approves
EOF

rm -f "${REVIEW_FILE}.tmp"

echo ""
echo "=== ALL ${TOTAL} ICONS COMPLETE ==="
echo "Total cost: ~\$${TOTAL_COST}"
echo "REVIEW.md updated: ${REVIEW_FILE}"
echo "Send summary to Telegram..."

curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
  -d "chat_id=${CHAT_ID}" \
  -d "text=All 16 Reyco homepage icons done. Review above and reply per icon: approve / regen (describe fix) / hold. Total cost ~\$${TOTAL_COST}."
