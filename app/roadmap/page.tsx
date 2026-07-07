import Link from 'next/link';

const MilestoneCard = ({
  tag,
  title,
  status,
  statusColor,
  items,
}: {
  tag: string;
  title: string;
  status: string;
  statusColor: string;
  items: string[];
}) => (
  <section className="bg-brand-surface p-8 rounded-lg shadow-xl">
    <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
      <h2 className="text-2xl font-semibold text-brand-primary">
        {tag} · {title}
      </h2>
      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${statusColor}`}>
        {status}
      </span>
    </div>
    <ul className="space-y-2 text-brand-text-darker">
      {items.map((item, i) => (
        <li key={i} className="flex items-start">
          <span className="text-brand-primary mr-2">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </section>
);

export default function RoadmapPage() {
  return (
    <div className="py-12 sm:py-16 bg-brand-dark text-brand-text">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-brand-text">
            Roadmap
          </h1>
          <p className="mt-6 text-xl leading-8 text-brand-text-darker">
            Argon v2 is being rebuilt milestone by milestone, correctness first.
            Each milestone ships independently, and we publish what&apos;s done —
            not what we hope will be done.
          </p>
        </div>

        <div className="space-y-8">
          <MilestoneCard
            tag="M1"
            title="Correctness Release"
            status="✅ Shipped · July 2026"
            statusColor="bg-green-900 text-green-300"
            items={[
              'Deterministic replay: the same history always reconstructs the same state — property-tested across processes, instances, and repeated replays',
              'Distributed LSN allocation: multiple Argon processes can write the same project with no sequence conflicts',
              'Branch ancestry with fork-point isolation: sibling branches can no longer see each other\'s writes',
              'Truthful write results across all operations (UpdateMany, DeleteMany, ReplaceOne, upserts)',
              'WAL entry v2 with pre/post document images and actor tracking, plus a migration tool for existing data',
            ]}
          />

          <MilestoneCard
            tag="M2"
            title="Bounded Time Travel"
            status="🚧 In progress"
            statusColor="bg-amber-900 text-amber-300"
            items={[
              'Snapshot layer: content-addressed, compressed checkpoints so time-travel replays a bounded window instead of full history',
              'WAL segmentation with cold storage offload and garbage collection — storage stops growing without bound',
              'A public benchmark repo: every performance number on this site will link to a run you can reproduce with docker compose up',
            ]}
          />

          <MilestoneCard
            tag="M3"
            title="True Drop-in"
            status="Planned"
            statusColor="bg-brand-dark text-brand-text-darker border border-brand-muted"
            items={[
              'One physical MongoDB database per branch — real mongod executes your queries, so every operator, index, and aggregation just works',
              'Write capture via change streams with pre/post images',
              'Per-branch connection strings: pymongo and mongoose work unchanged',
              'argon undo --session: roll back everything an AI agent wrote, in one command',
            ]}
          />

          <MilestoneCard
            tag="M4"
            title="Merge, Diff & Data PRs"
            status="Planned"
            statusColor="bg-brand-dark text-brand-text-darker border border-brand-muted"
            items={[
              'Document-level diff between branches or against any historical state',
              'Three-way merge with conflict detection',
              'Reviewable merge plans — pull requests for data',
            ]}
          />

          <MilestoneCard
            tag="M5"
            title="Agent Ecosystem"
            status="Planned"
            statusColor="bg-brand-dark text-brand-text-darker border border-brand-muted"
            items={[
              'MCP server: agents open their own sandbox before risky data operations, then merge or discard',
              'LangGraph checkpointer with fork and rewind',
              'TTL sandboxes: short-lived branches that clean up after themselves',
              'Eval dataset pinning: reproducible evaluations against a fixed data version',
            ]}
          />
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-brand-text-darker mb-6">
            Follow the work, or come build it with us.
          </p>
          <a
            href="https://github.com/argon-lab/argon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-brand-primary text-brand-dark hover:bg-brand-secondary hover:text-white font-semibold px-8 py-3 rounded-lg shadow-md transform transition-transform duration-150 hover:scale-105"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
