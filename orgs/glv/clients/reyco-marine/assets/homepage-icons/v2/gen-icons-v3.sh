#!/bin/bash
# Reyco Homepage Icons v3 — no brand markings on products
# Added to every prompt: "no visible text, no brand logos, no manufacturer markings, no decals on the product"

FAL_KEY=$(cat /mnt/c/Users/joshu/.claude/credentials/fal-key.txt)
BOT_TOKEN="8667999119:AAFsnx3ODW4mdf2L634z5V6DsJMJUH0i3is"
CHAT_ID="1582763943"
OUTPUT_DIR="/home/aiden/cortextos/orgs/glv/clients/reyco-marine/assets/homepage-icons/v3"
mkdir -p "$OUTPUT_DIR/transparent"

TOTAL=16
NO_BRAND="No visible text, no brand logos, no manufacturer markings, no decals, no labels on the product itself."

generate_and_remove_bg() {
  local IDX=$1
  local SLUG=$2
  local TAB=$3
  local LABEL=$4
  local PROMPT=$5

  echo "=== ${IDX}/${TOTAL}: ${LABEL} ==="

  # Submit NB2
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
  if [ -z "$REQUEST_ID" ]; then echo "ERROR: no request_id"; return 1; fi

  for i in $(seq 1 60); do
    sleep 5
    STATUS=$(curl -s "https://queue.fal.run/fal-ai/nano-banana-2/requests/${REQUEST_ID}/status" \
      -H "Authorization: Key ${FAL_KEY}" | python3 -c 'import sys,json; print(json.load(sys.stdin).get("status",""))' 2>/dev/null)
    [ "$STATUS" = "COMPLETED" ] && break
  done

  IMAGE_URL=$(curl -s "https://queue.fal.run/fal-ai/nano-banana-2/requests/${REQUEST_ID}" \
    -H "Authorization: Key ${FAL_KEY}" | python3 -c 'import sys,json; print(json.load(sys.stdin)["images"][0]["url"])' 2>/dev/null)
  if [ -z "$IMAGE_URL" ]; then echo "ERROR: no image URL"; return 1; fi

  # Background removal via birefnet
  BG_RESPONSE=$(curl -s -X POST "https://queue.fal.run/fal-ai/birefnet" \
    -H "Authorization: Key ${FAL_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"image_url\": \"${IMAGE_URL}\", \"model\": \"General Use (Light)\"}")

  BG_REQUEST_ID=$(echo "$BG_RESPONSE" | python3 -c 'import sys,json; print(json.load(sys.stdin).get("request_id",""))' 2>/dev/null)

  for i in $(seq 1 30); do
    sleep 3
    STATUS=$(curl -s "https://queue.fal.run/fal-ai/birefnet/requests/${BG_REQUEST_ID}/status" \
      -H "Authorization: Key ${FAL_KEY}" | python3 -c 'import sys,json; print(json.load(sys.stdin).get("status",""))' 2>/dev/null)
    [ "$STATUS" = "COMPLETED" ] && break
  done

  TRANSPARENT_URL=$(curl -s "https://queue.fal.run/fal-ai/birefnet/requests/${BG_REQUEST_ID}" \
    -H "Authorization: Key ${FAL_KEY}" | python3 -c 'import sys,json; print(json.load(sys.stdin)["image"]["url"])' 2>/dev/null)

  OUTFILE="${OUTPUT_DIR}/transparent/${SLUG}.png"
  curl -s -o "$OUTFILE" "$TRANSPARENT_URL"

  curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto" \
    -F "chat_id=${CHAT_ID}" \
    -F "photo=@${OUTFILE}" \
    -F "caption=${IDX}/${TOTAL}: ${LABEL} (${TAB}) — no branding" \
    > /dev/null

  echo "  done: ${SLUG}"
}

# Shared suffix appended to every prompt
S="$NO_BRAND Centered against a clean background fading from pure white at the centre to soft light grey at the edges. Even diffused studio lighting, commercial product catalog photography, square composition."

generate_and_remove_bg 1 "fishing-boat" "Water" "Fishing Boats" \
"Product photography of a generic 17-foot aluminium fishing boat with a centre console and bow casting deck, viewed from a 3/4 angle with the bow facing right. Plain unbranded hull with no markings. $S"

generate_and_remove_bg 2 "pontoon" "Water" "Pontoons" \
"Product photography of a generic 21-foot pontoon boat with dual aluminium pontoons and a Bimini top, viewed from a 3/4 angle with the bow facing right. Plain unbranded hull and deck surfaces with no markings. $S"

