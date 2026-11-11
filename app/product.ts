import release from "./release.json";

// Shared product claims and links. Keep release checks pointed at this file.
export const product = {
  ...release,
  demo: "/demo",
  demoLabel: "Explore walkthrough",
  demoStatus: "Hosted console paused",
  quickstart: "/quickstart",
  guide: `https://github.com/argon-lab/argon/blob/v${release.version}/docs/QUICK_START.md`,
  example: `https://github.com/argon-lab/argon-agents/blob/v${release.sdkVersion}/examples/two_agent_review.py`,
  roadmap: [
    "GCS chunk-store backend",
    "Read-your-writes barrier for the wire proxy",
    "MCP 2026-07-28 per-request protocol",
  ],
};
// [title, full text, lead sentence]. The full text is reused by the FAQ,
// llms.txt and several articles, so edit it with those in mind.
export const capabilities = [
  [
    "Branch vs checkout",
    "A branch is lightweight metadata. Checkout materializes a real MongoDB database; readiness, disk use and first-query costs depend on the dataset.",
    "A branch is metadata. A checkout is a real database.",
  ],
  [
    "Isolation and merge",
    "Experiments write to a separate branch database. Applying a reviewed merge explicitly changes the target branch; start the MCP server with --disable-tools argon_merge_apply to keep that step with a person. Use MongoDB credentials and network controls for access isolation.",
    "Nothing reaches the target until a merge is applied.",
  ],
  [
    "Writer attribution",
    "Native driver writes use the actor configured for the branch or run. Separate agents need separate branches; Argon does not identify individual clients sharing one connection.",
    "Attribution is per branch, not per client.",
  ],
  [
    "Capture and undo",
    "A healthy capture process records document changes. Undo requires complete images and retained history. Missing images or unsupported drop/rename operations mark history incomplete and prevent unsafe restoration.",
    "Undo depends on complete capture.",
  ],
  [
    "Retention and pins",
    "Time travel is available within retained history. A position whose history garbage collection has already reclaimed returns an error instead of a partial answer. Pins protect the data they reference while the pin exists; keep backups and choose retention for your workload.",
    "You can go back as far as history is retained.",
  ],
  [
    "Sandbox lifecycle",
    "An Argon sandbox is a MongoDB branch database. Reaching its TTL makes it eligible for cleanup on a successful sweep. A running writable, non-demo REST service or MCP server manages capture and sweeps; with the CLI alone, run watch and schedule sandbox sweep. TTL does not stop agent processes or revoke MongoDB credentials.",
    "A TTL schedules cleanup. It does not stop the agent.",
  ],
  [
    "Hosted console",
    "The hosted console is paused. Explore the illustrated workflow on this website, or run Argon locally for native MongoDB connections and physical sandboxes.",
    "The hosted console is paused.",
  ],
] as const;
// What a visitor can do with Argon, benefit first. The home page shows the
// name, summary and first command; the features page shows everything.
// Commands and their output were run with the published 2.2.0 CLI against a
// local replica set (IDs and timestamps shortened); rerun them when either
// changes. `transcript` pairs each command with what it printed.
export const features = [
  {
    id: "sandbox",
    short: "Sandboxes",
    name: "Give every run its own database",
    summary:
      "A sandbox is a branch checked out as a real MongoDB database, with a time limit. Any driver connects to it, and main stays as it was.",
    transcript: [
      [
        "argon sandbox create -p shop --name agent-run --ttl 1h",
        [
          'Sandbox "agent-run" forked from main at LSN 3.',
          "Expires: 2026-11-11T13:02:25Z",
          "Connection string:",
          "  mongodb://127.0.0.1:27017/argon_br_6af4…0f37?replicaSet=rs0",
        ],
      ],
    ],
    points: [
      "Creating a branch copies no documents. A branch is a pointer into shared history.",
      "Checkout builds the physical database and prints its connection string.",
      "Past its TTL, a sandbox is removed by the next sweep.",
    ],
    limit:
      "Checkout copies data, so its time and storage depend on the dataset.",
  },
  {
    id: "diff",
    short: "Diff",
    name: "Review changes as a diff",
    summary:
      "See which documents a branch would add, change or remove before anything reaches main.",
    transcript: [
      [
        "argon diff -p shop -b agent-run",
        [
          "Merging agent-run → main",
          "  put    orders/order-1",
          "1 change(s), 0 conflict(s)",
        ],
      ],
    ],
    points: [
      "It compares the data itself, whichever tool or driver wrote it.",
      "The same diff is available over MCP and REST.",
    ],
    limit: "Capture has to be running while the agent writes.",
  },
  {
    id: "merge",
    short: "Merge",
    name: "Merge the plan you reviewed",
    summary:
      "A merge preview is saved as a plan. Nothing from the branch reaches the target until you apply that plan by its ID.",
    transcript: [
      [
        "argon merge preview -p shop -b agent-run",
        [
          "1 change(s), 0 conflict(s)",
          "Plan 6af45958c0be80bef07068a3 saved (pending).",
        ],
      ],
      [
        "argon merge apply 6af45958c0be80bef07068a3",
        ["Merged: 1 change(s) applied."],
      ],
    ],
    points: [
      "Conflicts are reported, never resolved silently.",
      "To keep the decision with a person, start the MCP server with --disable-tools argon_merge_apply.",
    ],
    limit:
      "A preview is something to review. It does not enforce an approval by itself.",
  },
  {
    id: "time-travel",
    short: "Time travel",
    name: "Read or restore an earlier state",
    summary:
      "Query a branch as it was at any retained log position, or restore that state into a new branch.",
    transcript: [
      [
        "argon time-travel query -p shop -b main --lsn 3",
        ["orders: 1 documents"],
      ],
      [
        "argon restore branch -p shop -b main --lsn 3 --as recovered",
        ['Created branch "recovered" at LSN 3'],
      ],
    ],
    points: [
      "Address a state by log position (LSN) or by timestamp.",
      "A position that is no longer retained returns an error, not a partial answer.",
    ],
    limit: "You can go back as far as history is retained.",
  },
  {
    id: "undo",
    short: "Undo",
    name: "Undo one agent's writes",
    summary:
      "Revert a range of captured changes, filtered by the actor label of the run that made them. A dry run shows the result first.",
    transcript: [
      [
        "argon undo -p shop -b agent-run --from-lsn 6 --actor agent:planner --dry-run",
        [
          'Undo [6, 6] for actor "agent:planner": 1 document(s) to revert',
          "  restore orders/order-1",
          "Dry run: nothing applied.",
        ],
      ],
    ],
    points: [
      "The undo is recorded in history like any other change.",
      "An actor label belongs to a branch, so give each agent its own.",
    ],
    limit: "Undo requires complete images and retained history.",
  },
  {
    id: "pins",
    short: "Pins",
    name: "Start every eval from the same data",
    summary:
      "A pin names a fixed state of a branch. Each eval run forks a fresh sandbox from it, so every run starts from identical data.",
    transcript: [
      [
        "argon pin create -p shop --name eval-v1",
        [
          'Pinned shop/main at LSN 9 as "eval-v1"',
          "This state now survives GC and resets until the pin is deleted.",
        ],
      ],
      [
        "argon pin sandbox -p shop --name eval-v1 --ttl 1h",
        ['Sandbox "eval-v1-run-5e52bb85" forked from pin "eval-v1" (LSN 9)'],
      ],
    ],
    points: [
      "A pin protects the history it refers to for as long as it exists.",
      "Delete the pin to release that history.",
    ],
    limit:
      "Identical input does not make an agent's output deterministic, and a pin is not a backup.",
  },
] as const;

