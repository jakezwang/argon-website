"use client";

// The four surfaces aren't a sequence — they're parallel ways into the same
// engine. So this is a picker, not a stepped player: choose the surface that
// matches your integration point and see the setup command plus a real
// "what you send → what you get back" for it.

import { useState } from "react";
import { product, install } from "../product";

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
    who: "Claude Code, Cursor, any MCP client",
    title: "The agent runs the workflow itself",
    setupLabel: "Register it once",
    setup: install.mcp,
    blurb:
      "Thirteen tools over stdio. Each one declares whether it only reads and whether it can destroy data. The agent opens its own sandbox, does its work and prepares a merge plan. Pass --disable-tools argon_merge_apply if a person should apply it. While the server runs it captures every sandbox it hands out; check capture health before you rely on history.",
    exchange: {
      sendLabel: "The agent calls a tool",
      send: [
        "{",
        '  "method": "tools/call",',
        '  "params": {',
        '    "name": "argon_sandbox_create",',
        '    "arguments": { "project": "prod", "ttl_minutes": 60 }',
        "  }",
        "}",
      ],
      recvLabel: "It gets a real database back",
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
    who: "SDKs, services, any HTTP client",
    title: "The same workflow over HTTP",
    setupLabel: "Start the local API",
    setup: "argon console --no-browser  # 127.0.0.1:1818",
    blurb:
      "Manage projects, sandboxes, history and reviewed merges from any language. HTTP is the control plane only: your MongoDB driver reads and writes the data. The Python client wraps this API.",
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
      "The REST reference lists every endpoint: branches, merge plans, undo and pins.",
  },
  {
    key: "proxy",
    tab: "Wire proxy",
    who: "Existing apps, stable connection strings",
    title: "Switch branches without changing your config",
    setupLabel: "Run the proxy",
    setup: "argon proxy      # mongodb://127.0.0.1:27018",
    blurb:
      "Point your app at the proxy once. The database name in the URI selects the project and branch, so the connection string stays the same when a branch is checked out again. The proxy listens on loopback only unless you pass --allow-remote.",
    exchange: {
      sendLabel: "Your app connects",
      send: [
        'mongosh "mongodb://localhost:27018/prod~feature-x?directConnection=true"',
      ],
      recvLabel: "Routed to the branch database",
      recv: [
        { text: "→ argon_br_9f2c1a  (branch: feature-x)", kind: "val" },
        { text: "" },
        { text: "select the project~branch database alias", kind: "comment" },
        { text: "the app config never changes", kind: "comment" },
      ],
    },
    footnote: "A read-your-writes barrier for the proxy is on the roadmap.",
  },
  {
    key: "sdk",
    tab: "argon-agents",
    who: "Python, LangGraph, Mem0",
    title: "Review an agent run from Python",
    setupLabel: "Install",
    setup: install.langgraph,
    blurb: `The example starts two agents from one pin, writes with PyMongo, compares their proposals, meets a real conflict and verifies undo. Install SDK ${product.sdkVersion} from PyPI and run it below.`,
    exchange: {
      sendLabel: "Run the example",
      send: [
        `git clone --branch v${product.sdkVersion} https://github.com/argon-lab/argon-agents.git`,
        "cd argon-agents",
        install.python,
        "ARGON_API_URL=http://127.0.0.1:1818 python examples/two_agent_review.py",
      ],
      recvLabel: "What it asserts",
      recv: [
        { text: "same pin → identical $49 input", kind: "val" },
        { text: "planner $44 adopted; executor $1 conflicts", kind: "val" },
        { text: "undo restores $49", kind: "val" },
      ],
    },
    footnote:
      "The SDK also has a Mem0 factory, plus create_pin and sandbox_from_pin for eval harnesses.",
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
    <div className="ink ink-panel overflow-hidden">
      {/* surface selector */}
      <div className="grid grid-cols-2 gap-px border-b border-brand-edge bg-brand-edge sm:grid-cols-4">
        {surfaces.map((surf, i) => (
          <button
            key={surf.key}
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className={`relative px-4 py-3.5 text-left transition-colors focus-visible:z-10 focus-visible:-outline-offset-2 ${
              i === active
                ? "bg-brand-surface after:absolute after:inset-x-4 after:bottom-0 after:h-0.5 after:rounded-full after:bg-brand-primary"
                : "bg-brand-bg hover:bg-brand-surface/60"
            }`}
          >
            <p
              className={`text-sm font-semibold ${
                i === active ? "text-brand-text" : "text-brand-text-darker"
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
      <div className="bg-brand-surface">
        <div className="border-b border-brand-edge px-5 py-5 sm:px-6">
          <h3 className="text-lg font-semibold text-brand-text">{s.title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-text-darker">
            {s.blurb}
          </p>
          <div className="mt-4">
            <p className="mb-1.5 text-xs text-brand-muted first-letter:uppercase">
              {s.setupLabel}
            </p>
            <pre className="overflow-x-auto rounded-lg border border-brand-edge bg-brand-bg px-3.5 py-3 font-mono text-[13px] text-brand-primary">
              <code>
                <span className="select-none text-brand-muted">$ </span>
                {s.setup}
              </code>
            </pre>
          </div>
        </div>

        {/* send → receive */}
        <div className="grid gap-px bg-brand-edge lg:grid-cols-2">
          <div className="min-w-0 bg-brand-surface p-5 sm:p-6">
            <p className="mb-2 flex items-center gap-2 text-xs text-brand-muted">
              <span className="status-dot bg-brand-primary" />
              {s.exchange.sendLabel}
            </p>
            <pre className="overflow-x-auto font-mono text-[12.5px] leading-6 text-brand-text">
              <code>{s.exchange.send.join("\n")}</code>
            </pre>
          </div>
          <div className="min-w-0 bg-brand-surface p-5 sm:p-6">
            <p className="mb-2 flex items-center gap-2 text-xs text-brand-muted">
              <span className="status-dot bg-brand-added" />
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
          <p className="border-t border-brand-edge px-5 py-3 text-xs leading-5 text-brand-muted sm:px-6">
            {s.footnote}
          </p>
        )}
      </div>
    </div>
  );
}
