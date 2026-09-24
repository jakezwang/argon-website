import Link from "next/link";
import { install, limits, product } from "../product";
import { pageMetadata } from "../metadata";

export const metadata = pageMetadata(
  "FAQ",
  "Answers about MongoDB branching, capture, retained history, merge, agent sandboxes, and installing Argon.",
  "/faq",
);

const faq = [
  {
    q: "What is Argon?",
    a: "Argon is an MIT-licensed, self-hosted versioning layer for MongoDB. It adds branching, time travel, reviewed merge and per-actor undo. The hosted console is a temporary sample-data demo.",
    href: "/features",
    label: "Explore the features",
  },
  {
    q: "How is a branch different from a database dump?",
    a: `A dump is a standalone copy without Argon's branch history or merge workflow. ${limits.branching}`,
    href: "/blog/mongodb-database-branching-explained",
    label: "How database branching works",
  },
  {
    q: "Can I use my existing driver?",
    a: "Yes. argon checkout materializes a branch and prints a MongoDB connection string. Drivers, mongosh and Compass connect to that database. Keep capture healthy while writing, and prepare new collections for exact images before updates.",
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
    a: `Engine ${product.version}: ${install.cli}. Python SDK ${product.sdkVersion}: ${install.langgraph}. The SDK command installs the matching Git release; use a Python virtual environment.`,
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
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <p className="kicker mb-4">FAQ</p>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Frequently asked questions
      </h1>
      <p className="mt-3 leading-7">
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
      <dl className="mt-12 divide-y divide-brand-edge border-y border-brand-edge">
        {faq.map(({ q, a, href, label }, index) => (
          <div key={q} className="py-6">
            <dt className="flex gap-4">
              <span className="font-mono text-xs leading-6 text-brand-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-medium">{q}</span>
            </dt>
            <dd className="mt-2 break-words pl-10 text-sm leading-6 text-brand-text-darker">
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
