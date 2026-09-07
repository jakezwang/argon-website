import ReviewWorkflow from "../components/ReviewWorkflow";
import Capabilities from "../components/Capabilities";
import { ActionLink } from "../components/Funnel";
import { product } from "../product";
export const metadata = {
  title: "MongoDB Sandboxes for AI Agents",
  description:
    "Review two agents changing the same MongoDB order: fork one pinned dataset, inspect conflicts, merge a proposal and undo mistakes.",
  alternates: { canonical: "/agents" },
};
export default function AgentsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="kicker mb-4">For AI agents</p>
      <h1 className="max-w-3xl text-4xl font-semibold">
        Let agents propose database changes you can review
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8">
        One branch per run. Ordinary MongoDB drivers. A shared baseline for fair
        evaluation, with a diff and an explicit merge decision.
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
          Run the Python example
        </ActionLink>
      </div>
      <ReviewWorkflow />
      <Capabilities />
    </div>
  );
}
