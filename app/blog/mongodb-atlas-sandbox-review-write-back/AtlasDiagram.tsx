// How Argon works with a MongoDB Atlas source: Atlas holds the database, the
// engine (on a replica set the user runs) holds main, the sandboxes and the
// plans. Every arrow is a step the post's walkthrough runs.

const box = {
  fill: "var(--color-brand-surface)",
  stroke: "var(--color-brand-edge-strong)",
  strokeWidth: 1,
} as const;
const text = { fill: "var(--color-brand-text)", fontSize: 14, fontWeight: 600 } as const;
const sub = { fill: "var(--color-brand-muted)", fontSize: 12 } as const;
const step = { fill: "var(--color-brand-primary)", fontSize: 12, fontWeight: 600 } as const;
const line = { stroke: "var(--color-brand-primary)", strokeWidth: 1.6, fill: "none" } as const;

function Box({ x, y, w, h, title, lines }: { x: number; y: number; w: number; h: number; title: string; lines: string[] }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} style={box} />
      <text x={x + 14} y={y + 24} style={text}>
        {title}
      </text>
      {lines.map((l, i) => (
        <text key={l} x={x + 14} y={y + 42 + i * 16} style={sub}>
          {l}
        </text>
      ))}
    </g>
  );
}

export default function AtlasDiagram() {
  return (
    <figure style={{ margin: "1.75rem 0" }}>
      <div style={{ overflowX: "auto" }}>
        <svg
          viewBox="0 0 640 540"
          role="img"
          aria-labelledby="atlas-diagram-title"
          style={{ display: "block", width: "100%", minWidth: 520, height: "auto" }}
        >
          <title id="atlas-diagram-title">
            Argon with a MongoDB Atlas source: import and follow from Atlas into main, fork sandboxes
            for agents, preview a merge plan, and write it back to Atlas after review
          </title>
          <defs>
            <marker id="atlas-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" style={{ fill: "var(--color-brand-primary)" }} />
            </marker>
          </defs>

          {/* Atlas */}
          <rect x={10} y={10} width={620} height={120} rx={14}
            style={{ fill: "var(--color-brand-sunken)", stroke: "var(--color-brand-added)", strokeWidth: 1.5 }} />
          <text x={26} y={36} style={{ ...text, fill: "var(--color-brand-added)" }}>MongoDB Atlas · the source</text>
          <text x={26} y={54} style={sub}>Free M0 or dedicated M10 and up</text>
          <Box x={30} y={66} w={580} h={50} title="Your database (shop)" lines={["your application keeps reading and writing it as usual"]} />

          {/* Engine */}
          <rect x={10} y={190} width={620} height={230} rx={14}
            style={{ fill: "var(--color-brand-sunken)", stroke: "var(--color-brand-primary)", strokeWidth: 1.5 }} />
          <text x={140} y={214} style={{ ...text, fill: "var(--color-brand-primary)" }}>Argon engine · a MongoDB replica set you run</text>
          <Box x={30} y={228} w={270} h={66} title="main" lines={["Atlas at one cluster time,", "kept current by following"]} />
          <Box x={340} y={228} w={270} h={66} title="Merge plan" lines={["before and after of every document,", "plus an approval digest"]} />
          <Box x={30} y={334} w={270} h={70} title="Sandboxes" lines={["real MongoDB databases forked", "from main, one per agent run"]} />
          <Box x={340} y={334} w={270} h={70} title="Argon metadata" lines={["change log, branches, plans,", "the recorded Atlas identity"]} />

          {/* Agents */}
          <Box x={30} y={468} w={270} h={56} title="AI agents" lines={["pymongo, mongoose, mongosh…"]} />

          {/* 1-2: import and follow, Atlas -> main */}
          <path d="M120,116 L120,226" style={line} markerEnd="url(#atlas-arrow)" />
          <text x={132} y={152} style={step}>① import online</text>
          <text x={132} y={170} style={step}>② follow its change stream</text>

          {/* 3: fork */}
          <path d="M120,294 L120,332" style={line} markerEnd="url(#atlas-arrow)" />
          <text x={132} y={318} style={step}>③ fork</text>

          {/* 4: agents work through any driver */}
          <path d="M120,466 L120,406" style={line} markerStart="url(#atlas-arrow)" markerEnd="url(#atlas-arrow)" />
          <text x={132} y={442} style={step}>④ work in the sandbox</text>

          {/* 5: diff and preview, sandbox -> plan */}
          <path d="M300,352 L320,352 L320,262 L338,262" style={line} markerEnd="url(#atlas-arrow)" />
          <text x={306} y={318} style={step} transform="rotate(-90 314 318)">⑤ preview</text>

          {/* 6: write-back, plan -> Atlas */}
          <path d="M520,226 L520,118" style={line} markerEnd="url(#atlas-arrow)" />
          <text x={352} y={148} style={step}>⑥ write back after review</text>
          <text x={352} y={164} style={sub}>digest matches · same Atlas cluster ·</text>
          <text x={352} y={180} style={sub}>unchanged since review · one transaction</text>
        </svg>
      </div>
      <figcaption style={{ fontSize: "var(--text-xs)", color: "var(--color-brand-muted)", marginTop: "0.5rem" }}>
        Atlas keeps the database. The engine, on a replica set you run, keeps main, the sandboxes and
        the plans. Nothing reaches Atlas except step ⑥.
      </figcaption>
    </figure>
  );
}
