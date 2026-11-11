import { product, reviewSteps } from "../product";
export default function ReviewWorkflow() {
  return (
    <section id="review-workflow" className="mt-24 scroll-mt-24">
      <h2 className="section-title max-w-3xl">
        Review changes to your business data
      </h2>
      <p className="lede mt-5 max-w-2xl">
        One order, two agents, one decision. Conversation checkpoints do not
        capture changes to external orders and prices. This example makes the
        MongoDB data itself reviewable.
      </p>
      <ol className="mt-12 grid gap-y-10 md:grid-cols-2 lg:grid-cols-4">
        {reviewSteps.map(([title, body], index) => (
          <li key={title}>
            <div className="flex items-center" aria-hidden="true">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-primary text-sm font-semibold tabular-nums text-brand-primary">
                {index + 1}
              </span>
              <span className="h-px flex-1 bg-brand-edge-strong" />
            </div>
            <h3 className="mt-5 pr-8 text-lg font-semibold text-brand-text">
              {title}
            </h3>
            <p className="mt-2 pr-8 text-sm leading-6">{body}</p>
          </li>
        ))}
      </ol>
      <p className="mt-10 max-w-3xl text-sm leading-7">
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
