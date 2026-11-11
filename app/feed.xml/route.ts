import { sortedPosts } from "../blog/posts";

export const dynamic = "force-static";

const base = "https://argonlabs.tech";

const escape = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const day = (iso: string) => `${iso}T00:00:00Z`;

export function GET() {
  const posts = sortedPosts();
  const newest = posts
    .map((post) => post.updated ?? post.date)
    .sort()
    .at(-1);
  const entries = posts
    .map((post) => {
      const url = `${base}/blog/${post.slug}`;
      return `  <entry>
    <id>${url}</id>
    <title>${escape(post.title)}</title>
    <link rel="alternate" type="text/html" href="${url}"/>
    <published>${day(post.date)}</published>
    <updated>${day(post.updated ?? post.date)}</updated>
    <summary>${escape(post.description)}</summary>
${post.tags.map((tag) => `    <category term="${escape(tag)}"/>`).join("\n")}
  </entry>`;
    })
    .join("\n");
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${base}/blog</id>
  <title>Argon guides</title>
  <subtitle>Branching, time travel and reviewed merge for MongoDB.</subtitle>
  <link rel="self" type="application/atom+xml" href="${base}/feed.xml"/>
  <link rel="alternate" type="text/html" href="${base}/blog"/>
  <updated>${day(newest ?? "2026-07-08")}</updated>
  <author><name>Argon Labs</name></author>
${entries}
</feed>
`;
  return new Response(xml, {
    headers: { "Content-Type": "application/atom+xml; charset=utf-8" },
  });
}
