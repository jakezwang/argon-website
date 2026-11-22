"use client";

import { useEffect, useRef, useState } from "react";
import { product } from "../product";

// An interactive system diagram of the engine. Pick a flow and it plays hop
// by hop across the real components; click any component to inspect it.
// Every claim here comes from docs/ARCHITECTURE.md in the engine repository.
// Keep it to what that document already publishes.

// ---------------------------------------------------------------- layout --

const COL_X = [30, 244, 458, 672, 886];
const COL_W = 184;
const ROW_Y = [32, 172, 292, 482, 538];
const ROW_H = [58, 58, 58, 44, 44];
const CH = { below0: 122, below1: 262, below2: 422 } as const;
const VIEW_W = 1100;
const VIEW_H = 612;

type NodeId =
  | "app"
  | "cli"
  | "mcp"
  | "rest"
  | "source"
  | "proxy"
  | "importer"
  | "merge"
  | "writer"
  | "branch"
  | "ingest"
  | "seq"
  | "wal"
  | "mat"
  | "branchdb"
  | "wal_ingest_state"
  | "wal_counters"
  | "wal_log"
  | "wal_snapshots"
  | "wal_pins"
  | "wal_merge_plans"
  | "wal_sources"
  | "wal_branches";

interface NodeDef {
  col: number;
  row: number;
  rows?: number;
  title: string;
  code?: string;
  kind: "client" | "engine" | "store" | "db" | "external";
  about: string;
}

