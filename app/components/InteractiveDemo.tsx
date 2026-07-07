'use client';

import { useState } from 'react';
import DemoPlayer, { DemoPanel, DemoStep } from './DemoPlayer';
import { FlowGraph } from './GitGraph';

// History graphs: lane 0 = main (lavender), lane 1 = branch (green),
// lane 2 = second branch (amber). Nodes appear at the step index where
// the corresponding command completes.

const cliGraph: FlowGraph = {
  height: 160,
  lanes: [
    { name: 'main', y: 44 },
    { name: 'feature-x', y: 110 },
  ],
  nodes: [
    { id: 'm0', x: 120, y: 44, lane: 0, sub: 'LSN 0', appearAt: 0 },
    { id: 'm1', x: 280, y: 44, lane: 0, sub: 'LSN 3 · import', appearAt: 1 },
    { id: 'b0', x: 430, y: 110, lane: 1, sub: 'fork @ 3', appearAt: 2 },
    { id: 'b1', x: 620, y: 110, lane: 1, sub: 'LSN 5 · writes', appearAt: 4 },
    { id: 'plan', x: 810, y: 44, lane: 0, sub: 'plan_7d31 · pending', appearAt: 6, hideAt: 7, ghost: true },
    { id: 'm2', x: 810, y: 44, lane: 0, sub: 'LSN 8 · merge', appearAt: 7 },
  ],
  edges: [
    { from: 'm0', to: 'm1', appearAt: 1 },
    { from: 'm1', to: 'b0', appearAt: 2 },
    { from: 'b0', to: 'b1', appearAt: 4 },
    { from: 'b1', to: 'plan', appearAt: 6, hideAt: 7, ghost: true, curve: 'target' },
    { from: 'm1', to: 'm2', appearAt: 7 },
    { from: 'b1', to: 'm2', appearAt: 7, curve: 'target' },
  ],
  steps: [
    { head: 'm0', caption: 'project created — main is born at LSN 0' },
    { head: 'm1', caption: 'import advances main to LSN 3' },
    { head: 'b0', caption: 'feature-x forks from main @ LSN 3 — a pointer, no copies' },
    { head: 'b0', caption: 'feature-x is now a physical database (argon_br_9f2c1a)' },
    { head: 'b1', caption: 'captured driver writes advance feature-x to LSN 5' },
    { head: 'b1', highlight: ['b1', 'm1'], caption: 'diff: feature-x head vs main @ the fork point' },
    { head: 'b1', caption: 'merge plan (dashed = pending) targets main — nothing applied yet' },
    { head: 'm2', caption: 'feature-x merges into main — LSN 8, attributed, exactly-once' },
    { head: 'm2', highlight: ['m1'], caption: 'undo would rewind main past the merge — recorded as new history' },
  ],
};

const agentGraph: FlowGraph = {
  height: 200,
  lanes: [
    { name: 'prod/main', y: 40 },
    { name: 'sandbox-f81a', y: 104 },
    { name: 'eval run', y: 164 },
  ],
  nodes: [
    { id: 'm0', x: 130, y: 40, lane: 0, sub: 'LSN 8112', appearAt: 0 },
    { id: 's0', x: 330, y: 104, lane: 1, sub: 'fork · ttl 1h', appearAt: 0 },
    { id: 's1', x: 530, y: 104, lane: 1, sub: '+3,214 writes', appearAt: 1 },
    { id: 's2', x: 730, y: 104, lane: 1, sub: 'undo · compensations', appearAt: 3 },
    { id: 'pin', x: 130, y: 12, lane: 2, sub: 'pin: eval-2026-07', appearAt: 4, pin: true },
    { id: 'e0', x: 530, y: 164, lane: 2, sub: 'fork from pin', appearAt: 5 },
  ],
  edges: [
    { from: 'm0', to: 's0', appearAt: 0 },
    { from: 's0', to: 's1', appearAt: 1 },
    { from: 's1', to: 's2', appearAt: 3 },
    { from: 'm0', to: 'pin', appearAt: 4, ghost: true },
    { from: 'm0', to: 'e0', appearAt: 5 },
  ],
  steps: [
    { head: 's0', caption: 'sandbox forks prod @ LSN 8112 — TTL reaps it in 1h' },
    { head: 's1', caption: 'agent writes advance the sandbox head — prod untouched' },
    { head: 's1', highlight: ['s1', 'm0'], caption: 'diff: sandbox head vs prod @ fork' },
    { head: 's2', caption: 'undo: history moves forward, state moves back to the fork' },
    { head: 's2', highlight: ['pin'], caption: 'pin freezes LSN 8112 by name — GC and reset can never touch it' },
    { head: 'e0', caption: 'every eval run forks the pin — identical input, every time' },
  ],
};

