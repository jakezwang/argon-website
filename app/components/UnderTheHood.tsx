"use client";

import { useId, useState, type ReactNode } from "react";
import { product } from "../product";

// A guided picture of the engine, told with the same order the review example
// uses: order-1 at $49, the planner proposes $44, the executor $1. Every claim
// here comes from docs/ARCHITECTURE.md in the engine repository; keep it to
// what that document already publishes.

type Part = "code" | "db" | "log" | "plan" | "main";

const parts: { id: Part; name: string; note: string }[] = [
  { id: "code", name: "Your code", note: "driver · mongosh · agent" },
  { id: "db", name: "Branch database", note: "a real MongoDB database" },
  { id: "log", name: "Argon log", note: "every change, in order" },
  { id: "plan", name: "Merge plan", note: "computed, then reviewed" },
  { id: "main", name: "main", note: "changes only when applied" },
];
const links = ["writes", "change stream", "diff", "apply once"];

const scenes: {
  tab: string;
  title: string;
  lit: Part[];
  body: string;
  visual: () => ReactNode;
}[] = [
  {
    tab: "Writes",
    title: "Your code writes to a real MongoDB database",
    lit: ["code", "db", "log"],
    body: "argon checkout builds an ordinary database for the branch. MongoDB evaluates every filter, update operator and index, exactly as it would without Argon. Argon then reads what happened from the change stream, so it never has to imitate MongoDB.",
    visual: WriteScene,
  },
  {
    tab: "Records",
    title: "The log keeps the result, not the command",
    lit: ["log"],
    body: "Each entry holds the whole document after the change, and the document before it when there was one. The update operator is resolved once, by MongoDB, and never replayed. Replaying the log to any position therefore gives the same data every time; time travel, diff, restore and undo are all built on that.",
    visual: RecordScene,
  },
  {
    tab: "Branches",
    title: "A branch is a pointer into the log, not a copy",
    lit: ["log"],
    body: "Creating a branch writes one small record: where it forked and its newest entry. No documents are copied. A branch's data is the history up to its fork point plus its own entries, so sibling branches never see each other's writes. Collection snapshots let a rebuild start near the end instead of at the beginning.",
    visual: BranchScene,
  },
  {
    tab: "Merges",
    title: "A merge is a plan you review before anything changes",
    lit: ["plan", "main", "log"],
    body: "For each document the branch touched, Argon compares three versions: at the fork, on the target now, and on the branch now. The plan is saved for review and applies once, only against the exact data it was computed for. Undo appends new entries, so the history of what happened is kept.",
    visual: MergeScene,
  },
];

