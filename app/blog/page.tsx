import { pageMetadata } from "../metadata";
import Link from "next/link";
import { sortedPosts } from "./posts";

export const metadata = pageMetadata(
  "Blog",
  "Guides on MongoDB branching, time travel, data versioning, and giving AI agents safe, disposable databases.",
  "/blog",
);

export default function BlogIndex() {
  const posts = sortedPosts();
  return (
    <div className="mx-auto max-w-4xl px-6 pt-14 sm:pt-20">
      <h1 className="page-title">Notes on branching your data</h1>
      <p className="lede mt-6 max-w-2xl">
        Guides on MongoDB branching, time travel, and reviewing AI agent changes
        in separate database sandboxes.{" "}
        <a className="prose-link" href="/feed.xml">
          Subscribe to the Atom feed
        </a>
        .
      </p>

      <ul className="mt-14 divide-y divide-brand-edge border-y border-brand-edge-strong">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="group block py-8">
              <p className="flex flex-wrap gap-x-4 text-sm text-brand-muted">
                <span>
                  {new Date(p.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    timeZone: "UTC",
                  })}
                </span>
                <span>{p.readingMinutes} min read</span>
              </p>
              <h2 className="mt-2.5 text-2xl font-semibold leading-tight text-brand-text transition-colors [font-stretch:100%] group-hover:text-brand-primary sm:text-[1.75rem]">
                {p.title}
              </h2>
              <p className="mt-2.5 max-w-2xl leading-7 text-brand-text-darker">
                {p.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
