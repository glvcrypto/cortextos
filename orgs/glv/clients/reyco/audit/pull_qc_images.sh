#!/usr/bin/env bash
# Pull 12 QC batch images via agent-browser with warm reyco SG cookie jar.
set -euo pipefail

PROFILE="/home/aiden/cortextos/orgs/glv/agents/imagegen/runs/.browser-profile"
OUT="/home/aiden/cortextos/orgs/glv/clients/reyco/audit/qc-images"
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

mkdir -p "$OUT"

declare -A URLS=(
  [EC-CWT7410-26]="https://reyco.glvmarketing.ca/wp-content/uploads/2026/04/EC-CWT7410-26.jpg"
  [EC-HC2020-26]="https://reyco.glvmarketing.ca/wp-content/uploads/2026/04/EC-HC2020-26.jpg"
  [EC-PB265LN-26]="https://reyco.glvmarketing.ca/wp-content/uploads/2026/04/EC-PB265LN-26.jpg"
  [EC-PB580T-26]="https://reyco.glvmarketing.ca/wp-content/uploads/2026/04/EC-PB580T-26.jpg"
  [EC-PB755ST-26]="https://reyco.glvmarketing.ca/wp-content/uploads/2026/04/EC-PB755ST-26.jpg"
  [EC-PB9010T-26]="https://reyco.glvmarketing.ca/wp-content/uploads/2026/04/EC-PB9010T-26.jpg"
  [EC-PW3600-26]="https://reyco.glvmarketing.ca/wp-content/uploads/2026/04/EC-PW3600-26.jpg"
  [EC-SRM225-26]="https://reyco.glvmarketing.ca/wp-content/uploads/2026/04/EC-SRM225-26.jpg"
  [HS-SEC250-26]="https://reyco.glvmarketing.ca/wp-content/uploads/2026/04/800_sector250-085013.png"
  [HS-SEC750CREW-26]="https://reyco.glvmarketing.ca/wp-content/uploads/2026/04/800_sector750crewred-104342.png"
  [HS-STRK250R-26]="https://reyco.glvmarketing.ca/wp-content/uploads/2026/04/800_stike250blue-110557.png"
  [HS-STRK550R-26]="https://reyco.glvmarketing.ca/wp-content/uploads/2026/04/800_strike550blue-110937.png"
)

echo "1/ warming reyco.glvmarketing.ca origin (pass CF challenge, populate cookies)..."
agent-browser --profile "$PROFILE" --user-agent "$UA" open "https://reyco.glvmarketing.ca/" >/dev/null
agent-browser --profile "$PROFILE" wait 3000 >/dev/null || true

echo "2/ pulling 12 images..."
for sku in "${!URLS[@]}"; do
  url="${URLS[$sku]}"
  ext="${url##*.}"
  dest="$OUT/${sku}.${ext}"
  echo "  -> $sku  ($url)"
  # Use eval to fetch image as base64 from page context (same-origin, cookies apply)
  b64=$(agent-browser --profile "$PROFILE" --user-agent "$UA" eval "
    (async () => {
      const r = await fetch('$url', {credentials: 'include'});
      if (!r.ok) return 'ERR:'+r.status;
      const buf = await r.arrayBuffer();
      let s=''; const u8=new Uint8Array(buf);
      for (let i=0;i<u8.length;i++) s+=String.fromCharCode(u8[i]);
      return btoa(s);
    })()
  " 2>&1 | tail -n 1)
  if [[ "$b64" == ERR:* ]]; then
    echo "     FAIL: $b64"
    continue
  fi
  if [[ -z "$b64" || "$b64" == *"Error"* ]]; then
    echo "     FAIL: empty/error response — $b64"
    continue
  fi
  echo "$b64" | base64 -d > "$dest"
  sz=$(stat -c %s "$dest")
  echo "     saved $dest ($sz bytes)"
done

echo "3/ closing browser..."
agent-browser close --all >/dev/null 2>&1 || true

echo "done. output dir: $OUT"
ls -la "$OUT"
