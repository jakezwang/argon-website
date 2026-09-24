# Argon website

Next.js website with shared product claims in `app/product.ts`, a local quickstart and an opt-in, fixed-event analytics endpoint. Runtime: Node.js 22+ (Node 24 recommended).

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

`app/release.json` records the published engine and SDK source release versions; `app/product.ts` derives links and install commands from it. Update these versions only after both releases are publicly available; the quickstart and example links use matching release tags. The SDK install commands use the tagged Git source and do not imply that the same version is available on PyPI. Shared roadmap and capability copy feeds the homepage, Agents, Features and About. The reviewed CLI/Python setup is linked from `/quickstart`; validate these commands against the corresponding engine/agents refs during a coordinated release.

## Anonymous counts

Off by default; the footer checkbox saves the browser's choice. `/api/events` logs only fixed event names (`demo_opened`, `quickstart_opened`) as structured `argon_funnel` records. There are no event identifiers, query strings or document contents. Infrastructure may still process ordinary request metadata. Website and console have separate choices and no joining identity, so count ratios are directional aggregates, not cross-domain unique-user conversion rates. Log retention and access controls belong to the deployment configuration.

## Security migration

The hardening update moves Next.js 14 to 16.3.4 with React 19.2.8, following the [official migration guide](https://nextjs.org/docs/app/guides/upgrading/version-16). The app has no dynamic route params, async request APIs, middleware or custom webpack config requiring codemods. Dependency advisories, including build and test tooling, are checked with npm audit in CI.

## Content and example verification

`npm run test:releases` checks that the documented npm CLI, tagged engine guide,
SDK Git release and matching Python example are publicly available. Git-tag SDK
installation remains explicit until the corresponding package distribution is verified.

The browser regression discovers every route from the sitemap, checks it against
source pages, and verifies desktop/mobile rendering, destination-specific social
metadata, visible FAQ/JSON-LD agreement, placeholder removal and release references.
`/llms.txt` is generated from the same release data and capability limits as the site.

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
