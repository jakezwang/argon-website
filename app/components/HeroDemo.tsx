'use client';

// The homepage's ten-second pitch: an auto-looping scene that shows the
// whole product — an agent gets a disposable branch, wrecks it, and one
// command puts everything back. Graph, command, and data move together.

import { useEffect, useRef, useState } from 'react';
import GitGraph, { FlowGraph } from './GitGraph';

const heroGraph: FlowGraph = {
  width: 520,
  height: 100,
  lanes: [
    { name: 'prod', y: 26 },
    { name: 'agent', y: 72 },
  ],
  nodes: [
    { id: 'm0', x: 70, y: 26, lane: 0, appearAt: 0 },
    { id: 's0', x: 190, y: 72, lane: 1, sub: 'fork', appearAt: 0 },
    { id: 's1', x: 330, y: 72, lane: 1, sub: '+3,214 writes', appearAt: 1 },
    { id: 's2', x: 460, y: 72, lane: 1, sub: 'undo', appearAt: 2 },
  ],
  edges: [
    { from: 'm0', to: 's0', appearAt: 0 },
    { from: 's0', to: 's1', appearAt: 1 },
    { from: 's1', to: 's2', appearAt: 2 },
  ],
  steps: [
    { head: 's0', caption: '' },
    { head: 's1', caption: '' },
    { head: 's2', caption: '' },
    { head: 's2', caption: '' },
  ],
};

const scenes = [
  {
    cmd: 'argon sandbox create -p prod --ttl 1h',
    note: 'the agent gets a real MongoDB database — prod is never touched',
    docs: 'clean',
  },
  {
    cmd: 'python agent.py --db mongodb://…/argon_br_f81a',
    note: 'it wrecks the data — every write attributed to agent:price-fixer',
    docs: 'wrecked',
  },
  {
    cmd: 'argon undo --actor agent:price-fixer',
    note: 'one command reverts the entire session',
    docs: 'wrecked',
  },
  {
    cmd: '✓ 3,214 writes reverted · 0 conflicts',
    note: 'back to the fork state — the undo itself is auditable history',
    docs: 'clean',
  },
] as const;

const docData = [
  { id: 'p1', clean: 'price: 49', wrecked: 'price: 0' },
  { id: 'p2', clean: 'price: 89', wrecked: 'price: 0' },
  { id: 'p3', clean: 'price: 74', wrecked: 'price: 0' },
];

const SCENE_MS = 2800;

export default function HeroDemo() {
  const [scene, setScene] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    const t = setInterval(() => {
      if (!paused.current) setScene((s) => (s + 1) % scenes.length);
    }, SCENE_MS);
    return () => clearInterval(t);
  }, []);

  const s = scenes[scene];
  const wrecked = s.docs === 'wrecked';

  return (
    <div
      className="border border-brand-edge bg-brand-surface"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div className="flex items-center justify-between border-b border-brand-edge px-4 py-2">
        <p className="font-mono text-xs text-brand-muted">the whole idea, in one loop</p>
        <div className="flex items-center gap-1.5">
          {scenes.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i === scene ? 'bg-brand-primary' : 'bg-brand-edge'
              }`}
            />
          ))}
        </div>
      </div>

      {/* history graph */}
      <div className="border-b border-brand-edge px-4 pt-3">
        <GitGraph graph={heroGraph} step={scene} />
      </div>

      {/* command */}
      <div className="border-b border-brand-edge px-4 py-3 font-mono text-[13px]">
        <p className={scene === 3 ? 'text-emerald-400' : 'text-brand-text'}>
          {scene !== 3 && <span className="select-none text-brand-muted">$ </span>}
          {s.cmd}
        </p>
        <p className="mt-1 text-xs text-brand-muted">{s.note}</p>
      </div>

      {/* documents */}
      <div className="flex flex-wrap gap-2 px-4 py-3">
        {docData.map((d) => (
          <span
            key={d.id}
            className={`border px-2.5 py-1 font-mono text-xs transition-colors duration-500 ${
              wrecked
                ? 'border-red-400/40 text-red-400'
                : 'border-brand-edge text-brand-text-darker'
            }`}
          >
            {d.id} · {wrecked ? d.wrecked : d.clean}
          </span>
        ))}
        <span className="ml-auto self-center font-mono text-[10px] uppercase tracking-widest text-brand-muted">
          {wrecked ? 'sandbox: damaged' : 'sandbox: clean'}
        </span>
      </div>
    </div>
  );
}
