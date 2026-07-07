import Link from 'next/link';
import GitGraph, { FlowGraph } from '../components/GitGraph';

// The whole agent story in one static picture: fork a sandbox, let the
// agent write, undo it — and pin a dataset so every eval run is identical.
const flow: FlowGraph = {
  width: 1000,
  height: 168,
  lanes: [
    { name: 'prod', y: 32 },
    { name: 'sandbox', y: 88 },
    { name: 'eval run', y: 140 },
  ],
  nodes: [
    { id: 'm0', x: 130, y: 32, lane: 0, sub: 'LSN 8112', appearAt: 0 },
    { id: 'pin', x: 130, y: 10, lane: 2, sub: 'pin: eval-2026-07', appearAt: 0, pin: true },
    { id: 's0', x: 330, y: 88, lane: 1, sub: '1 · fork — ttl 1h', appearAt: 0 },
    { id: 's1', x: 530, y: 88, lane: 1, sub: '2 · agent writes', appearAt: 0 },
    { id: 's2', x: 730, y: 88, lane: 1, sub: '3 · undo', appearAt: 0 },
    { id: 'e0', x: 530, y: 140, lane: 2, sub: '4 · fork from pin — identical input', appearAt: 0 },
  ],
  edges: [
    { from: 'm0', to: 's0', appearAt: 0 },
    { from: 's0', to: 's1', appearAt: 0 },
    { from: 's1', to: 's2', appearAt: 0 },
    { from: 'm0', to: 'pin', appearAt: 0, ghost: true },
    { from: 'pin', to: 'e0', appearAt: 0 },
  ],
  steps: [{ caption: '' }],
};

const integrations = [
  {
    kicker: 'Claude Code · Cursor · any MCP client',
    cmd: 'claude mcp add argon -- argon mcp',
    note: 'Agents open their own sandbox, diff, merge, and undo — 13 tools over stdio.',
  },
  {
    kicker: 'CLI · scripts · CI',
    cmd: 'argon sandbox create -p prod --ttl 1h',
    note: 'Prints a real MongoDB URI. Point any driver at it — no SDK, no code changes.',
  },
  {
    kicker: 'Python · LangGraph · Mem0',
    cmd: 'pip install "argon-agents[langgraph]"',
    note: 'A checkpointer that forks and rewinds conversation state, on the same engine.',
  },
];

const guarantees = [
  'Undo is per-actor and conflict-safe — documents someone else touched are reported, never clobbered',
  'Undos are written as new history — auditable, and reversible in turn',
  'Expired sandboxes reap themselves, storage included',
];

export default function AgentsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14 sm:py-16">
      <p className="kicker mb-4">For AI agents</p>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-brand-text">
        Give your agents a database they can&apos;t destroy
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8">
        A disposable, auditable, undoable branch per agent session.
        One picture, three ways to plug in.
      </p>

      {/* The loop, as a picture */}
      <div className="mt-10 border border-brand-edge bg-brand-surface">
        <div className="flex items-center justify-between border-b border-brand-edge px-4 py-2">
          <p className="font-mono text-xs text-brand-muted">
            1 fork a sandbox · 2 agent writes, attributed · 3 undo the session · 4 pinned evals
          </p>
          <Link href="/demo" className="shrink-0 font-mono text-xs text-brand-primary hover:underline">
            step through it live →
          </Link>
        </div>
        <div className="px-4 py-4">
          <GitGraph graph={flow} step={0} />
        </div>
      </div>

      {/* How to plug in */}
      <div className="mt-14">
        <p className="kicker mb-6">Plug it in</p>
        <div className="grid gap-px border border-brand-edge bg-brand-edge lg:grid-cols-3">
          {integrations.map((item) => (
            <div key={item.kicker} className="bg-brand-dark p-6">
              <p className="font-mono text-[11px] uppercase tracking-wider text-brand-muted">
                {item.kicker}
              </p>
              <pre className="mt-3 overflow-x-auto border border-brand-edge bg-brand-surface px-3 py-2.5 font-mono text-[13px] text-brand-primary">
                <code>
                  <span className="select-none text-brand-muted">$ </span>
                  {item.cmd}
                </code>
              </pre>
              <p className="mt-3 text-sm leading-6 text-brand-text-darker">{item.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Guarantees, one line each */}
      <div className="mt-14 divide-y divide-brand-edge border border-brand-edge">
        {guarantees.map((g) => (
          <p key={g} className="flex items-center gap-3 px-5 py-3.5 text-sm text-brand-text-darker">
            <span className="status-dot shrink-0 bg-emerald-400" />
            {g}
          </p>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-14 flex flex-wrap gap-3">
        <Link href="/demo" className="btn-solid">
          Step through the demo
        </Link>
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
  );
}
