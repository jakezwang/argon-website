import { product } from "../product";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: { absolute: "About Argon — Database Workflows for AI Agents" },
  description:
    "Why Argon exists: branching, time travel, isolated experiments, and reviewed data merges for AI agents working with MongoDB.",
  alternates: { canonical: "/about" },
};

const team = [
  {
    name: "Jake Wang",
    image: "/jakewang.jpeg",
    href: "https://www.linkedin.com/in/wang1/",
    role: "Founder",
    bio: [
      "Software engineer at Pinterest. Previously at MongoDB, LinkedIn, and Bloomberg.",
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
        Why Argon exists
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8">
        Argon began in 2025 with a problem in the MongoDB workflow for AI
        agents. An agent needed to branch its data, test a change, return to an
        earlier state, and try another approach. Putting those steps together
        took too much work.
      </p>
      <p className="mt-5 max-w-2xl leading-8">
        Backups and rollback helped with recovery. Agents also needed a way to
        inspect what they had changed and bring useful results back after
        review. Argon brings branching, time travel, and reviewed merges to
        MongoDB, so agents can experiment in their own sandboxes and teams can
        decide what to keep.
      </p>
      <p className="mt-5 max-w-2xl text-sm leading-6">
        Read more about the{" "}
        <Link
          href="/blog/disposable-mongodb-sandbox-for-ai-agents"
          className="prose-link"
        >
          branch-per-agent workflow
        </Link>{" "}
        and{" "}
        <Link
          href="/blog/mongodb-time-travel-vs-point-in-time-recovery"
          className="prose-link"
        >
          time travel versus recovery
        </Link>
        .
      </p>

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