// Simulated walkthroughs — outputs are illustrative, not live measurements.
// The right-hand panel shows what the database (the thing you would see in
// Compass or mongosh) looks like after each command.

const sourcePanel: DemoPanel = {
  title: 'mongodb://localhost:27017 · shop',
  note: 'your existing database, before Argon',
  sections: [
    {
      name: 'products (3 documents)',
      lines: [
        { text: '{ _id: "p1", name: "flux capacitor", price: 88 }' },
        { text: '{ _id: "p2", name: "sonic screwdriver", price: 30 }' },
        { text: '{ _id: "p3", name: "point thruster", price: 45 }' },
      ],
    },
  ],
};

const cliSteps: DemoStep[] = [
  {
    id: 'create',
    command: 'argon projects create my-app',
    description: 'Create a project — every write from here on is versioned',
    output: ['Created project: my-app', 'Main branch ready'],
    panel: {
      title: 'my-app · main',
      note: 'no collections yet — bring your data in next',
      sections: [],
    },
  },
  {
    id: 'import',
    command: 'argon import database --uri mongodb://localhost:27017 --database shop --project my-app',
    description: 'Import existing data — "git clone" for your database',
    output: ['3 documents imported from shop', 'History starts at LSN 1 → 3'],
    panel: {
      title: 'my-app · main @ LSN 3',
      note: 'each document is now an LSN-addressed WAL entry',
      sections: [
        {
          name: 'products (3 documents)',
          lines: [
            { text: '{ _id: "p1", name: "flux capacitor", price: 88 }', status: 'added' },
            { text: '{ _id: "p2", name: "sonic screwdriver", price: 30 }', status: 'added' },
            { text: '{ _id: "p3", name: "point thruster", price: 45 }', status: 'added' },
          ],
        },
      ],
    },
  },
  {
    id: 'branch',
    command: 'argon branches create feature-x -p my-app',
    description: 'Branch — a metadata write, instant at any data size',
    output: ['Branch created: feature-x', 'Forked from main @ LSN 3 — nothing copied'],
    panel: {
      title: 'my-app · feature-x (fork @ LSN 3)',
      note: 'same 3 documents, zero bytes copied — a branch is a pointer',
      sections: [
        {
          name: 'products (3 documents, inherited)',
          lines: [
            { text: '{ _id: "p1", name: "flux capacitor", price: 88 }' },
            { text: '{ _id: "p2", name: "sonic screwdriver", price: 30 }' },
            { text: '{ _id: "p3", name: "point thruster", price: 45 }' },
          ],
        },
      ],
    },
  },
  {
    id: 'checkout',
    command: 'argon checkout -p my-app -b feature-x',
    description: 'Materialize the branch into a real MongoDB database',
    output: [
      'Checked out at LSN 3: 1 collection, 3 documents',
      'Connection string:',
      '  mongodb://localhost:27017/argon_br_9f2c1a',
    ],
    panel: {
      title: 'mongodb://…/argon_br_9f2c1a',
      note: 'a real database — open this URI in Compass or mongosh',
      sections: [
        {
          name: 'products (3 documents)',
          lines: [
            { text: '{ _id: "p1", name: "flux capacitor", price: 88 }' },
            { text: '{ _id: "p2", name: "sonic screwdriver", price: 30 }' },
            { text: '{ _id: "p3", name: "point thruster", price: 45 }' },
          ],
        },
      ],
    },
  },
  {
    id: 'watch',
    command: 'argon watch -p my-app -b feature-x',
    description: 'Capture direct driver writes into versioned history',
    output: [
      'Watching for changes...',
      'captured: insert products/p4 (LSN 4)',
      'captured: update products/p2 (LSN 5)',
    ],
    panel: {
      title: 'mongodb://…/argon_br_9f2c1a',
      note: 'someone wrote with plain pymongo — both writes are now history',
      sections: [
        {
          name: 'products (4 documents)',
          lines: [
            { text: '{ _id: "p1", name: "flux capacitor", price: 88 }' },
            { text: '{ _id: "p2", name: "sonic screwdriver", price: 25 }', status: 'modified' },
            { text: '{ _id: "p3", name: "point thruster", price: 45 }' },
            { text: '{ _id: "p4", name: "heisenberg compensator", price: 120 }', status: 'added' },
          ],
        },
      ],
    },
  },
  {
    id: 'diff',
    command: 'argon diff -p my-app -b feature-x',
    description: 'Review the branch against its parent',
    output: ['vs main @ fork LSN 3:', '  + 1 added · ~ 1 modified · 0 conflicts'],
    panel: {
      title: 'diff · feature-x vs main',
      sections: [
        {
          name: 'products',
          lines: [
            { text: '{ _id: "p4", … } added', status: 'added' },
            { text: '{ _id: "p2", price: 30 → 25 }', status: 'modified' },
            { text: 'p1, p3 unchanged', status: 'muted' },
          ],
        },
      ],
    },
  },
  {
    id: 'merge',
    command: 'argon merge preview -p my-app -b feature-x',
    description: 'A data pull request: persisted, reviewable, exactly-once',
    output: [
      'Merge plan persisted (pending): plan_7d31',
      '2 changes, 0 conflicts',
      'Apply with: argon merge apply plan_7d31',
    ],
    panel: {
      title: 'merge plan plan_7d31 → main',
      note: 'applies exactly once, only against the heads it was computed for',
      sections: [
        {
          name: 'planned changes',
          lines: [
            { text: 'insert products/p4', status: 'added' },
            { text: 'update products/p2 (price 30 → 25)', status: 'modified' },
          ],
        },
      ],
    },
  },
  {
    id: 'merge-apply',
    command: 'argon merge apply plan_7d31',
    description: 'The branch lands on main — attributed, exactly-once',
    output: [
      'Applied against the exact heads the plan was computed for',
      '2 changes on main · actor: merge:feature-x',
      'main head: LSN 8',
    ],
    panel: {
      title: 'my-app · main @ LSN 8',
      note: 'the merge is ordinary history — attributed, and undoable',
      sections: [
        {
          name: 'products (4 documents)',
          lines: [
            { text: '{ _id: "p1", name: "flux capacitor", price: 88 }' },
            { text: '{ _id: "p2", name: "sonic screwdriver", price: 25 }', status: 'modified' },
            { text: '{ _id: "p3", name: "point thruster", price: 45 }' },
            { text: '{ _id: "p4", name: "heisenberg compensator", price: 120 }', status: 'added' },
          ],
        },
      ],
    },
  },
  {
    id: 'undo',
    command: 'argon undo -p my-app -b main --from-lsn 6 --dry-run',
    description: 'The undo button — even a merge is just a revertible range',
    output: [
      'Would revert 2 documents on main · 0 conflicts',
      'Compensations are new history: auditable, undoable in turn',
    ],
    panel: {
      title: 'undo preview · main',
      note: 'nothing changed yet — drop --dry-run to apply',
      sections: [
        {
          name: 'products (would become)',
          lines: [
            { text: '{ _id: "p4", … } would be deleted', status: 'removed' },
            { text: '{ _id: "p2", price: 25 → 30 } would revert', status: 'modified' },
          ],
        },
      ],
    },
  },
];