const nodes: Record<NodeId, NodeDef> = {
  app: {
    col: 0,
    row: 0,
    title: "Your app or agent",
    code: "any MongoDB driver",
    kind: "client",
    about:
      "Connects with an ordinary MongoDB connection string. Argon does not parse or re-execute its writes; MongoDB does all of that.",
  },
  cli: {
    col: 1,
    row: 0,
    title: "argon CLI",
    code: "argon",
    kind: "client",
    about:
      "Checkout, diff, merge, undo, time travel, pins and import, for people and scripts.",
  },
  mcp: {
    col: 2,
    row: 0,
    title: "MCP server",
    code: "argon mcp",
    kind: "client",
    about:
      "Gives AI agents tools to create a sandbox, diff, preview and apply a merge, undo or discard. It supervises a change-stream ingester for every sandbox it hands out.",
  },
  rest: {
    col: 3,
    row: 0,
    title: "REST API · SDKs",
    code: "Go · Python",
    kind: "client",
    about:
      "The HTTP surface used by the Go and Python SDKs and the console. Same services as the CLI.",
  },
  source: {
    col: 4,
    row: 0,
    title: "External MongoDB",
    code: "followed source",
    kind: "external",
    about:
      "A live database Argon imports and follows. Online import copies it at one cluster time, then its own change stream keeps main up to date. Reviewed plans can be written back.",
  },
  proxy: {
    col: 0,
    row: 1,
    title: "Wire proxy",
    code: "argon proxy",
    kind: "engine",
    about:
      "Parses OP_MSG frames and rewrites $db from project~branch to the branch's physical database, forwarding everything else byte for byte. It only routes; mongod still evaluates every query.",
  },
  importer: {
    col: 1,
    row: 1,
    title: "Importer · follower",
    code: "importer · source",
    kind: "engine",
    about:
      "Copies a database into put entries, then follows its change stream. A followed branch has exactly one writer: its follower.",
  },
  merge: {
    col: 2,
    row: 1,
    title: "Diff & merge planner",
    code: "three-way plans",
    kind: "engine",
    about:
      "Compares each document three ways: at the fork, on the target now and on the branch now. It reads only documents the branch's own entries touched, so cost follows the change, not the database size.",
  },
  writer: {
    col: 3,
    row: 1,
    title: "Programmatic writer",
    code: "walwriter",
    kind: "engine",
    about:
      "Imports, merges and undos append explicit document states. Pre-images come from point lookups, and puts are batched into contiguous LSN ranges.",
  },
  branch: {
    col: 4,
    row: 1,
    title: "Branch service",
    code: "branch.Service",
    kind: "engine",
    about:
      "A branch is (parent, base_lsn, head_lsn). Creating one is a single metadata write. Writers advance head_lsn with a transactional compare-and-set.",
  },
  ingest: {
    col: 1,
    row: 2,
    title: "Change-stream ingester",
    code: "ingest",
    kind: "engine",
    about:
      "Watches each checked-out database. Turns change events with pre- and post-images into WAL entries and commits the resume token in the same transaction.",
  },
  seq: {
    col: 2,
    row: 2,
    title: "LSN sequencer",
    code: "wal.Sequencer",
    kind: "engine",
    about:
      "Reserves LSNs with an atomic findOneAndUpdate($inc) on a per-project counter, so many Argon processes can write at once. Gaps are allowed; only order matters.",
  },
  wal: {
    col: 3,
    row: 2,
    title: "WAL service",
    code: "wal.Service",
    kind: "engine",
    about:
      "Appends and queries the log. Each entry is one document's outcome, a put with its full image or a delete, plus the image from before.",
  },
  mat: {
    col: 4,
    row: 2,
    title: "Materializer",
    code: "materializer",
    kind: "engine",
    about:
      "Rebuilds any branch at any LSN by replaying its ancestry root first, starting from the newest usable snapshot. Same prefix, same state, byte for byte.",
  },
  branchdb: {
    col: 0,
    row: 3,
    rows: 2,
    title: "Branch databases",
    code: "argon_br_<id>",
    kind: "db",
    about:
      "Real MongoDB databases built by checkout, one per checked-out branch or sandbox. Indexes, queries and transactions are MongoDB's own.",
  },
  wal_ingest_state: {
    col: 1,
    row: 3,
    title: "wal_ingest_state",
    kind: "store",
    about:
      "Each captured branch's change-stream boundary, resume token, actor and last health report.",
  },
  wal_counters: {
    col: 2,
    row: 3,
    title: "wal_counters",
    kind: "store",
    about: "One LSN counter per project.",
  },
  wal_log: {
    col: 3,
    row: 3,
    title: "wal_log",
    kind: "store",
    about:
      "The log: one entry per document change. Indexed by (project, lsn) and by (branch, collection, document, lsn) for point reads.",
  },
  wal_snapshots: {
    col: 4,
    row: 3,
    title: "wal_snapshots",
    kind: "store",
    about:
      "Snapshot manifests. The data lives in content-addressed zstd chunks in MongoDB, S3 or a filesystem, so identical content is stored once.",
  },
  wal_pins: {
    col: 1,
    row: 4,
    title: "wal_pins",
    kind: "store",
    about:
      "Dataset pins: named, immutable branch states for reproducible evals. Pinned history is protected from garbage collection.",
  },
  wal_merge_plans: {
    col: 2,
    row: 4,
    title: "wal_merge_plans",
    kind: "store",
    about: "Merge plans saved for review, and the outcome once applied.",
  },
  wal_sources: {
    col: 3,
    row: 4,
    title: "wal_sources",
    kind: "store",
    about:
      "Which external database a branch follows: database, hosts and replica set. No credentials are stored.",
  },
  wal_branches: {
    col: 4,
    row: 4,
    title: "wal_branches",
    kind: "store",
    about: "Branch pointers, ancestry and discarded ranges.",
  },
};

const box = (id: NodeId) => {
  const n = nodes[id];
  const x = COL_X[n.col];
  const y = ROW_Y[n.row];
  const last = n.row + (n.rows ?? 1) - 1;
  const h = ROW_Y[last] + ROW_H[last] - y;
  return { x, y, w: COL_W, h, cx: x + COL_W / 2, cy: y + h / 2 };
};

