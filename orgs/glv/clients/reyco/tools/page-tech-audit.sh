#!/bin/bash
# Quick boss-solo technical audit of a Reyco page HTML
F="$1"
[[ -z "$F" || ! -f "$F" ]] && echo "usage: page-tech-audit.sh <html-path>" && exit 1
echo "FILE: $F"
echo "BYTES: $(wc -c < "$F")"
echo "TITLE: $(grep -oE '<title>[^<]*</title>' "$F" | head -1 | sed 's/<[^>]*>//g')"
DESC=$(grep -oE 'name="description" content="[^"]*"' "$F" | head -1 | sed 's/.*content="//;s/"$//')
echo "META_DESC: ${DESC:-MISSING}"
DESC_LEN=${#DESC}
echo "META_DESC_LEN: $DESC_LEN $(if (( DESC_LEN < 120 )); then echo '(SHORT)'; elif (( DESC_LEN > 165 )); then echo '(TOO_LONG)'; else echo '(OK)'; fi)"
echo "H1_COUNT: $(grep -cE '<h1[^>]*>' "$F")"
echo "H1_TEXT: $(grep -oE '<h1[^>]*>(.*?)</h1>' "$F" | head -1 | sed 's/<[^>]*>//g' | head -c 100)"
echo "H2_COUNT: $(grep -cE '<h2[^>]*>' "$F")"
echo "SCHEMA_BLOCKS: $(grep -cE 'application/ld\+json' "$F")"
echo "CANONICAL: $(grep -oE 'rel="canonical" href="[^"]*"' "$F" | head -1)"
echo "BROKEN_IMG: $(grep -cE '<img[^>]*src=""|<img[^>]*src="#"' "$F")"
echo "ALT_EMPTY: $(grep -cE '<img[^>]*alt=""' "$F")"
echo "ALT_TOTAL: $(grep -cE '<img[^>]*alt=' "$F")"
echo "EXT_LINKS: $(grep -cE 'href="https?://[^/r]' "$F")"
echo "INT_LINKS: $(grep -cE 'href="(/|https://reyco\.glvmarketing\.ca)' "$F")"
echo "TEL_LINKS: $(grep -cE 'href="tel:' "$F")"
echo "PHP_ERR: $(grep -cE 'Notice|Warning|Fatal error|Parse error' "$F")"
echo "EMPTY_STATE_FIRES: $(grep -cE 'No products in this section yet|to show here yet|We can order any product' "$F")"
