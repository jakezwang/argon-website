import Link from "next/link";

export const metadata = {
  title: "Page not found",
  robots: { index: false },
  alternates: { canonical: null },
};

const destinations = [
  ["/quickstart", "Start locally", "Install the CLI and run the engine."],
  ["/agents", "Connect an agent", "MCP, Python and REST setup."],
  ["/features", "Features and limits", "What Argon does and where it stops."],
  ["/blog", "Guides", "Runnable walkthroughs and comparisons."],
] as const;

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <p className="kicker mb-4">404</p>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        This page is not on any branch
      </h1>
      <p className="mt-3 leading-7">
        The address may have changed. These pages cover most of the site:
      </p>
      <ul className="mt-10 divide-y divide-brand-edge border-y border-brand-edge">
        {destinations.map(([href, label, detail]) => (
          <li key={href} className="py-4">
            <Link className="prose-link font-medium" href={href}>
              {label}
            </Link>
            <p className="mt-1 text-sm text-brand-muted">{detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