generate_and_remove_bg 3 "outboard-motor" "Water" "Outboard Motors" \
"Product photography of a generic 115-horsepower four-stroke outboard motor in operating position, viewed from a 3/4 angle showing the front and port side. Completely plain unbranded cowling with smooth surfaces and no text, no logos, no decals anywhere on the motor. $S"

generate_and_remove_bg 4 "fish-finder" "Water" "Electronics" \
"Product photography of a generic 7-inch marine fish finder and GPS chartplotter on a gimbal bracket, screen facing viewer at a slight 3/4 angle. Plain unbranded bezel and housing with no text or logos on the unit body. Screen shows a generic sonar display pattern. $S"

generate_and_remove_bg 5 "riding-mower" "Lawn & Garden" "Riding Mowers" \
"Product photography of a generic residential riding lawn mower with a 42-inch deck and high-back seat, viewed from a 3/4 angle with the front facing left. Plain unbranded hood and deck panels with no text, no logos, no decals. $S"

generate_and_remove_bg 6 "zero-turn" "Lawn & Garden" "Zero-Turn" \
"Product photography of a generic zero-turn riding lawn mower with dual lap-bar steering controls and a fabricated 42-inch deck, viewed from a 3/4 angle. Plain unbranded body panels with no text, no logos, no decals anywhere. $S"

generate_and_remove_bg 7 "push-mower" "Lawn & Garden" "Push Mowers" \
"Product photography of a generic self-propelled walk-behind push lawn mower with a 21-inch deck and grass bag attached, viewed from a 3/4 angle. Plain unbranded deck and housing with no text, no logos, no decals. $S"

generate_and_remove_bg 8 "chainsaw" "Lawn & Garden" "Chainsaws" \
"Product photography of a generic professional chainsaw with a 20-inch guide bar and chain, viewed from a 3/4 angle from above with the bar extending to the right. Plain unbranded body panels and handles with no text, no logos, no decals anywhere on the saw. $S"

generate_and_remove_bg 9 "two-stage" "Snow" "Two-Stage" \
"Product photography of a generic heavy-duty two-stage snowblower with a 28-inch clearing width, viewed from a 3/4 angle showing the auger housing and discharge chute. Plain unbranded housing panels with no text, no logos, no decals. $S"

generate_and_remove_bg 10 "three-stage" "Snow" "Three-Stage" \
"Product photography of a generic professional three-stage snowblower with a 30-inch clearing width viewed from a 3/4 angle. Plain unbranded housing with no text, no logos, no decals. $S"

generate_and_remove_bg 11 "single-stage" "Snow" "Single-Stage" \
"Product photography of a generic compact single-stage snowblower with a 21-inch clearing width and rubber auger, viewed from a 3/4 angle. Plain unbranded housing with no text, no logos, no decals. $S"

generate_and_remove_bg 12 "snow-plow" "Snow" "Snow Plows" \
"Product photography of a generic residential front-mounted snow plow blade approximately 60 inches wide with a curved mouldboard face and steel mounting frame, viewed from a 3/4 angle. Plain unbranded blade surface with no text, no logos, no markings. $S"

generate_and_remove_bg 13 "engine-repair" "Service & Parts" "Engine Repair" \
"Product photography of a generic marine outboard motor on a portable service stand with cowling removed exposing the powerhead, and mechanic tools laid neatly beside it, viewed from a 3/4 angle. No text, no brand names, no logos on any surface. $S"

generate_and_remove_bg 14 "winterization" "Service & Parts" "Winterization" \
"Product photography of a 17-foot aluminium fishing boat fully encased in white shrink-wrap plastic on a trailer with support stands, viewed from a 3/4 angle. The boat form is cleanly visible beneath the taut white wrap with no text or markings visible. $S"

generate_and_remove_bg 15 "spring-commissioning" "Service & Parts" "Spring Commissioning" \
"Product photography of a generic aluminium fishing boat being launched from a trailer into calm clear water at a dock ramp, viewed from a 3/4 angle. No brand markings or text visible on the hull or trailer. Bright, clean, evenly lit scene. $S"

generate_and_remove_bg 16 "parts" "Service & Parts" "Order Parts" \
"Product photography of a neat flat-lay arrangement of generic marine and small engine parts including an impeller, fuel filter, spark plugs, gear lube bottle, and a drive belt, viewed from slightly above. All parts are plain generic with no brand text, no logos, no labels. $S"

echo ""
echo "=== ALL 16 DONE (v3 — no branding) ==="

curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
  -d "chat_id=${CHAT_ID}" \
  --data-urlencode "text=All 16 regenerated — no branding, no text, transparent backgrounds. Reply per icon: approve / regen [describe fix] / hold."
