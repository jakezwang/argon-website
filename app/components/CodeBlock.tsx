"use client";

import { useEffect, useId, useRef, useState } from "react";

type CodeBlockProps = {
  code: string;
  label: string;
  language?: string;
  className?: string;
};

export default function CodeBlock({
  code,
  label,
  language,
  className = "",
}: CodeBlockProps) {
  const id = useId();
  const codeRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLPreElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState<"idle" | "copied" | "selected">("idle");
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const measure = () =>
      setOverflows(element.scrollWidth > element.clientWidth + 1);
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    return () => observer.disconnect();
  }, [code]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  async function copy() {
    if (timerRef.current) clearTimeout(timerRef.current);
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
      timerRef.current = setTimeout(() => setStatus("idle"), 2400);
    } catch {
      if (codeRef.current) {
        const range = document.createRange();
        range.selectNodeContents(codeRef.current);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      setStatus("selected");
    }
  }

  return (
    <div
      className={`min-w-0 border border-brand-edge bg-brand-surface ${className}`}
    >
      <div className="flex min-h-12 items-center justify-between gap-3 border-b border-brand-edge pl-4 pr-1">
        <span
          id={`${id}-label`}
          className="py-2 font-mono text-xs leading-5 text-brand-muted"
        >
          {label}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy ${label}`}
          className="min-h-11 min-w-16 shrink-0 px-3 font-mono text-xs text-brand-primary transition-colors hover:bg-brand-dark hover:text-brand-text"
        >
          {status === "copied" ? "Copied" : "Copy"}
        </button>
      </div>
      <pre
        ref={scrollRef}
        tabIndex={0}
        aria-labelledby={`${id}-label`}
        className="m-0 max-w-full overflow-x-auto border-0 bg-transparent p-4 font-mono text-sm leading-6 text-brand-text focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand-primary"
      >
        <code
          ref={codeRef}
          className={`select-all bg-transparent p-0 text-sm${language ? ` language-${language}` : ""}`}
        >
          {code}
        </code>
      </pre>
      <div className="px-4" role="status" aria-live="polite" aria-atomic="true">
        {status === "selected" ? (
          <p className="mb-3 text-xs leading-5 text-brand-primary">
            Clipboard unavailable. Code selected; press ⌘C or Ctrl+C to copy.
          </p>
        ) : (
          <span className="sr-only">
            {status === "copied" ? `${label} copied to clipboard.` : ""}
          </span>
        )}
      </div>
      {overflows && (
        <p className="border-t border-brand-edge px-4 py-2 text-xs leading-5 text-brand-muted">
          Scroll sideways to read the full code. Copy includes every line.
        </p>
      )}
    </div>
  );
}