const agentInitialPanel: DemoPanel = {
  title: 'prod · main @ LSN 8112',
  note: 'production data — the thing the agent must never touch directly',
  sections: [
    {
      name: 'products (3 of 51,240 documents)',
      lines: [
        { text: '{ _id: "s1", name: "trail shoe", price: 49 }' },
        { text: '{ _id: "s2", name: "road shoe", price: 89 }' },
        { text: '{ _id: "s3", name: "track spike", price: 74 }' },
      ],
    },
  ],
};

const agentSteps: DemoStep[] = [
  {
    id: 'sandbox',
    command: 'argon sandbox create -p prod --ttl 1h',
    description: 'Fork, checkout, and TTL-stamp in one command',
    output: [
      'Sandbox: sandbox-f81a (expires in 1h)',
      'Connection string:',
      '  mongodb://localhost:27017/argon_br_f81a',
    ],
    panel: {
      title: 'mongodb://…/argon_br_f81a',
      note: 'an isolated copy of prod @ LSN 8112 — reaps itself on expiry',
      sections: [
        {
          name: 'products (3 of 51,240 documents)',
          lines: [
            { text: '{ _id: "s1", name: "trail shoe", price: 49 }' },
            { text: '{ _id: "s2", name: "road shoe", price: 89 }' },
            { text: '{ _id: "s3", name: "track spike", price: 74 }' },
          ],
        },
      ],
    },
  },
  {
    id: 'agent-writes',
    command: 'agent --db mongodb://…/argon_br_f81a --task "10% off all shoes"',
    description: 'The agent works against a real database, unchanged',
    output: [
      'agent updated 3,214 documents',
      'every write captured with actor: agent:price-fixer',
    ],
    panel: {
      title: 'mongodb://…/argon_br_f81a',
      note: 'production untouched — but look at s3',
      sections: [
        {
          name: 'products (3 of 51,240 documents)',
          lines: [
            { text: '{ _id: "s1", price: 49 → 44.1 }', status: 'modified' },
            { text: '{ _id: "s2", price: 89 → 80.1 }', status: 'modified' },
            { text: '{ _id: "s3", price: 74 → 0 }', status: 'removed' },
          ],
        },
      ],
    },
  },
  {
    id: 'review',
    command: 'argon diff -p prod -b sandbox-f81a',
    description: 'Audit exactly what the agent changed',
    output: ['~ 3,214 modified by agent:price-fixer', '12 documents flagged: price = 0'],
    panel: {
      title: 'diff · sandbox-f81a vs main',
      sections: [
        {
          name: 'products',
          lines: [
            { text: '3,202 documents: price × 0.9', status: 'modified' },
            { text: '12 documents: price → 0 (bug!)', status: 'removed' },
          ],
        },
      ],
    },
  },
  {
    id: 'undo-actor',
    command: 'argon undo -p prod -b sandbox-f81a --actor agent:price-fixer --from-lsn 8113',
    description: 'Revert one agent’s entire session',
    output: [
      '3,214 documents reverted · 0 conflicts',
      'a document you had edited since would be reported, not clobbered',
    ],
    panel: {
      title: 'mongodb://…/argon_br_f81a',
      note: 'back to the pre-session state — the undo itself is history',
      sections: [
        {
          name: 'products (3 of 51,240 documents)',
          lines: [
            { text: '{ _id: "s1", name: "trail shoe", price: 49 }' },
            { text: '{ _id: "s2", name: "road shoe", price: 89 }' },
            { text: '{ _id: "s3", name: "track spike", price: 74 }' },
          ],
        },
      ],
    },
  },
  {
    id: 'pin',
    command: 'argon pin create -p prod -b main --name eval-2026-07',
    description: 'Freeze a named dataset state for reproducible evals',
    output: ['Pin created: eval-2026-07 @ LSN 8112', 'Immutable — GC and reset can never touch it'],
    panel: {
      title: 'prod · pins',
      sections: [
        {
          name: 'pins',
          lines: [
            { text: 'eval-2026-07 @ LSN 8112 · immutable', status: 'added' },
          ],
        },
      ],
    },
  },
  {
    id: 'eval-run',
    command: 'argon sandbox create -p prod --from-pin eval-2026-07',
    description: 'Every eval run forks the pin — identical input, every time',
    output: [
      'Sandbox from pin eval-2026-07',
      'run #1, #17, or #1,000 — same input state, byte for byte',
    ],
    panel: {
      title: 'mongodb://…/argon_br_a3d9',
      note: 'the corpus keeps moving; your eval input never does',
      sections: [
        {
          name: 'products (3 of 51,240 documents @ LSN 8112)',
          lines: [
            { text: '{ _id: "s1", name: "trail shoe", price: 49 }' },
            { text: '{ _id: "s2", name: "road shoe", price: 89 }' },
            { text: '{ _id: "s3", name: "track spike", price: 74 }' },
          ],
        },
      ],
    },
  },
];