// Orthogonal routing through the channels between rows and the gutters
// between columns, so lines never cross a component.
function route(from: NodeId, to: NodeId): string {
  const a = box(from);
  const b = box(to);
  const na = nodes[from];
  const nb = nodes[to];
  const pts: [number, number][] = [];
  const chBelow = (row: number) =>
    row === 0 ? CH.below0 : row === 1 ? CH.below1 : CH.below2;

  if (na.row === nb.row) {
    if (Math.abs(na.col - nb.col) === 1) {
      const ax = na.col < nb.col ? a.x + a.w : a.x;
      const bx = na.col < nb.col ? b.x : b.x + b.w;
      pts.push([ax, a.cy], [bx, b.cy]);
    } else {
      const ch = chBelow(na.row);
      pts.push([a.cx, a.y + a.h], [a.cx, ch], [b.cx, ch], [b.cx, b.y + b.h]);
    }
  } else if (nb.row > na.row) {
    const ch = chBelow(na.row);
    const simple =
      nb.row === na.row + 1 ||
      (na.row === 2 && nb.row === 3) ||
      (na.row === 2 && to === "branchdb") ||
      (na.col === 0 && nb.col === 0);
    if (simple) {
      pts.push([a.cx, a.y + a.h], [a.cx, ch], [b.cx, ch], [b.cx, b.y]);
    } else {
      // Down the gutter beside the target, then in from the side.
      const left = nb.col > 0;
      const g = left ? b.x - 15 : b.x + b.w + 15;
      const ty = Math.min(b.cy, b.y + 22);
      pts.push(
        [a.cx, a.y + a.h],
        [a.cx, ch],
        [g, ch],
        [g, ty],
        [left ? b.x : b.x + b.w, ty],
      );
    }
  } else {
    const ch = chBelow(nb.row);
    pts.push([a.cx, a.y], [a.cx, ch], [b.cx, ch], [b.cx, b.y + b.h]);
  }
  return rounded(pts);
}

function rounded(pts: [number, number][], r = 9): string {
  const clean = pts.filter(
    (p, i) => i === 0 || p[0] !== pts[i - 1][0] || p[1] !== pts[i - 1][1],
  );
  let d = `M ${clean[0][0]} ${clean[0][1]}`;
  for (let i = 1; i < clean.length - 1; i++) {
    const [px, py] = clean[i - 1];
    const [x, y] = clean[i];
    const [nx, ny] = clean[i + 1];
    const d1 = Math.hypot(x - px, y - py);
    const d2 = Math.hypot(nx - x, ny - y);
    const k = Math.min(r, d1 / 2, d2 / 2);
    const sx = x - ((x - px) / d1) * k;
    const sy = y - ((y - py) / d1) * k;
    const ex = x + ((nx - x) / d2) * k;
    const ey = y + ((ny - y) / d2) * k;
    d += ` L ${sx} ${sy} Q ${x} ${y} ${ex} ${ey}`;
  }
  const last = clean[clean.length - 1];
  return d + ` L ${last[0]} ${last[1]}`;
}

// ----------------------------------------------------------------- flows --

type Edge = [NodeId, NodeId];
interface Step {
  edges: Edge[];
  label: string;
  text: string;
}
interface Flow {
  name: string;
  summary: string;
  steps: Step[];
}

