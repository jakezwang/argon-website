import { product, reviewSteps } from "../product";
export default function ReviewWorkflow() {
  return (
    <section id="review-workflow" className="mt-14">
      <p className="kicker mb-4">One order. Two agents. One decision.</p>
      <h2 className="max-w-2xl text-3xl font-semibold text-brand-text">
        Review changes to your business data
      </h2>
      <p className="mt-4 max-w-2xl leading-7">
        Conversation checkpoints do not capture changes to external orders and
        prices. This example makes the MongoDB data itself reviewable.
      </p>
      <div className="mt-8 grid gap-px border border-brand-edge bg-brand-edge md:grid-cols-2">
        {reviewSteps.map(([title, body]) => (
          <div key={title} className="bg-brand-surface p-6">
            <h3 className="font-mono text-sm text-brand-primary">{title}</h3>
            <p className="mt-3 text-sm leading-7">{body}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm leading-7">
        Run the{" "}
        <a href={product.example} className="prose-link">
          complete Python example
        </a>{" "}
        with the{" "}
        <a href="/quickstart" className="prose-link">
          local quickstart
        </a>
        . It asserts identical input, a real conflict, accepted data and the
        restored result. No LLM key is required.
      </p>
    </section>
  );
}
