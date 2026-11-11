"use client";

import { useState } from "react";
import DemoPlayer, { DemoPanel, DemoStep } from "./DemoPlayer";
import { FlowGraph } from "./GitGraph";
import SurfacePicker from "./SurfacePicker";

// History graphs: lane 0 = main (lavender), lane 1 = branch (green),
// lane 2 = second branch (amber). Nodes appear at the step index where
// the corresponding command completes.

const cliGraph: FlowGraph = {
  height: 128,
  lanes: [
    { name: "main", y: 36 },
    { name: "feature-x", y: 94 },
  ],
  nodes: [
    { id: "m0", x: 120, y: 36, lane: 0, sub: "LSN 0", appearAt: 1 },
    { id: "m1", x: 280, y: 36, lane: 0, sub: "LSN 3 · import", appearAt: 1 },
    { id: "b0", x: 430, y: 94, lane: 1, sub: "fork @ 3", appearAt: 2 },
    { id: "b1", x: 620, y: 94, lane: 1, sub: "LSN 5 · writes", appearAt: 4 },
    {
      id: "plan",
      x: 810,
      y: 36,
      lane: 0,
      sub: "000000000000000000007d31 · pending",
      appearAt: 6,
      hideAt: 7,
      ghost: true,
    },
    { id: "m2", x: 810, y: 36, lane: 0, sub: "LSN 8 · merge", appearAt: 7 },
  ],
  edges: [
    { from: "m0", to: "m1", appearAt: 1 },
    { from: "m1", to: "b0", appearAt: 2 },
    { from: "b0", to: "b1", appearAt: 4 },
    {
      from: "b1",
      to: "plan",
      appearAt: 6,
      hideAt: 7,
      ghost: true,
      curve: "target",
    },
    { from: "m1", to: "m2", appearAt: 7 },
    { from: "b1", to: "m2", appearAt: 7, curve: "target" },
  ],
  steps: [
    { caption: "preview the source — no target project created yet" },
    { head: "m1", caption: "import advances main to LSN 3" },
    {
      head: "b0",
      caption: "feature-x forks from main @ LSN 3 — a pointer, no copies",
    },
    {
      head: "b0",
      caption: "feature-x is now a physical database (argon_br_9f2c1a)",
    },
    {
      head: "b1",
      caption: "captured driver writes advance feature-x to LSN 5",
    },
    {
      head: "b1",
      highlight: ["b1", "m1"],
      caption: "diff: feature-x head vs main @ the fork point",
    },
    {
      head: "b1",
      caption:
        "merge plan (dashed = pending) targets main — nothing applied yet",
    },
    {
      head: "m2",
      caption: "feature-x merges into main — LSN 8, attributed, reviewed",
    },
    {
      head: "m2",
      highlight: ["m1"],
      caption:
        "undo would rewind main past the merge — recorded as new history",
    },
  ],
};

const agentGraph: FlowGraph = {
  height: 168,
  lanes: [
    { name: "prod/main", y: 32 },
    { name: "sandbox-f81a", y: 88 },
    { name: "eval run", y: 140 },
  ],
  nodes: [
    { id: "m0", x: 130, y: 32, lane: 0, sub: "LSN 8112", appearAt: 0 },
    { id: "s0", x: 330, y: 88, lane: 1, sub: "fork · ttl 1h", appearAt: 0 },
    { id: "s1", x: 530, y: 88, lane: 1, sub: "+3,214 writes", appearAt: 1 },
    {
      id: "s2",
      x: 730,
      y: 88,
      lane: 1,
      sub: "undo · compensations",
      appearAt: 3,
    },
    {
      id: "pin",
      x: 130,
      y: 10,
      lane: 2,
      sub: "eval-2026-07",
      appearAt: 4,
      pin: true,
    },
    { id: "e0", x: 530, y: 140, lane: 2, sub: "fork from pin", appearAt: 5 },
  ],
  edges: [
    { from: "m0", to: "s0", appearAt: 0 },
    { from: "s0", to: "s1", appearAt: 1 },
    { from: "s1", to: "s2", appearAt: 3 },
    { from: "m0", to: "pin", appearAt: 4, ghost: true },
    { from: "pin", to: "e0", appearAt: 5 },
  ],
  steps: [
    {
      head: "s0",
      caption: "sandbox forks prod @ LSN 8112 — TTL reaps it in 1h",
    },
    {
      head: "s1",
      caption: "agent writes advance the sandbox head — prod untouched",
    },
    {
      head: "s1",
      highlight: ["s1", "m0"],
      caption: "diff: sandbox head vs prod @ fork",
    },
    {
      head: "s2",
      caption: "undo: history moves forward, state moves back to the fork",
    },
    {
      head: "s2",
      highlight: ["pin"],
      caption: "pin protects LSN 8112 while the pin exists",
    },
    {
      head: "e0",
      caption: "every eval run forks the pin — identical input, every time",
    },
  ],
};

