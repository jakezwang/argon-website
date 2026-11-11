import { highlight } from "./highlight";

type Entry = readonly [command: string, output: readonly string[]];

// A terminal excerpt: each command with what it printed. With `commandsOnly`
// it shows just the commands, for places that need the short form.
export default function Transcript({
  entries,
  label,
  commandsOnly = false,
}: {
  entries: readonly Entry[];
  label: string;
  commandsOnly?: boolean;
}) {
  return (
    <pre
      tabIndex={0}
      aria-label={label}
      className="ink m-0 max-w-full overflow-x-auto rounded-(--radius-panel) border border-brand-edge bg-brand-surface px-5 py-4 font-mono text-[0.8125rem] leading-[1.75] text-brand-text focus-visible:-outline-offset-2"
    >
      <code>
        {entries.map(([command, output], index) => (
          <span key={command} className="block">
            {index > 0 && !commandsOnly && <span className="block h-3" />}
            <span className="block whitespace-pre">
              <span className="select-none text-brand-muted">$ </span>
              {highlight(command, "bash")}
            </span>
            {!commandsOnly &&
              output.map((line) => (
                <span
                  key={line}
                  className="block whitespace-pre text-brand-text-darker"
                >
                  {line}
                </span>
              ))}
          </span>
        ))}
      </code>
    </pre>
  );
}