const flows: Flow[] = [
  {
    name: "Check out",
    summary: "Turn a branch into a real database you can connect to.",
    steps: [
      {
        edges: [
          ["cli", "branch"],
          ["branch", "wal_branches"],
        ],
        label: "Resolve the branch",
        text: "argon checkout reads the branch's pointers from wal_branches: its parent, fork point (base_lsn) and newest entry (head_lsn).",
      },
      {
        edges: [
          ["branch", "mat"],
          ["mat", "wal_snapshots"],
          ["mat", "wal"],
        ],
        label: "Replay from a snapshot",
        text: "The materializer starts from the newest usable snapshot and asks the WAL service only for entries above it, walking the ancestry root first.",
      },
      {
        edges: [
          ["mat", "branchdb"],
          ["mat", "wal_ingest_state"],
        ],
        label: "Build the database",
        text: "It writes the result into a physical database, argon_br_<id>, builds the branch's recorded secondary indexes, and saves the first change-stream boundary so capture starts exactly there.",
      },
      {
        edges: [
          ["app", "proxy"],
          ["proxy", "branchdb"],
        ],
        label: "Connect",
        text: "Your code connects to project~branch through the wire proxy, or straight to the printed connection string. It is plain MongoDB.",
      },
    ],
  },
  {
    name: "Capture a write",
    summary: "How a normal driver write becomes versioned history.",
    steps: [
      {
        edges: [
          ["app", "proxy"],
          ["proxy", "branchdb"],
        ],
        label: "Write with any driver",
        text: "mongod evaluates the filter, update operators, indexes and transaction. Argon re-implements none of it.",
      },
      {
        edges: [["branchdb", "ingest"]],
        label: "Read the change stream",
        text: "The ingester receives the change event with the document's pre-image and post-image, in mongod's commit order.",
      },
      {
        edges: [
          ["ingest", "seq"],
          ["seq", "wal_counters"],
        ],
        label: "Reserve an LSN",
        text: "The sequencer reserves an LSN range with one atomic $inc on the project counter. Many Argon processes can do this at once.",
      },
      {
        edges: [
          ["ingest", "wal"],
          ["wal", "wal_log"],
          ["ingest", "branch"],
          ["ingest", "wal_ingest_state"],
        ],
        label: "Commit atomically",
        text: "In one transaction the entry lands in wal_log, the branch head advances by compare-and-set, and the resume token is saved. After a crash, capture resumes from the token.",
      },
    ],
  },
  {
    name: "Fork & time travel",
    summary:
      "Why a branch is a metadata write and any point in time is readable.",
    steps: [
      {
        edges: [
          ["mcp", "branch"],
          ["branch", "wal_branches"],
        ],
        label: "Fork a branch",
        text: "A new branch is one document in wal_branches: its parent and base_lsn. No documents are copied, however large the database. A sandbox adds a checkout, which does copy them.",
      },
      {
        edges: [
          ["cli", "branch"],
          ["branch", "wal_pins"],
        ],
        label: "Pin a dataset",
        text: "A pin names an immutable state, so every agent or eval run can fork exactly the same input.",
      },
      {
        edges: [
          ["rest", "mat"],
          ["mat", "wal"],
          ["wal", "wal_log"],
        ],
        label: "Read at any LSN",
        text: "Time travel asks for a branch at any LSN. The materializer replays its ancestry up to that point; sibling branches never appear in the chain.",
      },
      {
        edges: [["mat", "wal_snapshots"]],
        label: "Bound the replay",
        text: "Snapshots keep replay short however long history grows. Their chunks are content-addressed, so unchanged data is stored once.",
      },
    ],
  },
  {
    name: "Review & merge",
    summary: "From a branch's changes to an applied, undoable merge.",
    steps: [
      {
        edges: [
          ["cli", "merge"],
          ["rest", "merge"],
        ],
        label: "Ask for a diff",
        text: "argon diff, or a merge preview from an agent or SDK, starts a three-way comparison for one branch.",
      },
      {
        edges: [
          ["merge", "wal"],
          ["wal", "wal_log"],
        ],
        label: "Compare three ways",
        text: "It reads only documents named by the branch's own entries, then point-reads the fork and target versions through the (branch, collection, document, lsn) index.",
      },
      {
        edges: [["merge", "wal_merge_plans"]],
        label: "Save a plan",
        text: "The plan is saved with the exact heads it was computed for. Conflicts are listed for a person to decide.",
      },
      {
        edges: [
          ["merge", "writer"],
          ["writer", "wal"],
          ["writer", "branchdb"],
        ],
        label: "Apply once",
        text: "walwriter appends the merged documents. A checked-out target is updated in a transaction that checks each document against the previewed before-image.",
      },
      {
        edges: [
          ["writer", "wal"],
          ["wal", "wal_log"],
        ],
        label: "Undo as new history",
        text: "Undo appends compensating entries that carry their own before-images. Nothing that happened is rewritten.",
      },
    ],
  },
  {
    name: "Follow a live DB",
    summary: "Branch a database that is still in production use.",
    steps: [
      {
        edges: [["source", "importer"]],
        label: "Import online",
        text: "argon import database --online copies the database at one cluster time while it keeps taking writes.",
      },
      {
        edges: [
          ["importer", "wal"],
          ["wal", "wal_log"],
          ["importer", "wal_sources"],
        ],
        label: "Follow its stream",
        text: "Source changes become entries on main through the source's own change stream. wal_sources records what main follows, without credentials.",
      },
      {
        edges: [
          ["merge", "writer"],
          ["writer", "source"],
        ],
        label: "Write back",
        text: "merge apply --write-back sends a reviewed plan to the source, comparing each saved before-image byte for byte inside the source transaction.",
      },
    ],
  },
];

const edgeId = ([a, b]: Edge) => `uth-${a}-${b}`;
const allEdges: Edge[] = [];
for (const f of flows)
  for (const s of f.steps)
    for (const e of s.edges)
      if (!allEdges.some((x) => x[0] === e[0] && x[1] === e[1]))
        allEdges.push(e);

// ------------------------------------------------------------- component --

