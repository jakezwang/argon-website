# Argon website

Next.js website with shared product claims in `app/product.ts`, a local quickstart, Vercel Web Analytics and an opt-in, fixed-event analytics endpoint. Runtime: Node.js 22+ (Node 24 recommended).

```bash
npm ci
npm audit
npm run build
npm run start -- --hostname 127.0.0.1 --port 13000
```

In another terminal:

```bash
npx playwright install chromium
npm run test:browser
```

`SITE_URL` changes the preview URL. `ARTIFACT_DIR` changes the screenshot directory (default `/tmp/argon-website-checks`). The regression checks desktop/mobile routes and overflow, CTA and mobile navigation, browser errors, opt-out/opt-in/DNT behavior, event allowlists, size limits, and cross-origin rejection. Run this against a production build before deployment.

`app/release.json` records the published engine and SDK source release versions; `app/product.ts` derives links and install commands from it. Update these versions only after both releases are publicly available; the quickstart and example links use matching release tags. The SDK install commands use the version-pinned PyPI package; release checks verify its non-yanked wheel is publicly available. Matching example links still use the source release tag. Shared roadmap and capability copy feeds the homepage, Agents, Features and About. The reviewed CLI/Python setup is linked from `/quickstart`; validate these commands against the corresponding engine/agents refs during a coordinated release.

## Design system

Tokens, type and component utilities live in `styles/globals.css`; its header
comment states the four rules new pages should keep:

1. **Inert until energized.** The page is ink on paper. Argon violet appears
   only on live things: the active branch, focus, link underlines, hover.
2. **Width carries hierarchy.** Headlines use the expanded width of Archivo,
   text the normal width. No all-caps labels and no eyebrow above every heading.
3. **Mono means literal.** IBM Plex Mono is for commands, code and document
   data only.
4. **Numbers and connecting lines mark real sequences only** (the quickstart
   rail, the review steps).

Colors are `brand-*` tokens. Light is the default; dark follows the system or
the header toggle (`html[data-theme]`, saved as `argon.theme`). The `ink` class
pins the dark palette for code blocks and the walkthrough in both themes, so use
tokens rather than fixed colors inside them. Text pairs are checked at 4.5:1 in
all three palettes; re-check when a token changes.

## Contributors

The Contributors section of `/about` thanks people outside the team. It renders
`app/contributors.json`, which `npm run sync:contributors` builds from the
merged pull requests of the public Argon repositories, with the release each
change shipped in. Avatars are copied into `public/contributors/` because the
Content-Security-Policy only allows images from this origin. Maintainers and
automated accounts are excluded by the lists at the top of
`scripts/sync-contributors.mjs`.

The Contributors workflow keeps the list current on its own. Every hour, and
at once when the engine repository reports a merged pull request, it runs
`scripts/publish-contributors.sh`: rebuild the list and, if someone new has
landed a change, commit it to master, which deploys the site. It refuses to
publish a list that got shorter. `npm run test:contributors` checks the
committed list by hand.

The instant trigger is a `repository_dispatch` event of type `contributors`.
The engine repository sends it when its `WEBSITE_DISPATCH_TOKEN` secret is
set; without the secret the hourly run still picks the change up.

`node scripts/render-brand-images.mjs` regenerates `og.png` and the icons from
the same tokens (needs network access for the two font families).

## Vercel Web Analytics

The root layout mounts `WebsiteAnalytics` once, using `@vercel/analytics/next`
for initial page views and client-side navigation. These cookieless page views
are enabled by default, independently of the optional button counts below.
The `beforeSend` hook respects Do Not Track and removes query parameters and
fragments from page URLs. `/privacy` describes both types of measurement.

