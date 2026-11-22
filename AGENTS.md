<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Writing copy for this site

Each fact has one home; other pages link to it.

- **Limits, test coverage and caveats** live in `capabilities` in
  `app/product.ts` and render once, under "What to expect" on /features. Other
  pages say the user-facing point in one sentence and link to
  `/features#capabilities` (or the feature section). Do not interpolate
  `sourceTesting`, `mergeCheckLimits` or a `capabilities` body into another
  page.
- **Describe the current release only.** No "From 2.x", "(from 2.x)" or "on
  older versions" in product pages; that history belongs in the changelog.
  Blog posts keep their dated wording, with `LaterReleasesNote` for later
  changes.
- **Lead with the answer.** A FAQ answer starts with a direct sentence and
  stays within two or three; the JSON-LD reuses it, so it must stand alone.
- When a release adds a feature, update its section on /features and, if
  users will ask about it, one FAQ entry. Check the duplicate-sentence count
  across pages before and after.