export default function UnderTheHood() {
  const [flow, setFlow] = useState(0);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [picked, setPicked] = useState<NodeId | null>(null);
  const [motion, setMotion] = useState(true);
  const ref = useRef<HTMLElement>(null);
  const touched = useRef(false);

  const current = flows[flow];
  const active = current.steps[step];
  const activeIds = new Set(active.edges.map(edgeId));
  const visited = new Set(
    current.steps.slice(0, step).flatMap((s) => s.edges.map(edgeId)),
  );
  const lit = new Set<NodeId>(active.edges.flat());
  const seen = new Set<NodeId>(
    current.steps.slice(0, step).flatMap((s) => s.edges.flat()),
  );
  const focus: NodeId = picked ?? active.edges[active.edges.length - 1][1];

  // Play once the diagram scrolls into view, unless the reader prefers
  // reduced motion or has already taken control.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    setMotion(!reduce.matches);
    if (reduce.matches || !ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (touched.current) return;
        setPlaying(e.isIntersecting);
      },
      { threshold: 0.35 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      if (step < current.steps.length - 1) setStep(step + 1);
      else {
        setFlow((flow + 1) % flows.length);
        setStep(0);
      }
      setPicked(null);
    }, 4200);
    return () => clearTimeout(t);
  }, [playing, step, flow, current.steps.length]);

  const take = () => {
    touched.current = true;
    setPlaying(false);
  };
  const choose = (i: number) => {
    take();
    setFlow(i);
    setStep(0);
    setPicked(null);
  };
  const go = (k: number) => {
    take();
    setStep(k);
    setPicked(null);
  };
  const pick = (id: NodeId) => {
    take();
    setPicked(id === picked ? null : id);
  };

  return (
    <section ref={ref} id="under-the-hood" className="mt-24 scroll-mt-24">
      <h2 className="section-title max-w-3xl">How it works under the hood</h2>
      <p className="lede mt-5 max-w-2xl">
        Argon is a Go engine beside MongoDB. Your data stays in real MongoDB
        databases; Argon keeps an ordered log of every document change and
        builds branches from it. Pick a flow to watch it move through the
        system, or click any component.
      </p>

      <div className="panel mt-10 overflow-hidden">
        <div
          role="tablist"
          aria-label="Flows through the system"
          className="flex gap-1 overflow-x-auto border-b border-brand-edge bg-brand-sunken px-2 py-2 sm:px-3"
        >
          {flows.map((f, i) => (
            <button
              key={f.name}
              role="tab"
              type="button"
              aria-selected={i === flow}
              onClick={() => choose(i)}
              className={`shrink-0 rounded-(--radius-control) px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
                i === flow
                  ? "bg-brand-surface text-brand-text shadow-sm ring-1 ring-brand-edge"
                  : "text-brand-muted hover:text-brand-text"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 sm:px-6">
          <p className="text-sm text-brand-text-darker">{current.summary}</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                touched.current = true;
                setPlaying(!playing);
              }}
              className="btn-quiet min-h-9 px-3 py-1.5 text-sm"
              aria-pressed={playing}
            >
              {playing ? "Pause" : "Play"}
            </button>
            <button
              type="button"
              onClick={() => go(Math.max(0, step - 1))}
              disabled={step === 0}
              className="btn-quiet min-h-9 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() =>
                step < current.steps.length - 1
                  ? go(step + 1)
                  : choose((flow + 1) % flows.length)
              }
              className="btn-quiet min-h-9 px-3 py-1.5 text-sm"
            >
              {step < current.steps.length - 1 ? "Next step" : "Next flow"}
            </button>
          </div>
        </div>

        <p className="px-5 pt-3 text-xs text-brand-muted md:hidden">
          Swipe sideways to see the whole system.
        </p>
        <div className="overflow-x-auto px-3 pb-2 pt-3 sm:px-4">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="block w-full min-w-[820px]"
            role="group"
            aria-label={`Argon system diagram. ${current.name}, step ${step + 1}: ${active.label}.`}
          >
            <defs>
              <marker
                id="uth-arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M0 1 L9 5 L0 9 z" fill="var(--color-brand-primary)" />
              </marker>
              <marker
                id="uth-arrow-dim"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M0 1 L9 5 L0 9 z" fill="var(--color-brand-control)" />
              </marker>
            </defs>

            <rect
              x={COL_X[1] - 12}
              y={150}
              width={COL_X[4] + COL_W - COL_X[1] + 24}
              height={218}
              rx={14}
              fill="var(--color-brand-sunken)"
              stroke="var(--color-brand-edge)"
            />
            <text
              x={COL_X[1] - 2}
              y={165}
              fontSize={12}
              fontWeight={600}
              fill="var(--color-brand-muted)"
            >
              Argon engine · Go
            </text>
            <rect
              x={18}
              y={448}
              width={VIEW_W - 36}
              height={150}
              rx={14}
              fill="var(--color-brand-sunken)"
              stroke="var(--color-brand-edge)"
            />
            <text
              x={30}
              y={470}
              fontSize={12}
              fontWeight={600}
              fill="var(--color-brand-muted)"
            >
              MongoDB replica set
            </text>
            <text
              x={COL_X[1]}
              y={470}
              fontSize={12}
              fill="var(--color-brand-muted)"
            >
              Argon metadata
            </text>

            {allEdges.map((e) => {
              const id = edgeId(e);
              if (activeIds.has(id)) return null;
              const was = visited.has(id);
              return (
                <path
                  key={id}
                  id={id}
                  d={route(e[0], e[1])}
                  fill="none"
                  stroke={
                    was
                      ? "var(--color-brand-secondary)"
                      : "var(--color-brand-edge-strong)"
                  }
                  strokeWidth={was ? 1.6 : 1.1}
                  strokeDasharray={was ? undefined : "3 4"}
                  opacity={was ? 0.7 : 0.45}
                  markerEnd={was ? "url(#uth-arrow-dim)" : undefined}
                  className="transition-all duration-500"
                />
              );
            })}
            {active.edges.map((e, i) => {
              const id = edgeId(e);
              return (
                <g key={`${flow}-${step}-${id}`}>
                  <path
                    id={id}
                    d={route(e[0], e[1])}
                    fill="none"
                    stroke="var(--color-brand-primary)"
                    strokeWidth={2.4}
                    markerEnd="url(#uth-arrow)"
                    pathLength={1}
                    className={motion ? "draw-line" : undefined}
                  />
                  {motion && (
                    <circle r={4.5} fill="var(--color-brand-primary)">
                      <animateMotion
                        dur="1.6s"
                        begin={`${0.25 + i * 0.35}s`}
                        repeatCount="indefinite"
                        rotate="auto"
                      >
                        <mpath href={`#${id}`} />
                      </animateMotion>
                    </circle>
                  )}
                </g>
              );
            })}

            {(Object.keys(nodes) as NodeId[]).map((id) => (
              <NodeBox
                key={id}
                id={id}
                state={lit.has(id) ? "lit" : seen.has(id) ? "seen" : "idle"}
                selected={focus === id}
                onPick={() => pick(id)}
              />
            ))}
          </svg>
        </div>

        <div className="grid gap-6 border-t border-brand-edge p-5 sm:p-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-10">
          <ol className="grid gap-2">
            {current.steps.map((s, i) => (
              <li key={s.label}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={i === step ? "step" : undefined}
                  className={`flex w-full gap-3 rounded-(--radius-control) border px-3 py-2.5 text-left transition-colors ${
                    i === step
                      ? "border-brand-primary bg-brand-surface"
                      : "border-transparent hover:bg-brand-sunken"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold tabular-nums ${
                      i === step
                        ? "border-brand-primary bg-brand-primary text-brand-on-primary"
                        : i < step
                          ? "border-brand-primary text-brand-primary"
                          : "border-brand-edge-strong text-brand-muted"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block text-sm font-semibold ${
                        i === step
                          ? "text-brand-text"
                          : "text-brand-text-darker"
                      }`}
                    >
                      {s.label}
                    </span>
                    {i === step && (
                      <span className="uth-in mt-1 block text-sm leading-6">
                        {s.text}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <aside
            aria-live="polite"
            className="self-start rounded-(--radius-panel) border border-brand-edge bg-brand-sunken p-4"
          >
            <div className="text-xs font-medium text-brand-muted">
              {picked ? "Component" : "In focus"}
            </div>
            <div key={focus} className="uth-in">
              <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
                <h3
                  className={`text-lg font-semibold text-brand-text ${
                    nodes[focus].kind === "store" ? "font-mono" : ""
                  }`}
                >
                  {nodes[focus].title}
                </h3>
                {nodes[focus].code && (
                  <code className="font-mono text-xs text-brand-muted">
                    {nodes[focus].code}
                  </code>
                )}
              </div>
              <p className="mt-2 text-sm leading-6">{nodes[focus].about}</p>
            </div>
            <p className="mt-3 text-xs text-brand-muted">
              Click any component in the diagram to inspect it.
            </p>
          </aside>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 text-sm leading-7 sm:flex-row sm:items-start sm:justify-between">
        <p className="max-w-3xl">
          Requirements: MongoDB 6 or later as a replica set (a single-node set
          works locally) with pre- and post-images available.{" "}
          <code className="font-mono">argon doctor</code> checks the permissions
          and images before you start.
        </p>
        <a href={product.architecture} className="prose-link shrink-0">
          Read the full architecture
        </a>
      </div>
    </section>
  );
}

function NodeBox({
  id,
  state,
  selected,
  onPick,
}: {
  id: NodeId;
  state: "lit" | "seen" | "idle";
  selected: boolean;
  onPick: () => void;
}) {
  const n = nodes[id];
  const b = box(id);
  const store = n.kind === "store";
  const stroke =
    state === "lit"
      ? "var(--color-brand-primary)"
      : selected
        ? "var(--color-brand-text-darker)"
        : "var(--color-brand-edge-strong)";
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`Inspect ${n.title}${n.code ? `, ${n.code}` : ""}`}
      aria-pressed={selected}
      onClick={onPick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPick();
        }
      }}
      className="uth-node cursor-pointer outline-none"
      opacity={state === "idle" ? 0.55 : 1}
      style={{ transition: "opacity 400ms" }}
    >
      {state === "lit" && (
        <rect
          x={b.x - 4}
          y={b.y - 4}
          width={b.w + 8}
          height={b.h + 8}
          rx={13}
          fill="var(--color-brand-primary)"
          opacity={0.12}
        />
      )}
      <rect
        x={b.x}
        y={b.y}
        width={b.w}
        height={b.h}
        rx={store ? 7 : 10}
        fill="var(--color-brand-surface)"
        stroke={stroke}
        strokeWidth={state === "lit" || selected ? 2 : 1.2}
        strokeDasharray={n.kind === "external" ? "5 4" : undefined}
        className="uth-node-rect"
      />
      {n.kind === "db" && <DbGlyph x={b.x + 14} y={b.y + 16} />}
      {store ? (
        <>
          <DbGlyph x={b.x + 12} y={b.cy - 8} small />
          <text
            x={b.x + 32}
            y={b.cy + 4.5}
            fontSize={13}
            fontFamily="var(--font-mono), monospace"
            fill="var(--color-brand-text)"
          >
            {n.title}
          </text>
        </>
      ) : (
        <>
          <text
            x={n.kind === "db" ? b.x + 38 : b.x + 14}
            y={n.kind === "db" ? b.y + 30 : b.y + 25}
            fontSize={14.5}
            fontWeight={600}
            fill="var(--color-brand-text)"
          >
            {n.title}
          </text>
          <text
            x={n.kind === "db" ? b.x + 38 : b.x + 14}
            y={n.kind === "db" ? b.y + 50 : b.y + 44}
            fontSize={12}
            fontFamily="var(--font-mono), monospace"
            fill="var(--color-brand-muted)"
          >
            {n.code}
          </text>
          {n.kind === "db" && (
            <text
              x={b.x + 14}
              y={b.y + b.h - 16}
              fontSize={12}
              fill="var(--color-brand-muted)"
            >
              one per checkout
            </text>
          )}
        </>
      )}
    </g>
  );
}

function DbGlyph({ x, y, small }: { x: number; y: number; small?: boolean }) {
  const w = small ? 12 : 16;
  const h = small ? 15 : 20;
  const ry = small ? 3 : 4;
  return (
    <g
      fill="none"
      stroke="var(--color-brand-muted)"
      strokeWidth={1.3}
      aria-hidden="true"
    >
      <ellipse cx={x + w / 2} cy={y + ry} rx={w / 2} ry={ry} />
      <path
        d={`M ${x} ${y + ry} V ${y + h - ry} A ${w / 2} ${ry} 0 0 0 ${x + w} ${y + h - ry} V ${y + ry}`}
      />
      <path
        d={`M ${x} ${y + h / 2} A ${w / 2} ${ry} 0 0 0 ${x + w} ${y + h / 2}`}
      />
    </g>
  );
}
