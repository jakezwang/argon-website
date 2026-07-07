import Link from 'next/link';
import QuickStartCommand from './components/QuickStartCommand';
import PeriodicTile from './components/PeriodicTile';
import HeroDemo from './components/HeroDemo';

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
            <p className="kicker mb-5">Open source · MIT · self-hosted</p>
            <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-brand-text sm:text-5xl">
              Git for MongoDB,
              <br />
              built for AI agents
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8">
              Every agent session gets a disposable branch of your database.
              Audit what it wrote, merge what works — and undo the rest with
              one command.
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

          {/* The ten-second pitch: auto-looping mini demo */}
          <div>
            <HeroDemo />
            <p className="mt-2 text-right font-mono text-xs">
              <Link href="/demo" className="text-brand-primary hover:underline">
                step through the full demo →
              </Link>
            </p>
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
                    stat: '0.86 ms',
                    label: 'to create a branch — p50, measured on a 50k-entry project',
                  },
                  {
                    stat: '479 B',
                    label: 'of storage per branch — branches are metadata, not copies',
                  },
                  {
                    stat: '1 command',
                    label: 'to undo an entire agent session — conflicts reported, never clobbered',
                  },
                ].map((item) => (
                  <div key={item.stat} className="bg-brand-dark p-6">
                    <p className="font-mono text-3xl text-brand-primary">{item.stat}</p>
                    <p className="mt-2 text-sm leading-6">{item.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 font-mono text-xs text-brand-muted">
                numbers from the{' '}
                <a
                  href="https://github.com/argon-lab/benchmarks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-primary hover:underline"
                >
                  public benchmark suite
                </a>{' '}
                — reproduce them with docker compose up
              </p>
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
          <div className="flex flex-col items-stretch gap-3 font-mono text-sm lg:flex-row lg:items-center">
            <div className="shrink-0 border border-brand-edge bg-brand-surface px-4 py-3 text-center">
              <p className="text-brand-text">your app · your agents</p>
              <p className="mt-1 text-xs text-brand-muted">any driver, unchanged</p>
            </div>
            <p className="shrink-0 text-center text-xs text-brand-muted">
              every write →
            </p>
            <div className="shrink-0 border border-brand-primary/50 bg-brand-surface px-4 py-3 text-center">
              <p className="text-brand-primary">append-only log</p>
              <p className="mt-1 text-xs text-brand-muted">pre/post images · actor · LSN</p>
            </div>
            <p className="shrink-0 text-center text-xs text-brand-muted">
              views →
            </p>
            <div className="min-w-0 flex-1 divide-y divide-brand-edge border border-brand-edge">
              {[
                ['branches', 'real MongoDB databases'],
                ['time travel', 'any state, by LSN or time'],
                ['undo', 'per-actor, conflict-safe'],
              ].map(([t, d]) => (
                <div key={t} className="flex items-baseline gap-2 px-4 py-2.5">
                  <p className="shrink-0 text-brand-text">{t}</p>
                  <p className="truncate text-xs text-brand-muted">— {d}</p>
                </div>
              ))}
            </div>
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
          <div className="divide-y divide-brand-edge border border-brand-edge">
            {[
              {
                text: 'Deterministic replay, property-tested in CI — same history, same state, byte for byte',
                link: { label: 'tests', href: 'https://github.com/argon-lab/argon/tree/master/tests' },
              },
              {
                text: 'Every number on this site reproduces with docker compose up',
                link: { label: 'benchmarks', href: 'https://github.com/argon-lab/benchmarks' },
              },
              {
                text: 'MIT licensed, self-hosted — your MongoDB, your data, your infrastructure',
                link: { label: 'license', href: 'https://github.com/argon-lab/argon/blob/master/LICENSE' },
              },
            ].map((item) => (
              <div key={item.link.label} className="flex flex-wrap items-center justify-between gap-2 px-5 py-4">
                <p className="text-sm text-brand-text-darker">{item.text}</p>
                <a
                  href={item.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-brand-primary hover:underline"
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
