'use client';

import { useEffect, useRef, useState } from 'react';
import GitGraph, { FlowGraph } from './GitGraph';

export interface PanelLine {
  text: string;
  status?: 'added' | 'modified' | 'removed' | 'muted';
}
export interface PanelSection {
  name: string;
  lines: PanelLine[];
}
export interface DemoPanel {
  title: string;
  note?: string;
  sections: PanelSection[];
}
export interface DemoStep {
  id: string;
  command: string;
  description: string;
  output: string[];
  panel: DemoPanel;
}

interface DemoPlayerProps {
  steps: DemoStep[];
  initialPanel: DemoPanel;
  terminalTitle: string;
  panelKind?: string;
  graph?: FlowGraph;
}

const TYPE_MS = 14;
const LINE_MS = 110;

const statusStyle: Record<NonNullable<PanelLine['status']> | 'default', string> = {
  added: 'text-emerald-400',
  modified: 'text-amber-400',
  removed: 'text-red-400',
  muted: 'text-brand-muted',
  default: 'text-brand-text-darker',
};

const statusPrefix: Record<NonNullable<PanelLine['status']>, string> = {
  added: '+ ',
  modified: '~ ',
  removed: '− ',
  muted: '  ',
};

export default function DemoPlayer({
  steps,
  initialPanel,
  terminalTitle,
  panelKind = 'database view',
  graph,
}: DemoPlayerProps) {
  const [idx, setIdx] = useState(0);
  const [instant, setInstant] = useState(false);
  const [chars, setChars] = useState(0);
  const [lines, setLines] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const safeIdx = Math.min(idx, steps.length - 1);
  const step = steps[safeIdx];
  const typingDone = chars >= step.command.length;
  const outputDone = lines >= step.output.length;
  const done = typingDone && outputDone;

  // Animation driver. Remounting (key per tab) plus this reset-on-index
  // effect means switching flows can never leave stale timers or an
  // out-of-range step behind.
  useEffect(() => {
    if (instant) {
      setChars(step.command.length);
      setLines(step.output.length);
      return;
    }
    setChars(0);
    setLines(0);
    let c = 0;
    let outputTimer: ReturnType<typeof setInterval> | null = null;
    const typeTimer = setInterval(() => {
      c += 1;
      setChars(c);
      if (c >= step.command.length) {
        clearInterval(typeTimer);
        let l = 0;
        outputTimer = setInterval(() => {
          l += 1;
          setLines(l);
          if (l >= step.output.length && outputTimer) clearInterval(outputTimer);
        }, LINE_MS);
      }
    }, TYPE_MS);
    return () => {
      clearInterval(typeTimer);
      if (outputTimer) clearInterval(outputTimer);
    };
  }, [safeIdx, instant, step]);

  // Keep the terminal scrolled to the newest line.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chars, lines, safeIdx]);

  const goTo = (i: number, animate: boolean) => {
    setInstant(!animate);
    setIdx(i);
  };
  const skip = () => {
    if (!done) setInstant(true);
  };
  const next = () => {
    if (safeIdx < steps.length - 1) goTo(safeIdx + 1, true);
    else if (!done) skip();
  };
  const prev = () => {
    if (safeIdx > 0) goTo(safeIdx - 1, false);
  };

  // The data panel and graph reflect the world *after* the current command
  // ran; while it is still typing, show the previous step's state.
  const panel = typingDone ? step.panel : safeIdx > 0 ? steps[safeIdx - 1].panel : initialPanel;
  const graphStep = typingDone ? safeIdx : safeIdx - 1;

  return (
    <div
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
      }}
      className="outline-none focus-visible:outline-none"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Terminal */}
        <div className="flex flex-col border border-brand-edge bg-brand-surface">
          <div className="flex items-center justify-between border-b border-brand-edge px-4 py-2">
            <p className="font-mono text-xs text-brand-muted">{terminalTitle}</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-brand-muted">
              simulated
            </p>
          </div>
          <div
            ref={scrollRef}
            onClick={skip}
            title={done ? undefined : 'Click to skip the animation'}
            className={`h-96 overflow-y-auto p-4 font-mono text-[13px] leading-6 ${
              done ? '' : 'cursor-pointer'
            }`}
          >
            {steps.slice(0, safeIdx).map((s) => (
              <div key={s.id} className="mb-3">
                <p className="text-brand-text">
                  <span className="select-none text-brand-muted">$ </span>
                  {s.command}
                </p>
                {s.output.map((line, i) => (
                  <p key={i} className="pl-4 text-brand-muted">
                    {line}
                  </p>
                ))}
              </div>
            ))}
            <div>
              <p className="text-brand-text">
                <span className="select-none text-brand-muted">$ </span>
                {step.command.slice(0, chars)}
                {!typingDone && <span className="animate-pulse text-brand-primary">▍</span>}
              </p>
              {step.output.slice(0, lines).map((line, i) => (
                <p key={i} className="pl-4 text-brand-text-darker">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Data panel — what the database looks like right now */}
        <div className="flex flex-col border border-brand-edge bg-brand-surface">
          <div className="flex items-center justify-between border-b border-brand-edge px-4 py-2">
            <p className="truncate font-mono text-xs text-brand-primary">{panel.title}</p>
            <p className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-brand-muted">
              {panelKind}
            </p>
          </div>
          <div className="h-96 overflow-y-auto p-4 font-mono text-xs leading-6">
            {panel.note && <p className="mb-3 text-brand-muted">// {panel.note}</p>}
            {panel.sections.length === 0 && !panel.note && (
              <p className="text-brand-muted">// empty</p>
            )}
            {panel.sections.map((section) => (
              <div key={section.name} className="mb-4">
                <p className="mb-1 text-brand-text">
                  {section.name}
                </p>
                <div className="border-l border-brand-edge pl-3">
                  {section.lines.map((line, i) => (
                    <p key={i} className={statusStyle[line.status ?? 'default']}>
                      {line.status ? statusPrefix[line.status] : '  '}
                      {line.text}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History graph — where you are in branch/commit space */}
      {graph && (
        <div className="mt-4 border border-brand-edge bg-brand-surface">
          <div className="flex items-center justify-between border-b border-brand-edge px-4 py-2">
            <p className="font-mono text-xs text-brand-muted">
              {graphStep >= 0
                ? graph.steps[Math.min(graphStep, graph.steps.length - 1)].caption
                : '…'}
            </p>
            <p className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-brand-muted">
              history graph
            </p>
          </div>
          <div className="px-4 py-3">
            <GitGraph graph={graph} step={graphStep} />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={prev}
            disabled={safeIdx === 0}
            className="btn-quiet px-4 py-1.5 font-mono text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Prev
          </button>
          <button
            onClick={next}
            disabled={safeIdx === steps.length - 1 && done}
            className="btn-solid px-5 py-1.5 font-mono text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </div>
        <p className="hidden font-mono text-xs text-brand-muted sm:block">
          arrow keys work too · click the terminal to skip
        </p>
        <button
          onClick={() => goTo(0, true)}
          className="btn-quiet px-4 py-1.5 font-mono text-sm"
        >
          Restart
        </button>
      </div>

      {/* Step list — click to jump */}
      <div className="mt-4 divide-y divide-brand-edge border border-brand-edge">
        {steps.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i, false)}
            className={`flex w-full items-center gap-3 px-4 py-2 text-left text-xs transition-colors ${
              i === safeIdx
                ? 'bg-brand-surface text-brand-primary'
                : i < safeIdx
                  ? 'text-brand-muted hover:text-brand-text'
                  : 'text-brand-text-darker hover:text-brand-text'
            }`}
          >
            <span className="font-mono">{String(i + 1).padStart(2, '0')}</span>
            <span>{s.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
