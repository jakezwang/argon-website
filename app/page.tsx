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
      <section className="mx-auto max-w-6xl px-6 pt-14 sm:pt-20 lg:pt-24">
        <h1 className="display text-[2.75rem] text-brand-text sm:text-6xl lg:text-[5.25rem]">
          Git for MongoDB,
          <br />
          built for AI agents
        </h1>
        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-12 lg:items-end">
          <p className="lede max-w-xl lg:col-span-6">
            Give each agent its own database branch. Test changes, revisit
            earlier states, and review what to merge.
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
          aria-labelledby="deployment-heading"
          className="pt-24 sm:pt-32"
        >
          <h2 id="deployment-heading" className="section-title">
            Try the idea.
            <br />
            Then use your data.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="panel p-7 sm:p-8">
              <h3 className="text-xl font-semibold text-brand-text">
                In the walkthrough
              </h3>
              <p className="mt-3 leading-7">
                Follow sample document states through branching, review, and a
                merge. The illustration runs in your browser.
              </p>
            </div>
            <div className="panel p-7 sm:p-8">
              <h3 className="text-xl font-semibold text-brand-text">
                In your deployment
              </h3>
              <p className="mt-3 leading-7">
                Connect your own MongoDB replica set. Agents write to separate
                branch databases; applying a reviewed merge changes the target.
              </p>
            </div>
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-7">
            Time travel depends on retained history and complete capture.
            Physical checkout takes time and storage that depend on the dataset.{" "}
            <Link href="/features#capabilities" className="prose-link">
              Read the operating boundaries
            </Link>
            .
          </p>
        </section>

        <section
          className="grid gap-8 pt-24 sm:pt-32 lg:grid-cols-12 lg:gap-12"
          aria-labelledby="evidence-heading"
        >
          <h2 id="evidence-heading" className="section-title lg:col-span-5">
            Check the work
          </h2>
          <div className="lg:col-span-7">
            <p className="lede">
              The two-agent example checks the starting data, a real conflict,
              the accepted change, and the restored result. Run it locally
              without an LLM key.
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
            <details className="group mt-6 border-y border-brand-edge text-sm">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 font-medium text-brand-text hover:text-brand-primary [&::-webkit-details-marker]:hidden">
                Historical metadata measurements
                <svg
                  viewBox="0 0 16 16"
                  className="h-4 w-4 shrink-0 transition-transform group-open:rotate-45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M8 3v10M3 8h10" />
                </svg>
              </summary>
              <p className="pb-5 leading-7">
                0.86 ms branch p50 and 479 B per metadata branch, measured with
                engine <code className="font-mono text-[0.9em]">8bf0f1e</code>{" "}
                on a 50k-entry project. These historical numbers exclude
                physical checkout, sandbox readiness, and MongoDB storage. The
                benchmark report includes end-to-end measurements and their
                scope.
              </p>
            </details>
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
