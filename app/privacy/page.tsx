import { pageMetadata } from "../metadata";
export const metadata = pageMetadata(
  "Privacy",
  "How the Argon website uses cookieless page analytics and optional product counts.",
  "/privacy",
);
export default function Privacy() {
  return (
    <div className="article mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold">Privacy</h1>
      <p>Updated September 26, 2026.</p>
      <h2>Website traffic</h2>
      <p>
        We use Vercel Web Analytics to understand visits to this website,
        including page views, referral sources, device types and approximate
        geographic information. It does not use analytics cookies. Page-view
        statistics are enabled by default, independently of the optional button
        counts below. We remove query parameters and fragments from the page URL
        before sending it, and Do Not Track disables these analytics events.
      </p>
      <p>
        See{" "}
        <a href="https://vercel.com/docs/analytics/privacy-policy">
          Vercel&apos;s Web Analytics privacy documentation
        </a>{" "}
        for details about how the service processes visitor data.
      </p>
      <h2>Optional usage counts</h2>
      <p>
        Sharing anonymous counts is off by default. If you enable it in the
        footer, the website sends only a fixed event name when you open the demo
        or local quickstart. It sends no project names, documents, connection
        strings, identities or page URLs in the event payload. We use these
        counts to improve the path to a first successful review.
      </p>
      <p>
        The demo console has a separate choice for successful first diff, merge
        and undo events. The website and console do not share an identifier. Do
        Not Track disables these events. You can turn sharing off at any time;
        the choice is saved in this browser.
      </p>
      <h2>Hosting and the demo</h2>
      <p>
        Infrastructure may process ordinary request metadata to serve pages and
        operate the service. The anonymous demo uses a session cookie to isolate
        temporary sample projects and expires them automatically. Do not upload
        sensitive or production data to the public demo. Self-host Argon for
        your own databases.
      </p>
      <h2>Questions</h2>
      <p>
        Contact the maintainers through{" "}
        <a href="https://github.com/argon-lab/argon/discussions">
          the project discussions
        </a>
        . Do not post private data or credentials.
      </p>
    </div>
  );
}
