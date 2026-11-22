import Link from "next/link";
import { install } from "../product";
import { pageMetadata } from "../metadata";

export const metadata = pageMetadata(
  "Argon FAQ: MongoDB Sandboxes, Branching and AI Agents",
  "Answers on MongoDB sandboxes for AI agents: Git for MongoDB, Atlas, importing a live database, write-back, sandbox credentials and cleanup, and installing Argon.",
  "/faq",
);

const faq = [
  {
    q: "What is Argon?",
    a: "Argon gives AI agents disposable MongoDB sandboxes. Each agent run gets a real MongoDB database forked from your data; you review what it changed, then merge or discard it. Underneath it is Git for MongoDB: an MIT-licensed, self-hosted versioning layer with branching, time travel, reviewed merge and per-actor undo.",
    href: "/features",
    label: "Explore the features",
  },
  {
    q: "Is Argon Git for MongoDB?",
    a: `Yes. Argon keeps a history of your MongoDB documents that you can branch, diff, merge, read at an earlier position and undo, with commands that mirror Git: argon branches create, argon diff, argon merge preview, argon undo. A sandbox for an agent run is a branch checked out as a real MongoDB database, much as a Git worktree is a branch checked out in its own directory. Unlike Git there is no commit step: a running capture process records each change.`,
    href: "/features",
    label: "Git and Argon side by side",
  },
  {
    q: "How do I give an AI agent a MongoDB sandbox?",
    a: "Create a sandbox and hand its connection string to the agent. From the CLI, argon sandbox create -p <project> --ttl 1h forks a branch, checks it out into its own MongoDB database and sets an expiry. Agents connected through the MCP server or the REST API create sandboxes themselves, and that server manages capture and expiry. The agent uses an ordinary MongoDB driver.",
    href: "/agents",
    label: "Connect an agent",
  },
  {
    q: "What is the difference between a code sandbox and a data sandbox?",
    a: "A code sandbox such as E2B, Modal or Daytona isolates the machine that agent-written code runs on. It does not contain writes that the code sends to a database over a connection string. A data sandbox is an isolated, disposable copy of the database for one run, with a record of what changed and a way to merge or discard it. Argon is a data sandbox for MongoDB; the two are used together.",
    href: "/blog/code-sandbox-vs-data-sandbox-for-ai-agents",
    label: "Code sandbox vs data sandbox",
  },
  {
    q: "Is there a Neon-style branching workflow for MongoDB?",
    a: "Yes, with differences. Argon adds branches, retained-history reads, reviewed merge and undo to MongoDB. It is a self-hosted engine, not a managed service, and a branch must be checked out into a physical MongoDB database before drivers can query it, which takes time and storage in proportion to the data.",
    href: "/blog/database-branching-tools-compared",
    label: "Branching tools compared",
  },
  {
    q: "How do I review conflicting MongoDB changes from two AI agents?",
    a: "Give each agent its own sandbox from the same pinned state, then preview the merge of each. The first plan applies cleanly. The second reports a conflict for every document both agents changed, with both versions, and nothing is merged until you choose a strategy or discard the run. Conflicts are never resolved silently.",
    href: "/blog/two-ai-agents-one-mongodb-document",
    label: "Two agents, one document",
  },
  {
    q: "How do I clean up MongoDB sandboxes with a TTL, and who runs capture?",
    a: "Every sandbox has a time to live, one hour by default, set with --ttl. The next sweep after it expires removes the sandbox; a running MCP server or REST service sweeps and captures for you, and with the CLI alone you run argon watch and schedule argon sandbox sweep. argon sandbox discard removes a sandbox at once, and argon sandbox keep removes its TTL. A TTL does not stop the agent process.",
    href: "/cli#sandboxes",
    label: "Sandbox commands",
  },
  {
    q: "Is this Argon related to Argon2 or Argo CD?",
    a: "No. Argon here is the open-source MongoDB tool from Argon Labs. Its CLI is installed as the argonctl package and run as argon. It is unrelated to the Argon2 password-hashing algorithm and its command-line utility, and to the Argo projects for Kubernetes.",
    href: "/cli",
    label: "The Argon CLI",
  },
  {
    q: "How is a branch different from a database dump?",
    a: "A dump is a standalone copy without history. A branch is metadata in Argon's log; checkout turns it into a real database when you need one.",
    href: "/blog/mongodb-database-branching-explained",
    label: "How database branching works",
  },
  {
    q: "Can I use my existing driver?",
    a: "Yes. argon checkout materializes a branch and prints a MongoDB connection string. Drivers, mongosh and Compass connect to that database. Keep capture running while you write so the changes are recorded.",
    href: "/quickstart",
    label: "Start locally",
  },
  {
    q: "Does Argon work with MongoDB Atlas?",
    a: "Yes, as the database Argon imports, follows and writes back to. Run the engine on a replica set you manage and point argon import database --online at the Atlas connection string. It is tested on free M0 and dedicated M10 clusters with least-privilege custom roles. Running the engine itself on Atlas is not tested.",
    href: "https://github.com/argon-lab/argon/blob/v2.12.0/docs/OPERATIONS.md#mongodb-atlas-as-a-source",
    label: "Atlas roles and limits",
  },
  {
    q: "What are the requirements?",
    a: "Use a MongoDB replica set, including a single-node local set, or a compatible Atlas deployment. Change streams do not work on a standalone mongod. Exact pre/post images and the necessary MongoDB permissions are required for supported restoration. Run argon doctor before a workload.",
    href: "/quickstart#mongodb",
    label: "Set up MongoDB",
  },
  {
    q: "Are branches an access-control boundary?",
    a: "No. Each experiment writes to its own database and nothing reaches the target until a reviewed merge is applied, but access isolation comes from MongoDB credentials and network controls.",
    href: "/features#capabilities",
    label: "Operating limits",
  },
  {
    q: "Can I limit what an agent's database connection can reach?",
    a: "Yes. Create the sandbox with argon sandbox create --credential, or credential=True in the Python SDK. Its connection string then carries a MongoDB user that can read and write only that sandbox's database, and discarding or sweeping the sandbox revokes the user.",
    href: "/cli#sandboxes",
    label: "Sandbox commands",
  },
  {
    q: "Can every change be undone?",
    a: "Changes captured with complete images, within retained history. Undo filters by the actor label of a branch, so give each agent its own branch.",
    href: "/features#capabilities",
    label: "Capture and attribution",
  },
  {
    q: "How far back can I time-travel?",
    a: "As far as history is retained. A pin keeps the state it names from being reclaimed; a reclaimed position returns an error, not a partial answer.",
    href: "/blog/mongodb-time-travel-vs-point-in-time-recovery",
    label: "Time travel and backups",
  },
  {
    q: "Can Argon import a database that is in use and keep up with it?",
    a: "Yes. argon import database --online copies a replica-set database while your application keeps writing to it, and argon source follow keeps main current, so each sandbox forks from recent data. It is tested with MongoDB 6.0 to 8.0 and Atlas, not with sharded clusters.",
    href: "/features#source",
    label: "Following a database in use",
  },
  {
    q: "Can Argon write a reviewed change back to the database it follows?",
    a: "Yes, from the CLI. Review the plan, optionally run argon merge check to catch unique-key collisions, then pass the plan's approval digest to argon merge apply --write-back. The write is one transaction: without a matching digest, or if a document changed on the source since the review, nothing is written.",
    href: "/features#write-back",
    label: "Write a reviewed change back",
  },
  {
    q: "How fast is branching?",
    a: "Creating a branch writes metadata and copies no documents. Checkout, historical queries and storage cost more and depend on the dataset.",
    href: "https://github.com/argon-lab/benchmarks",
    label: "Reproduce the benchmarks",
  },
  {
    q: "How do I install Argon?",
    a: `CLI: ${install.cli}, or brew install argon-lab/tap/argonctl. Python SDK: ${install.langgraph}, in a virtual environment.`,
    href: "/quickstart",
    label: "Run the full setup",
  },
];
const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-14 sm:pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <h1 className="page-title">Frequently asked questions</h1>
      <p className="lede mt-6 max-w-2xl">
        Short answers about running agents against MongoDB. Ask the maintainers
        in{" "}
        <a
          className="prose-link"
          href="https://github.com/argon-lab/argon/discussions"
        >
          Discussions
        </a>
        .
      </p>
      <dl className="mt-14 divide-y divide-brand-edge border-y border-brand-edge-strong">
        {faq.map(({ q, a, href, label }) => (
          <div
            key={q}
            className="grid gap-x-12 gap-y-3 py-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
          >
            <dt className="text-xl font-semibold leading-7 text-brand-text">
              {q}
            </dt>
            <dd className="wrap-break-word leading-7 text-brand-text-darker">
              {a}{" "}
              <Link className="prose-link" href={href}>
                {label}
              </Link>
              .
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
