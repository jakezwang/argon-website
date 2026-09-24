import { pageMetadata } from "../metadata";

export const metadata = pageMetadata(
  "Website and demo terms",
  "How to use the Argon website, temporary public demo, and open-source software.",
  "/terms",
);

export default function TermsPage() {
  return (
    <article className="article mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold">Website and demo terms</h1>
      <p>Updated September 24, 2026.</p>
      <h2>Scope</h2>
      <p>
        These terms describe use of argonlabs.tech and the public evaluation
        demo at console.argonlabs.tech. By using them, you agree to the
        acceptable-use rules below. The open-source engine and adapters are
        governed by their own repository licenses.
      </p>
      <h2>A temporary evaluation service</h2>
      <p>
        The public demo is for trying Argon with sample data in a temporary
        session. Sessions and their projects expire and may be reset. Keep
        anything you need elsewhere; the demo is not a production database,
        backup service, or a promise of ongoing availability or support.
        Self-host Argon to work with your own databases.
      </p>
      <h2>Acceptable use</h2>
      <p>
        Use only data you are authorized to use. Do not upload personal,
        confidential, production, or credential data to the public demo. Do not
        attempt to access another session, bypass access controls, disrupt the
        service, or overload it with automated requests. Access may be limited
        to protect the service and other users.
      </p>
      <h2>Data and privacy</h2>
      <p>
        The demo uses a session cookie. Optional website and console usage
        counts have separate opt-in choices. The{" "}
        <a href="/privacy">Privacy page</a>
        describes these choices and ordinary hosting request metadata. Avoid
        posting private data in public support discussions.
      </p>
      <h2>Software and documentation</h2>
      <p>
        The{" "}
        <a href="https://github.com/argon-lab/argon/blob/master/LICENSE">
          engine license
        </a>{" "}
        and{" "}
        <a href="https://github.com/argon-lab/argon-agents/blob/main/LICENSE">
          adapter license
        </a>{" "}
        state the permissions, conditions, and warranty terms for those
        packages. These website terms do not replace those licenses. Examples
        are starting points for evaluation: review the documented capture,
        retention, and access-control requirements before using your own
        deployment. Maintain independent backups.
      </p>
      <h2>Changes and contact</h2>
      <p>
        The website, demo, and these terms may change as the project develops.
        Material changes to this page will have a new update date. Contact the
        maintainers at{" "}
        <a href="mailto:jake.wang@argonlabs.tech">jake.wang@argonlabs.tech</a>
        with questions about these terms or use of the demo.
      </p>
    </article>
  );
}
