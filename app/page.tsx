import Link from "next/link";
import HeroDemo from "./components/HeroDemo";
import QuickStartCommand from "./components/QuickStartCommand";
import { ActionLink } from "./components/Funnel";
import { product } from "./product";

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
];

export default function HomePage() {
  return (
    <>
      <section className="border-b border-brand-edge">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:py-16 lg:grid-cols-[1fr_1.05fr] lg:gap-x-12 lg:py-20">
          <div className="min-w-0 lg:col-start-1">
            <p className="kicker mb-5">Open source · MIT · self-hosted</p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Git for MongoDB,
              <br />
              built for AI agents
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8">
              Give each agent its own database branch. Test changes, revisit
              earlier states, and review what to merge.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ActionLink
                href={product.demo}
                event="demo_opened"
                className="btn-solid"
              >
                Try live demo
              </ActionLink>
              <ActionLink
                href={product.quickstart}
                event="quickstart_opened"
                className="btn-quiet"
              >
                Start locally
              </ActionLink>
            </div>
            <p className="mt-3 text-sm leading-6">
              No login. Sample data in your own temporary session.
            </p>
          </div>
          <div className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
            <HeroDemo />
            <Link
              href="/demo"
              className="prose-link mt-3 inline-flex min-h-11 items-center text-sm"
            >
              How it works
            </Link>
          </div>
          <div className="min-w-0 lg:col-start-1 lg:row-start-2">
            <QuickStartCommand />
          </div>
        </div>
        <div className="border-t border-brand-edge px-6 py-4">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm leading-6">
            <p>Published release: v{product.version}</p>
            <a
              href={`https://github.com/argon-lab/argon/releases/tag/v${product.version}`}
              className="prose-link"
            >
              Read the release notes
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-20">
        <section className="py-16 sm:py-20" aria-labelledby="connect-heading">
          <div className="max-w-2xl">
            <h2
              id="connect-heading"
              className="text-3xl font-semibold tracking-tight"
            >
              Use the tools you already have
            </h2>
            <p className="mt-4 leading-7">
              An agent branch checks out as a real MongoDB database. Keep your
              usual driver; use Argon to manage its history and review its work.
            </p>
          </div>
          <div className="mt-9 grid border-y border-brand-edge md:grid-cols-3">
            {integrations.map((item) => (
              <div
                key={item.href}
                className="flex flex-col border-b border-brand-edge py-7 last:border-b-0 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              >
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-7">{item.detail}</p>
                <Link
                  href={item.href}
                  className="prose-link mt-4 inline-flex min-h-11 items-center self-start text-sm"
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="deployment-heading"
          className="grid gap-7 border-b border-brand-edge pb-16 sm:pb-20 lg:grid-cols-[1fr_2fr] lg:gap-12"
        >
          <h2
            id="deployment-heading"
            className="text-2xl font-semibold tracking-tight"
          >
            Try the idea.
            <br />
            Then use your data.
          </h2>
          <div>
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="font-mono text-sm text-brand-primary">
                  In the live demo
                </h3>
                <p className="mt-3 text-sm leading-7">
                  Compare two agents’ proposals on sample orders. Inspect a
                  conflict and undo a rejected change in a temporary session.
                </p>
              </div>
              <div>
                <h3 className="font-mono text-sm text-brand-primary">
                  In your deployment
                </h3>
                <p className="mt-3 text-sm leading-7">
                  Connect your own MongoDB replica set. Agents write to separate
                  branch databases; applying a reviewed merge changes the
                  target.
                </p>
              </div>
            </div>
            <p className="mt-7 text-sm leading-7">
              Time travel depends on retained history and complete capture.
              Physical checkout takes time and storage that depend on the
              dataset.{" "}
              <Link href="/features#capabilities" className="prose-link">
                Read the operating boundaries
              </Link>
              .
            </p>
          </div>
        </section>

        <section
          className="grid gap-7 border-b border-brand-edge py-12 lg:grid-cols-[1fr_2fr] lg:gap-12"
          aria-labelledby="evidence-heading"
        >
          <h2
            id="evidence-heading"
            className="text-2xl font-semibold tracking-tight"
          >
            Check the work
          </h2>
          <div>
            <p className="leading-7">
              The two-agent example checks the starting data, a real conflict,
              the accepted change, and the restored result. Run it locally
              without an LLM key.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-7 gap-y-2">
              <a
                href={product.example}
                className="prose-link inline-flex min-h-11 items-center text-sm"
              >
                Read the complete example
              </a>
              <a
                href="https://github.com/argon-lab/benchmarks/blob/main/RESULTS.md"
                className="prose-link inline-flex min-h-11 items-center text-sm"
              >
                Benchmarks and reproduction
              </a>
            </div>
            <details className="group mt-5 text-sm">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-brand-text-darker hover:text-brand-text">
                Historical metadata measurements
                <span aria-hidden="true" className="group-open:hidden">
                  +
                </span>
                <span aria-hidden="true" className="hidden group-open:block">
                  −
                </span>
              </summary>
              <p className="mt-3 leading-7">
                0.86 ms branch p50 and 479 B per metadata branch, measured with
                engine <code>8bf0f1e</code> on a 50k-entry project. These
                historical numbers exclude physical checkout, sandbox readiness,
                and MongoDB storage. The benchmark report includes end-to-end
                measurements and their scope.
              </p>
            </details>
          </div>
        </section>

        <section className="flex flex-col items-start justify-between gap-7 pt-14 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Review your first change
            </h2>
            <p className="mt-3 leading-7">
              Start with a sample order. See what the agent changed.
            </p>
          </div>
          <ActionLink
            href={product.demo}
            event="demo_opened"
            className="btn-solid shrink-0"
          >
            Try live demo
          </ActionLink>
        </section>
      </div>
    </>
  );
}
