import Link from 'next/link';

type Status = 'shipped' | 'active' | 'planned';

const statusStyle: Record<Status, { dot: string; label: string }> = {
  shipped: { dot: 'bg-emerald-400', label: 'shipped' },
  active: { dot: 'bg-amber-400', label: 'in progress' },
  planned: { dot: 'bg-brand-muted', label: 'planned' },
};

type Item = string | { text: string; done: boolean };

const milestones: {
  tag: string;
  title: string;
  status: Status;
  statusLabel?: string;
  when?: string;
  items: Item[];
}[] = [
  {
    tag: 'M1',
    title: 'Correctness release',
    status: 'shipped',
    when: 'July 2026',
    items: [
      'Deterministic replay: the same history always reconstructs the same state — property-tested across processes, instances, and repeated replays',
      'Distributed LSN allocation: multiple Argon processes can write the same project with no sequence conflicts',
      "Branch ancestry with fork-point isolation: sibling branches can no longer see each other's writes",
      'Truthful write results across all operations (UpdateMany, DeleteMany, ReplaceOne, upserts)',
      'WAL entry v2 with pre/post document images and actor tracking, plus a migration tool for existing data',
    ],
  },
  {
    tag: 'M2',
    title: 'Bounded time travel',
    status: 'shipped',
    when: 'July 2026',
    items: [
      {
        text: 'Snapshot layer: content-addressed, compressed checkpoints so time-travel replays a bounded window instead of full history — taken automatically off the write path',
        done: true,
      },
      {
        text: 'Retention-window WAL garbage collection and full storage reclamation of deleted branches — storage stops growing without bound',
        done: true,
      },
      {
        text: 'Pluggable snapshot chunk stores: MongoDB (default), S3-compatible object storage, or filesystem',
        done: true,
      },
      {
        text: 'Public benchmark suite (github.com/argon-lab/benchmarks): every performance number on this site links to a run you can reproduce with docker compose up',
        done: true,
      },
    ],
  },
  {
    tag: 'M3',
    title: 'True drop-in',
    status: 'shipped',
    when: 'July 2026',
    items: [
      {
        text: 'One physical MongoDB database per branch — argon checkout materializes it and prints a connection string; real mongod executes your queries, so every operator, index, and aggregation just works',
        done: true,
      },
      {
        text: 'Write capture via change streams with pre/post images and resume-token recovery',
        done: true,
      },
      {
        text: 'argon undo — revert a range or one actor\'s entire session, with per-document conflict detection; compensations are new, auditable history',
        done: true,
      },
      'Last box: official driver test suites (pymongo/mongoose) running against branch databases in CI — until then we say "any driver connects" (architectural fact), not "drop-in, no asterisks"',
    ],
  },
  {
    tag: 'M4',
    title: 'Merge, diff & data PRs',
    status: 'shipped',
    when: 'July 2026',
    items: [
      {
        text: 'argon diff — document-level three-way diff between a branch and its parent',
        done: true,
      },
      {
        text: 'argon merge preview/apply — merge plans are persisted, reviewable, and applied exactly once against the heads they were computed for; conflicts are never resolved silently',
        done: true,
      },
      {
        text: 'Merges are ordinary history: attributed to an actor, and undoable with argon undo like any other range',
        done: true,
      },
    ],
  },
  {
    tag: 'M5',
    title: 'Agent ecosystem',
    status: 'active',
    statusLabel: 'MCP + sandboxes shipped · integrations remaining',
    items: [
      {
        text: 'MCP server (argon mcp): agents open their own sandbox, get a connection string, diff, merge, and undo — nine tools over stdio, with a supervised change-stream ingester per sandbox',
        done: true,
      },
      {
        text: 'TTL sandboxes (argon sandbox create/keep/discard/sweep): short-lived branches that clean up after themselves, storage reclaimed on discard',
        done: true,
      },
      'LangGraph checkpointer with fork and rewind',
      'Eval dataset pinning: reproducible evaluations against a fixed data version',
    ],
  },
];

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
      <p className="kicker mb-4">Roadmap</p>
      <h1 className="text-4xl font-semibold tracking-tight text-brand-text">
        Rebuilt milestone by milestone, correctness first
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8">
        Each milestone ships independently, and we publish what&apos;s done —
        not what we hope will be done.
      </p>

      <div className="mt-14 space-y-0">
        {milestones.map((m, i) => {
          const s = statusStyle[m.status];
          return (
            <div key={m.tag} className="relative border-l border-brand-edge pb-12 pl-8 last:pb-0">
              {/* timeline node */}
              <span
                className={`absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full ${s.dot}`}
                aria-hidden="true"
              />
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h2 className="font-mono text-xl text-brand-text">
                  <span className="text-brand-primary">{m.tag}</span> · {m.title}
                </h2>
                <span className="font-mono text-xs uppercase tracking-wider text-brand-muted">
                  {m.statusLabel ?? s.label}
                  {m.when ? ` · ${m.when}` : ''}
                </span>
              </div>
              <ul className="mt-4 space-y-2.5">
                {m.items.map((item, j) => {
                  const text = typeof item === 'string' ? item : item.text;
                  const done = typeof item === 'string' ? false : item.done;
                  return (
                    <li key={j} className="flex gap-3 text-sm leading-6 text-brand-text-darker">
                      <span
                        className={`select-none font-mono ${done ? 'text-emerald-400' : 'text-brand-muted'}`}
                      >
                        –
                      </span>
                      <span>
                        {text}
                        {done && (
                          <span className="ml-2 font-mono text-xs uppercase tracking-wider text-emerald-400">
                            shipped
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-16 border-t border-brand-edge pt-8">
        <p className="text-brand-text-darker">
          Follow the work, or come build it with us.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="https://github.com/argon-lab/argon"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-solid"
          >
            View on GitHub
          </a>
          <a
            href="https://github.com/argon-lab/argon/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-quiet"
          >
            Join the discussion
          </a>
        </div>
      </div>
    </div>
  );
}
