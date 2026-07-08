import ArticleLayout from '../ArticleLayout';
import { getPost } from '../posts';

const post = getPost('disposable-mongodb-sandbox-for-ai-agents')!;

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
    q: 'Why can’t an AI agent just use the production database?',
    a: 'Because the blast radius is your whole business. An agent that misreads an instruction can delete or corrupt live data, and you often cannot tell what it changed until later. A branch gives the agent a real database to work in while production stays untouched.',
  },
  {
    q: 'How does an AI agent get its own database?',
    a: 'With Argon, the agent (or your orchestration code) calls a single command or MCP tool to create a sandbox branch. It gets back an ordinary MongoDB connection string and reads and writes normally — no special SDK.',
  },
  {
    q: 'What is an MCP server for MongoDB?',
    a: 'Model Context Protocol (MCP) is a standard way to expose tools to AI agents. Argon ships an MCP server with 13 tools so an agent can branch, diff, merge, time-travel, and undo a MongoDB database directly from clients like Claude or Cursor.',
  },
  {
    q: 'How do I make agent evaluations reproducible?',
    a: 'Use dataset pins: an immutable, named snapshot of the data. Every eval run forks from the same pin, so each run starts from byte-identical input and results are comparable.',
  },
];

export default function Page() {
  return (
    <ArticleLayout post={post} faq={faq}>
      <p>
        The fastest way to lose a database is to hand an AI agent a write
        connection to production. The agent is capable and confident, and it will
        occasionally do exactly the wrong thing at full speed. The fix is not to
        keep agents read-only forever — it is to give each one a{' '}
        <strong>disposable database it cannot destroy</strong>: a real MongoDB it
        can read, write, and wreck freely, because throwing it away costs nothing
        and production never saw it.
      </p>
      <p>
        That is the branch-per-agent pattern, and{' '}
        <a href="https://github.com/argon-lab/argon">Argon</a> is built to make it
        a one-liner.
      </p>

      <h2>The branch-per-agent loop</h2>
      <ol>
        <li>
          <strong>Fork a branch.</strong> Create a sandbox off production (or off
          a pinned dataset), optionally with a time-to-live so it cleans itself
          up.
        </li>
        <li>
          <strong>Let the agent work.</strong> Hand it the branch’s connection
          string. It reads and writes with any MongoDB driver — no code changes,
          no awareness that it is in a branch.
        </li>
        <li>
          <strong>Review the diff.</strong> When the agent is done, diff the
          branch against its parent to see exactly what it changed.
        </li>
        <li>
          <strong>Merge or discard.</strong> Merge the good work back as a
          reviewed, exactly-once data PR — or throw the whole branch away. Either
          way, production only ever sees changes you approved.
        </li>
      </ol>
      <p>
        Because every write is a revertible range, you also get a safety net
        after the fact: if something slips through, you can{' '}
        <a href="/blog/mongodb-database-branching-explained">undo</a> one agent’s
        changes without touching anyone else’s.
      </p>

      <h2>Wiring it up</h2>
      <p>
        Argon exposes the loop three ways so it fits however your agents run.
      </p>

      <h3>Over MCP (Claude Code, Cursor, any MCP client)</h3>
      <pre>
        <code>{`claude mcp add argon -- argon mcp`}</code>
      </pre>
      <p>
        The agent gets 13 tools — open a sandbox, diff, merge, time-travel, undo —
        as first-class actions over stdio. It manages its own database without you
        writing glue code.
      </p>

      <h3>From the CLI or CI</h3>
      <pre>
        <code>{`argon sandbox create -p prod --ttl 1h
# prints a real MongoDB URI — point the agent at it`}</code>
      </pre>

      <h3>From Python (LangGraph, Mem0)</h3>
      <pre>
        <code>{`pip install "argon-agents[langgraph]"`}</code>
      </pre>
      <p>
        A checkpointer that forks and rewinds conversation state on the same
        engine, plus a Mem0 sandbox factory for agent memory.
      </p>

      <h2>Reproducible evals with pins</h2>
      <p>
        Evaluations are only meaningful if every run starts from the same data. A{' '}
        <strong>dataset pin</strong> is an immutable, named state of the database;
        each eval run forks a fresh branch from the pin, so the input is identical
        every time and runs are comparable. Pins survive resets and garbage
        collection, so a benchmark you ran last month reproduces today.
      </p>

      <h2>Why this matters now</h2>
      <p>
        Agents are moving from reading data to acting on it, and the database is
        where actions become permanent. Giving every agent its own branch turns an
        irreversible operation into a reviewable one — the same shift that pull
        requests brought to code. Production stops being the place agents
        experiment, and starts being the place their reviewed work lands.
      </p>
    </ArticleLayout>
  );
}
