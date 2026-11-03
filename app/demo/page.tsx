import { pageMetadata } from "../metadata";
import InteractiveDemo from "../components/InteractiveDemo";
import ReviewWorkflow from "../components/ReviewWorkflow";
import { ActionLink } from "../components/Funnel";
import { product } from "../product";
export const metadata = pageMetadata(
  "How it works: Review MongoDB Changes",
  "Explore illustrated Argon branching and review workflows. The hosted console is paused; run the real engine locally with the quickstart.",
  "/demo",
);
export default function DemoPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="kicker mb-4">How it works</p>
      <h1 className="text-4xl font-semibold">Explore a data review</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8">
        Follow branching, time travel, and merge review with the illustrated
        workflows below. They run in your browser without a database connection.
        To try actual MongoDB writes, start Argon locally.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <ActionLink
          href={product.quickstart}
          event="quickstart_opened"
          className="btn-solid"
        >
          Start locally
        </ActionLink>
      </div>
      <p className="mt-4 text-sm leading-7">
        <strong className="text-brand-text">{product.demoStatus}.</strong> The
        local quickstart runs the real engine with your own MongoDB replica set.
      </p>
      <ReviewWorkflow />
      <section className="mt-14">
        <h2 className="mb-5 text-2xl font-semibold">Explore the concepts</h2>
        <p className="mb-5 text-sm">
          This illustrated walkthrough is a simulation. Run Argon locally to
          inspect actual document changes.
        </p>
        <InteractiveDemo />
      </section>
    </div>
  );
}
