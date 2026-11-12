import Link from "next/link";
import { pageMetadata } from "../metadata";
import Capabilities from "../components/Capabilities";
import Transcript from "../components/Transcript";
import { engineering, features, product, terms } from "../product";

const deepDives = [
  [
    "Full CLI reference",
    "https://github.com/argon-lab/argon/blob/master/docs/CLI.md",
  ],
  [
    "Architecture deep dive",
    "https://github.com/argon-lab/argon/blob/master/docs/ARCHITECTURE.md",
  ],
  ["Run the benchmarks", "https://github.com/argon-lab/benchmarks"],
  ["Changelog", "https://github.com/argon-lab/argon/blob/master/CHANGELOG.md"],
] as const;

export const metadata = pageMetadata(
  "Features: MongoDB Sandboxes, Branching, Time Travel and Data PRs",
  "What an Argon sandbox gives an agent team: disposable MongoDB databases, reviewable data PRs (diff and merge), time travel and per-actor undo. Open source and self-hosted.",
  "/features",
);

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-14 sm:pt-20">
      <h1 className="page-title max-w-4xl">
        Version control for your MongoDB data
      </h1>
      <p className="lede mt-6 max-w-2xl">
        Branch a database the way you branch code: isolate a change, review the
        difference, merge it, and return to any retained state. Open source and
        self-hosted.
      </p>
      <nav
        aria-label="Features on this page"
        className="mt-8 flex flex-wrap gap-x-7"
      >
        {features.map((feature) => (
          <a
            key={feature.id}
            href={`#${feature.id}`}
            className="prose-link inline-flex min-h-11 items-center text-sm font-medium"
          >
            {feature.short}
          </a>
        ))}
      </nav>

      <div className="mt-10">
        {features.map((feature) => (
          <section
            key={feature.id}
            id={feature.id}
            aria-labelledby={`${feature.id}-heading`}
            className="grid scroll-mt-24 gap-8 border-t border-brand-edge-strong py-12 lg:grid-cols-12 lg:gap-12"
          >
            <div className="lg:col-span-5">
              <h2
                id={`${feature.id}-heading`}
                className="text-[1.75rem] font-semibold leading-tight text-brand-text"
              >
                {feature.name}
              </h2>
              <p className="mt-4 leading-7">{feature.summary}</p>
              <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-6 text-brand-text-darker marker:text-brand-edge-strong">
                {feature.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
            <div className="min-w-0 lg:col-span-7">
              <Transcript
                entries={feature.transcript}
                label={`${feature.name}: commands and output`}
              />
              <p className="mt-4 text-sm leading-6">
                <span className="font-semibold text-brand-text">
                  Good to know:
                </span>{" "}
                {feature.limit}
              </p>
            </div>
          </section>
        ))}
        <p className="border-t border-brand-edge pt-6 text-sm leading-6 text-brand-muted">
          Commands and output are from Argon {product.version} on a local
          replica set, with a project named <code>shop</code>. Output is
          abbreviated, connection strings and IDs are shortened, and times are
          in UTC.{" "}
          <Link className="prose-link" href="/quickstart">
            Run them yourself
          </Link>
          .
        </p>
      </div>

      <section className="mt-24" aria-labelledby="engine-heading">
        <h2 id="engine-heading" className="section-title">
          How it is built
        </h2>
        <div className="mt-10 grid gap-x-12 sm:grid-cols-2">
          {engineering.map(([title, body]) => (
            <div key={title} className="border-t border-brand-edge py-7">
              <h3 className="text-xl font-semibold text-brand-text">{title}</h3>
              <p className="mt-2.5 text-sm leading-6">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <Capabilities />

      <section
        id="terms"
        className="mt-24 scroll-mt-24"
        aria-labelledby="terms-heading"
      >
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h2 id="terms-heading" className="section-title">
              Terms
            </h2>
            <p className="mt-4 max-w-sm leading-7">
              The words this site and the CLI use, defined once.
            </p>
          </div>
          <dl className="border-t border-brand-edge-strong lg:col-span-8">
            {terms.map(([term, definition]) => (
              <div
                key={term}
                className="grid gap-x-8 gap-y-1 border-b border-brand-edge py-5 sm:grid-cols-[11rem_minmax(0,1fr)]"
              >
                <dt className="font-semibold text-brand-text">{term}</dt>
                <dd className="text-sm leading-6 text-brand-text-darker">
                  {definition}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mt-24 grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <h2 className="section-title">Go deeper</h2>
          <p className="mt-4 max-w-xl leading-7">
            The reference documents live with the source, at the version you
            install.
          </p>
        </div>
        <ul className="border-t border-brand-edge lg:col-span-5">
          {deepDives.map(([label, href]) => (
            <li key={href} className="border-b border-brand-edge">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 items-center justify-between gap-4 text-sm font-medium text-brand-text transition-colors hover:text-brand-primary"
              >
                {label}
                <svg
                  viewBox="0 0 16 16"
                  className="h-3.5 w-3.5 shrink-0 text-brand-muted"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M5 3h8v8M13 3 3 13" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
