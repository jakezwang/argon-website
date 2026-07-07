import Link from 'next/link';
import InteractiveDemo from '../components/InteractiveDemo';

export default function DemoPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <p className="kicker mb-4">Demo</p>
      <h1 className="text-4xl font-semibold tracking-tight text-brand-text">
        Argon in action
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8">
        Simulated walkthroughs of real workflows for developers and ML
        engineers — step through the commands at your own pace.
      </p>

      <section className="mt-14">
        <InteractiveDemo />
      </section>

      <section className="mt-20 border-t border-brand-edge pt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-brand-text">
          Try it yourself
        </h2>
        <p className="mt-3 max-w-2xl leading-8">
          Self-host Argon with the open source version — sixty seconds from
          install to your first branch. There&apos;s also a hosted demo
          console if you want to click around first.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="https://github.com/argon-lab/argon/blob/master/docs/QUICK_START.md"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-solid"
          >
            Quick start guide
          </Link>
          <a
            href="https://console.argonlabs.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-quiet"
          >
            Open the demo console
          </a>
        </div>
        <p className="mt-3 font-mono text-xs text-brand-muted">
          The console is a demo instance — the product is the open-source
          engine.
        </p>
      </section>
    </div>
  );
}
