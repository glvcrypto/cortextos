#!/bin/bash
# Run birefnet background removal on all 16 Reyco icons
# Output: transparent PNGs in /v2/transparent/

FAL_KEY=$(cat /mnt/c/Users/joshu/.claude/credentials/fal-key.txt)
BOT_TOKEN="8667999119:AAFsnx3ODW4mdf2L634z5V6DsJMJUH0i3is"
CHAT_ID="1582763943"
OUTPUT_DIR="/home/aiden/cortextos/orgs/glv/clients/reyco-marine/assets/homepage-icons/v2/transparent"
mkdir -p "$OUTPUT_DIR"

TOTAL=16
IDX=0

remove_bg() {
  local SLUG=$1
  local TAB=$2
  local LABEL=$3
  local SOURCE_URL=$4
  IDX=$((IDX + 1))

  echo "=== BG removal ${IDX}/${TOTAL}: ${LABEL} ==="

  RESPONSE=$(curl -s -X POST "https://queue.fal.run/fal-ai/birefnet" \
    -H "Authorization: Key ${FAL_KEY}" \
    -H "Content-Type: application/json" \
    -d "{\"image_url\": \"${SOURCE_URL}\", \"model\": \"General Use (Light)\"}")

  REQUEST_ID=$(echo "$RESPONSE" | python3 -c 'import sys,json; d=json.load(sys.stdin); print(d.get("request_id",""))' 2>/dev/null)

  if [ -z "$REQUEST_ID" ]; then
    echo "ERROR: No request_id for ${SLUG}"
    return 1
  fi

  for i in $(seq 1 30); do
    sleep 3
    STATUS=$(curl -s "https://queue.fal.run/fal-ai/birefnet/requests/${REQUEST_ID}/status" \
      -H "Authorization: Key ${FAL_KEY}" | python3 -c 'import sys,json; d=json.load(sys.stdin); print(d.get("status",""))' 2>/dev/null)
    if [ "$STATUS" = "COMPLETED" ]; then break; fi
  done

  RESULT_URL=$(curl -s "https://queue.fal.run/fal-ai/birefnet/requests/${REQUEST_ID}" \
    -H "Authorization: Key ${FAL_KEY}" | python3 -c 'import sys,json; d=json.load(sys.stdin); print(d["image"]["url"])' 2>/dev/null)

  if [ -z "$RESULT_URL" ]; then
    echo "ERROR: No result URL for ${SLUG}"
    return 1
  fi

  OUTFILE="${OUTPUT_DIR}/${SLUG}.png"
  curl -s -o "$OUTFILE" "$RESULT_URL"
  echo "  saved: $OUTFILE"

  curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto" \
    -F "chat_id=${CHAT_ID}" \
    -F "photo=@${OUTFILE}" \
    -F "caption=Transparent ${IDX}/${TOTAL}: ${LABEL} (${TAB})" \
    > /dev/null
  echo "  sent to Telegram"

  echo "$RESULT_URL" >> "${OUTPUT_DIR}/urls.txt"
}

> "${OUTPUT_DIR}/urls.txt"

remove_bg "fishing-boat"          "Water"            "Fishing Boats"         "https://v3b.fal.media/files/b/0a9718d9/HPWHBX8I7KExztnrPRKHY_VVx7yPK8.png"
remove_bg "pontoon"               "Water"            "Pontoons"              "https://v3b.fal.media/files/b/0a9718dc/66g7kfqvdYlbG0EJw1d92_DebbJdmZ.png"
remove_bg "outboard-motor"        "Water"            "Outboard Motors"       "https://v3b.fal.media/files/b/0a9718e1/u9XS3YTUHpDRmtlMU-cW7_AgkKAtdt.png"
remove_bg "fish-finder"           "Water"            "Electronics"           "https://v3b.fal.media/files/b/0a9718e4/QlqPpwpKjoxdlw54CRb7i_plbsnO7g.png"
remove_bg "riding-mower"          "Lawn & Garden"    "Riding Mowers"         "https://v3b.fal.media/files/b/0a9718e6/QwYr9lQGflWJFdX0t2ehE_nBEFPU0f.png"
remove_bg "zero-turn"             "Lawn & Garden"    "Zero-Turn"             "https://v3b.fal.media/files/b/0a9718eb/MKdXU1-dlejUH4bFTymbu_bSfxfnoH.png"
remove_bg "push-mower"            "Lawn & Garden"    "Push Mowers"           "https://v3b.fal.media/files/b/0a9718ee/35RSNEBA1G-7bR-ecmjt__IMxjZStP.png"
remove_bg "chainsaw"              "Lawn & Garden"    "Chainsaws"             "https://v3b.fal.media/files/b/0a9718f1/VtnlrJAoy7MgGCWIlZvir_rwm3gwdN.png"
remove_bg "two-stage"             "Snow"             "Two-Stage"             "https://v3b.fal.media/files/b/0a9718f5/mXkKRgrcoIkiJZLzVOpi0_4Q9luQBn.png"
remove_bg "three-stage"           "Snow"             "Three-Stage"           "https://v3b.fal.media/files/b/0a9718f7/pOZF4fMgGqYKKGtsKffxx_O43HdV7J.png"
remove_bg "single-stage"         "Snow"             "Single-Stage"          "https://v3b.fal.media/files/b/0a9718fa/gZtb9pEAp1mtR9QkcR4GE_rMueEp5t.png"
remove_bg "snow-plow"             "Snow"             "Snow Plows"            "https://v3b.fal.media/files/b/0a9718fe/BLAOQaXGgHBfAq1YI6RPU_xqZN68UC.png"
remove_bg "engine-repair"         "Service & Parts"  "Engine Repair"         "https://v3b.fal.media/files/b/0a971902/KLjT2VF_97qoBpB58oZ7r_sMBMIGvV.png"
remove_bg "winterization"         "Service & Parts"  "Winterization"         "https://v3b.fal.media/files/b/0a971905/D9pSYQzZhB985EGnNJjtt_xyRLl75T.png"
remove_bg "spring-commissioning"  "Service & Parts"  "Spring Commissioning"  "https://v3b.fal.media/files/b/0a97190a/kSqN7lA5gpFOxlZsD8IPp_A1JZdSpg.png"
remove_bg "parts"                 "Service & Parts"  "Order Parts"           "https://v3b.fal.media/files/b/0a97190d/JTbeJXXzsMeqr5P_cAEJV_xEvgoatl.png"

echo ""
echo "=== ALL ${TOTAL} TRANSPARENT ICONS COMPLETE ==="
echo "Saved to: ${OUTPUT_DIR}"

curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
  -d "chat_id=${CHAT_ID}" \
  --data-urlencode "text=All 16 transparent versions done. No background, no text. Reply per icon: approve / regen [describe fix] / hold."
