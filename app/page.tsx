import Link from 'next/link';
import QuickStartCommand from './components/QuickStartCommand';
import PeriodicTile from './components/PeriodicTile';

const TerminalLine = ({
  cmd,
  out,
}: {
  cmd?: string;
  out?: string[];
}) => (
  <div className="mb-3 last:mb-0">
    {cmd && (
      <p className="text-brand-text">
        <span className="select-none text-brand-muted">$ </span>
        {cmd}
      </p>
    )}
    {out?.map((line, i) => (
      <p key={i} className="pl-4 text-brand-muted">
        {line}
      </p>
    ))}
  </div>
);

const SectionHeading = ({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children?: React.ReactNode;
}) => (
  <div className="mb-10">
    <p className="kicker mb-3">
      {index} — {title}
    </p>
    {children}
  </div>
);

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="border-b border-brand-edge">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-28">
          <div>
            <p className="kicker mb-5">Open source · MIT · MongoDB</p>
            <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-brand-text sm:text-5xl">
              The undo button for AI agents
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8">
              Git-like branching, time travel, and rollback for MongoDB.
              Give every agent session its own branch — a real MongoDB
              database with its own connection string. Keep what works,
              undo what doesn&apos;t.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="https://github.com/argon-lab/argon"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-solid"
              >
                View on GitHub
              </a>
              <Link href="/agents" className="btn-quiet">
                See the agent workflow
              </Link>
            </div>
            <div className="mt-10">
              <QuickStartCommand />
            </div>
          </div>

          {/* Terminal — a real session, no invented numbers */}
          <div className="border border-brand-edge bg-brand-surface">
            <div className="flex items-center justify-between border-b border-brand-edge px-4 py-2">
              <p className="font-mono text-xs text-brand-muted">argon · session</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-brand-muted">
                simulated
              </p>
            </div>
            <div className="overflow-x-auto p-5 font-mono text-[13px] leading-6">
              <TerminalLine
                cmd="argon branches create agent-run -p shop"
                out={['branch created — metadata only, no data copied']}
              />
              <TerminalLine
                cmd="argon checkout -p shop -b agent-run"
                out={['branch is live: a real MongoDB database', 'mongodb://…/argon_br_9f2c1a — any driver connects']}
              />
              <TerminalLine
                cmd="python agent.py --db mongodb://…/argon_br_9f2c1a"
                out={['agent wrote 3,214 documents', 'every write captured with actor: agent:price-fixer']}
              />
              <TerminalLine
                cmd="argon undo -p shop --actor agent:price-fixer --from-lsn 5001"
                out={['3,214 documents reverted · 0 conflicts', 'compensations logged as new history — undoable']}
              />
            </div>
          </div>
        </div>

        {/* Status strip */}
        <div className="border-t border-brand-edge">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-3 font-mono text-xs">
            <span className="flex items-center gap-2 text-brand-text-darker">
              <span className="status-dot bg-emerald-400" />
              v2.0 shipped: engine, benchmarks, branch databases, data PRs, agent surface
            </span>
            <span className="flex items-center gap-2 text-brand-text-darker">
              <span className="status-dot bg-amber-400" />
              next · GCS chunk store, synchronous proxy capture
            </span>
            <a
              href="https://github.com/argon-lab/argon/blob/master/CHANGELOG.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary hover:underline"
            >
              changelog →
            </a>
          </div>
        </div>
      </section>

      {/* ── 01 · Inert by design ─────────────────────────────── */}
      <section className="border-b border-brand-edge">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-[auto_1fr] lg:gap-20">
            <div className="flex items-start">
              <PeriodicTile size="lg" />
            </div>
            <div>
              <SectionHeading index="01" title="Inert by design">
                <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-brand-text">
                  Named after the noble gas for a reason
                </h2>
              </SectionHeading>
              <p className="max-w-2xl text-lg leading-8">
                Argon — element 18 — is inert: it doesn&apos;t react with
                anything. That&apos;s the contract: experiments happen on
                branches, history is append-only, production is never touched.
              </p>
              <div className="mt-12 grid gap-px border border-brand-edge bg-brand-edge sm:grid-cols-3">
                {[
                  {
                    n: '/01',
                    title: 'Branch in milliseconds',
                    body: 'A branch is one metadata document — parent, fork LSN, head LSN. No data is copied, whatever the database size. Measured: 0.86 ms p50 on a 50k-entry project, 479 bytes per branch.',
                  },
                  {
                    n: '/02',
                    title: 'Rewind anything',
                    body: 'Every write is logged with full before/after document images. Restore to any point, or revert one agent’s entire session with argon undo --actor — conflicts reported, never clobbered.',
                  },
                  {
                    n: '/03',
                    title: 'Prove what happened',
                    body: 'The write-ahead log is an audit trail: who wrote what, when, on which branch. Git blame, for your data.',
                  },
                ].map((item) => (
                  <div key={item.n} className="bg-brand-dark p-6">
                    <p className="font-mono text-xs text-brand-primary">{item.n}</p>
                    <h3 className="mt-3 font-medium text-brand-text">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 · Same muscle memory ──────────────────────────── */}
      <section className="border-b border-brand-edge">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeading index="02" title="Familiar workflow">
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-brand-text">
              The Git muscle memory you already have
            </h2>
          </SectionHeading>
          <div className="overflow-x-auto border border-brand-edge">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="border-b border-brand-edge bg-brand-surface text-left">
                  <th className="px-5 py-3 font-normal text-brand-muted">git (code)</th>
                  <th className="px-5 py-3 font-normal text-brand-muted">argon (data)</th>
                  <th className="hidden px-5 py-3 font-normal text-brand-muted sm:table-cell">
                    what it does
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['git init', 'argon projects create', 'start versioning'],
                  ['git branch feature-x', 'argon branches create feature-x', 'isolated branch in milliseconds'],
                  ['git checkout feature-x', 'argon checkout -b feature-x', 'a real MongoDB database + URI'],
                  ['git log', 'argon time-travel info', 'see every past state'],
                  ['git diff main', 'argon diff', 'document-level three-way diff'],
                  ['git merge + PR review', 'argon merge preview/apply', 'reviewable data PRs, exactly-once'],
                  ['git reset --hard', 'argon restore reset', 'rewind mistakes'],
                  ['git revert', 'argon undo --actor agent:x', 'revert one agent’s session'],
                ].map(([git, argon, what]) => (
                  <tr key={git} className="border-b border-brand-edge last:border-b-0">
                    <td className="whitespace-nowrap px-5 py-3 text-brand-text-darker">{git}</td>
                    <td className="whitespace-nowrap px-5 py-3 text-brand-primary">{argon}</td>
                    <td className="hidden px-5 py-3 text-brand-muted sm:table-cell">{what}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 font-mono text-xs text-brand-muted">
            agents can drive all of this themselves via MCP:{' '}
            <code className="text-brand-primary">claude mcp add argon -- argon mcp</code>
            {' — '}
            <Link href="/agents" className="text-brand-primary hover:underline">
              see the agent workflow
            </Link>
          </p>
        </div>
      </section>

      {/* ── 03 · How it works ────────────────────────────────── */}
      <section className="border-b border-brand-edge">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeading index="03" title="How it works">
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-brand-text">
              One idea, carried all the way through
            </h2>
          </SectionHeading>
          <div className="grid gap-10 lg:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Every write becomes a log entry',
                body: 'Writes are recorded in an append-only write-ahead log with full document images and a global sequence number (LSN). The log is the source of truth.',
              },
              {
                step: '2',
                title: 'Branches are pointers',
                body: 'A branch records where it forked and where its head is. Creating one costs a single metadata write; sibling branches can never see each other.',
              },
              {
                step: '3',
                title: 'Replay is deterministic',
                body: 'State at any LSN is reconstructed by replaying the log — a pure function, property-tested in CI. The same history produces the same state, byte for byte.',
              },
            ].map((item) => (
              <div key={item.step} className="border-l border-brand-edge pl-6">
                <p className="font-mono text-2xl text-brand-primary">{item.step}</p>
                <h3 className="mt-4 font-medium text-brand-text">{item.title}</h3>
                <p className="mt-2 text-sm leading-6">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <a
              href="https://github.com/argon-lab/argon/blob/master/docs/ARCHITECTURE.md"
              target="_blank"
              rel="noopener noreferrer"
              className="prose-link font-mono text-sm"
            >
              Read the architecture doc →
            </a>
          </div>
        </div>
      </section>

      {/* ── 04 · Built in the open ───────────────────────────── */}
      <section className="border-b border-brand-edge">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeading index="04" title="Built in the open">
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-brand-text">
              Claims you can check
            </h2>
          </SectionHeading>
          <div className="grid gap-px border border-brand-edge bg-brand-edge lg:grid-cols-3">
            {[
              {
                title: 'Correctness first',
                body: 'Replay determinism is enforced structurally and verified by property tests in CI — the same history always produces the same state.',
                link: { label: 'see the tests', href: 'https://github.com/argon-lab/argon/tree/master/tests' },
              },
              {
                title: 'No unverifiable numbers',
                body: 'We removed every performance figure we couldn’t back. Every number on this site now comes from the public benchmark suite — pinned engine ref, recorded environment, reproducible with docker compose up.',
                link: { label: 'run the benchmarks', href: 'https://github.com/argon-lab/benchmarks' },
              },
              {
                title: 'Your infrastructure',
                body: 'MIT licensed, self-hosted, works with your own MongoDB — local or Atlas. Your data never leaves your environment.',
                link: { label: 'license', href: 'https://github.com/argon-lab/argon/blob/master/LICENSE' },
              },
            ].map((item) => (
              <div key={item.title} className="bg-brand-dark p-6">
                <h3 className="font-medium text-brand-text">{item.title}</h3>
                <p className="mt-2 text-sm leading-6">{item.body}</p>
                <a
                  href={item.link.href}
                  target={item.link.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="mt-4 inline-block font-mono text-xs text-brand-primary hover:underline"
                >
                  {item.link.label} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Positioning ──────────────────────────────────────── */}
      <section className="border-b border-brand-edge">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <p className="mx-auto max-w-3xl font-mono text-lg leading-9 text-brand-text-darker">
            Postgres has Neon. MySQL has PlanetScale. SQL has Dolt.
            Data lakes have lakeFS.{' '}
            <span className="text-brand-primary">MongoDB has Argon.</span>
          </p>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-brand-text">
            Branch your MongoDB today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8">
            Open source, MIT licensed, self-hosted. Star the repo to follow
            along — or run the benchmarks yourself first.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://github.com/argon-lab/argon"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-solid"
            >
              Star on GitHub
            </a>
            <a
              href="https://github.com/argon-lab/benchmarks"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-quiet"
            >
              Run the benchmarks
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
