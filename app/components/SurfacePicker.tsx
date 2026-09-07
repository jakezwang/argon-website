"use client";

// The four surfaces aren't a sequence — they're parallel ways into the same
// engine. So this is a picker, not a stepped player: choose the surface that
// matches your integration point and see the setup command plus a real
// "what you send → what you get back" for it.

import { useState } from "react";
import { product } from "../product";

interface Exchange {
  sendLabel: string;
  send: string[];
  recvLabel: string;
  recv: { text: string; kind?: "key" | "val" | "comment" }[];
}

interface Surface {
  key: string;
  tab: string;
  who: string;
  title: string;
  setupLabel: string;
  setup: string;
  blurb: string;
  exchange: Exchange;
  footnote?: string;
}

const surfaces: Surface[] = [
  {
    key: "mcp",
    tab: "MCP server",
    who: "Claude Code · Cursor · any MCP client",
    title: "Agents drive the whole loop themselves",
    setupLabel: "register once",
    setup: "claude mcp add argon -- argon mcp",
    blurb:
      "Exposes the workflow as 13 tools over stdio. The agent opens its own branch, works, diffs, and merges — and the server runs a change-stream capture ingester per sandbox, while the service runs; check capture health and image completeness.",
    exchange: {
      sendLabel: "the agent calls a tool",
      send: [
        "{",
        '  "method": "tools/call",',
        '  "params": {',
        '    "name": "argon_sandbox_create",',
        '    "arguments": { "project": "prod", "ttl_minutes": 60 }',
        "  }",
        "}",
      ],
      recvLabel: "it gets a real database back",
      recv: [
        { text: "{" },
        { text: '  "branch":', kind: "key" },
        { text: '  "sandbox-9f2c1a",', kind: "val" },
        {
          text: '  "connection_string": "mongodb://…/argon_br_9f2c1a",',
          kind: "val",
        },
        { text: '  "expires_in": "1h"', kind: "val" },
        { text: "}" },
      ],
    },
    footnote:
      "MCP returns text content with the branch name, connection string and expiry. This abbreviated response illustrates the fields; see the tool reference for the exact schema.",
  },
  {
    key: "rest",
    tab: "REST API",
    who: "language SDKs · services · any HTTP client",
    title: "The same workflow over HTTP",
    setupLabel: "start the control plane",
    setup: "argon console --no-browser  # 127.0.0.1:1818",
    blurb:
      "Every operation the CLI does is a REST endpoint, so any language can drive Argon without a native SDK. The official Python and Go SDKs are thin clients over this.",
    exchange: {
      sendLabel: "POST a sandbox",
      send: [
        "curl -X POST localhost:1818/api/v1/projects/prod/sandboxes \\",
        "  -H 'Content-Type: application/json' \\",
        "  -d '{ \"ttl_minutes\": 60 }'",
      ],
      recvLabel: "201 Created",
      recv: [
        { text: "{" },
        { text: '  "branch": "sandbox-9f2c1a",', kind: "val" },
        {
          text: '  "connection_string": "mongodb://…/argon_br_9f2c1a",',
          kind: "val",
        },
        { text: '  "expires_at": "2026-07-07T18:00Z"', kind: "val" },
        { text: "}" },
      ],
    },
    footnote:
      "see the REST reference for /api/v1/projects/:p/branches, merge-plans, undo and pins",
  },
  {
    key: "proxy",
    tab: "Wire proxy",
    who: "existing apps · stable connection strings",
    title: "Switch branches without changing config",
    setupLabel: "run the proxy",
    setup: "argon proxy      # mongodb://localhost:27018",
    blurb:
      "Point your app at the proxy once. The database alias selects the project and branch — no checkout/release dance, no connection string churn in your config. The alias survives across checkout cycles.",
    exchange: {
      sendLabel: "your app connects",
      send: [
        'mongosh "mongodb://localhost:27018/prod~feature-x?directConnection=true"',
      ],
      recvLabel: "routed to the branch database",
      recv: [
        { text: "→ argon_br_9f2c1a  (branch: feature-x)", kind: "val" },
        { text: "" },
        { text: "select the project~branch database alias", kind: "comment" },
        { text: "the app config never changes", kind: "comment" },
      ],
    },
    footnote: "a read-your-writes barrier for the proxy is on the roadmap",
  },
  {
    key: "sdk",
    tab: "argon-agents",
    who: "Python · LangGraph · Mem0",
    title: "Review external business data",
    setupLabel: "install",
    setup: `pip install "argon-agents[langgraph] @ git+https://github.com/argon-lab/argon-agents.git@v${product.sdkVersion}"`,
    blurb: `The same-pin order example uses PyMongo to compare planner and executor proposals, inspect a conflict and verify undo. Install SDK ${product.sdkVersion} from its release tag and run the matching example below.`,
    exchange: {
      sendLabel: "run the reviewed source example",
      send: [
        `git clone --branch v${product.sdkVersion} https://github.com/argon-lab/argon-agents.git`,
        "cd argon-agents",
        "pip install -e .",
        "ARGON_API_URL=http://127.0.0.1:1818 python examples/two_agent_review.py",
      ],
      recvLabel: "asserted outcomes",
      recv: [
        { text: "same pin → identical $49 input", kind: "val" },
        { text: "planner $44 adopted; executor $1 conflicts", kind: "val" },
        { text: "undo restores $49", kind: "val" },
      ],
    },
    footnote:
      "also ships a Mem0 factory and create_pin / sandbox_from_pin for eval harnesses",
  },
];

