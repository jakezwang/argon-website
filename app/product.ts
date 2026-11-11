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
export const capabilities = [
  [
    "Branch vs checkout",
    "A branch is lightweight metadata. Checkout materializes a real MongoDB database; readiness, disk use and first-query costs depend on the dataset.",
  ],
  [
    "Isolation and merge",
    "Experiments write to a separate branch database. Applying a reviewed merge explicitly changes the target branch; start the MCP server with --disable-tools argon_merge_apply to keep that step with a person. Use MongoDB credentials and network controls for access isolation.",
  ],
  [
    "Writer attribution",
    "Native driver writes use the actor configured for the branch or run. Separate agents need separate branches; Argon does not identify individual clients sharing one connection.",
  ],
  [
    "Capture and undo",
    "A healthy capture process records document changes. Undo requires complete images and retained history. Missing images or unsupported drop/rename operations mark history incomplete and prevent unsafe restoration.",
  ],
  [
    "Retention and pins",
    "Time travel is available within retained history. A position whose history garbage collection has already reclaimed returns an error instead of a partial answer. Pins protect the data they reference while the pin exists; keep backups and choose retention for your workload.",
  ],
  [
    "Sandbox lifecycle",
    "An Argon sandbox is a MongoDB branch database. Reaching its TTL makes it eligible for cleanup on a successful sweep. A running writable, non-demo REST service or MCP server manages capture and sweeps; with the CLI alone, run watch and schedule sandbox sweep. TTL does not stop agent processes or revoke MongoDB credentials.",
  ],
  [
    "Hosted console",
    "The hosted console is paused. Explore the illustrated workflow on this website, or run Argon locally for native MongoDB connections and physical sandboxes.",
  ],
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
