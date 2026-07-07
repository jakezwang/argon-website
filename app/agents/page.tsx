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
          title="Open a sandbox"
          body="Fork, checkout, and TTL-stamp in one command: an isolated physical MongoDB database with its own connection string. Expired sandboxes reap themselves — storage included."
          cmd="argon sandbox create -p app --ttl 1h"
        />
        <Step
          n="2"
          title="Point the agent at it"
          body="Any driver connects — it's a real mongod, so indexes, aggregations, and transactions all work. Validated in CI with real pymongo and mongoose workloads, capture verified byte-for-byte."
          cmd="agent --db mongodb://…/argon_br_9f2c"
        />
        <Step
          n="3"
          title="Every write is on the record"
          body="Change streams capture each write with full before/after images and the actor that made it. The append-only log is your audit trail."
          cmd="argon diff -p app -b agent-run"
        />
        <Step
          n="4"
          title="Merge it — or undo it"
          body="argon merge preview persists a reviewable plan; apply executes it exactly once, conflicts never resolved silently. Or revert the agent's whole session — undos are new history: auditable, undoable in turn."
          cmd="argon undo -p app --actor agent:x --from-lsn 5001"
        />
      </div>

      {/* Semantics */}
      <div className="mt-20 max-w-3xl">
        <p className="kicker mb-4">How undo works</p>
        <h2 className="text-3xl font-semibold tracking-tight text-brand-text">
          Compensation, not time travel backwards
        </h2>
        <div className="mt-6 text-sm leading-7 text-brand-text-darker">
          <p>
            For every document the session touched, Argon restores its
            pre-session state (inserts compensate to deletes). Compensations
            are written as new, attributed history — every undo is audited
            and reversible — and{' '}
            <code className="font-mono text-brand-primary">--dry-run</code>{' '}
            shows exactly what would change, and what conflicts, before
            touching anything.
          </p>
        </div>
      </div>

      {/* MCP */}
      <div className="mt-20 border-t border-brand-edge pt-10">
        <p className="kicker mb-4">Model Context Protocol</p>
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-brand-text">
          Agents drive the whole loop themselves
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-text-darker">
          <code className="font-mono text-brand-primary">argon mcp</code> exposes
          the workflow as thirteen MCP tools over stdio: open a sandbox
          (returns the connection string), list branches, connect, diff,
          preview and apply merges, undo with dry-run, snapshot, pin, fork a
          sandbox from a pin, keep or discard. The server supervises a
          change-stream ingester for every sandbox it hands out, so agent
          writes become versioned history with no babysitting.
        </p>
        <pre className="mt-6 max-w-xl overflow-x-auto border border-brand-edge bg-brand-surface px-4 py-3 font-mono text-sm text-brand-text">
          <code>
            <span className="text-brand-muted">$ </span>claude mcp add argon -- argon mcp
          </code>
        </pre>
        <p className="mt-3 font-mono text-xs text-brand-muted">
          Claude Code opens its own sandbox before risky data work, then
          merges or discards it — undo included.
        </p>
      </div>

      {/* The rest of the surface */}
      <div className="mt-20 border-t border-brand-edge pt-10">
        <p className="kicker mb-6">Also in the toolbox</p>
        <div className="grid gap-px border border-brand-edge bg-brand-edge sm:grid-cols-2">
          <div className="bg-brand-dark p-6">
            <div className="flex items-baseline justify-between">
              <h3 className="font-medium text-brand-text">LangGraph checkpointer</h3>
              <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-400">shipped</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-brand-text-darker">
              Fork and rewind conversation state the way you branch data —{' '}
              <code className="font-mono text-brand-primary">
                pip install &quot;argon-agents[langgraph]&quot;
              </code>
              , alongside a Mem0 factory, on the REST API.
            </p>
          </div>
          <div className="bg-brand-dark p-6">
            <div className="flex items-baseline justify-between">
              <h3 className="font-medium text-brand-text">Eval dataset pinning</h3>
              <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-400">shipped</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-brand-text-darker">
              <code className="font-mono text-brand-primary">argon pin</code> freezes
              a named dataset state that GC and reset can never touch. Fork a
              sandbox from the pin per eval run — every run sees identical
              input, even while the live corpus keeps moving.
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
          <a
            href="https://github.com/argon-lab/argon/blob/master/docs/AGENTS.md"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-quiet"
          >
            Read the agents guide
          </a>
        </div>
      </div>
    </div>
  );
}
