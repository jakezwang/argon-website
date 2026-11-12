import Link from "next/link";
import { pageMetadata } from "../metadata";
import CodeBlock from "../components/CodeBlock";
import QuickStartCommand from "../components/QuickStartCommand";
import { product } from "../product";

export const metadata = pageMetadata(
  "Argon CLI (argonctl): Install and Command Reference",
  "Install the Argon CLI and see every command group: MongoDB sandboxes, diff and merge, pins, branches, time travel, undo and the MCP server.",
  "/cli",
);

const reference = "https://github.com/argon-lab/argon/blob/master/docs/CLI.md";

const groups: {
  id: string;
  title: string;
  lead: string;
  code: string;
  note?: string;
}[] = [
  {
    id: "sandboxes",
    title: "Sandboxes",
    lead: "A sandbox is a branch forked from a parent, checked out into its own MongoDB database and given a time to live. Hand its connection string to an agent.",
    code: `argon sandbox create -p <project> --ttl 1h
argon sandbox create -p <project> --ttl 1h --watch --actor agent:run-1
argon sandbox list    -p <project>
argon sandbox keep    -p <project> -b <sandbox>
argon sandbox discard -p <project> -b <sandbox>
argon sandbox sweep   -p <project>`,
    note: "--watch (2.3.0 and newer) captures the sandbox's writes in the foreground until you stop it. keep removes the TTL; sweep discards every expired sandbox. A collection the agent creates needs argon collections prepare before its first update or delete.",
  },
  {
    id: "review",
    title: "Review and merge",
    lead: "See what a sandbox or branch changed, save that as a plan, then apply exactly that plan.",
    code: `argon diff          -p <project> -b <branch>
argon merge preview -p <project> -b <branch>
argon merge apply <plan-id>
argon merge list    -p <project>`,
    note: "A plan applies once and is refused if the parent has moved since the preview. Conflicts stop the merge unless you pass --strategy theirs or --strategy ours.",
  },
  {
    id: "pins",
    title: "Pins",
    lead: "A pin names a captured state so every evaluation run can start from the same data.",
    code: `argon pin create  -p <project> --name eval-v1
argon pin sandbox -p <project> --name eval-v1 --ttl 1h
argon pin branch  -p <project> --name eval-v1 --as <new-branch>
argon pin list    -p <project>
argon pin delete  -p <project> --name eval-v1`,
    note: "A pin protects the history it references while it exists. It is not a backup.",
  },
  {
    id: "branches",
    title: "Projects, branches and real databases",
    lead: "Bring data in, branch it, and check a branch out as an ordinary MongoDB database.",
    code: `argon import database --uri <mongodb-uri> --database <db> --project <project> --source-quiesced
argon projects create <project>
argon branches create <branch> -p <project>
argon checkout -p <project> -b <branch>
argon collections prepare <collection> -p <project> -b <branch>
argon watch    -p <project> -b <branch> --actor <label>
argon release  -p <project> -b <branch>`,
    note: "Creating a branch writes metadata only. checkout materializes the data and prints a connection string; watch records writes made through it.",
  },
  {
    id: "history",
    title: "Time travel, undo and restore",
    lead: "Read an earlier state, revert a range of changes, or rewind a branch.",
    code: `argon time-travel info  -p <project> -b <branch>
argon time-travel query -p <project> -b <branch> --lsn <lsn>
argon undo -p <project> -b <branch> --from-lsn <lsn> --actor <label> --dry-run
argon restore preview -p <project> -b <branch> --time <rfc3339>
argon restore reset   -p <project> -b <branch> --time <rfc3339> --backup <name>
argon restore branch  -p <project> -b <branch> --lsn <lsn> --as <new-branch>`,
    note: "History is available within the retention window and where capture was complete. Undo appends new entries; it never rewrites history.",
  },
  {
    id: "servers",
    title: "Agents, console and health",
    lead: "Run the MCP server for Claude or Cursor, the local console and REST API, or check that MongoDB is ready.",
    code: `argon mcp
argon mcp --disable-tools argon_merge_apply
argon mcp --read-only
argon console --no-browser
argon proxy
argon doctor
argon status`,
    note: "The MCP server and the console manage capture and sandbox expiry for the sandboxes they create. The console and the proxy listen on the local machine by default.",
  },
];

const softwareLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Argon CLI (argonctl): install and command reference",
  about: { "@id": "https://argonlabs.tech/#software" },
  author: { "@id": "https://argonlabs.tech/#organization" },
  url: "https://argonlabs.tech/cli",
};

export default function CliPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-14 sm:pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
      />
      <h1 className="page-title max-w-3xl">The Argon CLI</h1>
      <p className="lede mt-6 max-w-2xl">
        One binary, <code className="font-mono text-[0.92em]">argon</code>,
        creates MongoDB sandboxes for AI agents and reviews what they wrote. It
        is published as the{" "}
        <code className="font-mono text-[0.92em]">argonctl</code> package on npm
        and Homebrew.
      </p>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-brand-muted">
        This is Argon from Argon Labs, the open-source MongoDB tool. It is not
        the Argon2 password-hashing utility or Argo CD. Current version:{" "}
        {product.version}.
      </p>

      <section id="install" className="mt-12 scroll-mt-24">
        <h2 className="section-title">Install</h2>
        <div className="mt-6 space-y-5 text-sm leading-7">
          <QuickStartCommand showSdk={false} />
          <CodeBlock
            label="Check the installed CLI"
            language="bash"
            code="argon --version"
          />
          <p>
            Argon needs MongoDB running as a replica set; one node is enough.
            Set <code>MONGODB_URI</code> and run <code>argon doctor</code> to
            check that it can capture changes. The{" "}
            <Link href="/quickstart" className="prose-link">
              quickstart
            </Link>{" "}
            starts a local database and runs a full review.
          </p>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="section-title">Commands by task</h2>
        <p className="mt-4 max-w-2xl leading-7">
          Most commands take <code>-p</code> for the project and <code>-b</code>{" "}
          for the branch, which defaults to <code>main</code>. Commands that
          print results accept <code>--output json</code> and write one JSON
          value to standard output.
        </p>
        <nav
          aria-label="Command groups"
          className="mt-6 flex flex-wrap gap-x-7 border-b border-brand-edge pb-6"
        >
          {groups.map((group) => (
            <a
              key={group.id}
              href={`#${group.id}`}
              className="prose-link inline-flex min-h-11 items-center text-sm font-medium"
            >
              {group.title}
            </a>
          ))}
        </nav>
        <div className="mt-10 space-y-14">
          {groups.map((group) => (
            <section key={group.id} id={group.id} className="scroll-mt-24">
              <h3 className="text-2xl font-semibold leading-9 text-brand-text">
                {group.title}
              </h3>
              <div className="mt-4 space-y-5 text-sm leading-7">
                <p className="max-w-2xl">{group.lead}</p>
                <CodeBlock
                  label={group.title}
                  language="bash"
                  code={group.code}
                />
                {group.note && (
                  <p className="max-w-2xl text-brand-text-darker">
                    {group.note}
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="panel mt-16 p-8 sm:p-10">
        <h2 className="section-title">Every flag</h2>
        <p className="mt-3 max-w-2xl leading-7">
          The complete reference, including import cleanup, snapshots, garbage
          collection and migration, lives with the source so it always matches
          the release. <code>argon &lt;command&gt; --help</code> prints the same
          information for the version you have installed.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={reference}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-solid"
          >
            Full CLI reference
          </a>
          <Link href="/agents" className="btn-quiet">
            Connect an agent
          </Link>
          <Link href="/features#capabilities" className="btn-quiet">
            Operating limits
          </Link>
        </div>
      </section>
    </div>
  );
}
