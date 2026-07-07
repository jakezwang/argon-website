'use client';

// The four surfaces aren't a sequence — they're parallel ways into the same
// engine. So this is a picker, not a stepped player: choose the surface that
// matches your integration point and see the setup command plus a real
// "what you send → what you get back" for it.

import { useState } from 'react';

interface Exchange {
  sendLabel: string;
  send: string[];
  recvLabel: string;
  recv: { text: string; kind?: 'key' | 'val' | 'comment' }[];
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
    key: 'mcp',
    tab: 'MCP server',
    who: 'Claude Code · Cursor · any MCP client',
    title: 'Agents drive the whole loop themselves',
    setupLabel: 'register once',
    setup: 'claude mcp add argon -- argon mcp',
    blurb:
      'Exposes the workflow as 13 tools over stdio. The agent opens its own branch, works, diffs, and merges — and the server runs a change-stream capture ingester per sandbox, so every write becomes versioned history with no babysitting.',
    exchange: {
      sendLabel: 'the agent calls a tool',
      send: [
        '{',
        '  "method": "tools/call",',
        '  "params": {',
        '    "name": "argon_sandbox_create",',
        '    "arguments": { "project": "prod", "ttl": "1h" }',
        '  }',
        '}',
      ],
      recvLabel: 'it gets a real database back',
      recv: [
        { text: '{' },
        { text: '  "branch":', kind: 'key' },
        { text: '  "sandbox-9f2c1a",', kind: 'val' },
        { text: '  "uri": "mongodb://…/argon_br_9f2c1a",', kind: 'val' },
        { text: '  "expires_in": "1h"', kind: 'val' },
        { text: '}' },
      ],
    },
    footnote:
      'other tools: argon_diff · argon_merge_preview / _apply · argon_undo · argon_pin_create · argon_sandbox_from_pin · argon_snapshot_create',
  },
  {
    key: 'rest',
    tab: 'REST API',
    who: 'language SDKs · services · any HTTP client',
    title: 'The same workflow over HTTP',
    setupLabel: 'start the control plane',
    setup: 'argon api        # listening on :8080',
    blurb:
      'Every operation the CLI does is a REST endpoint, so any language can drive Argon without a native SDK. The official Python and Go SDKs are thin clients over this.',
    exchange: {
      sendLabel: 'POST a sandbox',
      send: [
        'curl -X POST localhost:8080/projects/prod/sandboxes \\',
        "  -d '{ \"ttl\": \"1h\" }\'",
      ],
      recvLabel: '201 Created',
      recv: [
        { text: '{' },
        { text: '  "branch": "sandbox-9f2c1a",', kind: 'val' },
        { text: '  "uri": "mongodb://…/argon_br_9f2c1a",', kind: 'val' },
        { text: '  "expires_at": "2026-07-07T18:00Z"', kind: 'val' },
        { text: '}' },
      ],
    },
    footnote:
      'also: POST /projects/:p/branches · /merge/preview · /merge/apply · /undo · /pins · sandbox-from-pin',
  },
  {
    key: 'proxy',
    tab: 'Wire proxy',
    who: 'existing apps · stable connection strings',
    title: 'Switch branches without changing config',
    setupLabel: 'run the proxy',
    setup: 'argon proxy      # mongodb://localhost:27100',
    blurb:
      'Point your app at the proxy once. Which branch it talks to is a query parameter — no checkout/release dance, no connection string churn in your config. The alias survives across checkout cycles.',
    exchange: {
      sendLabel: 'your app connects',
      send: ['mongosh "mongodb://localhost:27100/?branch=feature-x"'],
      recvLabel: 'routed to the branch database',
      recv: [
        { text: '→ argon_br_9f2c1a  (branch: feature-x)', kind: 'val' },
        { text: '' },
        { text: 'switch branches by changing ?branch=', kind: 'comment' },
        { text: 'the app config never changes', kind: 'comment' },
      ],
    },
    footnote: 'synchronous write capture through the proxy is on the roadmap',
  },
  {
    key: 'sdk',
    tab: 'argon-agents',
    who: 'Python · LangGraph · Mem0',
    title: 'Fork and rewind agent memory',
    setupLabel: 'install',
    setup: 'pip install "argon-agents[langgraph]"',
    blurb:
      'A LangGraph checkpointer whose store is a versioned MongoDB branch — fork a whole conversation at step 14 and try a different path, or pin a dataset so an eval always sees the same input. Published on PyPI (0.1.0); CI runs the real engine stack.',
    exchange: {
      sendLabel: 'wire it into your graph',
      send: [
        'from argon_agents import ArgonCheckpointer',
        '',
        'cp = ArgonCheckpointer(project="chat")',
        'graph = builder.compile(checkpointer=cp)',
      ],
      recvLabel: 'branch the conversation',
      recv: [
        { text: '# explore an alternate path from step 14', kind: 'comment' },
        { text: 'cp.fork(thread_id, at_step=14)', kind: 'val' },
        { text: '' },
        { text: '# …the original thread is untouched', kind: 'comment' },
      ],
    },
    footnote: 'also ships a Mem0 factory and create_pin / sandbox_from_pin for eval harnesses',
  },
];

const recvColor = {
  key: 'text-brand-primary',
  val: 'text-brand-text-darker',
  comment: 'text-brand-muted',
  default: 'text-brand-text-darker',
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
              i === active ? 'bg-brand-surface' : 'bg-brand-dark hover:bg-brand-surface/50'
            }`}
          >
            <p
              className={`font-mono text-sm ${
                i === active ? 'text-brand-primary' : 'text-brand-text'
              }`}
            >
              {surf.tab}
            </p>
            <p className="mt-1 text-xs leading-5 text-brand-muted">{surf.who}</p>
          </button>
        ))}
      </div>

      {/* detail */}
      <div className="mt-4 border border-brand-edge bg-brand-surface">
        <div className="border-b border-brand-edge px-5 py-4">
          <h3 className="font-medium text-brand-text">{s.title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-text-darker">{s.blurb}</p>
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
              <code>{s.exchange.send.join('\n')}</code>
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
                  <span key={i} className={`block ${recvColor[line.kind ?? 'default']}`}>
                    {line.text || ' '}
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
