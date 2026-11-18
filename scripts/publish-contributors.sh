#!/usr/bin/env bash
# Rebuilds the contributors list and pushes it to master when it changed.
# Run by .github/workflows/contributors.yml; set DRY_RUN=1 to stop before
# committing.
set -euo pipefail

count() { node -p "require('./app/contributors.json').length"; }

before=$(count)
node scripts/sync-contributors.mjs
after=$(count)

# People are only ever added. A shorter list means the data source returned
# something wrong, and publishing it would remove someone's thanks.
if [ "$after" -lt "$before" ]; then
  echo "FAIL: the list shrank from $before to $after; not publishing." >&2
  exit 1
fi

git add app/contributors.json public/contributors public/contributors.svg
# A re-encoded avatar alone is not worth a deployment; it rides along with
# the next real change. The image embeds the avatars, so it changes with them.
if ! git diff --cached --name-status | grep -qvE '^M.public/contributors(/|\.svg$)'; then
  git reset -q
  git checkout -q -- public/contributors public/contributors.svg
  echo "The contributors list is current ($after listed)."
  exit 0
fi

git diff --cached --stat
if [ "${DRY_RUN:-}" = 1 ]; then
  echo "DRY_RUN: not committing."
  exit 0
fi

git -c user.name="Jake Wang" \
  -c user.email="jakezwang@users.noreply.github.com" \
  commit -q -m "Update the contributors list on the About page"
git push origin HEAD:master
echo "Published: $before -> $after contributor(s)."
