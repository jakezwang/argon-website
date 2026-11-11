"use client";

import { useEffect, useState } from "react";

type Entry = { id: string; text: string };

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// "On this page" for long guides. Built from the article's own headings so the
// hand-written pages need no ids; shown beside the text on wide screens only.
export default function ArticleToc() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLHeadingElement>(".article h2"),
    );
    const seen = new Set<string>();
    const found = headings.map((heading) => {
      let id = heading.id || slug(heading.textContent ?? "");
      while (seen.has(id)) id += "-2";
      seen.add(id);
      heading.id = id;
      return { id, text: heading.textContent ?? "" };
    });
    setEntries(found);
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView();
    }

    const observer = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          if (record.isIntersecting) setActive(record.target.id);
        }
      },
      { rootMargin: "-96px 0px -70% 0px" },
    );
    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, []);

  if (entries.length < 3) return null;

  return (
    <nav aria-label="On this page" className="sticky top-28 text-sm">
      <p className="font-semibold text-brand-text">On this page</p>
      <ul className="mt-3 border-l border-brand-edge">
        {entries.map(({ id, text }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
              className={`-ml-px block border-l py-1.5 pl-4 leading-5 transition-colors ${
                active === id
                  ? "border-brand-primary text-brand-text"
                  : "border-transparent text-brand-muted hover:text-brand-text"
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
