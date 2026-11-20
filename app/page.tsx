import Link from "next/link";
import HeroDemo from "./components/HeroDemo";
import QuickStartCommand from "./components/QuickStartCommand";
import { ActionLink } from "./components/Funnel";
import { features, product } from "./product";

// The two entries about a database in use carry their limit on this page too.
const limitOnHome: Record<string, string> = {
  source:
    "Tested on MongoDB 7.0 replica sets only: not on Atlas or with access control.",
  "write-back":
    "From the CLI only. Tested on MongoDB 7.0 replica sets only: not on Atlas or with access control.",
};

const integrations = [
  {
    title: "Connect an agent",
    detail: "Give Claude Code or Cursor database tools through MCP.",
    label: "Set up MCP",
    href: "/agents#mcp",
  },
  {
    title: "Build in Python",
    detail: "Run the review workflow with the SDK, then add it to your agent.",
    label: "Use the Python SDK",
    href: "/agents#python",
  },
  {
    title: "Use your own stack",
    detail: "Create sandboxes and inspect changes from any HTTP client.",
    label: "Call the REST API",
    href: "/agents#rest",
  },
  {
    title: "Pair with a code sandbox",
    detail:
      "Run agent-written code on an isolated boxd machine against an Argon sandbox.",
    label: "See the boxd integration",
    href: "/blog/connect-code-sandbox-to-mongodb-sandbox-boxd",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-14 sm:pt-20 lg:pt-24">
        <hgroup>
          <h1 className="display text-[2.75rem] text-brand-text sm:text-6xl lg:text-[5.25rem]">
            MongoDB sandboxes
            <br />
            for AI agents
          </h1>
          <p className="tagline mt-4 text-[1.375rem] text-brand-muted sm:mt-5 sm:text-3xl lg:mt-6 lg:text-[2.25rem]">
            <Link
              href="/features"
              className="text-brand-text transition-colors hover:text-brand-primary"
            >
              Git for MongoDB
            </Link>{" "}
            underneath.
          </p>
        </hgroup>
        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-12 lg:items-end">
          <p className="lede max-w-xl lg:col-span-6">
            Give every agent run its own real MongoDB database, forked from your
            data. Review what it changed, merge what works, and discard the
            rest.
          </p>
          <div className="lg:col-span-6 lg:justify-self-end">
            <div className="flex flex-wrap gap-3">
              <ActionLink
                href={product.demo}
                event="demo_opened"
                className="btn-solid"
              >
                {product.demoLabel}
              </ActionLink>
              <ActionLink
                href={product.quickstart}
                event="quickstart_opened"
                className="btn-quiet"
              >
                Start locally
              </ActionLink>
            </div>
            <p className="mt-3 text-sm leading-6 text-brand-muted">
              Open source under MIT. Self-hosted, on your own MongoDB.
            </p>
          </div>
        </div>

        <div className="mt-12 lg:mt-16">
          <HeroDemo />
          <p className="mt-3 text-sm leading-6 text-brand-muted">
            Illustrated workflow. Run the real engine locally.{" "}
            <Link
              href="/demo"
              className="prose-link inline-flex min-h-11 items-center"
            >
              How it works
            </Link>
          </p>
        </div>

        <div className="mt-10 grid gap-8 border-t border-brand-edge pt-10 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-7">
            <QuickStartCommand />
          </div>
          <div className="lg:col-span-5 lg:pt-1">
            <p className="text-sm leading-6 text-brand-text">
              Published release: v{product.version}
            </p>
            <p className="mt-1 text-sm leading-6">
              One CLI named{" "}
              <code className="font-mono text-[0.9em]">argon</code>. It runs the
              engine, the local console, the MCP server and the wire proxy.
            </p>
            <a
              href={`https://github.com/argon-lab/argon/releases/tag/v${product.version}`}
              className="prose-link mt-2 inline-flex min-h-11 items-center text-sm"
            >
              Read the release notes
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <section className="pt-24 sm:pt-32" aria-labelledby="features-heading">
          <div className="max-w-2xl">
            <h2 id="features-heading" className="section-title">
              Git for MongoDB, command by command
            </h2>
            <p className="mt-5 leading-7">
              Every sandbox is a branch, so the workflow is the one you know
              from Git.
            </p>
          </div>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <li key={feature.id} className="min-w-0">
                <Link
                  href={`/features#${feature.id}`}
                  className="panel group flex h-full flex-col gap-3 p-5 transition-colors hover:border-brand-primary"
                >
                  <span className="font-semibold text-brand-text transition-colors group-hover:text-brand-primary">
                    {feature.name}
                  </span>
                  <code className="font-mono text-sm text-brand-muted">
                    {
                      feature.transcript[0][0].match(
                        /^argon(?: [a-z][a-z-]*)*/,
                      )?.[0]
                    }
                  </code>
                  {limitOnHome[feature.id] && (
                    <span className="text-sm leading-6 text-brand-muted">
                      {limitOnHome[feature.id]}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm leading-7">
            <Link href="/features" className="prose-link">
              See each command with its output and limits
            </Link>
          </p>
        </section>

        <section
          className="grid gap-10 pt-24 sm:pt-32 lg:grid-cols-12 lg:gap-12"
          aria-labelledby="connect-heading"
        >
          <div className="lg:col-span-5">
            <h2 id="connect-heading" className="section-title">
              Use the tools you already have
            </h2>
            <p className="mt-5 max-w-md leading-7">
              An agent branch checks out as a real MongoDB database. Keep your
              usual driver; use Argon to manage its history and review its work.
            </p>
          </div>
          <ul className="border-t border-brand-edge lg:col-span-7">
            {integrations.map((item) => (
              <li
                key={item.href}
                className="grid gap-x-8 gap-y-1 border-b border-brand-edge py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <div>
                  <h3 className="text-xl font-semibold text-brand-text">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6">{item.detail}</p>
                </div>
                <Link
                  href={item.href}
                  className="prose-link inline-flex min-h-11 items-center justify-self-start text-sm font-medium"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="grid gap-8 pt-24 sm:pt-32 lg:grid-cols-12 lg:gap-12"
          aria-labelledby="evidence-heading"
        >
          <h2 id="evidence-heading" className="section-title lg:col-span-5">
            Verify it yourself
          </h2>
          <div className="lg:col-span-7">
            <p className="lede">
              The two-agent example checks the starting data, a real conflict,
              the accepted change, and the restored result.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-1">
              <a
                href={product.example}
                className="prose-link inline-flex min-h-11 items-center text-sm font-medium"
              >
                Read the complete example
              </a>
              <a
                href="https://github.com/argon-lab/benchmarks/blob/main/RESULTS.md"
                className="prose-link inline-flex min-h-11 items-center text-sm font-medium"
              >
                Benchmarks and reproduction
              </a>
            </div>
          </div>
        </section>

        <section className="pt-24 sm:pt-32">
          <div className="panel flex flex-col items-start justify-between gap-8 p-8 sm:flex-row sm:items-center sm:p-12">
            <div>
              <h2 className="section-title">Review your first change</h2>
              <p className="mt-3 leading-7">
                Start with a sample order. See what the agent changed.
              </p>
            </div>
            <ActionLink
              href={product.demo}
              event="demo_opened"
              className="btn-solid shrink-0"
            >
              {product.demoLabel}
            </ActionLink>
          </div>
        </section>
      </div>
    </>
  );
}
