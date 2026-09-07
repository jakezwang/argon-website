import { product } from "../product";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: { absolute: "About Argon — Data Sandboxes for AI Agents" },
  description:
    "Meet the team behind Argon, an open-source tool that gives AI agents their own MongoDB sandboxes, with changes you can review, merge, or undo.",
  alternates: { canonical: "/about" },
};

const team = [
  {
    name: "Jake Wang",
    image: "/jakewang.jpeg",
    href: "https://www.linkedin.com/in/wang1/",
    role: "Founder",
    bio: [
      "I'm building Argon for AI agents that work with MongoDB. Each agent gets its own sandbox, with changes you can review, merge, or undo.",
      "I'm a software engineer at Pinterest. Before that, I worked at MongoDB, LinkedIn, and Bloomberg.",
    ],
  },
  {
    name: "Noot Noot",
    image: "/nootnoot.jpg",
    href: "https://www.instagram.com/energetic_nootnoot",
    role: "Chief Emotional Support Officer",
    bio: [
      "Official team cat and professional morale booster. Keeps the workplace pawsitive. His value: beyond measure (and very fluffy).",
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
      <p className="kicker mb-4">About</p>
      <h1 className="text-4xl font-semibold tracking-tight text-brand-text">
        About Argon
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8">
        Argon gives AI agents their own MongoDB sandboxes. Agents can read and
        write data with their usual tools. You can compare their changes, decide
        what to merge, and undo a run when it goes wrong.
      </p>

      {/* Team */}
      <section className="mt-16">
        <p className="kicker mb-8">Team</p>
        <div className="grid gap-6 sm:grid-cols-2">
          {team.map((member) => (
            <article
              key={member.name}
              className="border border-brand-edge bg-brand-surface p-8"
            >
              <div className="relative h-24 w-24 overflow-hidden rounded-full border border-brand-edge">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="mt-5 text-lg font-medium text-brand-text">
                <Link
                  href={member.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-primary"
                >
                  {member.name}
                </Link>
              </h3>
              <p className="font-mono text-xs uppercase tracking-wider text-brand-primary sm:min-h-8 lg:min-h-4">
                {member.role}
              </p>
              <div className="mt-3 space-y-3 text-sm leading-6">
                {member.bio.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
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
