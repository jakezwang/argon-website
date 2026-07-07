'use client';

import { useState, useEffect } from 'react';
import TerminalDemo from './TerminalDemo';

interface DemoStep {
  id: string;
  command: string;
  description: string;
  output: string;
  metrics?: {
    time: string;
    operations: string;
    compression?: string;
  };
}

// Simulated outputs for illustration — not live measurements.
const cliSteps: DemoStep[] = [
  {
    id: 'create',
    command: 'argon projects create my-app',
    description: 'Create a project — every write from here on is versioned',
    output: 'Created project: my-app\nMain branch ready\nEvery write becomes an LSN-addressed WAL entry',
    metrics: { time: 'milliseconds', operations: 'metadata write' },
  },
  {
    id: 'branch',
    command: 'argon branches create feature-x -p my-app',
    description: 'Branch — a metadata write, instant at any data size',
    output: 'Branch created: feature-x\nForked from main at current head\nNo data copied',
    metrics: { time: 'milliseconds', operations: 'metadata write' },
  },
  {
    id: 'checkout',
    command: 'argon checkout -p my-app -b feature-x',
    description: 'Materialize the branch into a real MongoDB database',
    output: 'Checked out at LSN 4982\nConnection string:\n  mongodb://localhost:27017/argon_br_9f2c1a\nAny driver connects — indexes, aggregation, transactions',
    metrics: { time: 'snapshot-accelerated', operations: 'checkout' },
  },
  {
    id: 'watch',
    command: 'argon watch -p my-app -b feature-x',
    description: 'Capture direct driver writes into versioned history',
    output: 'Watching for changes...\nEvery write recorded with full before/after images\nResume-token persisted — at-least-once, idempotent replay',
    metrics: { time: 'streaming', operations: 'ingest' },
  },
  {
    id: 'diff',
    command: 'argon diff -p my-app -b feature-x',
    description: 'Review the branch against its parent',
    output: 'vs main @ fork point:\n  + 12 added\n  ~ 3 modified\n  - 1 deleted\n  0 conflicts',
    metrics: { time: 'three-way', operations: 'diff' },
  },
  {
    id: 'merge',
    command: 'argon merge preview -p my-app -b feature-x',
    description: 'A data pull request: persisted, reviewable, exactly-once',
    output: 'Merge plan persisted (pending): plan_7d31\n16 changes, 0 conflicts\nApply with: argon merge apply plan_7d31\nStale if either head moves — re-preview',
    metrics: { time: 'reviewable', operations: 'merge plan' },
  },
  {
    id: 'undo',
    command: 'argon undo -p my-app -b main --from-lsn 5001 --dry-run',
    description: 'The undo button — preview first, conflicts never silent',
    output: 'Would revert 16 documents · 0 conflicts\nCompensations are new history: auditable, undoable in turn\nDrop --dry-run to apply',
    metrics: { time: 'pre-image based', operations: 'undo' },
  },
];

const agentSteps: DemoStep[] = [
  {
    id: 'sandbox',
    command: 'argon sandbox create -p prod --ttl 1h',
    description: 'Fork, checkout, and TTL-stamp in one command',
    output: 'Sandbox: sandbox-f81a (expires in 1h)\nConnection string:\n  mongodb://localhost:27017/argon_br_f81a\nExpired sandboxes reap themselves — storage included',
    metrics: { time: 'one command', operations: 'sandbox' },
  },
  {
    id: 'agent-writes',
    command: 'agent --db mongodb://…/argon_br_f81a',
    description: 'The agent works against a real database, unchanged',
    output: 'agent wrote 3,214 documents\nEvery write captured with actor: agent:price-fixer\nProduction never in the blast radius',
    metrics: { time: 'any driver', operations: 'captured' },
  },
  {
    id: 'review',
    command: 'argon diff -p prod -b sandbox-f81a',
    description: 'Audit exactly what the agent changed',
    output: '3,214 documents touched by agent:price-fixer\n12 price fields set to 0 — flagged in review',
    metrics: { time: 'per-document', operations: 'audit' },
  },
  {
    id: 'undo-actor',
    command: 'argon undo -p prod --actor agent:price-fixer --from-lsn 5001',
    description: 'Revert one agent’s entire session',
    output: '3,214 documents reverted · 0 conflicts\nDocuments another actor touched since would be reported, never clobbered',
    metrics: { time: 'per-actor', operations: 'undo' },
  },
  {
    id: 'pin',
    command: 'argon pin create -p prod -b main --name eval-2026-07',
    description: 'Freeze a named dataset state for reproducible evals',
    output: 'Pin created: eval-2026-07 @ LSN 8112\nImmutable — GC and reset can never touch it',
    metrics: { time: 'named LSN', operations: 'pin' },
  },
  {
    id: 'eval-run',
    command: 'argon sandbox create -p prod --from-pin eval-2026-07',
    description: 'Every eval run forks the pin — identical input, every time',
    output: 'Sandbox from pin eval-2026-07\nSame input state for run #1, #17, or #1,000\nEvals stay reproducible while the live corpus moves',
    metrics: { time: 'from pin', operations: 'eval sandbox' },
  },
];

