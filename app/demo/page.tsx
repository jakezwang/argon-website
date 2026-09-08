import InteractiveDemo from "../components/InteractiveDemo";
import ReviewWorkflow from "../components/ReviewWorkflow";
import { ActionLink } from "../components/Funnel";
import { product } from "../product";
export const metadata = {
  title: "How it works: Review MongoDB Changes",
  description:
    "Open a session-scoped Argon demo, inspect changes and conflicts, apply a reviewed merge and undo sample writes.",
  alternates: { canonical: "/demo" },
};
export default function DemoPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="kicker mb-4">How it works</p>
      <h1 className="text-4xl font-semibold">Make your first data review</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8">
        Open the live console with sample orders and your own temporary session.
        Run the two-agent scenario: the script accepts planner’s proposal, then
        you inspect executor’s conflict and undo the rejected change. Continue
        locally to drive every step yourself.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
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
      <p className="mt-4 text-sm leading-7">
        The anonymous console exposes sample-data review tools. Native database
        connections require a local deployment. Your demo session expires
        automatically.
      </p>
      <ReviewWorkflow />
      <section className="mt-14">
        <h2 className="mb-5 text-2xl font-semibold">Explore the concepts</h2>
        <p className="mb-5 text-sm">
          This illustrated walkthrough is a simulation; the console above runs
          the real engine.
        </p>
        <InteractiveDemo />
      </section>
    </div>
  );
}
