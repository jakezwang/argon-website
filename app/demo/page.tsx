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
          Self-host Argon today with the open source version — or join the
          waitlist for the managed cloud service coming after the v2 engine
          ships.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="https://github.com/argon-lab/argon/blob/master/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-solid"
          >
            Self-host guide
          </Link>
          <Link href="/pricing" className="btn-quiet">
            Join the cloud waitlist
          </Link>
        </div>
      </section>
    </div>
  );
}