The SDK alone does not enable the Vercel project setting. Open the
[project's Analytics dashboard](https://vercel.com/jake-wangs-projects-c28e93e2/argon-website/analytics),
click **Enable** if it is offered, then redeploy the website so Vercel provisions
the analytics routes. No application API key or additional environment variable
is required. Follow the [official setup guide](https://vercel.com/docs/analytics/quickstart).

Verify on the deployed site that the analytics script loads and page-view
requests succeed, then check the dashboard for incoming data. With SDK v2,
Vercel may supply generated script/intake paths instead of the default
`/_vercel/insights/*`. A standalone local `next start` does not serve those
Vercel-managed endpoints. Existing `/api/events` logs are not Vercel page views,
and enabling Web Analytics does not backfill historical visits.

## Optional button counts

Off by default; the footer checkbox saves the browser's choice. `/api/events` logs only fixed event names (`demo_opened`, `quickstart_opened`) as structured `argon_funnel` records. `demo_opened` now counts the illustrated website walkthrough, not a hosted-console session, so do not compare it with historical hosted-console conversion counts. There are no event identifiers, query strings or document contents. Infrastructure may still process ordinary request metadata. Website and console have separate choices and no joining identity. Log retention and access controls belong to the deployment configuration.

The hosted console is paused. Website demo links lead to the illustrated `/demo` page; `/quickstart` runs the real engine locally. Website deployments do not enable the hosted runtime.

## Security migration

The site uses Next.js 16.4.3 with React 19.2.8, following the [official migration guide](https://nextjs.org/docs/app/guides/upgrading/version-16). The October 2026 maintenance update includes the upstream fixes for [image optimization](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw), [Server Actions](https://github.com/vercel/next.js/security/advisories/GHSA-p3m5-59mp-jv5r), and [cached typed arrays](https://github.com/vercel/next.js/security/advisories/GHSA-673q-mjm6-r5xr). An affected dependency version alone does not establish that these exploit conditions exist on this site. The app has no dynamic route params, async request APIs, middleware or custom webpack config requiring codemods. Dependency advisories, including build and test tooling, are checked with npm audit in CI.

## Content and example verification

`npm run test:releases` checks that the documented npm CLI, tagged engine guide,
SDK Git release, non-yanked PyPI wheel and matching Python example are publicly
available. The install commands pin the verified PyPI SDK release.

CLI commands use npm 11.16+ and approve only `argonctl`'s binary download script
with `--allow-scripts=argonctl`; npm 12 blocks dependency install scripts by
default. CI exercises the complete MongoDB example with npm 11.19.1 and checks
fresh global and `npm exec` installations of the published CLI with npm 12.2.0.
Workflow actions use reviewed Node 24 releases pinned to exact commits.

The browser regression discovers every route from the sitemap, checks it against
source pages, and verifies desktop/mobile rendering, destination-specific social
metadata, visible FAQ/JSON-LD agreement, placeholder removal and release references.
`/llms.txt` is generated from the same release data and capability limits as the site.

The feature showcase on the home and features pages renders `features` in
`app/product.ts`: one entry per job, written benefit first, with the commands and
the output they printed. Those transcripts were captured by hand from the
published CLI on a local replica set and are not executed by CI. When a release
changes a command or its output, rerun the commands and update the entry. Keep
the order benefit, command, limit; the full operating limits stay in
`capabilities`, whose text is reused by the FAQ, `llms.txt` and several articles.

The older CLI blog snippets render commands from `app/cli-examples.json`.
`npm run test:docs` executes those exact commands against a disposable local
MongoDB replica set with native PyMongo writes: a real diff and merge preview,
then a historical branch that restores the baseline while leaving main unchanged.
It requires Python 3.10+, `pymongo`, and the documented `argon` CLI on PATH:

```bash
export ARGON_TEST_MONGODB_URI='mongodb://localhost:27017/?replicaSet=rs0'
npm run test:docs
```

`ARGON_BIN` optionally selects the CLI executable. The test only accepts local
MongoDB hosts, assigns its own random metadata database and removes its own
branch databases afterward. CI provides an isolated MongoDB 7 container and
installs the exact CLI version from the shared release manifest.

The MCP tutorial downloads are served from `public/examples/`. With Python
3.12+, PyMongo, the released CLI and a disposable local replica set, run
`mcp_review.py` once with the default discard decision and once with `--apply`.
The script sends real stdio MCP requests, writes through PyMongo, reads the
same saved plan through the CLI, and checks the document values. `mcp_ttl.py`
imports its adjacent client and measures CLI sweep, running MCP expiry and
stopped/restarted MCP cleanup. Both accept `--output-dir`; use a fresh path.
`ARGON_TEST_MONGODB_URI` selects a local URI without credentials and `ARGON_BIN`
optionally selects the binary. Pass `--expected-version` from the release
manifest when verifying a new release. Their output includes synthetic local
URIs, JSONL messages and assertions, and their own fixture databases are removed
at exit. They provide a scripted review demonstration, not an approval policy.

CI runs both review decisions and the TTL experiment against a digest-pinned
MongoDB 7.0.45 replica set, retaining optional evidence artifacts. The browser
suite checks that the downloadable Python files equal these exercised sources.
