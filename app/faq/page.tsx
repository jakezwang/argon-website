import Link from "next/link";
import { install, limits, product } from "../product";
import { pageMetadata } from "../metadata";

export const metadata = pageMetadata(
  "Argon FAQ: MongoDB Sandboxes, Branching and AI Agents",
  "Answers about MongoDB sandboxes for AI agents, branching, capture, retained history, merge, sandbox cleanup, and installing Argon.",
  "/faq",
);

const faq = [
  {
    q: "What is Argon?",
    a: "Argon gives AI agents disposable MongoDB sandboxes. Each agent run gets a real MongoDB database forked from your data; you review what it changed, then merge or discard it. Underneath it is an MIT-licensed, self-hosted versioning layer for MongoDB with branching, time travel, reviewed merge and per-actor undo. The hosted console is currently paused; the illustrated walkthrough and local quickstart remain available.",
    href: "/features",
    label: "Explore the features",
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
    q: "How do I clean up MongoDB agent sandboxes with a TTL?",
    a: `Every sandbox has a time to live, one hour by default, set with --ttl. Reaching it makes the sandbox eligible for cleanup. ${limits.lifecycle} argon sandbox discard removes one sandbox immediately, and argon sandbox keep removes the TTL from one you want to keep.`,
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
    a: `A dump is a standalone copy without Argon's branch history or merge workflow. ${limits.branching}`,
    href: "/blog/mongodb-database-branching-explained",
    label: "How database branching works",
  },
  {
    q: "Can I use my existing driver?",
    a: "Yes. argon checkout materializes a branch and prints a MongoDB connection string. Drivers, mongosh and Compass connect to that database. Keep capture healthy while writing. From 2.3.1, a collection your application creates is captured exactly while capture is running; on older versions, prepare new collections for exact images before updates.",
    href: "/quickstart",
    label: "Start locally",
  },
  {
    q: "What are the requirements?",
    a: "Use a MongoDB replica set, including a single-node local set, or a compatible Atlas deployment. Change streams do not work on a standalone mongod. Exact pre/post images and the necessary MongoDB permissions are required for supported restoration. Run argon doctor before a workload.",
    href: "/quickstart#mongodb",
    label: "Set up MongoDB",
  },
  {
    q: "Are branches an access-control boundary?",
    a: limits.isolation,
    href: "/features#capabilities",
    label: "Operating limits",
  },
  {
    q: "Can every change be undone?",
    a: `${limits.undo} ${limits.attribution}`,
    href: "/features#capabilities",
    label: "Capture and attribution",
  },
  {
    q: "How far back can I time-travel?",
    a: limits.retention,
    href: "/blog/mongodb-time-travel-vs-point-in-time-recovery",
    label: "Time travel and backups",
  },
  {
    q: "Who manages capture and sandbox expiry?",
    a: limits.lifecycle,
    href: "/agents",
    label: "Connect an agent",
  },
  {
    q: "How fast is branching?",
    a: "Creating branch metadata does not copy documents. Physical checkout, sandbox readiness, historical queries and MongoDB storage have separate costs that depend on the dataset and workload. Benchmark numbers apply to the documented engine version and measurement scope.",
    href: "https://github.com/argon-lab/benchmarks",
    label: "Reproduce the benchmarks",
  },
  {
    q: "How do I install Argon?",
    a: `Engine ${product.version}: ${install.cli}. Use npm 11.16+ with a supported Node.js version; the flag allows only argonctl's binary installer, which checks the download against the SHA-256 published with the package before installing it. Python SDK ${product.sdkVersion}: ${install.langgraph}. The SDK command installs the matching PyPI release; use a Python virtual environment.`,
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
