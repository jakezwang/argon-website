"use client";

import { useId, useState } from "react";
import { install } from "../product";
import CodeBlock from "./CodeBlock";

const installMethods = [
  {
    label: "npm",
    command: install.cli,
    description:
      "Installs the argon CLI with npm 11.16+ and a supported Node.js version. Allows only argonctl's binary installer.",
    codeLabel: "Install the CLI with npm",
  },
  {
    label: "Homebrew",
    command: "brew install argon-lab/tap/argonctl",
    description: "Installs the argon CLI on macOS with Homebrew.",
    codeLabel: "Install the CLI with Homebrew",
  },
  {
    label: "Python SDK",
    command: install.langgraph,
    description:
      "Installs the Python adapter from PyPI. Requires Python 3.10+ and a running Argon server.",
    codeLabel: "Install the Python SDK in a virtual environment",
  },
];

export default function QuickStartCommand({
  showSdk = true,
}: {
  showSdk?: boolean;
}) {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const methods = showSdk ? installMethods : installMethods.slice(0, 2);
  const current = methods[selected] ?? methods[0];

  return (
    <div className="w-full min-w-0 max-w-2xl">
      <div className="ink overflow-hidden rounded-(--radius-panel) border border-brand-edge bg-brand-surface">
        <div
          className="flex flex-wrap gap-1 border-b border-brand-edge px-1.5 pt-1.5"
          role="group"
          aria-label="Installation method"
        >
          {methods.map((method, index) => (
            <button
              type="button"
              key={method.label}
              onClick={() => setSelected(index)}
              aria-pressed={selected === index}
              aria-controls={id}
              className={`relative min-h-11 rounded-t-(--radius-control) px-4 py-2 text-sm font-medium transition-colors focus-visible:-outline-offset-2 ${
                selected === index
                  ? "text-brand-text after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-brand-primary"
                  : "text-brand-muted hover:text-brand-text"
              }`}
            >
              {method.label}
            </button>
          ))}
        </div>
        <div id={id}>
          <CodeBlock
            key={current.label}
            code={current.command}
            label={current.codeLabel}
            language="bash"
            bare
          />
        </div>
      </div>
      <div>
        <p className="mt-3 max-w-xl text-xs leading-5 text-brand-muted">
          {current.description}{" "}
          {selected === 2 && (
            <a className="prose-link" href="/agents#python">
              Python setup
            </a>
          )}
        </p>
      </div>
    </div>
  );
}
