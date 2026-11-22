import { capabilities } from "../product";
export default function Capabilities() {
  return (
    <section className="mt-24 scroll-mt-24" id="capabilities">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <h2 className="section-title">What to expect</h2>
          <p className="mt-4 max-w-sm leading-7">
            The operating boundaries, stated plainly. Open any item for the
            details.
          </p>
        </div>
        <dl className="border-t border-brand-edge-strong lg:col-span-8">
          {capabilities.map(([title, body, lead]) => (
            <div
              key={title}
              className="grid gap-x-8 gap-y-1 border-b border-brand-edge py-5 sm:grid-cols-[11rem_minmax(0,1fr)]"
            >
              <dt className="pt-0.5 font-semibold text-brand-text">{title}</dt>
              <dd>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 leading-6 text-brand-text hover:text-brand-primary [&::-webkit-details-marker]:hidden">
                    <span className="font-medium">{lead}</span>
                    <svg
                      viewBox="0 0 16 16"
                      className="mt-1 h-4 w-4 shrink-0 text-brand-muted transition-transform group-open:rotate-45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden="true"
                    >
                      <path d="M8 3v10M3 8h10" />
                    </svg>
                  </summary>
                  <p className="mt-2 text-sm leading-6 text-brand-text-darker">
                    {body}
                  </p>
                </details>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
