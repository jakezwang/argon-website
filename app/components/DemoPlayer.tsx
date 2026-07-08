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

const TYPE_MS = 16;
const LINE_MS = 130;
const DWELL_MS = 3000;

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
  // Auto-plays through the flow on load so the panels fill and the story
  // tells itself; a Pause button (or any manual control) stops it, and Play
  // resumes from wherever you are.
  const [playing, setPlaying] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const safeIdx = Math.min(idx, steps.length - 1);
  const step = steps[safeIdx];
  const typingDone = chars >= step.command.length;
  const outputDone = lines >= step.output.length;
  const done = typingDone && outputDone;

  // Typing animation for the current step. Types the command, then reveals
  // the output line by line. Runs once per step (remounting per tab means
  // switching flows never leaves stale timers behind).
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

  // Auto-advance: while playing, once a step has finished, dwell (long enough
  // to read it), then move on. Pausing (playing=false) cancels the pending
  // advance; pressing Play while a finished step is showing reschedules it.
  useEffect(() => {
    if (!playing || !done || safeIdx >= steps.length - 1) return;
    const t = setTimeout(() => {
      setInstant(false);
      setIdx((i) => i + 1);
    }, DWELL_MS);
    return () => clearTimeout(t);
  }, [playing, done, safeIdx, steps.length]);

  // Keep the terminal scrolled to the newest line.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chars, lines, safeIdx]);

  const goTo = (i: number, animate: boolean) => {
    setInstant(!animate);
    setIdx(i);
  };
  const pause = () => setPlaying(false);
  const atEnd = safeIdx === steps.length - 1 && done;
  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
    } else {
      if (atEnd) {
        setInstant(false);
        setIdx(0);
      }
      setPlaying(true);
    }
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
        if (e.key === 'ArrowRight') {
          pause();
          next();
        }
        if (e.key === 'ArrowLeft') {
          pause();
          prev();
        }
      }}
      className="outline-none focus-visible:outline-none"
    >
      {/* Current step, one line */}
      <p className="mb-3 flex flex-wrap items-center gap-x-2 font-mono text-xs text-brand-text-darker">
        <span className="text-brand-primary">
          step {safeIdx + 1}/{steps.length}
        </span>
        <span>· {step.description}</span>
        {playing && (
          <span className="flex items-center gap-1.5 text-brand-muted">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-brand-primary" />
            auto-playing
          </span>
        )}
      </p>

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
            onClick={() => {
              pause();
              skip();
            }}
            title={done ? undefined : 'Click to skip the animation'}
            className={`h-60 overflow-y-auto p-4 font-mono text-[13px] leading-6 ${
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
          <div className="h-60 overflow-y-auto p-4 font-mono text-xs leading-6">
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
            onClick={togglePlay}
            className="btn-solid px-5 py-1.5 font-mono text-sm"
          >
            {playing ? '❙❙ Pause' : atEnd ? '↺ Replay' : '▶ Play'}
          </button>
          <button
            onClick={() => {
              pause();
              prev();
            }}
            disabled={safeIdx === 0}
            className="btn-quiet px-4 py-1.5 font-mono text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Prev
          </button>
          <button
            onClick={() => {
              pause();
              next();
            }}
            disabled={safeIdx === steps.length - 1 && done}
            className="btn-quiet px-4 py-1.5 font-mono text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {steps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                pause();
                goTo(i, false);
              }}
              title={s.description}
              className={`h-7 w-7 border font-mono text-[11px] transition-colors ${
                i === safeIdx
                  ? 'border-brand-primary text-brand-primary'
                  : i < safeIdx
                    ? 'border-brand-edge text-brand-muted hover:text-brand-text'
                    : 'border-brand-edge text-brand-text-darker hover:text-brand-text'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            setInstant(false);
            setIdx(0);
            setPlaying(true);
          }}
          className="btn-quiet px-4 py-1.5 font-mono text-sm"
        >
          Restart
        </button>
      </div>

    </div>
  );
}
