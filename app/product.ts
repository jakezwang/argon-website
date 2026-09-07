// Shared product claims and links. Keep release checks pointed at this file.
export const product = {
  version: "2.1.1",
  sdkVersion: "0.2.0",
  demo: "https://console.argonlabs.tech",
  quickstart: "/quickstart",
  guide: "https://github.com/argon-lab/argon/blob/v2.1.1/docs/QUICK_START.md",
  example:
    "https://github.com/argon-lab/argon-agents/blob/v0.2.0/examples/two_agent_review.py",
  roadmap: [
    "GCS chunk-store backend",
    "Read-your-writes barrier for the wire proxy",
  ],
};
export const capabilities = [
  [
    "Branch vs checkout",
    "A branch is lightweight metadata. Checkout materializes a real MongoDB database; readiness, disk use and first-query costs depend on the dataset.",
  ],
  [
    "Isolation and merge",
    "Experiments write to a separate branch database. Applying a reviewed merge explicitly changes the target branch. Use MongoDB credentials and network controls for access isolation.",
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
    "Time travel is available within retained history. Pins protect the data they reference while the pin exists; keep backups and choose retention for your workload.",
  ],
  [
    "Sandbox lifecycle",
    "REST and MCP manage capture and TTL cleanup while the service runs. Standalone CLI sandbox creation requires a running watch process and scheduled sandbox sweep.",
  ],
  [
    "Anonymous demo",
    "The hosted demo provides session-scoped sample data and review tools. Native MongoDB connections and physical sandboxes are available in your local deployment.",
  ],
] as const;
export const reviewSteps = [
  [
    "01 · Pin the input",
    "Freeze orders at baseline: order-1 costs $49. Both agents fork that same pin, so their starting data is identical.",
  ],
  [
    "02 · Compare proposals",
    "Planner changes the price to $44. Executor proposes $1 on its own branch. Both use ordinary MongoDB driver writes.",
  ],
  [
    "03 · Review before adopting",
    "Inspect the planner diff and apply its merge plan. Main now contains $44. The executor plan surfaces a real conflict against that accepted change.",
  ],
  [
    "04 · Reject and recover",
    "Undo the executor proposal on its branch, then discard it. You can also undo the accepted merge to restore $49; that recovery is recorded in history.",
  ],
] as const;
