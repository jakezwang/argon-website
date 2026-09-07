"use client";

// The homepage's ten-second pitch: an auto-looping scene that shows the
// whole product — an agent gets a disposable branch, wrecks it, and one
// command puts everything back. Graph, command, and data move together.

import { useEffect, useState } from "react";
import GitGraph, { FlowGraph } from "./GitGraph";

const heroGraph: FlowGraph = {
  width: 520,
  height: 100,
  lanes: [
    { name: "prod", y: 26 },
    { name: "agent", y: 72 },
  ],
  nodes: [
    { id: "m0", x: 70, y: 26, lane: 0, appearAt: 0 },
    { id: "s0", x: 200, y: 72, lane: 1, sub: "branch", appearAt: 0 },
    { id: "s1", x: 340, y: 72, lane: 1, sub: "agent's work", appearAt: 1 },
    { id: "m1", x: 470, y: 26, lane: 0, sub: "merged", appearAt: 3 },
  ],
  edges: [
    { from: "m0", to: "s0", appearAt: 0 },
    { from: "s0", to: "s1", appearAt: 1 },
    { from: "m0", to: "m1", appearAt: 3 },
    { from: "s1", to: "m1", appearAt: 3, curve: "target" },
  ],
  steps: [
    { head: "s0", caption: "" },
    { head: "s1", caption: "" },
    { head: "s1", caption: "" },
    { head: "m1", caption: "" },
  ],
};

const scenes = [
  {
    cmd: "argon sandbox create -p orders --name planner --ttl 1h",
    note: "a local sandbox; run watch for CLI capture and schedule sweep for expiry",
    state: "base",
  },
  {
    cmd: "argon watch -p orders -b planner --actor agent:planner",
    note: "native writes share this branch actor; keep capture running",
    state: "proposed",
  },
  {
    cmd: "argon merge preview -p orders -b planner",
    note: "review the diff and conflicts; preview returns the plan ID",
    state: "proposed",
  },
  {
    cmd: "argon merge apply <plan-id>",
    note: "replace <plan-id> with the reviewed plan; this changes its target",
    state: "merged",
  },
] as const;

const docData = [{ id: "order-1", base: "price: 49", after: "price: 44" }];

const SCENE_MS = 2800;

export default function HeroDemo() {
  const [scene, setScene] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      if (
        !paused &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        setScene((s) => (s + 1) % scenes.length);
    }, SCENE_MS);
    return () => clearInterval(t);
  }, [paused]);

  const s = scenes[scene];
  const state = s.state; // 'base' | 'proposed' | 'merged'
  const showAfter = state !== "base";
  const chipClass =
    state === "merged"
      ? "border-emerald-400/40 text-emerald-400"
      : state === "proposed"
        ? "border-amber-400/40 text-amber-400"
        : "border-brand-edge text-brand-text-darker";
  const badge =
    state === "merged"
      ? "merged to prod"
      : state === "proposed"
        ? "branch: agent's work"
        : "branch: isolated";

  return (
    <div className="border border-brand-edge bg-brand-surface">
      <div className="flex items-center justify-between border-b border-brand-edge px-4 py-2">
        <p className="font-mono text-sm text-brand-muted">
          local workflow · illustrated
        </p>
        <button
          className="text-xs text-brand-primary"
          onClick={() => setPaused(!paused)}
        >
          {paused ? "Play" : "Pause"}
        </button>
        <div className="flex items-center gap-1.5">
          {scenes.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i === scene ? "bg-brand-primary" : "bg-brand-edge"
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
      <div className="border-b border-brand-edge px-4 py-3 font-mono text-sm break-words">
        <p className="text-brand-text">
          <span className="select-none text-brand-muted">$ </span>
          {s.cmd}
        </p>
        <p className="mt-1 text-sm text-brand-muted">{s.note}</p>
      </div>

      {/* documents */}
      <div className="flex flex-wrap gap-2 px-4 py-3">
        {docData.map((d) => (
          <span
            key={d.id}
            className={`border px-2.5 py-1 font-mono text-xs transition-colors duration-500 ${chipClass}`}
          >
            {d.id} · {showAfter ? d.after : d.base}
          </span>
        ))}
        <span className="ml-auto self-center font-mono text-[10px] uppercase tracking-widest text-brand-muted">
          {badge}
        </span>
      </div>
    </div>
  );
}