export default function UnderTheHood() {
  const [active, setActive] = useState(0);
  const base = useId();
  const scene = scenes[active];
  const Visual = scene.visual;

  return (
    <section id="under-the-hood" className="mt-24 scroll-mt-24">
      <h2 className="section-title max-w-3xl">How it works under the hood</h2>
      <p className="lede mt-5 max-w-2xl">
        Argon sits beside MongoDB. It records each change as a document in an
        ordered log and builds every branch from that log. Follow one write
        through the system.
      </p>

      <div className="panel mt-10 overflow-hidden">
        <Overview lit={scene.lit} />

        <div
          role="tablist"
          aria-label="Parts of the system"
          className="grid grid-cols-4 gap-1 border-y border-brand-edge bg-brand-sunken px-2 py-2 sm:flex sm:px-3"
        >
          {scenes.map((s, i) => (
            <button
              key={s.tab}
              id={`${base}-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={i === active}
              aria-controls={`${base}-panel`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                const step =
                  e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
                if (!step) return;
                e.preventDefault();
                const next = (active + step + scenes.length) % scenes.length;
                setActive(next);
                document.getElementById(`${base}-tab-${next}`)?.focus();
              }}
              className={`rounded-(--radius-control) px-1 py-2 text-sm sm:shrink-0 sm:px-4 font-medium transition-colors ${
                i === active
                  ? "bg-brand-surface text-brand-text shadow-sm ring-1 ring-brand-edge"
                  : "text-brand-muted hover:text-brand-text"
              }`}
            >
              {s.tab}
            </button>
          ))}
        </div>

        <div
          id={`${base}-panel`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${active}`}
          className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12"
        >
          <div key={`text-${active}`} className="uth-in">
            <h3 className="text-xl font-semibold leading-snug text-brand-text">
              {scene.title}
            </h3>
            <p className="mt-3 leading-7">{scene.body}</p>
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                className="btn-quiet min-h-10 px-4 py-2 text-sm"
                onClick={() => setActive(Math.max(0, active - 1))}
                disabled={active === 0}
              >
                Previous
              </button>
              <button
                type="button"
                className="btn-quiet min-h-10 px-4 py-2 text-sm"
                onClick={() =>
                  setActive(active === scenes.length - 1 ? 0 : active + 1)
                }
              >
                {active === scenes.length - 1 ? "Start over" : "Next"}
              </button>
            </div>
          </div>
          <div key={`visual-${active}`} className="uth-in min-w-0">
            <Visual />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 text-sm leading-7 sm:flex-row sm:items-start sm:justify-between">
        <p className="max-w-3xl">
          Argon keeps its log in MongoDB too. It needs MongoDB 6 or later as a
          replica set (a single-node set works locally) with pre- and
          post-images enabled; <code className="font-mono">argon doctor</code>{" "}
          checks this before you start.
        </p>
        <a href={product.architecture} className="prose-link shrink-0">
          Read the full architecture
        </a>
      </div>
    </section>
  );
}

// The five parts of the system in one strip. The parts the current scene is
// about light up; the others stay quiet.
function Overview({ lit }: { lit: Part[] }) {
  return (
    <ol
      aria-label="How a change moves through Argon"
      className="flex flex-wrap items-center gap-x-1 gap-y-2 p-4 sm:p-6 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-stretch lg:gap-0"
    >
      {parts.map((p, i) => {
        const on = lit.includes(p.id);
        const linkOn = i < links.length && on && lit.includes(parts[i + 1].id);
        return (
          <li key={p.id} className="contents">
            <div
              className={`rounded-(--radius-control) border px-2.5 py-1.5 transition-all lg:px-3 lg:py-2.5 duration-300 ${
                on
                  ? "border-brand-primary bg-brand-surface text-brand-text shadow-(--shadow-panel)"
                  : "border-brand-edge bg-brand-sunken/60 text-brand-muted"
              }`}
            >
              <div
                className={`text-sm font-semibold ${p.id === "main" ? "font-mono" : ""}`}
              >
                {p.name}
              </div>
              <div className="hidden text-xs leading-5 text-brand-muted lg:block">
                {p.note}
              </div>
            </div>
            {i < links.length && (
              <div
                aria-hidden="true"
                className={`flex items-center text-xs transition-colors lg:flex-col lg:justify-center lg:gap-0.5 lg:px-2 ${
                  linkOn ? "text-brand-primary" : "text-brand-control"
                }`}
              >
                <span>→</span>
                <span className="hidden whitespace-nowrap lg:inline">
                  {links[i]}
                </span>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Card({
  label,
  tone = "plain",
  children,
}: {
  label: ReactNode;
  tone?: "plain" | "faded" | "lit";
  children: ReactNode;
}) {
  const border =
    tone === "lit"
      ? "border-brand-primary"
      : tone === "faded"
        ? "border-dashed border-brand-edge-strong opacity-70"
        : "border-brand-edge";
  return (
    <div
      className={`rounded-(--radius-control) border bg-brand-surface ${border}`}
    >
      <div className="border-b border-inherit px-3 py-2 text-xs font-medium text-brand-muted">
        {label}
      </div>
      <div className="px-3 py-3 font-mono text-[0.8125rem] leading-6 text-brand-text">
        {children}
      </div>
    </div>
  );
}

function Arrow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-1.5 pl-5 text-xs text-brand-muted">
      <svg width="10" height="26" viewBox="0 0 10 26" aria-hidden="true">
        <path
          d="M5 0 V22 M1 18 L5 24 L9 18"
          fill="none"
          stroke="var(--color-brand-primary)"
          strokeWidth="1.5"
        />
      </svg>
      {label}
    </div>
  );
}

const Old = ({ children }: { children: ReactNode }) => (
  <span className="text-brand-removed">{children}</span>
);
const New = ({ children }: { children: ReactNode }) => (
  <span className="rounded bg-brand-added/12 px-1 text-brand-added">
    {children}
  </span>
);

function WriteScene() {
  return (
    <div>
      <Card label="Your code · any MongoDB driver">
        orders.update_one(
        <br />
        &nbsp;&nbsp;{'{"_id": "order-1"}'},
        <br />
        &nbsp;&nbsp;{'{"$set": {"price": 44}})'}
      </Card>
      <Arrow label="an ordinary write; MongoDB does the work" />
      <Card
        label="Branch database planner · built by argon checkout"
        tone="lit"
      >
        {"{ _id: "}&quot;order-1&quot;{", price: "}
        <New>44</New>
        {" }"}
      </Card>
      <Arrow label="Argon reads the change stream" />
      <Card label="Argon log · new entry">
        lsn 42 · planner · put orders/order-1
      </Card>
    </div>
  );
}

function RecordScene() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <Card label="Not stored: the command" tone="faded">
          <span className="text-brand-muted line-through decoration-brand-removed">
            {'{"$set": {"price": 44}}'}
          </span>
          <div className="mt-2 font-sans text-xs leading-5 text-brand-muted">
            Re-running a command depends on the data it runs against.
          </div>
        </Card>
        <Card label="Stored: the outcome" tone="lit">
          <dl className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-2">
            <dt className="text-brand-muted">lsn</dt>
            <dd>42</dd>
            <dt className="text-brand-muted">branch</dt>
            <dd>planner</dd>
            <dt className="text-brand-muted">before</dt>
            <dd className="break-words">
              {"{ price: "}
              <Old>49</Old>
              {" }"}
            </dd>
            <dt className="text-brand-muted">after</dt>
            <dd className="break-words">
              {"{ price: "}
              <New>44</New>
              {" }"}
            </dd>
          </dl>
        </Card>
      </div>
      <div className="rounded-(--radius-control) border border-brand-edge bg-brand-sunken px-4 py-4">
        <div className="text-xs font-medium text-brand-muted">
          Replay the log up to lsn 42, as often as you like
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="uth-pop rounded-(--radius-control) border border-brand-edge bg-brand-surface px-2 py-2 text-center"
              style={{ animationDelay: `${n * 140}ms` }}
            >
              <div className="text-xs text-brand-muted">replay {n}</div>
              <div className="mt-1 font-mono text-sm text-brand-text">
                price <New>44</New>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-brand-added">
          ✓ Same history, same data: byte for byte
        </div>
      </div>
    </div>
  );
}

// The history picture: main, then two branches forked from the same pinned
// entry. Each label points at the branch's newest entry.
function BranchScene() {
  const lanes = [
    { name: "main", y: 44, color: "var(--color-brand-primary)" },
    { name: "planner", y: 120, color: "var(--color-brand-added)" },
    { name: "executor", y: 196, color: "var(--color-brand-pending)" },
  ];
  const dot = (x: number, y: number, color: string, label: string) => (
    <g key={`${x}-${y}`}>
      <circle
        cx={x}
        cy={y}
        r={9}
        fill="var(--color-brand-surface)"
        stroke={color}
        strokeWidth={2.5}
      />
      <text
        x={x}
        y={y + 27}
        textAnchor="middle"
        fontSize={15}
        fill="var(--color-brand-muted)"
        fontFamily="var(--font-mono), monospace"
      >
        {label}
      </text>
    </g>
  );
  const flag = (x: number, y: number, color: string, name: string) => (
    <g key={name}>
      <rect
        x={x}
        y={y - 13}
        width={name.length * 9.2 + 18}
        height={26}
        rx={6}
        fill="var(--color-brand-surface)"
        stroke={color}
        strokeWidth={1.5}
      />
      <text
        x={x + 9}
        y={y + 4.5}
        fontSize={15}
        fill="var(--color-brand-text)"
        fontFamily="var(--font-mono), monospace"
      >
        {name}
      </text>
    </g>
  );
  const fork = (y: number, color: string) => (
    <path
      d={`M 238 44 C 268 44, 262 ${y}, 300 ${y} L 330 ${y}`}
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      className="draw-line"
      pathLength={1}
    />
  );

  return (
    <div>
      <svg
        viewBox="30 0 458 250"
        width="100%"
        role="img"
        aria-label="main has entries 38, 40 and 41, with a snapshot at 40 and a pin at 41. planner and executor both fork at 41; planner has entry 42 and executor entry 43."
        className="block"
      >
        {/* snapshot: rebuilds start here instead of at the first entry */}
        <rect
          x={98}
          y={14}
          width={102}
          height={60}
          rx={8}
          fill="var(--color-brand-sunken)"
          stroke="var(--color-brand-edge-strong)"
          strokeDasharray="4 4"
        />
        <text
          x={149}
          y={9}
          textAnchor="middle"
          fontSize={14}
          fill="var(--color-brand-muted)"
        >
          snapshot
        </text>
        <line
          x1={40}
          y1={44}
          x2={250}
          y2={44}
          stroke={lanes[0].color}
          strokeWidth={2.5}
        />
        {fork(120, lanes[1].color)}
        {fork(196, lanes[2].color)}
        {dot(60, 44, lanes[0].color, "38")}
        {dot(150, 44, lanes[0].color, "40")}
        {dot(238, 44, lanes[0].color, "41")}
        <text
          x={238}
          y={18}
          textAnchor="middle"
          fontSize={14}
          fill="var(--color-brand-muted)"
        >
          pin
        </text>
        {dot(330, 120, lanes[1].color, "42")}
        {dot(330, 196, lanes[2].color, "43")}
        <line
          x1={258}
          y1={44}
          x2={290}
          y2={44}
          stroke="var(--color-brand-edge-strong)"
          strokeWidth={1.5}
        />
        {flag(292, 44, lanes[0].color, "main")}
        <line
          x1={350}
          y1={120}
          x2={384}
          y2={120}
          stroke="var(--color-brand-edge-strong)"
          strokeWidth={1.5}
        />
        {flag(386, 120, lanes[1].color, "planner")}
        <line
          x1={350}
          y1={196}
          x2={384}
          y2={196}
          stroke="var(--color-brand-edge-strong)"
          strokeWidth={1.5}
        />
        {flag(386, 196, lanes[2].color, "executor")}
      </svg>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[
          ["1", "record written to create a branch"],
          ["0", "documents copied"],
          ["2", "entries replayed to rebuild executor"],
        ].map(([value, label]) => (
          <div
            key={label}
            className="flex flex-col-reverse justify-end rounded-(--radius-control) border border-brand-edge bg-brand-sunken px-2 py-3"
          >
            <dt className="mt-1 text-xs leading-4 text-brand-muted">{label}</dt>
            <dd className="font-mono text-2xl font-semibold text-brand-text">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function MergeScene() {
  const plans = [
    {
      name: "planner → main",
      cols: ["49", "49", "44"],
      verdict: "Only the branch changed it: adopt 44",
      tone: "text-brand-added border-brand-added/40 bg-brand-added/10",
    },
    {
      name: "executor → main, after that",
      cols: ["49", "44", "1"],
      verdict: "Both changed it differently: conflict, you choose a side",
      tone: "text-brand-removed border-brand-removed/40 bg-brand-removed/10",
    },
  ];
  return (
    <div className="grid gap-4">
      {plans.map((p, i) => (
        <div
          key={p.name}
          className="uth-pop rounded-(--radius-control) border border-brand-edge bg-brand-surface"
          style={{ animationDelay: `${i * 160}ms` }}
        >
          <div className="flex items-center justify-between border-b border-brand-edge px-3 py-2 text-xs">
            <span className="font-medium text-brand-muted">
              Merge plan · <span className="font-mono">{p.name}</span>
            </span>
            <span className="font-mono text-brand-muted">order-1.price</span>
          </div>
          <div className="grid grid-cols-3 gap-2 px-3 pt-3 text-center">
            {["at the fork", "main now", "branch now"].map((h, j) => (
              <div
                key={h}
                className="rounded-(--radius-control) bg-brand-sunken px-1 py-2"
              >
                <div className="text-xs text-brand-muted">{h}</div>
                <div className="mt-0.5 font-mono text-lg font-semibold text-brand-text">
                  ${p.cols[j]}
                </div>
              </div>
            ))}
          </div>
          <div
            className={`m-3 rounded-(--radius-control) border px-3 py-2 text-sm font-medium ${p.tone}`}
          >
            {p.verdict}
          </div>
        </div>
      ))}
      <div className="rounded-(--radius-control) border border-brand-edge bg-brand-sunken px-3 py-3 font-mono text-[0.8125rem] leading-6 text-brand-text">
        <div>
          <span className="text-brand-muted">lsn 44</span> main · merge planner
          · price <New>44</New>
        </div>
        <div>
          <span className="text-brand-muted">lsn 45</span> main · undo merge ·
          price <New>49</New>
        </div>
        <div className="mt-1 font-sans text-xs text-brand-muted">
          Undo is a new entry. The merge it reverses stays in the history.
        </div>
      </div>
    </div>
  );
}