const surfacesInitialPanel: DemoPanel = {
  title: 'one engine',
  note: 'pick the surface that matches your integration point',
  sections: [],
};

const surfaceSteps: DemoStep[] = [
  {
    id: 'mcp',
    command: 'claude mcp add argon -- argon mcp',
    description: 'MCP: agents drive the whole loop themselves',
    output: ['Registered: argon (13 tools over stdio)'],
    panel: {
      title: 'MCP tools',
      note: 'the server supervises a capture ingester per sandbox',
      sections: [
        {
          name: 'tools/list',
          lines: [
            { text: 'argon_sandbox_create → returns a connection string', status: 'added' },
            { text: 'argon_diff · argon_merge_preview · argon_merge_apply' },
            { text: 'argon_undo (with dry-run) · argon_snapshot_create' },
            { text: 'argon_pin_create · argon_sandbox_from_pin' },
            { text: 'argon_branch_list · argon_connect · keep · discard' },
          ],
        },
      ],
    },
  },
  {
    id: 'rest',
    command: 'go run ./api',
    description: 'REST control plane for language SDKs and services',
    output: ['Listening on :8080'],
    panel: {
      title: 'REST · :8080',
      sections: [
        {
          name: 'endpoints',
          lines: [
            { text: 'POST /projects · /projects/:p/branches' },
            { text: 'POST /projects/:p/sandboxes (ingester supervised)' },
            { text: 'POST /projects/:p/pins · sandbox-from-pin' },
            { text: 'POST /merge/preview · /merge/apply · /undo' },
          ],
        },
      ],
    },
  },
  {
    id: 'proxy',
    command: 'argon proxy',
    description: 'Wire proxy: stable branch-aliased connection strings',
    output: ['Proxying on mongodb://localhost:27100'],
    panel: {
      title: 'argon proxy · :27100',
      note: 'URIs survive checkout/release cycles; synchronous capture is roadmap',
      sections: [
        {
          name: 'aliases',
          lines: [
            { text: 'mongodb://…:27100/?branch=feature-x → argon_br_9f2c1a' },
            { text: 'mongodb://…:27100/?branch=main → argon_br_00a1ce' },
          ],
        },
      ],
    },
  },
  {
    id: 'agents-pkg',
    command: 'pip install "argon-agents[langgraph]"',
    description: 'argon-agents: LangGraph checkpointer + Mem0 factory',
    output: [
      'Successfully installed argon-agents-0.1.0',
      'LangGraph checkpointer with fork and rewind',
      'Mem0 factory on the same REST control plane',
    ],
    panel: {
      title: 'argon-agents 0.1.0 (PyPI)',
      note: 'CI runs the real engine stack: checkpoint round-trips, pinned eval datasets',
      sections: [
        {
          name: 'surface',
          lines: [
            { text: 'ArgonCheckpointer — fork a conversation at step 14' },
            { text: 'Mem0 factory — agent memory on versioned storage' },
            { text: 'create_pin / sandbox_from_pin for eval harnesses' },
          ],
        },
      ],
    },
  },
];