// How the engine is built, for readers who want the mechanism.
export const engineering = [
  [
    "One append-only log",
    "Everything is a view over one log: branches are pointers into it, time travel replays it, and checkout materializes it into a real MongoDB database.",
  ],
  [
    "Deterministic replay",
    "Same history, same state — byte for byte, property-tested in CI.",
  ],
  [
    "Four ways in",
    "A CLI for people, an MCP server for agents (13 tools, restrictable per server), REST for SDKs, and a wire proxy for stable URIs.",
  ],
  [
    "Numbers you can rerun",
    "Every number links to a benchmark you can run with docker compose up. What we can't back, we don't publish.",
  ],
] as const;

// The words the site and the CLI use, defined once.
export const terms = [
  [
    "Branch",
    "A pointer into a project's shared history, plus the writes made after the branch point. Not a copy of your documents.",
  ],
  [
    "Checkout",
    "Building a branch into a physical MongoDB database you can connect to.",
  ],
  [
    "Sandbox",
    "A branch that is forked, checked out and given a time limit in one step, for a single agent run.",
  ],
  [
    "Capture",
    "The process that records document changes made through a driver: argon watch, or a running console, API or MCP server.",
  ],
  [
    "Exact images",
    "Before and after copies of each changed document, enabled per collection. Undo and restore rely on them.",
  ],
  [
    "LSN",
    "Log sequence number: the position of a change in history. Time travel, undo and pins address states by it.",
  ],
  [
    "Merge plan",
    "The saved result of a merge preview. Applying it by ID is what changes the target branch.",
  ],
  ["Pin", "A named, immutable reference to a captured branch state."],
  ["Sweep", "The cleanup pass that removes sandboxes past their TTL."],
] as const;

export const reviewSteps = [
  [
    "Pin the input",
    "Freeze orders at baseline: order-1 costs $49. Both agents fork that same pin, so their starting data is identical.",
  ],
  [
    "Compare proposals",
    "Planner changes the price to $44. Executor proposes $1 on its own branch. Both use ordinary MongoDB driver writes.",
  ],
  [
    "Review before adopting",
    "Inspect the planner diff and apply its merge plan. Main now contains $44. The executor plan surfaces a real conflict against that accepted change.",
  ],
  [
    "Reject and recover",
    "Undo the executor proposal on its branch, then discard it. You can also undo the accepted merge to restore $49; that recovery is recorded in history.",
  ],
] as const;

export const install = {
  cli: `npm install -g argonctl@${release.version} --allow-scripts=argonctl`,
  python: `python3 -m pip install "argon-agents==${release.sdkVersion}"`,
  langgraph: `python3 -m pip install "argon-agents[langgraph]==${release.sdkVersion}"`,
  mcp: `claude mcp add --transport stdio --env MONGODB_URI='mongodb://localhost:27017/?replicaSet=rs0' argon -- argon mcp`,
};

export const limits = {
  branching: capabilities[0][1],
  isolation: capabilities[1][1],
  attribution: capabilities[2][1],
  undo: capabilities[3][1],
  retention: capabilities[4][1],
  lifecycle: capabilities[5][1],
};
