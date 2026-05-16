#!/usr/bin/env bash
# GLV Marketing — Blotato syndication step (run AFTER reel-pipeline.sh + Aiden aesthetic sign-off)
# Requires: BLOTATO_API_KEY, BLOTATO_IG_ACCOUNT_ID, BLOTATO_TIKTOK_ACCOUNT_ID,
#           BLOTATO_FB_ACCOUNT_ID, BLOTATO_YT_ACCOUNT_ID, BLOTATO_LI_ACCOUNT_ID
# in orgs/glv/secrets.env or agent .env
#
# AUTO_POST is OFF by default. Flip AUTO_POST=true only after Aiden aesthetic sign-off.

set -euo pipefail

AUTO_POST="${AUTO_POST:-false}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../../../.." && pwd)"

SECRETS_FILE="$REPO_ROOT/orgs/glv/secrets.env"
if [[ -f "$SECRETS_FILE" ]]; then
  # shellcheck disable=SC1090
  set -a; source "$SECRETS_FILE"; set +a
fi

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <run_dir>"
  echo "  run_dir: the timestamped output directory from reel-pipeline.sh"
  exit 1
fi

RUN_DIR="$1"
MANIFEST="$RUN_DIR/manifest.json"
CAPTION_FILE="$RUN_DIR/caption.txt"

if [[ ! -f "$MANIFEST" ]]; then
  echo "ERROR: manifest.json not found in $RUN_DIR"
  exit 1
fi

VIDEO_FILE="$(python3 -c "import json; d=json.load(open('$MANIFEST')); print(d['output_video'])")"
CAPTION="$(cat "$CAPTION_FILE")"
HEADLINE="$(python3 -c "import json; d=json.load(open('$MANIFEST')); print(d['headline'])")"

echo "[reel-post] Video: $VIDEO_FILE"
echo "[reel-post] Headline: $HEADLINE"
echo "[reel-post] Caption (first 120): ${CAPTION:0:120}..."

if [[ "$AUTO_POST" != "true" ]]; then
  echo ""
  echo "AUTO_POST=false — dry run only. To syndicate, run:"
  echo "  AUTO_POST=true $0 $RUN_DIR"
  echo ""
  echo "Platforms configured: IG Reels, TikTok, FB Reels, YouTube Shorts, LinkedIn"
  exit 0
fi

# Validate required env vars
for VAR in BLOTATO_API_KEY BLOTATO_IG_ACCOUNT_ID BLOTATO_TIKTOK_ACCOUNT_ID BLOTATO_FB_ACCOUNT_ID BLOTATO_YT_ACCOUNT_ID BLOTATO_LI_ACCOUNT_ID; do
  if [[ -z "${!VAR:-}" ]]; then
    echo "ERROR: $VAR not set. Add to orgs/glv/secrets.env."
    exit 1
  fi
done

BLOTATO_API="https://backend.blotato.com/api"

post_to_platform() {
  local PLATFORM="$1"
  local ACCOUNT_ID="$2"
  echo "[reel-post] Posting to $PLATFORM (account: $ACCOUNT_ID)..."

  RESPONSE="$(curl -s -X POST "$BLOTATO_API/posts" \
    -H "Authorization: Bearer $BLOTATO_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$(python3 -c "
import json, sys
payload = {
    'account_id': sys.argv[1],
    'media_type': 'video',
    'video_url': sys.argv[2],
    'caption': sys.argv[3],
    'post_type': 'reel',
}
print(json.dumps(payload))
" "$ACCOUNT_ID" "$VIDEO_FILE" "$CAPTION")")"

  echo "[reel-post] $PLATFORM response: $(echo "$RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('id','?'), d.get('status','?'))" 2>/dev/null || echo "$RESPONSE")"
}

post_to_platform "Instagram Reels" "$BLOTATO_IG_ACCOUNT_ID"
post_to_platform "TikTok" "$BLOTATO_TIKTOK_ACCOUNT_ID"
post_to_platform "Facebook Reels" "$BLOTATO_FB_ACCOUNT_ID"
post_to_platform "YouTube Shorts" "$BLOTATO_YT_ACCOUNT_ID"
post_to_platform "LinkedIn" "$BLOTATO_LI_ACCOUNT_ID"

echo "[reel-post] Syndication complete."
