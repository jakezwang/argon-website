import { capabilities } from "../product";
export default function Capabilities() {
  return (
    <section className="mt-14" id="capabilities">
      <p className="kicker mb-5">What to expect</p>
      <div className="divide-y divide-brand-edge border border-brand-edge">
        {capabilities.map(([title, body]) => (
          <div key={title} className="grid gap-2 p-5 sm:grid-cols-[180px_1fr]">
            <h3 className="font-medium text-brand-text">{title}</h3>
            <p className="text-sm leading-6">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
