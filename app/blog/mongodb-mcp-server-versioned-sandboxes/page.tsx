import ArticleLayout from '../ArticleLayout';
import { getPost } from '../posts';

const post = getPost('mongodb-mcp-server-versioned-sandboxes')!;

export const metadata = {
  title: post.title,
  description: post.description,
  alternates: { canonical: `/blog/${post.slug}` },
  openGraph: {
    type: 'article',
    siteName: 'Argon',
    url: `https://argonlabs.tech/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    images: [{ url: '/og.png', width: 1200, height: 630 }],
    publishedTime: post.date,
  },
};

const faq = [
  {
    q: 'What is an MCP server for MongoDB?',
    a: 'An MCP (Model Context Protocol) server for MongoDB exposes database operations as tools an AI agent can call. Argon’s MCP server goes beyond raw queries: it exposes 13 tools for branching, diffing, merging, time-travel, and undo, so an agent works against a versioned database rather than a live one.',
  },
  {
    q: 'How is Argon’s MCP server different from a standard MongoDB MCP server?',
    a: 'A standard MongoDB MCP server connects the agent directly to a live database. Argon gives each agent its own branch — an isolated, writable MongoDB rooted at your data — plus diff, merge, and undo. Writes are reviewable and reversible instead of hitting production directly.',
  },
  {
    q: 'How do I add Argon to Claude Code or Cursor?',
    a: 'Run `claude mcp add argon -- argon mcp` (or the equivalent MCP config for your client). Argon is also listed in the official MCP Registry as io.github.argon-lab/argon, so MCP-aware clients can discover it.',
  },
  {
    q: 'Is it safe to let an AI agent write to MongoDB over MCP?',
    a: 'Yes, when it writes to a branch instead of production. The agent works in an isolated sandbox; you review the diff and merge what works or discard the branch. Per-actor undo makes any change reversible without a full restore.',
  },
  {
    q: 'How do I make agent runs reproducible?',
    a: 'Use dataset pins — immutable, named states of the database that each run branches from. Every run starts from byte-identical data, so evaluations are comparable.',
  },
];

export default function Page() {
  return (
    <ArticleLayout post={post} faq={faq}>
      <p>
        The Model Context Protocol (MCP) lets an AI agent call tools — and
        increasingly, one of those tools is your database. But wiring an agent to
        MongoDB over MCP usually means handing it a live connection: it can read,
        and it can write, straight to real data. That is powerful and dangerous.{' '}
        <a href="https://github.com/argon-lab/argon">Argon</a>’s MCP server takes a
        different approach: instead of one shared database, it gives each agent a
        versioned, branchable MongoDB it can’t break — 13 tools to open a sandbox,
        write freely, then diff, merge, time-travel, or undo.
      </p>

      <h2>A 30-second MCP refresher</h2>
      <p>
        MCP is an open standard for connecting AI agents to tools and data. An MCP
        server exposes a set of tools — functions the model can call — over a
        simple protocol, usually stdio. Clients like Claude Code, Cursor, or any
        MCP-compatible app connect to the server and let the model invoke those
        tools mid-conversation. Point an agent at a MongoDB MCP server and it can
        query — and often mutate — your database as it works.
      </p>

      <h2>The problem with a live MongoDB over MCP</h2>
      <p>
        A straightforward MongoDB MCP server connects the agent to a database and
        exposes find, insert, update, and delete as tools. For read-only analysis
        that is genuinely useful. For anything that writes, the blast radius is
        your production data: an agent that misreads an instruction can corrupt or
        delete records at tool-call speed, and you often can’t tell what changed
        until later. There is no branch, no diff, no undo — just the live database
        and an optimistic model.
      </p>

      <h2>Argon’s MCP server: a sandbox per agent</h2>
      <p>
        Argon exposes MongoDB over MCP too, but every agent works inside its own{' '}
        <a href="/blog/mongodb-database-branching-explained">branch</a> — a real,
        isolated MongoDB rooted at your data. The agent reads and writes normally;
        production never sees it. When the agent is done, you (or another tool
        call) diff the branch, then merge the good work as a reviewed,
        exactly-once data PR — or discard it. The 13 tools cover the whole loop:
      </p>
      <ul>
        <li>Open a TTL sandbox off production (or off a pinned dataset).</li>
        <li>Read and write with ordinary MongoDB operations.</li>
        <li>Diff a branch against its parent to see exactly what changed.</li>
        <li>Preview and apply a merge — conflicts are reported, never silent.</li>
        <li>Time-travel: query the branch as of any point in its history.</li>
        <li>Undo: revert one actor’s writes as a range, leaving others intact.</li>
        <li>Pins: freeze an immutable dataset so every eval run starts identical.</li>
      </ul>
      <p>
        The agent gets a disposable MongoDB it cannot destroy, and you get a review
        step before anything lands on production.
      </p>

      <h2>Add it to your agent in one line</h2>
      <p>
        Argon’s MCP server is a subcommand of the CLI, and it’s listed in the
        official <strong>MCP Registry</strong> as{' '}
        <code>io.github.argon-lab/argon</code>, so MCP-aware clients can discover
        it. To wire it into Claude Code, Cursor, or any MCP client:
      </p>
      <pre>
        <code>{`claude mcp add argon -- argon mcp`}</code>
      </pre>
      <p>The agent now has Argon’s tools over stdio.</p>

      <h2>What an agent loop looks like</h2>
      <ol>
        <li>
          <strong>sandbox create</strong> — the agent opens a branch off prod with
          a one-hour TTL.
        </li>
        <li>
          It reads and writes to the branch’s connection string to do its task.
        </li>
        <li>
          <strong>diff</strong> — it (or you) inspects exactly what changed.
        </li>
        <li>
          <strong>merge</strong> — the reviewed change lands on prod exactly once,
          or the branch is discarded.
        </li>
      </ol>
      <p>
        If something slips through, <strong>undo</strong> reverts just that agent’s
        writes — no full restore. And because pins give every run identical input,
        agent evaluations are reproducible. See the{' '}
        <a href="/agents">agents page</a> for the full picture, or the{' '}
        <a href="https://github.com/argon-lab/argon/tree/master/docs">docs</a> for
        every tool.
      </p>
    </ArticleLayout>
  );
}
