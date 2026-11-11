"use client";

import { useEffect, useState } from "react";

const scenes = [
  {
    label: "Branch",
    title: "Start from the same data.",
    description:
      "Give the planner agent its own branch of orders. Both start with the same document.",
    detail: "Branch point",
    value: "price: 49",
    status: "Same baseline",
  },
  {
    label: "Test",
    title: "Let the agent try a change.",
    description:
      "The planner changes a price in its sandbox. The document on main stays at 49.",
    detail: "Agent's change",
    value: "49 → 44",
    status: "Isolated edit",
  },
  {
    label: "Time travel",
    title: "Read the earlier state.",
    description:
      "Inspect the document at the branch point. The agent's current price stays at 44.",
    detail: "Historical read",
    value: "price: 49",
    status: "Current state",
  },
  {
    label: "Review",
    title: "See exactly what would change.",
    description:
      "Preview the merge and review its diff. Nothing reaches main until the plan is applied.",
    detail: "Merge preview",
    value: "49 → 44",
    status: "Ready for review",
  },
  {
    label: "Merge",
    title: "Apply the plan you reviewed.",
    description:
      "The reviewed change is now on main. Branching, testing and history led to one explicit merge.",
    detail: "Reviewed plan",
    value: "Applied to main",
    status: "Reviewed change",
  },
] as const;

const SCENE_MS = 5000;
const controlClass =
  "min-h-11 min-w-11 rounded-(--radius-control) px-4 text-sm font-medium text-brand-text-darker transition-colors hover:bg-brand-edge/50 hover:text-brand-text disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent";

