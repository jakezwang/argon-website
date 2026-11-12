// Builds app/contributors.json and public/contributors/<login>.<ext> from the
// merged pull requests of the public Argon repositories.
//
//   node scripts/sync-contributors.mjs          rewrite the data and avatars
//   node scripts/sync-contributors.mjs --check  exit 1 if the data is stale
//
// The site's Content-Security-Policy only allows images from its own origin,
// so avatars are copied into public/ rather than linked from GitHub.
//
// Set GITHUB_TOKEN to raise the API rate limit; public data needs no token.
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const REPOSITORIES = [
  "argon-lab/argon",
  "argon-lab/argon-agents",
  "argon-lab/benchmarks",
  "argon-lab/homebrew-tap",
];
// Maintainers are shown under Team, not thanked as outside contributors.
const MAINTAINERS = ["jakezwang"];
// Accounts that open automated pull requests but are not marked as bots.
const AUTOMATED = ["openaitx-system"];

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dataPath = path.join(root, "app", "contributors.json");
const avatarDir = path.join(root, "public", "contributors");
const check = process.argv.includes("--check");

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "argon-website-contributors",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

async function github(pathname) {
  const response = await fetch(`https://api.github.com${pathname}`, {
    headers,
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) {
    throw new Error(`GitHub ${pathname}: ${response.status}`);
  }
  return response.json();
}

async function paged(pathname) {
  const items = [];
  for (let page = 1; ; page += 1) {
    const separator = pathname.includes("?") ? "&" : "?";
    const batch = await github(
      `${pathname}${separator}per_page=100&page=${page}`,
    );
    items.push(...batch);
    if (batch.length < 100) return items;
  }
}

// The release a change shipped in is the first one published after it merged.
function shippedIn(releases, mergedAt) {
  const later = releases
    .filter((release) => release.published_at > mergedAt)
    .sort((a, b) => a.published_at.localeCompare(b.published_at));
  return later.length ? later[0].tag_name : null;
}

const skipped = new Set([...MAINTAINERS, ...AUTOMATED]);
const byLogin = new Map();
for (const repository of REPOSITORIES) {
  const pulls = await paged(`/repos/${repository}/pulls?state=closed`);
  const releases = await paged(`/repos/${repository}/releases`);
  const published = releases.filter(
    (release) => !release.draft && !release.prerelease && release.published_at,
  );
  for (const pull of pulls) {
    const mergedAt = pull.merged_at;
    if (!mergedAt || pull.user.type !== "User") continue;
    if (skipped.has(pull.user.login)) continue;
    const entry = byLogin.get(pull.user.login) ?? {
      login: pull.user.login,
      avatarUrl: pull.user.avatar_url,
      contributions: [],
    };
    entry.contributions.push({
      repository,
      number: pull.number,
      title: pull.title,
      url: pull.html_url,
      mergedAt: mergedAt.slice(0, 10),
      release: shippedIn(published, mergedAt),
    });
    byLogin.set(pull.user.login, entry);
  }
}

const contributors = [];
for (const entry of byLogin.values()) {
  const profile = await github(`/users/${entry.login}`);
  entry.contributions.sort(
    (a, b) => a.mergedAt.localeCompare(b.mergedAt) || a.number - b.number,
  );
  contributors.push({
    login: entry.login,
    name: profile.name || entry.login,
    url: profile.html_url,
    avatar: null,
    firstMergedAt: entry.contributions[0].mergedAt,
    contributions: entry.contributions,
    avatarUrl: entry.avatarUrl,
  });
}
// Earliest first, so the order never reshuffles when someone new arrives.
contributors.sort(
  (a, b) =>
    a.firstMergedAt.localeCompare(b.firstMergedAt) ||
    a.login.localeCompare(b.login),
);

const avatarSources = new Map(
  contributors.map((contributor) => [contributor.login, contributor.avatarUrl]),
);
for (const contributor of contributors) delete contributor.avatarUrl;
const serialize = () => `${JSON.stringify(contributors, null, 2)}\n`;

if (check) {
  // The avatar path depends on the downloaded image type, so the check keeps
  // the committed path and compares everything else.
  const current = await readFile(dataPath, "utf8").catch(() => "[]");
  const committed = new Map(
    JSON.parse(current).map((contributor) => [
      contributor.login,
      contributor.avatar,
    ]),
  );
  for (const contributor of contributors) {
    contributor.avatar = committed.get(contributor.login) ?? null;
  }
  const next = serialize();
  if (current !== next) {
    console.error(
      "FAIL: app/contributors.json is out of date. Run `npm run sync:contributors` and commit the result.",
    );
    process.exit(1);
  }
  console.log(`PASS: ${contributors.length} contributor(s), data is current`);
  process.exit(0);
}

const extensions = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
};
await mkdir(avatarDir, { recursive: true });
const written = new Set();
for (const contributor of contributors) {
  const avatarUrl = avatarSources.get(contributor.login);
  const separator = avatarUrl.includes("?") ? "&" : "?";
  const response = await fetch(`${avatarUrl}${separator}s=192`, {
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) {
    throw new Error(`avatar ${contributor.login}: ${response.status}`);
  }
  const type = response.headers.get("content-type")?.split(";")[0];
  const extension = extensions[type];
  if (!extension) throw new Error(`avatar ${contributor.login}: ${type}`);
  const file = `${contributor.login}.${extension}`;
  await writeFile(
    path.join(avatarDir, file),
    Buffer.from(await response.arrayBuffer()),
  );
  contributor.avatar = `/contributors/${file}`;
  written.add(file);
}
for (const file of await readdir(avatarDir)) {
  if (!written.has(file)) await rm(path.join(avatarDir, file));
}
await writeFile(dataPath, serialize());
console.log(
  `Wrote ${contributors.length} contributor(s) to app/contributors.json`,
);
