// Tells IndexNow (Bing and the engines that share it) which pages changed in
// the commit that was just deployed, so they are re-crawled without waiting.
//
//   node scripts/indexnow.mjs            submit pages changed in HEAD
//   node scripts/indexnow.mjs --all      submit every sitemap URL
//   node scripts/indexnow.mjs --dry-run  print the list without submitting
//
// The key is public by design: IndexNow verifies it by fetching the key file
// from this site.
import { execFileSync } from "node:child_process";

const HOST = "argonlabs.tech";
const KEY = "1d7cadac5413c3c9878dad5c0a54df1c";
const origin = `https://${HOST}`;
const all = process.argv.includes("--all");
const dryRun = process.argv.includes("--dry-run");

const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urls.length) throw new Error("sitemap has no URLs");

function changedUrls() {
  let files;
  try {
    files = execFileSync("git", ["diff", "--name-only", "HEAD~1", "HEAD"], {
      encoding: "utf8",
    })
      .split("\n")
      .filter(Boolean);
  } catch {
    return urls; // no parent commit available: treat everything as changed
  }
  const picked = new Set();
  for (const file of files) {
    const page = file.match(/^app\/(.*\/)?page\.tsx$/);
    if (page) {
      picked.add(
        `${origin}/${(page[1] ?? "").replace(/\/$/, "")}`.replace(/\/$/, ""),
      );
    } else if (/^(app|styles|public)\//.test(file)) {
      return urls; // shared code, data or assets can change any page
    }
  }
  return urls.filter((url) => picked.has(url));
}

const urlList = all ? urls : changedUrls();
console.log(`${urlList.length} of ${urls.length} URL(s) to submit`);
for (const url of urlList) console.log(`  ${url}`);
if (dryRun || !urlList.length) process.exit(0);

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `${origin}/${KEY}.txt`,
    urlList,
  }),
});
console.log(`IndexNow responded ${response.status}`);
// 200 and 202 both mean accepted; 202 means the key is still being checked.
if (![200, 202].includes(response.status)) {
  console.error(await response.text());
  process.exit(1);
}