export default function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState<'cli' | 'agent' | 'surfaces'>('cli');

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
            'The terminal drives; the right panel shows what your database looks like after each command.'}
          {activeTab === 'agent' &&
            'TTL sandboxes with per-actor attribution, session undo, and pinned datasets for reproducible evals.'}
          {activeTab === 'surfaces' &&
            'The CLI for humans and CI, MCP for agents, REST for SDKs, and a wire proxy for stable URIs.'}
        </p>
        <p className="mt-2 text-xs text-brand-text-darker opacity-70">
          Simulated walkthrough for illustration — outputs are not live measurements.
        </p>
      </div>

      {/* key per tab: switching flows remounts the player, so no stale
          timers or out-of-range steps can survive a tab change */}
      {activeTab === 'cli' && (
        <DemoPlayer
          key="cli"
          steps={cliSteps}
          initialPanel={sourcePanel}
          terminalTitle="argon · cli"
          graph={cliGraph}
        />
      )}
      {activeTab === 'agent' && (
        <DemoPlayer
          key="agent"
          steps={agentSteps}
          initialPanel={agentInitialPanel}
          terminalTitle="argon · agent session"
          graph={agentGraph}
        />
      )}
      {activeTab === 'surfaces' && (
        <DemoPlayer
          key="surfaces"
          steps={surfaceSteps}
          initialPanel={surfacesInitialPanel}
          terminalTitle="argon · surfaces"
          panelKind="surface view"
        />
      )}
    </div>
  );
}