const surfaceSteps: DemoStep[] = [
  {
    id: 'mcp',
    command: 'claude mcp add argon -- argon mcp',
    description: 'MCP: agents drive the whole loop themselves',
    output: 'Registered: 13 tools over stdio\nsandbox_create · connect · diff · merge_preview/apply\nundo · snapshot · pin · sandbox_from_pin · keep · discard\nThe server supervises an ingester per sandbox',
    metrics: { time: 'stdio', operations: 'MCP' },
  },
  {
    id: 'rest',
    command: 'go run ./api',
    description: 'REST control plane for language SDKs and services',
    output: 'Listening on :8080\nProjects, branches, sandboxes, pins, merges over HTTP\nSandbox-from-pin included, ingester supervised',
    metrics: { time: 'HTTP', operations: 'REST' },
  },
  {
    id: 'proxy',
    command: 'argon proxy',
    description: 'Wire proxy: stable branch-aliased connection strings',
    output: 'Proxying mongodb://localhost:27100\nURIs stay stable across checkout/release cycles\nSynchronous capture is on the roadmap',
    metrics: { time: 'wire protocol', operations: 'proxy' },
  },
  {
    id: 'agents-pkg',
    command: 'python -c "from argon_agents import checkpointer"',
    description: 'argon-agents: LangGraph checkpointer + Mem0 factory',
    output: 'LangGraph checkpointer with fork and rewind\nMem0 factory on the same REST control plane\nPyPI publication pending — source ships with the engine',
    metrics: { time: 'REST-backed', operations: 'argon-agents' },
  },
];

export default function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState<'cli' | 'agent' | 'surfaces'>('cli');
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);

  useEffect(() => {
    setCurrentStep(0);
  }, [activeTab]);

  const handleStepChange = (step: number, total: number) => {
    setCurrentStep(step);
    setTotalSteps(total);
  };

  const getCurrentSteps = () => {
    switch (activeTab) {
      case 'cli':
        return cliSteps;
      case 'agent':
        return agentSteps;
      case 'surfaces':
        return surfaceSteps;
      default:
        return cliSteps;
    }
  };

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: 'cli', label: 'CLI workflow' },
    { key: 'agent', label: 'Agent & eval workflow' },
    { key: 'surfaces', label: 'MCP · REST · proxy' },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      {/* Tabs */}
      <div className="mb-8 flex justify-center overflow-x-auto">
        <div className="flex min-w-max flex-nowrap border border-brand-edge">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap px-4 py-2.5 font-mono text-sm transition-colors ${
                activeTab === tab.key
                  ? 'bg-brand-surface text-brand-primary'
                  : 'text-brand-text-darker hover:text-brand-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mb-8 text-center">
        <h3 className="mb-2 text-2xl font-semibold text-brand-text">
          {activeTab === 'cli' && 'The full loop, from branch to data PR'}
          {activeTab === 'agent' && 'Sandbox an agent, audit it, undo it, pin the eval'}
          {activeTab === 'surfaces' && 'Four surfaces, one engine'}
        </h3>
        <p className="text-brand-text-darker">
          {activeTab === 'cli' &&
            'Project → branch → real database → capture → diff → reviewable merge → undo'}
          {activeTab === 'agent' &&
            'TTL sandboxes with per-actor attribution, session undo, and pinned datasets for reproducible evals'}
          {activeTab === 'surfaces' &&
            'The CLI for humans and CI, MCP for agents, REST for SDKs, and a wire proxy for stable URIs'}
        </p>
        <p className="mt-2 text-xs text-brand-text-darker opacity-70">
          Simulated walkthrough for illustration — outputs are not live measurements.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <TerminalDemo steps={getCurrentSteps()} onStepChange={handleStepChange} />

        {/* Step info */}
        <div className="space-y-6">
          <div className="border border-brand-edge bg-brand-surface p-6">
            <h4 className="mb-2 font-mono text-sm text-brand-primary">
              Step {currentStep + 1} of {totalSteps || 1}
            </h4>
            <p className="mb-4 text-sm leading-6 text-brand-text">
              {getCurrentSteps()[currentStep]?.description}
            </p>
            <div className="h-1 w-full bg-brand-dark">
              <div
                className="h-1 bg-brand-primary transition-all duration-300"
                style={{ width: `${totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="border border-brand-edge bg-brand-surface p-6">
            <h4 className="mb-4 font-mono text-xs uppercase tracking-wider text-brand-muted">
              Steps
            </h4>
            <div className="space-y-1.5">
              {getCurrentSteps().map((s, index) => (
                <div
                  key={s.id}
                  className={`flex items-center gap-2 px-2 py-1.5 text-xs ${
                    index === currentStep
                      ? 'bg-brand-dark text-brand-primary'
                      : index < currentStep
                        ? 'text-brand-muted line-through decoration-brand-edge'
                        : 'text-brand-text-darker'
                  }`}
                >
                  <span className="font-mono">{String(index + 1).padStart(2, '0')}</span>
                  <span>{s.description}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-brand-edge bg-brand-surface p-6">
            <h4 className="mb-4 font-mono text-xs uppercase tracking-wider text-brand-muted">
              Why it holds up
            </h4>
            <ul className="space-y-2 text-sm leading-6 text-brand-text-darker">
              {activeTab === 'cli' && (
                <>
                  <li>Branches are metadata — real databases on checkout</li>
                  <li>Deterministic, property-tested replay</li>
                  <li>Merges are exactly-once, conflicts never silent</li>
                  <li>Real-driver capture validated in CI</li>
                </>
              )}
              {activeTab === 'agent' && (
                <>
                  <li>Every write attributed to an actor</li>
                  <li>Undo compensates via pre-images, reports conflicts</li>
                  <li>Pins are GC- and reset-proof by construction</li>
                  <li>TTL expiry reclaims storage, loudly skips pinned children</li>
                </>
              )}
              {activeTab === 'surfaces' && (
                <>
                  <li>All four surfaces drive the same WAL engine</li>
                  <li>MCP and REST supervise capture for you</li>
                  <li>Open source, MIT — run it all yourself</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