function BranchHistory({ scene }: { scene: number }) {
  const edited = scene > 0;
  const merged = scene === scenes.length - 1;
  const history = scene === 2;

  return (
    <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] border-b border-brand-edge px-5 py-5 sm:px-6">
      <div className="relative font-mono text-xs">
        <span className="absolute left-0 top-[19.2%] -translate-y-1/2 text-brand-text-darker">
          main
        </span>
        <span className="absolute left-0 top-[80.8%] -translate-y-1/2 text-brand-primary">
          agent
        </span>
      </div>
      <svg
        viewBox="0 0 400 104"
        className="block h-auto w-full overflow-visible"
        aria-hidden="true"
      >
        <path
          d="M 20 20 H 380 M 20 20 C 80 20 65 84 125 84 H 270 C 325 84 310 20 380 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-brand-edge-strong"
          vectorEffect="non-scaling-stroke"
        />
        <g className="glow text-brand-primary">
          <path
            d="M 20 20 C 80 20 65 84 125 84"
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="draw-line"
          />
          {edited && (
            <path
              d="M 125 84 H 270"
              pathLength={1}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="draw-line"
            />
          )}
          {merged && (
            <path
              d="M 270 84 C 325 84 310 20 380 20"
              pathLength={1}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="draw-line"
            />
          )}
          {merged && (
            <path
              d="M 20 20 H 380"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          )}
        </g>
        {[
          { x: 20, y: 20, visible: true },
          { x: 125, y: 84, visible: true },
          { x: 270, y: 84, visible: edited },
          { x: 380, y: 20, visible: merged },
        ].map(({ x, y, visible }) => (
          <circle
            key={x}
            cx={x}
            cy={y}
            r={4.5}
            fill={visible ? "currentColor" : "var(--color-brand-surface)"}
            stroke="currentColor"
            strokeWidth="1.5"
            className={
              visible ? "text-brand-primary" : "text-brand-edge-strong"
            }
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <circle
          cx={merged ? 380 : edited ? 270 : 125}
          cy={merged ? 20 : 84}
          r={10}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="glow text-brand-primary"
          vectorEffect="non-scaling-stroke"
        />
        {history && (
          <circle
            cx={20}
            cy={20}
            r={13}
            fill="none"
            stroke="currentColor"
            strokeDasharray="3 4"
            className="text-brand-text"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
    </div>
  );
}

export default function HeroDemo() {
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(false);
  const current = scenes[scene];
  const merged = scene === scenes.length - 1;

  useEffect(() => {
    if (!playing) return;

    const timer = window.setTimeout(() => {
      if (scene === scenes.length - 2) setPlaying(false);
      setScene((previous) => Math.min(previous + 1, scenes.length - 1));
    }, SCENE_MS);

    return () => window.clearTimeout(timer);
  }, [playing, scene]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pauseForPreference = () => {
      if (preference.matches) setPlaying(false);
    };
    preference.addEventListener("change", pauseForPreference);
    return () => preference.removeEventListener("change", pauseForPreference);
  }, []);

  function selectScene(next: number) {
    setPlaying(false);
    setScene(next);
  }

  return (
    <section
      aria-label="Illustrated agent workflow"
      className="ink ink-panel min-w-0 overflow-hidden"
    >
      <div className="flex items-center justify-between gap-3 border-b border-brand-edge px-5 py-3 sm:px-6">
        <p className="font-mono text-xs text-brand-text">orders / order-1</p>
        <span className="rounded-full border border-brand-edge px-2.5 py-0.5 text-xs text-brand-muted">
          Illustration
        </span>
      </div>

      <div
        role="group"
        aria-label="Workflow steps"
        className="grid grid-cols-5 border-b border-brand-edge"
      >
        {scenes.map((step, index) => (
          <button
            key={step.label}
            type="button"
            aria-pressed={scene === index}
            aria-controls="hero-workflow-scene"
            onClick={() => selectScene(index)}
            className={`relative flex min-h-12 min-w-0 items-center justify-center px-1 py-2 text-center text-xs font-medium leading-4 transition-colors focus-visible:z-10 focus-visible:-outline-offset-2 sm:text-sm ${
              scene === index
                ? "text-brand-text before:absolute before:inset-x-3 before:bottom-0 before:h-0.5 before:rounded-full before:bg-brand-primary"
                : "text-brand-muted hover:bg-brand-edge/40 hover:text-brand-text"
            }`}
          >
            {step.label}
          </button>
        ))}
      </div>

      <div
        id="hero-workflow-scene"
        className="lg:grid lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]"
      >
        <div className="min-w-0 lg:border-r lg:border-brand-edge">
          <BranchHistory scene={scene} />

          <div className="grid grid-cols-2 divide-x divide-brand-edge border-b border-brand-edge lg:border-b-0">
            <div
              role="group"
              aria-label="main document"
              className="min-w-0 p-5 sm:p-6"
            >
              <p className="font-mono text-sm text-brand-text">main</p>
              <dl className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono">
                <dt className="text-xs text-brand-text-darker">price</dt>
                <dd className="text-5xl leading-none tracking-tight text-brand-text sm:text-6xl">
                  {merged ? "44" : "49"}
                </dd>
              </dl>
              <p className="mt-4 min-h-5 text-xs leading-4 text-brand-text-darker">
                {merged ? "Merge applied" : "Unchanged"}
              </p>
            </div>
            <div
              role="group"
              aria-label="planner document"
              className="min-w-0 p-5 sm:p-6"
            >
              <p className="font-mono text-sm text-brand-primary">planner</p>
              <dl className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono">
                <dt className="text-xs text-brand-text-darker">price</dt>
                <dd className="glow text-5xl leading-none tracking-tight text-brand-primary sm:text-6xl">
                  {scene === 0 ? "49" : "44"}
                </dd>
              </dl>
              <p className="mt-4 min-h-5 text-xs leading-4 text-brand-text-darker">
                {current.status}
              </p>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-between gap-6 p-5 sm:p-6">
          <div
            aria-live={playing ? "off" : "polite"}
            aria-atomic="true"
            className="grid"
          >
            {scenes.map((step, index) => (
              <div
                key={step.label}
                aria-hidden={index !== scene}
                className={`[grid-area:1/1] ${index === scene ? "visible" : "invisible"}`}
              >
                <h2 className="text-xl font-semibold leading-7 text-brand-text [font-stretch:100%]">
                  {step.title}
                </h2>
                <p className="mt-2.5 text-sm leading-6">{step.description}</p>
              </div>
            ))}
          </div>

          <div
            className={`flex min-h-11 flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-(--radius-control) border px-4 py-2 text-sm ${
              scene === 2
                ? "border-brand-primary/50 bg-brand-primary/10"
                : "border-brand-edge bg-brand-bg"
            }`}
          >
            <span className="text-brand-text-darker">{current.detail}</span>
            <span className="font-mono text-brand-primary">
              {current.value}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-brand-edge p-1.5">
        <button
          type="button"
          className={controlClass}
          disabled={scene === 0}
          onClick={() => selectScene(scene - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          className={`${controlClass} text-brand-primary`}
          aria-pressed={playing}
          aria-label={playing ? "Pause workflow" : "Play workflow"}
          onClick={() => {
            if (merged) setScene(0);
            setPlaying((previous) => !previous);
          }}
        >
          {playing ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          className={controlClass}
          disabled={merged}
          onClick={() => selectScene(scene + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}
