import Link from "next/link";
import HeroDemo from "./components/HeroDemo";
import QuickStartCommand from "./components/QuickStartCommand";
import ReviewWorkflow from "./components/ReviewWorkflow";
import Capabilities from "./components/Capabilities";
import { ActionLink } from "./components/Funnel";
import { product } from "./product";
export default function HomePage() {
  return (
    <>
      <section className="border-b border-brand-edge">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-24">
          <div className="min-w-0">
            <p className="kicker mb-5">Open source · MIT · self-hosted</p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Git for MongoDB,
              <br />
              built for AI agents
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8">
              Give each agent a branch of your business database. Review its
              changes, merge the work you accept, and undo mistakes. Experiments
              stay on their branches; applying a merge explicitly changes the
              target.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ActionLink
                href={product.demo}
                event="demo_opened"
                className="btn-solid"
              >
                Open demo
              </ActionLink>
              <ActionLink
                href={product.quickstart}
                event="quickstart_opened"
                className="btn-quiet"
              >
                Start locally
              </ActionLink>
            </div>
            <p className="mt-3 text-sm">
              No login for the demo. Sample data, isolated to your session.
            </p>
            <div className="mt-8">
              <QuickStartCommand />
            </div>
          </div>
          <div className="min-w-0">
            <HeroDemo />
            <p className="mt-3 text-sm">
              <Link href="/demo" className="prose-link">
                Explore the walkthrough →
              </Link>
            </p>
          </div>
        </div>
        <div className="border-t border-brand-edge px-6 py-4">
          <p className="mx-auto max-w-6xl text-sm leading-6">
            Published release: v{product.version} · Preparing v
            {product.upcomingVersion} · Branch databases, reviewable merges and
            agent workflows. Next: {product.roadmap.join(" · ")}.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-6 pb-20">
        <ReviewWorkflow />
        <section className="mt-16">
          <p className="kicker mb-4">Evidence, with its scope</p>
          <div className="grid gap-px border border-brand-edge bg-brand-edge sm:grid-cols-3">
            {[
              ["0.86 ms", "Historical metadata branch p50"],
              ["479 B", "Historical metadata bytes per branch"],
              ["Diff → merge → undo", "A review loop over your business data"],
            ].map(([stat, label]) => (
              <div key={stat} className="bg-brand-surface p-6">
                <p className="font-mono text-3xl text-brand-primary">{stat}</p>
                <p className="mt-3 text-sm">{label}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-7">
            The 0.86 ms / 479 B measurements use engine <code>8bf0f1e</code> and
            a 50k-entry project. They measure metadata branching, excluding
            physical checkout, sandbox readiness and MongoDB storage. Read the{" "}
            <a
              className="prose-link"
              href="https://github.com/argon-lab/benchmarks/blob/main/RESULTS.md"
            >
              versioned results and reproduction steps
            </a>{" "}
            for current end-to-end measurements.
          </p>
        </section>
        <Capabilities />
        <section className="mt-16 border-t border-brand-edge pt-12">
          <h2 className="text-3xl font-semibold">
            Try the complete review loop
          </h2>
          <p className="mt-4 max-w-2xl leading-7">
            Begin with the hosted sample, then run the same order workflow
            against your own local MongoDB replica set.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ActionLink
              href={product.demo}
              event="demo_opened"
              className="btn-solid"
            >
              Open demo
            </ActionLink>
            <ActionLink
              href={product.quickstart}
              event="quickstart_opened"
              className="btn-quiet"
            >
              Start locally
            </ActionLink>
          </div>
        </section>
      </div>
    </>
  );
}
