# Argon website

Next.js website with shared product claims in `app/product.ts`, a local quickstart and an opt-in, fixed-event analytics endpoint. Runtime: Node.js 22+ (Node 24 recommended).

```bash
npm ci
npm audit --omit=dev
npm run build
npm run start -- --hostname 127.0.0.1 --port 13000
```

In another terminal:

```bash
npx playwright install chromium
npm run test:browser
```

`SITE_URL` changes the preview URL. `ARTIFACT_DIR` changes the screenshot directory (default `/tmp/argon-website-checks`). The regression checks desktop/mobile routes and overflow, CTA and mobile navigation, browser errors, opt-out/opt-in/DNT behavior, event allowlists, size limits, and cross-origin rejection. Run this against a production build before deployment.

`app/product.ts` separates the currently published release from the upcoming release. Promote the version after the engine release is published. Shared roadmap and capability copy feeds the homepage, Agents, Features and About. The reviewed CLI/Python setup is linked from `/quickstart`; validate these commands against the corresponding engine/agents refs during a coordinated release.

## Anonymous counts

Off by default; the footer checkbox saves the browser's choice. `/api/events` logs only fixed event names (`demo_opened`, `quickstart_opened`) as structured `argon_funnel` records. There are no event identifiers, query strings or document contents. Infrastructure may still process ordinary request metadata. Website and console have separate choices and no joining identity, so count ratios are directional aggregates, not cross-domain unique-user conversion rates. Log retention and access controls belong to the deployment configuration.

## Security migration

The hardening update moves Next.js 14 to 16.3.4 with React 19.2.8, following the [official migration guide](https://nextjs.org/docs/app/guides/upgrading/version-16). The app has no dynamic route params, async request APIs, middleware or custom webpack config requiring codemods. Production dependency advisories are checked with npm audit in CI.
