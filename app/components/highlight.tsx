import type { ReactNode } from "react";

// A small highlighter for the three languages the site shows. It only wraps
// text in spans, so the code's text content (what gets copied) is unchanged.
type Kind = "comment" | "string" | "key" | "number";

const tone: Record<Kind, string> = {
  comment: "italic text-brand-muted",
  string: "text-brand-added",
  key: "text-brand-primary",
  number: "text-brand-pending",
};

const string = `'(?:[^'\\\\\\n]|\\\\.)*'|"(?:[^"\\\\\\n]|\\\\.)*"`;
const grammars: Record<string, { pattern: RegExp; kinds: (Kind | null)[] }> = {
  bash: {
    // comment · string · flag
    pattern: new RegExp(
      `((?:^|(?<=\\s))#.*$)|(${string})|((?<=\\s)--?[A-Za-z][\\w-]*)`,
      "gm",
    ),
    kinds: ["comment", "string", "key"],
  },
  json: {
    // key · string · number or literal
    pattern: new RegExp(
      `("(?:[^"\\\\\\n]|\\\\.)*"(?=\\s*:))|(${string})|(-?\\b\\d+(?:\\.\\d+)?\\b|\\b(?:true|false|null)\\b)`,
      "g",
    ),
    kinds: ["key", "string", "number"],
  },
  python: {
    // comment · string · keyword
    pattern: new RegExp(
      `((?:^|(?<=\\s))#.*$)|(${string})|\\b(from|import|def|return|if|else|for|in|with|as|assert|not|and|or|None|True|False)\\b`,
      "gm",
    ),
    kinds: ["comment", "string", "key"],
  },
};

export function highlight(code: string, language?: string): ReactNode {
  const grammar = language ? grammars[language] : undefined;
  if (!grammar) return code;
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  grammar.pattern.lastIndex = 0;
  for (const match of code.matchAll(grammar.pattern)) {
    const index = match.index ?? 0;
    const group = match.slice(1).findIndex((value) => value !== undefined);
    const kind = grammar.kinds[group];
    if (!kind || !match[0]) continue;
    if (index > last) out.push(code.slice(last, index));
    out.push(
      <span key={key++} className={tone[kind]}>
        {match[0]}
      </span>,
    );
    last = index + match[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}
