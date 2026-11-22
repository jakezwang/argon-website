import { pageMetadata } from "../metadata";
import InteractiveDemo from "../components/InteractiveDemo";
import ReviewWorkflow from "../components/ReviewWorkflow";
import UnderTheHood from "../components/UnderTheHood";
import { ActionLink } from "../components/Funnel";
import { product } from "../product";
export const metadata = pageMetadata(
  "How Argon Works: MongoDB Branching, Review and Architecture",
  "Step through MongoDB branching, merge review and time travel, then see how Argon works: change streams, an ordered log of document changes and branch pointers.",
  "/demo",
);
export default function DemoPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-14 sm:pt-20">
      <h1 className="page-title">Walk through a data review</h1>
      <p className="lede mt-6 max-w-2xl">
        Step through branching, time travel and merge review in your browser.
        These walkthroughs are simulated; to see real MongoDB writes, start
        Argon locally.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ActionLink
          href={product.quickstart}
          event="quickstart_opened"
          className="btn-solid"
        >
          Start locally
        </ActionLink>
        <a href="/quickstart#order-review" className="btn-quiet">
          Test a return that changes the wrong order
        </a>
      </div>
      <p className="mt-4 text-sm leading-7">
        <strong className="text-brand-text">{product.demoStatus}.</strong>
      </p>
      <ReviewWorkflow />
      <section className="mt-24">
        <h2 className="section-title mb-8">Explore the concepts</h2>
        <InteractiveDemo />
      </section>
      <UnderTheHood />
    </div>
  );
}
