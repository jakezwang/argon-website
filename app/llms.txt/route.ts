import { capabilities, install, product } from "../product";

export const dynamic = "force-static";

export function GET() {
  const text = `# Argon

> Argon is an MIT-licensed, self-hosted engine for Git-style branching, time travel, reviewed merge, and undo for MongoDB.

## Operating boundaries

${capabilities.map(([title, detail]) => `- **${title}**: ${detail}`).join("\n")}

## Releases and installation

- Engine: ${product.version}. CLI: \`${install.cli}\` (command: \`argon\`).
- Python SDK: ${product.sdkVersion}, installed from its Git release tag in a virtual environment: \`${install.langgraph}\`.
- MCP: follow the MongoDB and project prerequisites at https://argonlabs.tech/agents#mcp, then \`${install.mcp}\`.
- Start with the complete local setup: https://argonlabs.tech/quickstart

## Key links

- Website: https://argonlabs.tech
- Source: https://github.com/argon-lab/argon
- Release setup guide: ${product.guide}
- Agent adapters: https://github.com/argon-lab/argon-agents
- Reproducible benchmarks: https://github.com/argon-lab/benchmarks
- Features and limits: https://argonlabs.tech/features#capabilities
- Agent setup: https://argonlabs.tech/agents
- Live sample-data demo: ${product.demo}
- Two-agent example: ${product.example}
`;
  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
