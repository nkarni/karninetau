#!/usr/bin/env bash
#
# Assembles the deployable site from versions/v2 into build/site and a zip.
# Copies ONLY the allow-listed files, so local secrets (smtp-config.php) and
# dev scaffolding (versions/index.html, versions/v1, tools/) never ship.
#
# Usage:  bash tools/deploy/build.sh
# Output: build/site/           (upload the CONTENTS of this to the web root)
#         build/karni-net-au.zip

set -euo pipefail

# Resolve repo root from this script's location (works regardless of cwd).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

SRC="${ROOT}/versions/v2"
OUT="${ROOT}/build/site"
ZIP="${ROOT}/build/karni-net-au.zip"

# Files/dirs to publish (paths relative to versions/v2).
ITEMS=(
  index.html
  styles.css
  main.js
  contact.php
  smtp-config.example.php
  favicon.svg
  favicon-16x16.png
  favicon-32x32.png
  apple-touch-icon.png
  og-image.png
  robots.txt
  sitemap.xml
  images
  lib
)

echo "Source: ${SRC}"
echo "Output: ${OUT}"

rm -rf "${OUT}" "${ZIP}"
mkdir -p "${OUT}"

missing=0
for item in "${ITEMS[@]}"; do
  if [ -e "${SRC}/${item}" ]; then
    cp -R "${SRC}/${item}" "${OUT}/"
    echo "  + ${item}"
  else
    echo "  ! MISSING: ${item}" >&2
    missing=1
  fi
done

# Safety net: make sure no real secret slipped in.
if [ -e "${OUT}/smtp-config.php" ]; then
  echo "Removing smtp-config.php from build (must be set on the server only)." >&2
  rm -f "${OUT}/smtp-config.php"
fi

# Zip the CONTENTS of build/site (so files land at the web root, not in a subfolder).
if command -v zip >/dev/null 2>&1; then
  ( cd "${OUT}" && zip -r -q "${ZIP}" . )
  echo "Zip: ${ZIP}"
else
  echo "Note: 'zip' not found — skipped archive; upload build/site contents directly." >&2
fi

echo
if [ "${missing}" -eq 0 ]; then
  echo "Done. Upload the CONTENTS of build/site/ to the web root."
else
  echo "Done WITH WARNINGS: some files were missing (see above)."
fi
echo "Reminder: create smtp-config.php on the server from smtp-config.example.php."