const recvColor = {
  key: "text-brand-primary",
  val: "text-brand-text-darker",
  comment: "text-brand-muted",
  default: "text-brand-text-darker",
};

export default function SurfacePicker() {
  const [active, setActive] = useState(0);
  const s = surfaces[active];

  return (
    <div>
      {/* surface selector */}
      <div className="grid grid-cols-2 gap-px border border-brand-edge bg-brand-edge sm:grid-cols-4">
        {surfaces.map((surf, i) => (
          <button
            key={surf.key}
            onClick={() => setActive(i)}
            className={`px-4 py-3 text-left transition-colors ${
              i === active
                ? "bg-brand-surface"
                : "bg-brand-dark hover:bg-brand-surface/50"
            }`}
          >
            <p
              className={`font-mono text-sm ${
                i === active ? "text-brand-primary" : "text-brand-text"
              }`}
            >
              {surf.tab}
            </p>
            <p className="mt-1 text-xs leading-5 text-brand-muted">
              {surf.who}
            </p>
          </button>
        ))}
      </div>

      {/* detail */}
      <div className="mt-4 border border-brand-edge bg-brand-surface">
        <div className="border-b border-brand-edge px-5 py-4">
          <h3 className="font-medium text-brand-text">{s.title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-text-darker">
            {s.blurb}
          </p>
          <div className="mt-4">
            <p className="mb-1.5 font-mono text-[11px] uppercase tracking-wider text-brand-muted">
              {s.setupLabel}
            </p>
            <pre className="overflow-x-auto border border-brand-edge bg-brand-dark px-3 py-2.5 font-mono text-[13px] text-brand-primary">
              <code>
                <span className="select-none text-brand-muted">$ </span>
                {s.setup}
              </code>
            </pre>
          </div>
        </div>

        {/* send → receive */}
        <div className="grid gap-px bg-brand-edge lg:grid-cols-2">
          <div className="bg-brand-surface p-5">
            <p className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-brand-muted">
              <span className="status-dot bg-brand-primary" />
              {s.exchange.sendLabel}
            </p>
            <pre className="overflow-x-auto font-mono text-[12.5px] leading-6 text-brand-text">
              <code>{s.exchange.send.join("\n")}</code>
            </pre>
          </div>
          <div className="bg-brand-surface p-5">
            <p className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-brand-muted">
              <span className="status-dot bg-emerald-400" />
              {s.exchange.recvLabel}
            </p>
            <pre className="overflow-x-auto font-mono text-[12.5px] leading-6">
              <code>
                {s.exchange.recv.map((line, i) => (
                  <span
                    key={i}
                    className={`block ${recvColor[line.kind ?? "default"]}`}
                  >
                    {line.text || " "}
                  </span>
                ))}
              </code>
            </pre>
          </div>
        </div>

        {s.footnote && (
          <p className="border-t border-brand-edge px-5 py-3 font-mono text-xs leading-5 text-brand-muted">
            {s.footnote}
          </p>
        )}
      </div>
    </div>
  );
}
