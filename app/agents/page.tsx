import Link from 'next/link';

const Step = ({
  n,
  title,
  body,
  cmd,
}: {
  n: string;
  title: string;
  body: string;
  cmd?: string;
}) => (
  <div className="border-l border-brand-edge pl-6">
    <p className="font-mono text-2xl text-brand-primary">{n}</p>
    <h3 className="mt-3 font-medium text-brand-text">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-brand-text-darker">{body}</p>
    {cmd && (
      <pre className="mt-3 overflow-x-auto border border-brand-edge bg-brand-surface px-3 py-2 font-mono text-xs text-brand-text">
        <code>
          <span className="text-brand-muted">$ </span>
          {cmd}
        </code>
      </pre>
    )}
  </div>
);

export default function AgentsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <p className="kicker mb-4">For AI agents</p>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-brand-text">
        Give your agents a database they can&apos;t destroy
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8">
        An agent session gets its own branch: a real MongoDB database with
        its own connection string, every write attributed to the agent, and
        one command to take it all back. Production is never in the blast
        radius.
      </p>

      {/* The loop */}
      <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <Step
          n="1"
          title="Check out a branch"
          body="Branch creation is a metadata write; checkout materializes it into a physical MongoDB database and prints the connection string."
          cmd="argon checkout -p app -b agent-run"
        />
        <Step
          n="2"
          title="Point the agent at it"
          body="Any driver connects — it's a real mongod, so indexes, aggregations, and transactions all work. No SDK, no wrapper, no code changes in the agent."
          cmd="agent --db mongodb://…/argon_br_9f2c"
        />
        <Step
          n="3"
          title="Every write is on the record"
          body="Change streams capture each write with full before/after images and the actor that made it. The append-only log is your audit trail."
          cmd="argon time-travel info -p app -b agent-run"
        />
        <Step
          n="4"
          title="Keep it — or undo it"
          body="Revert everything one actor wrote in a range. Documents someone else touched afterwards are reported as conflicts, never silently clobbered. Undos are new history: auditable, and undoable in turn."
          cmd="argon undo -p app --actor agent:x --from-lsn 5001"
        />
      </div>

      {/* Semantics */}
      <div className="mt-20 max-w-3xl">
        <p className="kicker mb-4">How undo works</p>
        <h2 className="text-3xl font-semibold tracking-tight text-brand-text">
          Compensation, not time travel backwards
        </h2>
        <div className="mt-6 space-y-4 text-sm leading-7 text-brand-text-darker">
          <p>
            For every document the range touched, Argon restores the
            pre-image of the oldest in-range entry — the state just before
            the session began. An insert (no pre-image) compensates to a
            delete. One pass, per document, no reverse replay.
          </p>
          <p>
            History stays append-only: compensations are written as new
            entries with actor <code className="font-mono text-brand-primary">undo</code>,
            so every undo is itself audited and reversible. With{' '}
            <code className="font-mono text-brand-primary">--dry-run</code>{' '}
            you see exactly what would change — and what conflicts — before
            touching anything.
          </p>
        </div>
      </div>

      {/* What's next */}
      <div className="mt-20 border-t border-brand-edge pt-10">
        <p className="kicker mb-6">Where this is going</p>
        <div className="grid gap-px border border-brand-edge bg-brand-edge sm:grid-cols-2">
          <div className="bg-brand-dark p-6">
            <h3 className="font-medium text-brand-text">M4 · Data PRs</h3>
            <p className="mt-2 text-sm leading-6 text-brand-text-darker">
              Document-level diff and three-way merge with reviewable merge
              plans — adopt an agent&apos;s work the way you review code.
            </p>
          </div>
          <div className="bg-brand-dark p-6">
            <h3 className="font-medium text-brand-text">M5 · Agent ecosystem</h3>
            <p className="mt-2 text-sm leading-6 text-brand-text-darker">
              MCP server so agents open their own sandboxes, LangGraph
              checkpointer with fork and rewind, TTL branches that clean up
              after themselves, eval dataset pinning.
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="https://github.com/argon-lab/argon"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-solid"
          >
            Get started on GitHub
          </a>
          <Link href="/roadmap" className="btn-quiet">
            View the roadmap
          </Link>
        </div>
      </div>
    </div>
  );
}
