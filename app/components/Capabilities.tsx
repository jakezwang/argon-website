import { capabilities } from "../product";
export default function Capabilities() {
  return (
    <section className="mt-24 scroll-mt-24" id="capabilities">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <h2 className="section-title">What to expect</h2>
          <p className="mt-4 max-w-sm leading-7">
            The operating boundaries, stated plainly. Read these before you
            point an agent at data you care about.
          </p>
        </div>
        <dl className="border-t border-brand-edge-strong lg:col-span-8">
          {capabilities.map(([title, body, lead]) => (
            <div
              key={title}
              className="grid gap-x-8 gap-y-2 border-b border-brand-edge py-6 sm:grid-cols-[11rem_minmax(0,1fr)]"
            >
              <dt className="font-semibold text-brand-text">{title}</dt>
              <dd className="text-sm leading-6 text-brand-text-darker">
                <span className="mb-1.5 block text-base font-medium leading-6 text-brand-text">
                  {lead}
                </span>
                {body}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
