// A git-log-style horizontal history graph that lights up as the demo
// steps forward: commits appear, HEAD moves, forks curve down, merges and
// pins render as ghosts and tags. Purely presentational — the flow data
// lives with the demo steps.

export interface GraphLane {
  name: string;
  y: number;
}
export interface GraphNode {
  id: string;
  x: number;
  y: number;
  sub?: string;
  appearAt: number;
  hideAt?: number;
  ghost?: boolean;
  pin?: boolean;
  lane: number;
}
export interface GraphEdge {
  from: string;
  to: string;
  appearAt: number;
  hideAt?: number;
  ghost?: boolean;
  // Where the bend sits: forks curve away right after the source ('source',
  // default); merges run along their lane and curve in just before the
  // target ('target') — the classic git-graph shapes.
  curve?: 'source' | 'target';
}
export interface GraphStep {
  head?: string;
  highlight?: string[];
  caption: string;
}
export interface FlowGraph {
  height: number;
  width?: number;
  lanes: GraphLane[];
  nodes: GraphNode[];
  edges: GraphEdge[];
  steps: GraphStep[];
}

const laneColors = ['#96A7FF', '#34d399', '#fbbf24'];

export default function GitGraph({ graph, step }: { graph: FlowGraph; step: number }) {
  const shown = (el: { appearAt: number; hideAt?: number }) =>
    el.appearAt <= step && (el.hideAt === undefined || step < el.hideAt);
  const visibleNodes = graph.nodes.filter(shown);
  const visibleEdges = graph.edges.filter(shown);
  const byId = Object.fromEntries(graph.nodes.map((n) => [n.id, n]));
  const state = step >= 0 ? graph.steps[Math.min(step, graph.steps.length - 1)] : undefined;

  // Bends start after a straight lead segment so curves never sweep through
  // the LSN labels that sit under their source (or target) node.
  const edgePath = (e: GraphEdge) => {
    const a = byId[e.from];
    const b = byId[e.to];
    if (a.y === b.y || a.x === b.x) return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
    const dx = Math.abs(b.x - a.x);
    const lead = Math.min(60, Math.max(0, dx - 100));
    const w = Math.min(90, dx - lead);
    if (e.curve === 'target') {
      const x0 = b.x - lead - w;
      const x1 = b.x - lead;
      return `M ${a.x} ${a.y} L ${x0} ${a.y} C ${x0 + w / 2} ${a.y}, ${x0 + w / 2} ${b.y}, ${x1} ${b.y} L ${b.x} ${b.y}`;
    }
    const x0 = a.x + lead;
    const x1 = x0 + w;
    return `M ${a.x} ${a.y} L ${x0} ${a.y} C ${x0 + w / 2} ${a.y}, ${x0 + w / 2} ${b.y}, ${x1} ${b.y} L ${b.x} ${b.y}`;
  };

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${graph.width ?? 1000} ${graph.height}`}
      role="img"
      aria-label="Branch and commit history graph"
      className="block"
    >
      {/* lane labels */}
      {graph.lanes.map((lane, i) => {
        const hasVisible = visibleNodes.some((n) => n.lane === i && !n.pin);
        if (!hasVisible) return null;
        return (
          <text
            key={lane.name}
            x={12}
            y={lane.y + 3}
            fontSize={11}
            fontFamily="var(--font-mono), monospace"
            fill={laneColors[i]}
            opacity={0.85}
          >
            {lane.name}
          </text>
        );
      })}

      {/* edges */}
      {visibleEdges.map((e, i) => {
        const color = laneColors[byId[e.to].lane] ?? laneColors[0];
        return (
          <path
            key={i}
            d={edgePath(e)}
            fill="none"
            stroke={color}
            strokeWidth={1.5}
            strokeDasharray={e.ghost ? '4 4' : undefined}
            opacity={e.ghost ? 0.6 : 0.9}
          />
        );
      })}

      {/* nodes */}
      {visibleNodes.map((n) => {
        const color = laneColors[n.lane] ?? laneColors[0];
        const isHead = state?.head === n.id;
        const isHi = state?.highlight?.includes(n.id);
        return (
          <g key={n.id}>
            {isHi && (
              <circle cx={n.x} cy={n.y} r={11} fill="none" stroke="#E8EBF2" strokeWidth={1} strokeDasharray="3 3" opacity={0.7} />
            )}
            {isHead && (
              <>
                <circle cx={n.x} cy={n.y} r={9} fill="none" stroke={color} strokeWidth={1.5} />
                <text
                  x={n.x}
                  y={n.y - 16}
                  fontSize={10}
                  fontFamily="var(--font-mono), monospace"
                  fill="#E8EBF2"
                  textAnchor="middle"
                >
                  HEAD
                </text>
              </>
            )}
            {n.pin ? (
              <rect
                x={n.x - 5}
                y={n.y - 5}
                width={10}
                height={10}
                fill={color}
                transform={`rotate(45 ${n.x} ${n.y})`}
              />
            ) : (
              <circle
                cx={n.x}
                cy={n.y}
                r={5}
                fill={n.ghost ? 'none' : color}
                stroke={color}
                strokeWidth={1.5}
                strokeDasharray={n.ghost ? '3 3' : undefined}
              />
            )}
            {n.sub && (
              <text
                x={n.pin ? n.x - 12 : n.x}
                y={n.pin ? n.y + 3 : n.y + 17}
                fontSize={10}
                fontFamily="var(--font-mono), monospace"
                fill="#6E7891"
                textAnchor={n.pin ? 'end' : 'middle'}
              >
                {n.sub}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
