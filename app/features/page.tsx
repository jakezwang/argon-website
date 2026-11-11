import { pageMetadata } from "../metadata";
import Capabilities from "../components/Capabilities";

const features = [
  [
    "Millisecond branching",
    "Metadata branches share history. Physical checkout creates a MongoDB database and has dataset-dependent time and storage costs.",
  ],
  [
    "Time-travel queries",
    "Inspect retained historical states, addressed by log position (LSN) or timestamp. Pins protect their referenced history.",
  ],
  [
    "Deterministic by design",
    "Same history, same state — byte for byte, property-tested in CI.",
  ],
  [
    "Agent and eval workflows",
    "Managed TTL sandboxes, branch-scoped actor undo, dataset pins, and a LangGraph checkpointer (argon-agents).",
  ],
  [
    "Four surfaces, one engine",
    "A CLI for people, an MCP server for agents (13 tools, restrictable per server), REST for SDKs, and a wire proxy for stable URIs.",
  ],
  [
    "Honest engineering",
    "Every number links to a benchmark you can run with docker compose up. What we can't back, we don't publish.",
  ],
] as const;

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
  "Branching, Time Travel & Data PRs for MongoDB",
  "Git-style branching, point-in-time time travel, reviewable data PRs (diff + merge), and per-actor undo for MongoDB. Open-source, MIT-licensed, and self-hosted.",
  "/features",
);

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-14 sm:pt-20">
      <h1 className="page-title max-w-4xl">
        Version control for your MongoDB data
      </h1>
      <p className="lede mt-6 max-w-2xl">
        Lightweight metadata branching, time travel, and restore, built on a
        deterministic write-ahead log. Open source and self-hosted.
      </p>

      <div className="mt-16 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(([title, body]) => (
          <div key={title} className="border-t border-brand-edge-strong py-7">
            <h2 className="text-xl font-semibold text-brand-text [font-stretch:100%]">
              {title}
            </h2>
            <p className="mt-2.5 text-sm leading-6">{body}</p>
          </div>
        ))}
      </div>

      <Capabilities />

      <div className="mt-24 grid gap-8 lg:grid-cols-12 lg:gap-12">
        <p className="lede lg:col-span-7">
          Everything is a view over one append-only log: branches are pointers
          into it, time-travel replays it (deterministically, property-tested),
          and checkout materializes it into a real MongoDB database.
        </p>
        <div className="lg:col-span-5">
          <h2 className="text-sm font-semibold text-brand-text [font-stretch:100%]">
            The deep dives
          </h2>
          <ul className="mt-3 border-t border-brand-edge">
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
        </div>
      </div>
    </div>
  );
}
