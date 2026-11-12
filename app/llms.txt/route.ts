import { capabilities, features, install, product } from "../product";
import { posts } from "../blog/posts";

export const dynamic = "force-static";

export function GET() {
  const text = `# Argon

> Argon gives AI agents disposable MongoDB sandboxes. It is an MIT-licensed, self-hosted engine with Git-style branching, time travel, reviewed merge, and undo for MongoDB.

## What you can do

${features
  .map((feature) => {
    const commands = feature.transcript
      .map((entry) => `\`${entry[0].replace(/[0-9a-f]{24}/, "<plan-id>")}\``)
      .join(", ");
    return `- **${feature.name}**: ${feature.summary} Commands: ${commands}. Good to know: ${feature.limit}`;
  })
  .join("\n")}

## Operating boundaries

${capabilities.map(([title, detail]) => `- **${title}**: ${detail}`).join("\n")}

## Releases and installation

- Engine: ${product.version}. CLI: \`${install.cli}\` (command: \`argon\`).
- The npm command requires npm 11.16+ with a supported Node.js version. It allows only argonctl's binary installer; npm 12 otherwise blocks the download script. Homebrew and source builds are available at https://argonlabs.tech/quickstart#install.
- Python SDK: ${product.sdkVersion}, installed from PyPI in a virtual environment: \`${install.langgraph}\`.
- MCP: follow the MongoDB and project prerequisites at https://argonlabs.tech/agents#mcp, then \`${install.mcp}\`.
- Start with the complete local setup: https://argonlabs.tech/quickstart

## MCP server

- \`argon mcp\` serves 13 tools over stdio: argon_sandbox_create, argon_sandbox_discard, argon_sandbox_keep, argon_branch_list, argon_connect, argon_diff, argon_merge_preview, argon_merge_apply, argon_undo, argon_snapshot_create, argon_pin_create, argon_pin_list, argon_pin_sandbox.
- Every tool declares MCP annotations. argon_branch_list, argon_diff and argon_pin_list are read-only; argon_merge_apply, argon_undo and argon_sandbox_discard are destructive.
- From 2.2.0, \`argon mcp --disable-tools argon_merge_apply\` withholds the apply tool so a person applies the reviewed plan with \`argon merge apply <plan-id>\`. \`--disable-tools\` takes a comma-separated list; \`argon mcp --read-only\` offers only the three read-only tools.
- From 2.3.2 the server starts without a reachable MongoDB: the handshake and tools/list need no database, and it connects on the first tool call. A tool called while MongoDB is unreachable returns a tool error and the server stays up.
- Supported MCP revisions: 2024-11-05, 2025-03-26 and 2025-06-18 (handshake based). The 2026-07-28 per-request protocol is not implemented yet.

## Local access and security

- The console and API bind 127.0.0.1 and, without a token, answer only to localhost and loopback hostnames; add others with ARGON_ALLOWED_HOSTS. ARGON_API_TOKEN enables Bearer auth.
- The wire proxy listens on loopback unless started with \`--listen <addr> --allow-remote\`; it does not authenticate clients.
- The npm installer verifies the downloaded binary against the SHA-256 published with the package.
- Security policy and private reporting: https://github.com/argon-lab/argon/security/policy

## Key links

- Website: https://argonlabs.tech
- Source: https://github.com/argon-lab/argon
- Release setup guide: ${product.guide}
- Agent adapters: https://github.com/argon-lab/argon-agents
- Reproducible benchmarks: https://github.com/argon-lab/benchmarks
- Features and limits: https://argonlabs.tech/features#capabilities
- Agent setup: https://argonlabs.tech/agents
- CLI install and commands by task: https://argonlabs.tech/cli
- Guides feed (Atom): https://argonlabs.tech/feed.xml
- Illustrated walkthrough: https://argonlabs.tech${product.demo}
- Hosted console: paused. Use https://argonlabs.tech/quickstart for the real engine.
- Two-agent example: ${product.example}

## Guides

${posts.map((post) => `- [${post.title}](https://argonlabs.tech/blog/${post.slug}): ${post.description}`).join("\n")}
`;
  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
