import Link from 'next/link';

export default function DemoPage() {
  return (
    <div className="py-12 sm:py-16 bg-brand-dark text-brand-text">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-brand-text">
            Argon in Action
          </h1>
          <p className="mt-6 text-xl leading-8 text-brand-text-darker">
            See how Argon can revolutionize your MongoDB workflows.
          </p>
        </div>

        <section className="mb-12 bg-brand-surface p-4 sm:p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-semibold mb-6 text-brand-primary text-center">
            Watch Our Demo
          </h2>
          <div className="aspect-w-16 aspect-h-9">
            {/* Placeholder YouTube Video - Rick Astley - Never Gonna Give You Up */}
            <iframe
              className="w-full h-full rounded-lg shadow-md"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="YouTube video player - Placeholder"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </section>

      </div>
    </div>
  );
}
