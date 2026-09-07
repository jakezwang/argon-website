import { product } from "../product";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: { absolute: "About Argon — The Versioning Layer for MongoDB" },
  description:
    "About Argon, an open-source tool for branching and reviewing MongoDB data, and its founder Jake Wang.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
      <p className="kicker mb-4">About</p>
      <h1 className="text-4xl font-semibold tracking-tight text-brand-text">
        About Argon
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8">
        Argon adds branching and version history to MongoDB. You can try changes
        in a separate database, review the diff, and decide what to merge.
      </p>

      {/* Team */}
      <section className="mt-16">
        <p className="kicker mb-8">Team</p>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="border border-brand-edge bg-brand-surface p-8">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border border-brand-edge">
              <Image
                src="/jakewang.jpeg"
                alt="Jake Wang"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="mt-5 text-lg font-medium text-brand-text">
              <Link
                href="https://www.linkedin.com/in/wang1/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-primary"
              >
                Jake Wang
              </Link>
            </h3>
            <p className="mt-1 text-sm text-brand-text-darker">
              Founder
            </p>
            <p className="mt-3 text-sm leading-6">
              I work as a software engineer at Pinterest. Before that, I worked
              at MongoDB, LinkedIn, and Bloomberg.
            </p>
            <p className="mt-3 text-sm leading-6">
              I&apos;m building Argon to make it easier to test and review
              changes to MongoDB data.
            </p>
          </div>
          <div className="border border-brand-edge bg-brand-surface p-8">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border border-brand-edge">
              <Image
                src="/nootnoot.jpg"
                alt="Noot Noot"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="mt-5 text-lg font-medium text-brand-text">
              <Link
                href="https://www.instagram.com/energetic_nootnoot"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-primary"
              >
                Noot Noot
              </Link>
            </h3>
            <p className="font-mono text-xs uppercase tracking-wider text-brand-primary">
              Chief Emotional Support Officer
            </p>
            <p className="mt-3 text-sm leading-6">
              Official team cat and professional morale booster. Keeps the
              workplace pawsitive. His value: beyond measure (and very fluffy).
            </p>
          </div>
        </div>
      </section>

      {/* Status */}
      <section className="mt-16">
        <p className="kicker mb-8">Current status</p>
        <div className="grid gap-6 border border-brand-edge bg-brand-surface p-8 sm:grid-cols-2">
          <div>
            <h3 className="flex items-center gap-2.5 font-medium text-brand-text">
              <span className="status-dot bg-emerald-400" />
              Working today
            </h3>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-brand-text-darker">
              <li>Deterministic WAL engine; public reproducible benchmarks</li>
              <li>
                Branches check out as real MongoDB databases — real-driver
                validated in CI
              </li>
              <li>argon diff / merge — reviewable data PRs; per-actor undo</li>
              <li>TTL sandboxes, dataset pins, MCP server, argon-agents</li>
            </ul>
          </div>
          <div>
            <h3 className="flex items-center gap-2.5 font-medium text-brand-text">
              <span className="status-dot bg-amber-400" />
              What&apos;s next
            </h3>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-brand-text-darker">
              {product.roadmap.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <Link
            href="https://github.com/argon-lab/argon/blob/master/CHANGELOG.md"
            target="_blank"
            rel="noopener noreferrer"
            className="prose-link font-mono text-sm"
          >
            Read the changelog →
          </Link>
        </div>
      </section>

      {/* License + CTA */}
      <section className="mt-16 border-t border-brand-edge pt-10">
        <p className="leading-8">
          Argon is licensed under the{" "}
          <Link
            href="https://github.com/argon-lab/argon/blob/master/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="prose-link"
          >
            MIT License
          </Link>
          . Ready to take it for a spin or help shape its future?
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="https://github.com/argon-lab/argon"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-solid"
          >
            Star us on GitHub
          </Link>
          <Link
            href="https://github.com/argon-lab/argon/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-quiet"
          >
            Join the discussion
          </Link>
        </div>
      </section>
    </div>
  );
}