// Simulated walkthroughs — outputs are illustrative, not live measurements.
// The right-hand panel shows what the database (the thing you would see in
// Compass or mongosh) looks like after each command.

const sourcePanel: DemoPanel = {
  title: "mongodb://localhost:27017 · shop",
  note: "your existing database, before Argon",
  sections: [
    {
      name: "products (3 documents)",
      lines: [
        { text: '{ _id: "s1", name: "trail shoe", price: 49 }' },
        { text: '{ _id: "s2", name: "road shoe", price: 89 }' },
        { text: '{ _id: "s3", name: "track spike", price: 74 }' },
      ],
    },
  ],
};

const cliSteps: DemoStep[] = [
  {
    id: "preview",
    command:
      "argon import preview --uri mongodb://localhost:27017 --database shop",
    description: "Preview the source database before importing it",
    output: ["1 collection · 3 documents", "No target data created"],
    panel: sourcePanel,
  },
  {
    id: "import",
    command:
      "argon import database --uri mongodb://localhost:27017 --database shop --project my-app --source-quiesced",
    description: "Import it. Stop writes and schema changes first.",
    output: ["3 documents imported from shop", "History starts at LSN 1 → 3"],
    panel: {
      title: "my-app · main @ LSN 3",
      note: "each document is now an LSN-addressed WAL entry",
      sections: [
        {
          name: "products (3 documents)",
          lines: [
            {
              text: '{ _id: "s1", name: "trail shoe", price: 49 }',
              status: "added",
            },
            {
              text: '{ _id: "s2", name: "road shoe", price: 89 }',
              status: "added",
            },
            {
              text: '{ _id: "s3", name: "track spike", price: 74 }',
              status: "added",
            },
          ],
        },
      ],
    },
  },
  {
    id: "branch",
    command: "argon branches create feature-x -p my-app",
    description: "Create a branch. No documents are copied.",
    output: [
      "Branch created: feature-x",
      "Forked from main @ LSN 3 — nothing copied",
    ],
    panel: {
      title: "my-app · feature-x (fork @ LSN 3)",
      note: "same 3 documents, zero bytes copied — a branch is a pointer",
      sections: [
        {
          name: "products (3 documents, inherited)",
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
    id: "checkout",
    command: "argon checkout -p my-app -b feature-x",
    description: "Check the branch out as a real MongoDB database",
    output: [
      "Checked out at LSN 3: 1 collection, 3 documents",
      "Connection string:",
      "  mongodb://localhost:27017/argon_br_9f2c1a",
    ],
    panel: {
      title: "mongodb://…/argon_br_9f2c1a",
      note: "a real database — open this URI in Compass or mongosh",
      sections: [
        {
          name: "products (3 documents)",
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
    id: "watch",
    command: "argon watch -p my-app -b feature-x",
    description: "Write with any driver while capture records the changes",
    output: [
      "Watching for changes...",
      "captured: insert products/s4 (LSN 4)",
      "captured: update products/s2 (LSN 5)",
    ],
    panel: {
      title: "mongodb://…/argon_br_9f2c1a",
      note: "someone wrote with plain pymongo — both writes are now history",
      sections: [
        {
          name: "products (4 documents)",
          lines: [
            { text: '{ _id: "s1", name: "trail shoe", price: 49 }' },
            {
              text: '{ _id: "s2", name: "road shoe", price: 79 }',
              status: "modified",
            },
            { text: '{ _id: "s3", name: "track spike", price: 74 }' },
            {
              text: '{ _id: "s4", name: "trail runner", price: 59 }',
              status: "added",
            },
          ],
        },
      ],
    },
  },
  {
    id: "diff",
    command: "argon diff -p my-app -b feature-x",
    description: "Diff the branch against main",
    output: [
      "vs main @ fork LSN 3:",
      "  + 1 added · ~ 1 modified · 0 conflicts",
    ],
    panel: {
      title: "diff · feature-x vs main",
      sections: [
        {
          name: "products",
          lines: [
            { text: '{ _id: "s4", … } added', status: "added" },
            { text: '{ _id: "s2", price: 89 → 79 }', status: "modified" },
            { text: "s1, s3 unchanged", status: "muted" },
          ],
        },
      ],
    },
  },
  {
    id: "merge",
    command: "argon merge preview -p my-app -b feature-x",
    description: "Save a merge plan to review",
    output: [
      "Merge plan persisted (pending): 000000000000000000007d31",
      "2 changes, 0 conflicts",
      "Apply with: argon merge apply 000000000000000000007d31",
    ],
    panel: {
      title: "merge plan 000000000000000000007d31 → main",
      note: "claims the reviewed plan atomically; stale heads require a fresh preview",
      sections: [
        {
          name: "planned changes",
          lines: [
            { text: "insert products/s4", status: "added" },
            { text: "update products/s2 (price 89 → 79)", status: "modified" },
          ],
        },
      ],
    },
  },
  {
    id: "merge-apply",
    command: "argon merge apply 000000000000000000007d31",
    description: "Apply the reviewed plan to main",
    output: [
      "Applied against the exact heads the plan was computed for",
      "2 changes on main · actor: merge:feature-x",
      "main head: LSN 8",
    ],
    panel: {
      title: "my-app · main @ LSN 8",
      note: "the merge is ordinary history — attributed, and undoable",
      sections: [
        {
          name: "products (4 documents)",
          lines: [
            { text: '{ _id: "s1", name: "trail shoe", price: 49 }' },
            {
              text: '{ _id: "s2", name: "road shoe", price: 79 }',
              status: "modified",
            },
            { text: '{ _id: "s3", name: "track spike", price: 74 }' },
            {
              text: '{ _id: "s4", name: "trail runner", price: 59 }',
              status: "added",
            },
          ],
        },
      ],
    },
  },
  {
    id: "undo",
    command: "argon undo -p my-app -b main --from-lsn 6 --dry-run",
    description: "Preview undoing that merge",
    output: [
      "Would revert 2 documents on main · 0 conflicts",
      "Compensations are new history: auditable, undoable in turn",
    ],
    panel: {
      title: "undo preview · main",
      note: "nothing changed yet — drop --dry-run to apply",
      sections: [
        {
          name: "products (would become)",
          lines: [
            { text: '{ _id: "s4", … } would be deleted', status: "removed" },
            {
              text: '{ _id: "s2", price: 79 → 89 } would revert',
              status: "modified",
            },
          ],
        },
      ],
    },
  },
];

const agentInitialPanel: DemoPanel = {
  title: "prod · main @ LSN 8112",
  note: "production data — the thing the agent must never touch directly",
  sections: [
    {
      name: "products (3 of 51,240 documents)",
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
    id: "sandbox",
    command: "argon sandbox create -p prod --ttl 1h",
    description:
      "Create a sandbox: fork, checkout and a time limit in one command",
    output: [
      "Sandbox: sandbox-f81a (expires in 1h)",
      "Connection string:",
      "  mongodb://localhost:27017/argon_br_f81a",
      "Keep capture running: argon watch -p prod -b sandbox-f81a --actor agent:price-fixer",
      "Schedule expiry cleanup: argon sandbox sweep -p prod",
    ],
    panel: {
      title: "mongodb://…/argon_br_f81a",
      note: "separate branch at LSN 8112 — schedule sandbox sweep for expiry",
      sections: [
        {
          name: "products (3 of 51,240 documents)",
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
    id: "agent-writes",
    command: 'agent --db mongodb://…/argon_br_f81a --task "10% off all shoes"',
    description: "The agent writes to a real database with its usual driver",
    output: [
      "agent updated 3,214 documents",
      "branch capture configured with actor: agent:price-fixer",
    ],
    panel: {
      title: "mongodb://…/argon_br_f81a",
      note: "production untouched — but look at s3",
      sections: [
        {
          name: "products (3 of 51,240 documents)",
          lines: [
            { text: '{ _id: "s1", price: 49 → 44.1 }', status: "modified" },
            { text: '{ _id: "s2", price: 89 → 80.1 }', status: "modified" },
            { text: '{ _id: "s3", price: 74 → 0 }', status: "removed" },
          ],
        },
      ],
    },
  },
  {
    id: "review",
    command: "argon diff -p prod -b sandbox-f81a",
    description: "See exactly what the agent changed",
    output: [
      "~ 3,214 modified by agent:price-fixer",
      "12 documents flagged: price = 0",
    ],
    panel: {
      title: "diff · sandbox-f81a vs main",
      sections: [
        {
          name: "products",
          lines: [
            { text: "3,202 documents: price × 0.9", status: "modified" },
            { text: "12 documents: price → 0 (bug!)", status: "removed" },
          ],
        },
      ],
    },
  },
  {
    id: "undo-actor",
    command:
      "argon undo -p prod -b sandbox-f81a --actor agent:price-fixer --from-lsn 8113",
    description: "Undo that agent's writes on its branch",
    output: [
      "3,214 documents reverted · 0 conflicts",
      "a document you had edited since would be reported, not clobbered",
    ],
    panel: {
      title: "mongodb://…/argon_br_f81a",
      note: "back to the pre-session state — the undo itself is history",
      sections: [
        {
          name: "products (3 of 51,240 documents)",
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
    id: "pin",
    command: "argon pin create -p prod -b main --name eval-2026-07",
    description: "Pin a dataset state for evals",
    output: [
      "Pin created: eval-2026-07 @ LSN 8112",
      "Protects the referenced state while the pin exists",
    ],
    panel: {
      title: "prod · pins",
      sections: [
        {
          name: "pins",
          lines: [
            { text: "eval-2026-07 @ LSN 8112 · immutable", status: "added" },
          ],
        },
      ],
    },
  },
  {
    id: "eval-run",
    command: "argon pin sandbox -p prod --name eval-2026-07 --ttl 1h",
    description: "Start each eval run from the pin, with identical input",
    output: [
      "Sandbox from pin eval-2026-07",
      "run #1, #17, or #1,000 — same input state, byte for byte",
    ],
    panel: {
      title: "mongodb://…/argon_br_a3d9",
      note: "the corpus keeps moving; your eval input never does",
      sections: [
        {
          name: "products (3 of 51,240 documents @ LSN 8112)",
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

export default function InteractiveDemo() {
  const [activeTab, setActiveTab] = useState<"cli" | "agent" | "surfaces">(
    "cli",
  );

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: "cli", label: "CLI workflow" },
    { key: "agent", label: "Agent & eval workflow" },
    { key: "surfaces", label: "MCP · REST · proxy" },
  ];

  return (
    <div className="mx-auto min-w-0 max-w-6xl">
      {/* Tabs */}
      <div className="mb-4 flex justify-start overflow-x-auto">
        <div className="flex min-w-max flex-nowrap gap-1 rounded-[0.75rem] border border-brand-edge bg-brand-surface p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              aria-pressed={activeTab === tab.key}
              className={`min-h-11 whitespace-nowrap rounded-(--radius-control) px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-brand-solid text-brand-on-solid"
                  : "text-brand-text-darker hover:text-brand-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-sm text-brand-text-darker">
          {activeTab === "cli" &&
            "The full loop, from import to a reviewed merge. The terminal drives; the panels show the data."}
          {activeTab === "agent" &&
            "Sandbox an agent, review what it changed, undo it, and pin a dataset for evals."}
          {activeTab === "surfaces" &&
            "One engine, four ways in: CLI, MCP, REST and the wire proxy."}{" "}
          Simulated.
        </p>
      </div>

      {/* key per tab: switching flows remounts the player, so no stale
          timers or out-of-range steps can survive a tab change */}
      {activeTab === "cli" && (
        <DemoPlayer
          key="cli"
          steps={cliSteps}
          initialPanel={sourcePanel}
          terminalTitle="argon · cli"
          graph={cliGraph}
        />
      )}
      {activeTab === "agent" && (
        <DemoPlayer
          key="agent"
          steps={agentSteps}
          initialPanel={agentInitialPanel}
          terminalTitle="argon · agent session"
          graph={agentGraph}
        />
      )}
      {activeTab === "surfaces" && <SurfacePicker />}
    </div>
  );
}
